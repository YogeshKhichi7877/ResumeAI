import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../pages/Navbar';
import HomePricingSection from './HomePricingSection';
import UpgradeModal from '../components/UpgradeModal';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import {
  ArrowRight, ArrowUpRight, Check, Star, Zap, Target,
  FileText, MessageSquare, Mail, RefreshCw, Brain, Flame,
  Shield, Clock, TrendingUp, ChevronRight, Sparkles
} from 'lucide-react';

/* ─── Marquee domains ─────────────────────────────────────────────────────── */
const DOMAINS = [
  'SOFTWARE ENGINEER','DATA SCIENTIST','PRODUCT MANAGER','UX DESIGNER',
  'MARKETING','DEVOPS','BACKEND DEV','FULLSTACK','AI ENGINEER','CYBERSECURITY',
  'DATA ANALYST','FRONTEND DEV','CLOUD ARCHITECT','BUSINESS ANALYST','LAWYER' ,
  'ACCOUNTANT' ,'FINANCE ANALYST','HR SPECIALIST','SALES MANAGER','CONTENT WRITER',
  'GRAPHIC DESIGNER','CONSULTANT'
];

/* ─── Features ────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Target className="w-6 h-6" />,
    label: 'ATS(Applicant Tracking System) Score',
    desc: `See exactly how recruiters' bots rank you — and what to fix first.`,
    tag: 'Always Free',
    accent: '#FFE234',
    to: '/dashboard',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    label: 'JD Match',
    desc: 'Paste any job description. Get a match percentage & keyword gap report.',
    tag: 'Starter+',
    accent: '#8BF5A0',
    to: '/jd-match',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    label: 'Cover Letter',
    desc: 'Personalised cover letters in seconds that match tone and role.',
    tag: 'Starter+',
    accent: '#93C5FD',
    to: '/cover-letter',
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    label: 'Resume Rewrite',
    desc: 'Bullet-by-bullet AI rewrite using impact verbs and quantified results.',
    tag: 'Starter+',
    accent: '#FDB5F5',
    to: '/rewrite',
  },
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Cold Outreach',
    desc: 'Hyper-personalised cold emails that get replies from hiring managers.',
    tag: 'Starter+',
    accent: '#FED7AA',
    to: '/cold-outreach',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    label: 'Mock Interview',
    desc: 'AI-generated interview questions tailored to your resume and role.',
    tag: 'Starter+',
    accent: '#A5F3FC',
    to: '/mock-interview',
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    label: 'AI Chat',
    desc: 'Ask anything about your resume — get specific, instant answers.',
    tag: 'Starter+',
    accent: '#BBF7D0',
    to: '/chat',
  },
  {
    icon: <Flame className="w-6 h-6" />,
    label: 'Roast My Resume',
    desc: `Brutally honest AI critique. No sugar-coating. Fix what's actually wrong.`,
    tag: 'Pro Only 🔥',
    accent: '#FCA5A5',
    to: '/dashboard',
    exclusive: true,
  },
];

/* ─── Social proof numbers ────────────────────────────────────────────────── */
const STATS = [
  { num: '9K+',  label: 'Resumes Analyzed'   },
  { num: '90% +',   label: 'Score Improved'   },
  { num: '< 2hr', label: 'Plan Activation'     },
  { num: '4.5/5', label: 'Average User Rating' },
];

