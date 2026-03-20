// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Loader2 } from 'lucide-react';

// export const AuthPage = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login, register } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     let success;
//     if (isLogin) {
//       success = await login(email, password);
//     } else {
//       success = await register(name, email, password);
//     }

//     setLoading(false);
//     if (success) {
//       navigate('/');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-neo-offwhite flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2">
//             <div className="w-12 h-12 bg-neo-yellow border-3 border-black flex items-center justify-center">
//               <span className="font-space font-extrabold text-xl">R</span>
//             </div>
//             <span className="font-space font-extrabold text-3xl">RESUME AI</span>
//           </Link>
//         </div>

//         {/* Auth Card */}
//         <div className="neo-card p-8">
//           <h1 className="font-space text-3xl font-extrabold text-center mb-2">
//             {isLogin ? 'LOGIN' : 'SIGN UP'}
//           </h1>
//           <p className="text-center text-gray-500 mb-8">
//             {isLogin ? 'Welcome back!' : 'Create your account'}
//           </p>

//           {/* Toggle Buttons */}
//           <div className="flex mb-8 border-3 border-black">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-3 font-bold transition-all ${
//                 isLogin ? 'bg-neo-yellow' : 'bg-white hover:bg-gray-100'
//               }`}
//             >
//               LOGIN
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-3 font-bold transition-all ${
//                 !isLogin ? 'bg-neo-yellow' : 'bg-white hover:bg-gray-100'
//               }`}
//             >
//               SIGN UP
//             </button>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {!isLogin && (
//               <div>
//                 <label className="block font-bold mb-2">Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="neo-input"
//                   placeholder="Enter your name"
//                   required={!isLogin}
//                 />
//               </div>
//             )}
//             <div>
//               <label className="block font-bold mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="neo-input"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block font-bold mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="neo-input"
//                 placeholder="Enter your password"
//                 required
//                 minLength={6}
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="neo-button w-full flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Please wait...
//                 </>
//               ) : (
//                 isLogin ? 'LOGIN' : 'CREATE ACCOUNT'
//               )}
//             </button>
//           </form>

//           {isLogin && (
//             <p className="text-center mt-6 text-gray-500">
//               Forgot your password?{' '}
//               <a href="#" className="font-bold hover:text-neo-blue">
//                 Reset here
//               </a>
//             </p>
//           )}
//         </div>

//         {/* Back to Home */}
//         <p className="text-center mt-8">
//           <Link to="/" className="font-bold hover:text-neo-blue">
//             ← Back to Home
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };



























import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SEO } from '../components/SEO';
import {
  Loader2, AlertTriangle, CheckCircle, Target,
  Briefcase, TrendingUp, FileText, Brain, Zap,
  ArrowRight, Star, Shield, Clock
} from 'lucide-react';

const DOMAINS = [
  { value: 'software-engineer', label: '💻 Software Engineer' },
  { value: 'data-scientist',    label: '📊 Data Scientist'    },
  { value: 'product-manager',   label: '🎯 Product Manager'   },
  { value: 'design',            label: '🎨 UX / Designer'     },
  { value: 'marketing',         label: '📣 Marketing'         },
  { value: 'sales',             label: '💼 Sales'             },
  { value: 'other',             label: '✏️ Other'             },
];

const EXP_LEVELS = [
  { value: 'fresher',    label: '🌱 Fresher (0–1 yr)'  },
  { value: 'junior',     label: '🚀 Junior (1–3 yrs)'  },
  { value: 'mid',        label: '⚡ Mid (3–6 yrs)'     },
  { value: 'senior',     label: '🔥 Senior (6–10 yrs)' },
  { value: 'lead',       label: '👑 Lead / Staff (10+)'},
];

const PERKS = [
  { icon: <Target className="w-5 h-5" />,    text: 'ATS score in 30 seconds'       },
  { icon: <Brain className="w-5 h-5" />,     text: 'AI mock interview questions'   },
  { icon: <FileText className="w-5 h-5" />,  text: 'Bullet rewrites that get hired'},
  { icon: <TrendingUp className="w-5 h-5" />,text: 'JD match percentage'           },
  { icon: <Briefcase className="w-5 h-5" />, text: 'Cover letter in one click'     },
  { icon: <Zap className="w-5 h-5" />,       text: 'Roast mode — brutal honesty'   },
];

