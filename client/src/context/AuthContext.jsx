import { createContext, useContext, useRef ,useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api, { authAPI } from '../services/api';

const AuthContext = createContext();
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
 
  // Track interceptor ID so we can eject it on unmount
  const interceptorRef = useRef(null);
 
  // ── Logout helper (used internally + exposed) ──────────────
  const logout = (showToast = true) => {
    localStorage.removeItem('token');
    setUser(null);
    if (showToast) toast.success('Logged out successfully');
  };
 
  // ── Setup 401 interceptor once on mount ────────────────────
  useEffect(() => {
    interceptorRef.current = api.interceptors.response.use(
      // Pass successful responses through unchanged
      (response) => response,
 
      // Handle errors
      (error) => {
        if (error.response?.status === 401) {
          const isLoginRoute = error.config?.url?.includes('/auth/login');
          const isRegisterRoute = error.config?.url?.includes('/auth/register');
 
          // Don't auto-logout on login/register failures — those are wrong credentials
          if (!isLoginRoute && !isRegisterRoute) {
            logout(false); // silent logout — no "Logged out" toast
            toast.error('Your session has expired. Please log in again.', {
              id: 'session-expired', // prevents duplicate toasts
              duration: 5000,
            });
            // Redirect to auth page
            window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      }
    );
 
    // Cleanup interceptor when AuthProvider unmounts
    return () => {
      if (interceptorRef.current !== null) {
        api.interceptors.response.eject(interceptorRef.current);
      }
    };
  }, []);
 
  // ── Fetch user on mount if token exists ───────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);
 
  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      // 401 is handled by the interceptor above
      // This handles other errors like network failures
    } finally {
      setLoading(false);
    }
  };
 
  // ── Login ─────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.log("Login error is : ",error) ;
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };
 
  // ── Register ──────────────────────────────────────────────
  const register = async (name, email, password, jobTitle, targetDomain, experienceLevel) => {
    try {
      const response = await authAPI.register({ name, email, password, jobTitle, targetDomain, experienceLevel });
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.log("registration error iss :  ",error) ;
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };
 
  const value = {
    user,
    loading,
    login,
    register,
    logout: () => logout(true),
  };
 
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};