/* ─── Testimonials ────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: 'Jyoti.S', role: 'SDE-2 at Swiggy', score: '90', text: 'Went from 3 rejections to an offer in 2 weeks after following the ATS fixes. The JD match tool is insane.' , rating : 4.5 },
  { name: 'Rahul M.', role: 'Product @ Razorpay', score: '86', text: 'The rewrite feature turned my generic bullets into real impact statements. Interviewers actually commented on my resume.' , rating : 4.0 },
  { name: 'Ananya K.', role: 'Data Analyst @ Zomato', score: '79', text: 'Mock interview questions were spot on for my role. Felt way more prepared than before.' , rating : 4.2 },
];

/* ─── Animated score counter ──────────────────────────────────────────────── */
function ScoreCounter({ target = 93 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = () => {
          start += 2;
          setCount(Math.min(start, target));
          if (start < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════ */
export const HomePage = () => {
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState('starter');

  const openUpgrade = (planId = 'starter') => {
    setUpgradePlan(planId);
    setShowUpgrade(true);
  };

  return (
    <>
      <SEO
        title="AI Resume Analyser for Indian Job Seekers"
        description="ResumeLens is an AI-powered resume analyser built for Indian job seekers. Get ATS scores, cover letters, JD matching, cold emails & mock interview prep — free."
        keywords="resume analyser India, ATS resume checker, AI resume builder, resume score, job application India, cover letter generator, resume tips for freshers"
      />
      <div
        className="min-h-screen"
        style={{ backgroundColor: '#FAFAF8', color: '#0A0A0A', fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden border-b-4 border-black"
        style={{ background: 'linear-gradient(160deg, #FAFAF8 0%, #F0EDE4 100%)' }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00000018 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Top announcement bar */}
        <div className="relative z-10 border-b-2 border-black bg-black text-white py-2.5 px-4 text-center">
          <p className="text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            New: AI-Powered Roast My Resume — Brutally honest feedback for Pro users
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          </p>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 border-2 border-black px-3.5 py-1.5"
              style={{ backgroundColor: '#FFE234', boxShadow: '3px 3px 0 #000' }}
            >
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">AI Resume Intelligence</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1
                className="text-[clamp(48px,7vw,84px)] font-black leading-[0.9] tracking-tight uppercase"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Your Resume
                <br />
                <span
                  className="inline-block border-4 border-black px-3 my-1 -rotate-1 transition-transform hover:rotate-0"
                  style={{ backgroundColor: '#4F7EFF', color: '#fff', boxShadow: '6px 6px 0 #000' }}
                >
                  Is Costing
                </span>
                <br />
                You Jobs.
              </h1>
            </div>

            {/* Sub */}
            <p
              className="text-lg font-semibold leading-relaxed max-w-md border-l-4 border-black pl-5"
              style={{ color: '#3D3D3D' }}
            >
              Most resumes never reach a human — ATS bots filter them out in seconds.
              We fix every reason yours gets rejected.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={user ? '/dashboard' : '/auth'}
                className="group flex items-center gap-3 border-4 border-black px-8 py-4 font-black text-base uppercase tracking-wide transition-all hover:translate-x-[3px] hover:translate-y-[3px]"
                style={{ backgroundColor: '#FFE234', boxShadow: '6px 6px 0 #000' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '3px 3px 0 #000'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '6px 6px 0 #000'}
              >
                Analyze My Resume
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => openUpgrade('starter')}
                className="flex items-center gap-2 border-4 border-black px-8 py-4 font-black text-base uppercase tracking-wide bg-white transition-all hover:bg-black hover:text-white"
                style={{ boxShadow: '4px 4px 0 #000' }}
              >
                View Plans <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {['Free to start', 'No credit card', 'Results in 30 sec'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm font-bold">
                  <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — mock result card */}
          <div className="relative flex justify-center">
            {/* Rotating dashed ring */}
            <div
              className="absolute inset-0 m-auto rounded-full border-4 border-dashed border-black/20"
              style={{
                width: '110%',
                height: '110%',
                maxWidth: '460px',
                maxHeight: '460px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'spin 30s linear infinite',
              }}
            />

            <div
              className="relative w-full max-w-sm border-4 border-black overflow-hidden"
              style={{ backgroundColor: '#fff', boxShadow: '12px 12px 0 #000' }}
            >
              {/* Card title bar */}
              <div className="border-b-4 border-black bg-black px-5 py-3 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {['#FF6B6B','#FFE234','#8BF5A0'].map(c => (
                    <span key={c} className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-white text-xs font-black uppercase tracking-widest">Resume_Analysis.pdf</span>
                <span className="text-white/40 text-xs font-bold">AI</span>
              </div>

              <div className="p-7 space-y-5">
                {/* Score */}
                <div className="text-center">
                  <div
                    className="text-[96px] font-black leading-none tracking-tighter"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    <ScoreCounter target={92} />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span
                      className="border-2 border-black px-3 py-0.5 text-xs font-black uppercase tracking-widest"
                      style={{ backgroundColor: '#8BF5A0' }}
                    >
                      ✓ ATS Ready
                    </span>
                    <span
                      className="border-2 border-black px-3 py-0.5 text-xs font-black uppercase tracking-widest"
                      style={{ backgroundColor: '#FFE234' }}
                    >
                      TOP 5%
                    </span>
                  </div>
                </div>

                {/* Metric bars */}
                <div className="space-y-3">
                  {[
                    { label: 'Keyword Match',  pct: 88, color: '#4F7EFF' },
                    { label: 'Impact Score',   pct: 76, color: '#8BF5A0' },
                    { label: 'Clarity',        pct: 94, color: '#FFE234' },
                    { label: 'Formatting',     pct: 91, color: '#FDB5F5' },
                  ].map(({ label, pct, color }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase tracking-wide">{label}</span>
                        <span className="text-xs font-black">{pct}</span>
                      </div>
                      <div className="w-full h-2.5 border-2 border-black overflow-hidden bg-gray-100">
                        <div
                          className="h-full"
                          style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 1s ease-out' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggestion chip */}
                <div
                  className="border-2 border-black p-3 flex items-start gap-2"
                  style={{ backgroundColor: '#FFF9E6' }}
                >
                  <span className="text-base flex-shrink-0">💡</span>
                  <p className="text-xs font-bold leading-snug text-gray-700">
                    Add 3 quantified achievements to boost impact score by ~12 points
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ═══════════════════════════════════════════════════════ */}
      <div className="border-b-4 border-black bg-black">
        <div className="max-w-8xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-white/10">
          {STATS.map(({ num, label }) => (
            <div key={label} className="py-7 px-4 text-center">
              <div className="text-4xl font-black text-white mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {num}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════════════ */}
      <div
        className="border-b-4 border-black overflow-hidden py-4"
        style={{ backgroundColor: '#FFE234' }}
      >
        <div style={{ display: 'flex', animation: 'marquee 15s linear infinite', whiteSpace: 'nowrap' }}>
          {[...DOMAINS, ...DOMAINS].map((d, i) => (
            <span key={i} className="font-black text-sm uppercase tracking-widest mx-8 flex items-center gap-3">
              {d}
              <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ══ AD 1 — after marquee, before how it works ════════════════════════ */}
        <div className="px-6 max-w-7xl mx-auto">
          <AdBanner />
        </div>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b-4 border-black" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-end mb-16">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#4F7EFF' }}>
                THE PROCESS
              </p>
              <h2 className="text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight">
                From Upload<br />to Offer-Ready<br />
                <span
                  className="inline-block border-4 border-black px-3 py-0.5 mt-1"
                  style={{ backgroundColor: '#8BF5A0', boxShadow: '4px 4px 0 #000' }}
                >
                  in 30 Seconds
                </span>
              </h2>
            </div>
            <p className="text-base font-semibold text-gray-600 max-w-sm leading-relaxed">
              Our AI reads your resume the same way ATS systems do — then gives you
              a prioritised fix list that actually moves the needle.
            </p>
          </div>

          <div
            className="grid md:grid-cols-4 border-4 border-black overflow-hidden"
            style={{ boxShadow: '8px 8px 0 #000' }}
          >
            {[
              { n: '01', title: 'Upload PDF',     desc: 'Drop your resume. We accept any PDF up to 5 MB.', bg: '#fff' },
              { n: '02', title: 'Pick Your Role', desc: 'Tell us the domain and target title.', bg: '#F0EDE7' },
              { n: '03', title: 'AI Analyses',    desc: 'Every line scanned against 200+ ATS signals.', bg: '#FFE234' },
              { n: '04', title: 'Get Report',     desc: 'Actionable, ranked suggestions ready instantly.', bg: '#8BF5A0' },
            ].map(({ n, title, desc, bg }, i) => (
              <div
                key={n}
                className="p-8 border-r-4 last:border-r-0 border-black flex flex-col gap-4 group hover:-translate-y-1 transition-transform"
                style={{ backgroundColor: bg }}
              >
                <span
                  className="text-5xl font-black leading-none"
                  style={{ color: bg === '#FFE234' || bg === '#8BF5A0' ? '#000' : '#000', fontVariantNumeric: 'tabular-nums' }}
                >
                  {n}
                </span>
                <div>
                  <h3 className="font-black text-lg uppercase mb-1.5">{title}</h3>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 mt-auto opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES GRID ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 border-b-4 border-black" style={{ backgroundColor: '#F0EDE4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#4F7EFF' }}>
                EVERYTHING YOU NEED
              </p>
              <h2 className="text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight">
                8 Weapons.<br />One Dashboard.
              </h2>
            </div>
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="flex items-center gap-2 border-4 border-black px-6 py-3 font-black text-sm uppercase bg-black text-white hover:bg-white hover:text-black transition-colors"
              style={{ boxShadow: '4px 4px 0 #888' }}
            >
              Open Dashboard <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <Link
                key={f.label}
                to={user ? f.to : '/auth'}
                className="group border-4 border-black p-6 flex flex-col gap-4 transition-all hover:-translate-y-1 relative overflow-hidden"
                style={{
                  backgroundColor: '#fff',
                  boxShadow: '5px 5px 0 #000',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = f.accent; e.currentTarget.style.boxShadow = '8px 8px 0 #000'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '5px 5px 0 #000'; }}
              >
                {f.exclusive && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-black px-2 py-1 uppercase tracking-wider">
                    Pro Only
                  </div>
                )}
                <div
                  className="w-11 h-11 border-3 border-black flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: f.accent, border: '3px solid #000' }}
                >
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-base uppercase mb-1.5">{f.label}</h3>
                  <p className="text-xs font-semibold text-gray-600 leading-snug">{f.desc}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-black uppercase px-2 py-0.5 border border-black/20"
                    style={{ backgroundColor: f.exclusive ? '#FCA5A5' : '#F0EDE4' }}
                  >
                    {f.tag}
                  </span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SOCIAL PROOF — Before / After ════════════════════════════════════ */}
      <section className="py-24 px-6 border-b-4 border-black" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: '#4F7EFF' }}>RESULTS</p>
            <h2 className="text-5xl font-black uppercase leading-tight">Real People.<br />Real Offers.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, score, text , rating }) => (
              <div
                key={name}
                className="border-4 border-black p-6 flex flex-col gap-5"
                style={{ backgroundColor: '#fff', boxShadow: '6px 6px 0 #000' }}
              >
                {/* Score badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className="border-3 border-black w-14 h-14 flex items-center justify-center font-black text-2xl"
                      style={{ border: '3px solid #000', backgroundColor: '#FFE234' }}
                    >
                      {score}
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                </div>

                <p className="text-sm font-semibold text-gray-700 leading-relaxed flex-1">
                  "{text}"
                </p>

                <div className="border-t-2 border-black/10 pt-4 flex items-center gap-3">
                  <div
                    className="w-9 h-9 border-2 border-black flex items-center justify-center font-black text-sm"
                    style={{ backgroundColor: '#8BF5A0' }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm">{name}</p>
                    <p className="text-xs text-gray-500 font-semibold">{role}</p>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══ PRICING ════════════════════════════════════════════════════════════ */}
      <HomePricingSection onUpgrade={openUpgrade} />

      {/* ══ CTA BAND ═══════════════════════════════════════════════════════════ */}
      <section
        className="border-y-4 border-gray-700 py-20 px-6"
        style={{ backgroundColor: '#FFE234' }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight">
            Stop Guessing.<br />Start Getting<br />Interviews.
          </h2>
          <p className="text-base font-bold text-black/70 max-w-md mx-auto">
            Upload your resume free — Simply Make an account to see your ATS score.
            Takes 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="group flex items-center gap-3 border-4 border-black px-10 py-5 font-black text-base uppercase bg-black text-white hover:bg-white hover:text-black transition-colors"
              style={{ boxShadow: '6px 6px 0 #555' }}
            >
              Get My Free Score
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => openUpgrade('starter')}
              className="flex items-center gap-2 border-4 border-black px-8 py-5 font-black text-sm uppercase bg-white hover:bg-black hover:text-white transition-colors"
              style={{ boxShadow: '4px 4px 0 #555' }}
            >
              View Paid Plans <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            {[<Shield className="w-4 h-4" />, <Clock className="w-4 h-4" />, <Zap className="w-4 h-4" />].map((icon, i) => {
              const labels = ['No spam ever', 'Results in 30 sec', 'Free forever tier'];
              return (
                <span key={i} className="flex items-center gap-1.5 text-sm font-bold">
                  {icon}{labels[i]}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="border-t-4 border-black py-16 px-6" style={{ backgroundColor: '#0A0A0A', color: '#fff' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-5">
              {/* Logo — uses the same SVG as the navbar */}
            <Link to="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
              {/* Dark-background version of the logo */}
              <img
                src="/logo-icon.svg"
                alt="ResumeLens"
                className="h-10 w-auto"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </Link>
              
            <p className="text-sm font-semibold text-white/50 max-w-xs leading-relaxed">
              AI-powered resume analysis that helps you beat ATS filters and land interviews at top companies.
            </p>
            <div className="flex gap-3">
              {['📧', '🐦', '💼'].map((emoji, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 border-2 border-white/20 flex items-center justify-center text-sm hover:border-white/60 transition-colors"
                >
                  {emoji}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white/40">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Features',      to: '/features' },
                { label: 'Pricing',       to: '/pricing' },
                { label: 'How It Works',  to: '/how-it-works' },
                { label: 'Dashboard',     to: user ? '/dashboard' : '/auth' },
                { label: 'Admin',         to: '/admin/payments' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-white/40">
            <TrendingUp className="w-3.5 h-3.5 text-green-400 inline-block" />Our Other Websites</h4>
           
            <ul className="space-y-2.5">
              {[
                { label: 'Portfolio',    to: `https://yogeshportfolio2.vercel.app/` },
                { label: 'PaperStack',        to: `https://paper-stack-beryl.vercel.app/` },
                { label: 'Expense Tracker',  to: `https://expensetracker2-eight.vercel.app/` },
               
              ].map(({ label, to }) => (
                <li key={label}>
                  <a href={to} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-white/60 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="border-t-2 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs text-white/30 font-semibold">
            © 2026 ResumeLens · Built to help you get hired
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map((l) => (
              <Link
                key={l}
                to={`/${l.toLowerCase()}`}
                className="text-xs font-bold text-white/30 hover:text-white/70 uppercase tracking-widest transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Keyframe styles injected inline for marquee + spin ── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
      `}</style>

      {showUpgrade && (
        <UpgradeModal
          isOpen
          onClose={() => setShowUpgrade(false)}
          defaultPlan={upgradePlan}
        />
      )}
      </div>
    </>
  );
};