export const AuthPage = () => {
  const [isLogin, setIsLogin]     = useState(true);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [domain, setDomain]       = useState('');
  const [expLevel, setExpLevel]   = useState('');
  const [jobTitle, setJobTitle]   = useState('');
  const [loading, setLoading]     = useState(false);
  const { login, register }       = useAuth();
  const navigate                  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = isLogin
      ? await login(email, password)
      : await register(name, email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <>
      <SEO
        title="Login or Sign Up"
        description="Create a free Resume AI account to analyze your resume, get ATS scores, and land your dream job in India."
        keywords="login, sign up, resume ai account, free resume analyzer registration"
      />
      <div className="min-h-screen bg-neo-offwhite flex flex-col">
      {/* ── Top bar with logo ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-3 bg-white"
        style={{ borderBottom: '3px solid black' }}
      >
        <Link to="/" className="flex items-center hover:opacity-70 transition-opacity">
          <img
            src="/full_logo_navbar.svg"
            alt="Resume AI"
            style={{ height: '56px', imageRendering: 'crisp-edges' }}
          />
        </Link>
        <Link
          to="/"
          className="font-bold text-sm uppercase tracking-wide flex items-center gap-1.5 hover:text-neo-blue transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* ── Main two-column layout ────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ══════════════════════════════════════════════════════════
            LEFT PANEL — branding + social proof
        ══════════════════════════════════════════════════════════ */}
        <div
          className="hidden lg:flex flex-col justify-between w-[46%] flex-shrink-0 p-12 relative overflow-hidden"
          style={{ backgroundColor: '#0A0A0A', borderRight: '4px solid black' }}
        >
          {/* Dot-grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* Yellow accent bar top-left */}
          <div
            className="absolute top-0 left-0 w-2 h-full"
            style={{ backgroundColor: '#FACC15' }}
          />

          <div className="relative z-10 space-y-10">
            {/* Headline */}
            <div className="space-y-4">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 border-2"
                style={{ backgroundColor: '#FACC15', borderColor: '#FACC15' }}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Free to start · No credit card
                </span>
              </div>

              <h1
                className="text-5xl font-black uppercase leading-[0.92] tracking-tight text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Stop Sending<br />
                <span style={{ color: '#FACC15' }}>Resumes</span><br />
                Into The Void.
              </h1>

              <p className="text-sm font-semibold text-white/50 leading-relaxed max-w-xs">
                90% of resumes never reach a human. Our AI tells you exactly why — and fixes it in seconds.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {PERKS.map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-8 h-8 flex items-center justify-center flex-shrink-0 text-black"
                    style={{ backgroundColor: '#FACC15', border: '2px solid #FACC15' }}
                  >
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                    {text}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial quote at bottom */}
          <div
            className="relative z-10 p-5 mt-8"
            style={{ border: '2px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)' }}
          >
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#FACC15' }} />
              ))}
            </div>
            <p className="text-sm font-semibold text-white/70 leading-relaxed italic mb-4">
              "Went from 3 rejections to a Swiggy offer in 2 weeks after fixing my ATS score. The JD match tool is insane."
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 flex items-center justify-center font-black text-sm text-black"
                style={{ backgroundColor: '#4ADE80' }}
              >
                J
              </div>
              <div>
                <p className="text-xs font-black text-white">Jyoti S.</p>
                <p className="text-[10px] font-semibold text-white/40">SDE-2 at Swiggy · Score: 90</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            RIGHT PANEL — auth form
        ══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto py-10 px-6">
          <div className="w-full max-w-lg">

            {/* ── Tab switcher ─────────────────────────────────────── */}
            <div
              className="flex mb-8"
              style={{ border: '3px solid black', boxShadow: '4px 4px 0 #000' }}
            >
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3.5 font-black text-sm uppercase tracking-widest transition-all ${
                  isLogin ? 'bg-neo-yellow text-black' : 'bg-white text-gray-400 hover:bg-neo-offwhite'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3.5 font-black text-sm uppercase tracking-widest transition-all border-l-2 border-black ${
                  !isLogin ? 'bg-neo-yellow text-black' : 'bg-white text-gray-400 hover:bg-neo-offwhite'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* ── Title ────────────────────────────────────────────── */}
            <div className="mb-7">
              <h2 className="font-space font-extrabold text-3xl uppercase mb-1">
                {isLogin ? 'Welcome Back 👋' : 'Create Account 🚀'}
              </h2>
              <p className="text-sm font-semibold text-gray-500">
                {isLogin
                  ? 'Login to view your analyses and resume history.'
                  : 'Join 9K+ professionals already beating ATS filters.'}
              </p>
            </div>

            {/* ── ⚠️ Password warning ───────────────────────────────── */}
            <div
              className="flex items-start gap-3 p-4 mb-6"
              style={{
                backgroundColor: '#FFFBEB',
                border: '2px solid #F59E0B',
                borderLeft: '5px solid #F59E0B',
              }}
            >
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-amber-700 mb-0.5">
                  Password cannot be reset
                </p>
                <p className="text-xs font-semibold text-amber-600 leading-relaxed">
                  We currently don't support password recovery. Please save your password somewhere safe before signing up.
                </p>
              </div>
            </div>

            {/* ── Form ─────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ── SIGN UP ONLY FIELDS ──────────────────────────── */}
              {!isLogin && (
                <>
                  {/* Full name */}
                  <div>
                    <label className="block font-black text-xs uppercase tracking-widest mb-2">
                      Full Name <span className="text-neo-red">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="neo-input"
                      placeholder="e.g. Rahul Sharma"
                      required={!isLogin}
                    />
                  </div>

                  {/* Current job title */}
                  <div>
                    <label className="block font-black text-xs uppercase tracking-widest mb-2">
                      Current / Target Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      className="neo-input"
                      placeholder="e.g. Software Engineer, Product Manager"
                    />
                  </div>

                  {/* Domain + Experience — side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black text-xs uppercase tracking-widest mb-2">
                        Target Domain
                      </label>
                      <select
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        className="neo-input"
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">Select domain</option>
                        {DOMAINS.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-black text-xs uppercase tracking-widest mb-2">
                        Experience Level
                      </label>
                      <select
                        value={expLevel}
                        onChange={e => setExpLevel(e.target.value)}
                        className="neo-input"
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">Select level</option>
                        {EXP_LEVELS.map(l => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-black/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Details</span>
                    <div className="flex-1 h-px bg-black/10" />
                  </div>
                </>
              )}

              {/* Email */}
              <div>
                <label className="block font-black text-xs uppercase tracking-widest mb-2">
                  Email Address <span className="text-neo-red">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="neo-input"
                  placeholder="you@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-black text-xs uppercase tracking-widest mb-2">
                  Password <span className="text-neo-red">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="neo-input"
                  placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                  required
                  minLength={6}
                />
                {!isLogin && (
                  <p className="text-[11px] font-semibold text-gray-400 mt-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Save this password — recovery is not available
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="neo-button w-full flex items-center justify-center gap-2 py-4 text-base"
                style={{ marginTop: '8px' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Please wait…
                  </>
                ) : isLogin ? (
                  <>Login to Dashboard <ArrowRight className="w-4 h-4" /></>
                ) : (
                  <>Create Free Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {/* Trust pills */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                {[
                  { icon: <CheckCircle className="w-3.5 h-3.5 text-green-600" />, text: 'Free forever tier' },
                  { icon: <Shield className="w-3.5 h-3.5 text-blue-600" />,       text: 'No spam ever'      },
                  { icon: <Clock className="w-3.5 h-3.5 text-purple-600" />,      text: 'Results in 30 sec' },
                ].map(({ icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    {icon}{text}
                  </span>
                ))}
              </div>
            </form>

            {/* Switch mode */}
            <p className="text-center mt-6 text-sm font-semibold text-gray-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(v => !v)}
                className="font-black underline text-black hover:text-neo-blue transition-colors"
              >
                {isLogin ? 'Sign up free' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};