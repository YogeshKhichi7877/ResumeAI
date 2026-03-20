import { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { LoadingScreen } from './components/LoadingScreen';
import { InstallBanner } from './components/InstallBanner';

const HomePage          = lazy(() => import('./pages/HomePage1').then(m => ({ default: m.HomePage })));
const AuthPage          = lazy(() => import('./pages/AuthPage1').then(m => ({ default: m.AuthPage })));
const DashboardPage     = lazy(() => import('./pages/DashboardPage1').then(m => ({ default: m.DashboardPage })));
const JDMatchPage       = lazy(() => import('./pages/JDMatchPage1').then(m => ({ default: m.JDMatchPage })));
const CoverLetterPage   = lazy(() => import('./pages/CoverLetterPage1').then(m => ({ default: m.CoverLetterPage })));
const RewritePage       = lazy(() => import('./pages/RewritePage1').then(m => ({ default: m.RewritePage })));
const ColdEmailPage     = lazy(() => import('./pages/ColdEmailPage1').then(m => ({ default: m.ColdEmailPage })));
const FeaturesPage      = lazy(() => import('./pages/FeaturesPage1').then(m => ({ default: m.FeaturesPage })));
const HowItWorksPage    = lazy(() => import('./pages/HowItWorksPage1').then(m => ({ default: m.HowItWorksPage })));
const PrivacyPage       = lazy(() => import('./pages/PrivacyPage1').then(m => ({ default: m.PrivacyPage })));
const TermsPage         = lazy(() => import('./pages/TermsPage1').then(m => ({ default: m.TermsPage })));
const ContactPage       = lazy(() => import('./pages/ContactPage1').then(m => ({ default: m.ContactPage })));
const AnalysisPage      = lazy(() => import('./pages/Analyse').then(m => ({ default: m.AnalysisPage })));
const ResumeChatPage    = lazy(() => import('./pages/ResumeChatPage').then(m => ({ default: m.ResumeChatPage })));
const MockInterviewPage = lazy(() => import('./pages/MockInterviewPage').then(m => ({ default: m.MockInterviewPage })));
const PricingPage       = lazy(() => import('./components/Pricing/PricingPage'));
const AdminPaymentsPage = lazy(() => import('./pages/AdminPaymentsPage'));
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'));
const OfflinePage       = lazy(() => import('./pages/OfflinePage'));


const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online',  on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return isOnline;
};

// ── Detect PWA standalone mode ────────────────────────────────
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

// ── Protected route ───────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // Use LoadingScreen while checking auth
  if (loading) return <LoadingScreen message="Checking authentication..." minTime={800} />;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

function App() {
  const isOnline = useOnlineStatus();

  // Show loading screen on:
  // 1. PWA launch (standalone mode)
  // 2. First browser visit (shown once per session)
  const [showLoader, setShowLoader] = useState(() => {
    if (isStandalone()) return true;
    const seen = sessionStorage.getItem('rp-loaded');
    if (!seen) { sessionStorage.setItem('rp-loaded', '1'); return true; }
    return false;
  });

  // Also show on PWA install
  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    const handler = (e) => { if (e.matches) setShowLoader(true); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Show loading screen
  if (showLoader) {
    return (
      <LoadingScreen
        onDone={() => setShowLoader(false)}
        minTime={isStandalone() ? 2400 : 1800}
      />
    );
  }

  // Offline page
  if (!isOnline) {
    return (
      <Suspense fallback={<LoadingScreen message="Loading offline page..." />}>
        <OfflinePage />
      </Suspense>
    );
  }

  return (
    <SubscriptionProvider>
      <InstallBanner />
      <Suspense fallback={<LoadingScreen message="Loading page..." minTime={600} />}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/features"       element={<FeaturesPage />} />
          <Route path="/how-it-works"   element={<HowItWorksPage />} />
          <Route path="/privacy"        element={<PrivacyPage />} />
          <Route path="/terms"          element={<TermsPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/auth"           element={<AuthPage />} />
          <Route path="/pricing"        element={<PricingPage />} />

          {/* ── Admin ── */}
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />

          {/* ── Protected ── */}
          <Route path="/dashboard"      element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/upload"         element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/analysis/:id"   element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
          <Route path="/jd-match"       element={<ProtectedRoute><JDMatchPage /></ProtectedRoute>} />
          <Route path="/cover-letter"   element={<ProtectedRoute><CoverLetterPage /></ProtectedRoute>} />
          <Route path="/rewrite"        element={<ProtectedRoute><RewritePage /></ProtectedRoute>} />
          <Route path="/cold-outreach"  element={<ProtectedRoute><ColdEmailPage /></ProtectedRoute>} />
          <Route path="/chat"           element={<ProtectedRoute><ResumeChatPage /></ProtectedRoute>} />
          <Route path="/mock-interview" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </SubscriptionProvider>
  );
}

export default App;