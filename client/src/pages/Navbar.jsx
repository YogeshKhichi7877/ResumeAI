
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import UpgradeModal from '../components/UpgradeModal';
import {
  Home, Zap, Info, Target, FileSignature,
  RefreshCw, Mail, LayoutDashboard, LogOut,
  User, Menu, X, ChevronDown, MessageSquare,
  Brain, CreditCard ,BookOpen
} from 'lucide-react';

const publicLinks = [
  { to: '/',             label: 'Home',         icon: <Home className="w-4 h-4" /> },
  { to: '/features',     label: 'Features',     icon: <Zap className="w-4 h-4" /> },
  { to: '/how-it-works', label: 'How It Works', icon: <Info className="w-4 h-4" /> },
  { to: '/pricing',      label: 'Pricing',      icon: <CreditCard className="w-4 h-4" /> },
  { to: '/resume_guide.html', label: 'Resume Guide', icon: <BookOpen className="w-4 h-4" /> },
];

const authLinks = [
  { to: '/dashboard',      label: 'Dashboard',      icon: <LayoutDashboard className="w-4 h-4" />, action: null },
  { to: '/jd-match',       label: 'JD Match',       icon: <Target className="w-4 h-4" />,          action: 'jd_match' },
  { to: '/cover-letter',   label: 'Cover Letter',   icon: <FileSignature className="w-4 h-4" />,   action: 'cover_letter' },
  { to: '/rewrite',        label: 'Rewrite',        icon: <RefreshCw className="w-4 h-4" />,       action: 'resume_rewrite' },
  { to: '/cold-outreach',  label: 'Outreach',       icon: <Mail className="w-4 h-4" />,            action: 'mail_gen' },
  { to: '/chat',           label: 'AI Chat',        icon: <MessageSquare className="w-4 h-4" />,   action: 'chat',                badge: 'NEW' },
  { to: '/mock-interview', label: 'Mock Interview', icon: <Brain className="w-4 h-4" />,           action: 'interview_questions', badge: 'NEW' },
];

export const Navbar = () => {
  const { user, logout }                            = useAuth();
  const { plan, remainingDays, isFeatureAvailable } = useSubscription();
  const location                                    = useLocation();
  const navigate                                    = useNavigate();
  const [mobileOpen,  setMobileOpen]                = useState(false);
  const [toolsOpen,   setToolsOpen]                 = useState(false);
  const [showUpgrade, setShowUpgrade]               = useState(false);

  const isActive = (p) => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p);

  const planBg    = plan === 'pro' ? '#C084FC' : plan === 'starter' ? '#86EFAC' : '#E5E7EB';
  const planIcon  = plan === 'pro' ? '👑' : plan === 'starter' ? '⚡' : '🆓';
  const planLabel = plan === 'pro' ? 'Pro' : plan === 'starter' ? 'Starter' : 'Free';

  const navBg = plan === 'pro'
    ? 'linear-gradient(90deg, #faf5ff 0%, #ffffff 35%)'
    : plan === 'starter'
    ? 'linear-gradient(90deg, #f0fdf4 0%, #ffffff 35%)'
    : '#ffffff';
  const navAccent   = plan === 'pro' ? '#7c3aed' : plan === 'starter' ? '#16a34a' : '#000';
  const navBorderBt = plan === 'pro'
    ? '3px solid #7c3aed'
    : plan === 'starter'
    ? '3px solid #16a34a'
    : '3px solid black';

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{ background: navBg, borderBottom: navBorderBt }}
      >

        {/* ══════════════════════════════════════════════════════════════
            DESKTOP — true 3-column grid so links are perfectly centered
            [  logo  ] [       nav links (center)      ] [  auth  ]
        ══════════════════════════════════════════════════════════════ */}
        <div
          className="max-w-9xl mx-auto px-6 h-[72px] hidden md:grid items-stretch"
          style={{ gridTemplateColumns: '1fr auto 1fr' }}
        >

          {/* ── COL 1: LOGO — stays at far left ─────────────────────── */}
          <div className="flex items-center justify-start flex-1">
            <Link
              to="/"
              className="flex items-center hover:opacity-70 transition-opacity"
              aria-label="ResumeLens — Home"
            >
              <img
                src="/full_logo_navbar.svg"
                alt="ResumeLens"
                style={{ height: '53px', imageRendering: 'crisp-edges' }}
              />
            </Link>
          </div>

        {/* COL 2: NAV LINKS */}
          <div className="flex items-stretch">
            {publicLinks.map(({ to, label, icon }) => {
              const isStaticHtml = to.endsWith('.html');
              const linkClass = `flex items-center gap-1.5 px-5 font-bold text-sm uppercase tracking-wide border-l border-black/10 transition-all
                ${isActive(to)
                  ? 'bg-neo-yellow text-black border-b-[3px] border-b-black'
                  : 'hover:bg-neo-offwhite text-black'}`;

              return isStaticHtml ? (
                <a key={to} href={to} className={linkClass}>
                  {icon}{label}
                </a>
              ) : (
                <Link key={to} to={to} className={linkClass}>
                  {icon}{label}
                </Link>
              );
            })}

            {/* Tools dropdown */}
            {user && (
              <div className="relative flex items-stretch">
                <button
                  onClick={() => setToolsOpen(v => !v)}
                  className={`flex items-center gap-1.5 px-5 font-bold text-sm uppercase tracking-wide border-l border-black/10 transition-all
                    ${authLinks.some(l => isActive(l.to))
                      ? 'bg-neo-yellow text-black border-b-[3px] border-b-black'
                      : 'hover:bg-neo-offwhite text-black'}`}
                >
                  <Zap className="w-4 h-4" />
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {toolsOpen && (
                  <div
                    className="absolute top-full left-0 w-60 bg-white z-50"
                    style={{ border: '3px solid black', boxShadow: '5px 5px 0 #000' }}
                    onMouseLeave={() => setToolsOpen(false)}
                  >
                    {authLinks.map(({ to, label, icon, badge, action }) => {
                      const locked = action && !isFeatureAvailable(action);
                      return (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setToolsOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 font-bold text-sm border-b border-black/10 last:border-b-0 transition-colors
                            ${isActive(to) ? 'bg-neo-yellow' : 'hover:bg-neo-offwhite'}`}
                        >
                          <span className="flex items-center gap-3">
                            {icon}
                            <span className={locked ? 'text-gray-400' : ''}>{label}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            {locked && <span className="text-[10px] font-black text-gray-400">🔒</span>}
                            {badge && !locked && (
                              <span className="text-[10px] font-extrabold bg-neo-blue text-white px-1.5 py-0.5 border border-black">
                                {badge}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── COL 3: AUTH — stays at far right ────────────────────── */}
          <div className="flex items-center justify-end gap-3">
            {user ? (
              <>
                {/* Subscription badge + username */}
                <div
                  className="flex items-stretch overflow-hidden"
                  style={{ border: '3px solid black', boxShadow: '3px 3px 0 #000' }}
                >
                  <button
                    onClick={() => plan === 'free' ? setShowUpgrade(true) : navigate('/pricing')}
                    className="flex items-center gap-1.5 px-3 py-1.5 font-black text-xs uppercase hover:opacity-90 transition"
                    style={{ backgroundColor: planBg, borderRight: '2px solid black' }}
                    title={plan !== 'free' ? `${remainingDays} days remaining` : 'Upgrade plan'}
                  >
                    <span className="text-sm leading-none">{planIcon}</span>
                    <span>{planLabel}</span>
                    {plan !== 'free' && (
                      <span className="text-[9px] font-bold opacity-60 hidden lg:inline">
                        · {remainingDays}d
                      </span>
                    )}
                  </button>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white">
                    <div
                      className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: navAccent }}
                    >
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-sm truncate max-w-[90px]">{user?.name}</span>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 font-bold text-sm hover:bg-neo-red hover:text-white transition-colors"
                  style={{ border: '3px solid black' }}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-4 py-2 font-bold text-sm uppercase hover:bg-neo-offwhite transition-colors"
                  style={{ border: '3px solid black' }}
                >
                  Login
                </Link>
                <Link to="/auth" className="neo-button-yellow text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MOBILE — icon logo left, hamburger right
        ══════════════════════════════════════════════════════════════ */}
        <div className="md:hidden flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity" aria-label="ResumeLens">
            <img
              src="/logo-icon.svg"
              alt="ResumeLens"
              style={{ height: '44px', imageRendering: 'crisp-edges' }}
            />
          </Link>
          <button
            className="flex items-center justify-center w-10 h-10"
            style={{ border: '3px solid black' }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── MOBILE MENU ───────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden bg-white" style={{ borderTop: '3px solid black' }}>
            <div className="flex flex-col divide-y divide-black/10">

              {publicLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 font-bold text-sm uppercase tracking-wide transition-colors
                    ${isActive(to) ? 'bg-neo-yellow' : 'hover:bg-neo-offwhite'}`}
                >
                  {icon}{label}
                </Link>
              ))}

              {user && authLinks.map(({ to, label, icon, badge, action }) => {
                const locked = action && !isFeatureAvailable(action);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 font-bold text-sm uppercase tracking-wide transition-colors
                      ${isActive(to) ? 'bg-neo-yellow' : 'hover:bg-neo-offwhite'}`}
                  >
                    <span className="flex items-center gap-3">
                      {icon}
                      <span className={locked ? 'text-gray-400' : ''}>{label}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {locked && <span className="text-xs">🔒</span>}
                      {badge && !locked && (
                        <span className="text-[10px] font-extrabold bg-neo-blue text-white px-1.5 py-0.5 border border-black">
                          {badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}

              <div className="px-4 py-3 flex items-center justify-between gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          plan === 'free' ? setShowUpgrade(true) : navigate('/pricing');
                          setMobileOpen(false);
                        }}
                        className="border-2 border-black px-2 py-1 font-black text-xs uppercase"
                        style={{ backgroundColor: planBg }}
                      >
                        {planIcon} {planLabel}
                      </button>
                      <span className="font-bold text-sm">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 font-bold text-sm hover:bg-neo-red transition-colors"
                      style={{ border: '3px solid black' }}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 w-full">
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center px-4 py-2 font-bold text-sm uppercase hover:bg-neo-offwhite"
                      style={{ border: '3px solid black' }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center neo-button-yellow text-sm px-4 py-2"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {showUpgrade && (
        <UpgradeModal isOpen onClose={() => setShowUpgrade(false)} />
      )}
    </>
  );
};












