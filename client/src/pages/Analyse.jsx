import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import toast from 'react-hot-toast';
import { resumeAPI, historyAPI } from '../services/api';
import {
  ArrowLeft, Loader2, CheckCircle, XCircle, MessageSquare,
  Target, Flame, FileText, Copy, Check, AlertTriangle,
  Star, Code, BookOpen, Zap, Brain, TrendingUp, TrendingDown,
  Minus, DollarSign, Trophy, ShieldAlert, AlertCircle,
  Lightbulb, Clock, Eye, ChevronDown, ChevronUp,
  ArrowRight, BarChart2, Users
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const scoreNum   = (s) => Number(s) || 0;
const scoreHex   = (s) => { const n = scoreNum(s); return n >= 80 ? '#16a34a' : n >= 60 ? '#ca8a04' : '#dc2626'; };
const scoreBg    = (s) => { const n = scoreNum(s); return n >= 80 ? 'bg-neo-green'  : n >= 60 ? 'bg-neo-yellow'  : 'bg-neo-red'; };
const scoreLabel = (s) => { const n = scoreNum(s); return n >= 80 ? 'Excellent'     : n >= 60 ? 'Good'           : 'Needs Work'; };
const arr        = (v) => Array.isArray(v) ? v : [];

// ── FIX: Normalize interview question difficulty
// Handles both old format (importance: "High/Medium/Low")
// and new format (difficulty: "Hard/Medium/Easy")
const normalizeDifficulty = (q) => {
  const raw = (q.difficulty || q.importance || '').trim().toLowerCase();
  if (raw === 'hard'   || raw === 'high')   return 'Hard';
  if (raw === 'easy'   || raw === 'low')    return 'Easy';
  return 'Medium'; // covers "medium", "med", anything else
};

// ── FIX: Format currency with locale-aware commas
const formatSalary = (num, currency) => {
  if (!num || num === 0) return '—';
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency', currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${currency || '$'}${(num / 1000).toFixed(0)}k`;
  }
};

// ─────────────────────────────────────────────────────────────
// SVG SCORE RING
// ─────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 96, label }) {
  const n   = Math.min(100, Math.max(0, scoreNum(score)));
  const r   = (size - 12) / 2;
  const c   = 2 * Math.PI * r;
  const off = c - (n / 100) * c;
  const col = scoreHex(score);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={col} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={off}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-space font-black text-lg leading-none" style={{ color: col }}>{n}</span>
          <span className="text-[9px] font-bold text-gray-400 leading-none mt-0.5">/100</span>
        </div>
      </div>
      <span className="text-xs font-black uppercase tracking-wide text-center leading-tight">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────
function Bar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (scoreNum(value) / max) * 100));
  return (
    <div className="h-2 bg-gray-200 border border-black/10 w-full">
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: scoreHex(pct >= 10 ? value : pct * (100 / max)) }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────
function Section({ id, title, icon: Icon, accentColor = '#000', children, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="neo-card overflow-hidden" style={{ borderColor: accentColor, borderWidth: '3px', borderStyle: 'solid' }}>
      <button
        className={`w-full flex items-center justify-between px-6 py-4 ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ backgroundColor: accentColor + '18' }}
        onClick={() => collapsible && setOpen(o => !o)}
      >
        <h2 className="font-space font-extrabold text-base uppercase tracking-widest flex items-center gap-2.5">
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />}
          {title}
        </h2>
        {collapsible && (open
          ? <ChevronUp   className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />)}
      </button>
      {open && <div className="px-6 pb-6 pt-4">{children}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ITEM ROW
// ─────────────────────────────────────────────────────────────
function ItemRow({ text, variant = 'neutral', number }) {
  const cfg = {
    green:   { bg: '#f0fdf4', border: '#86efac', icon: <CheckCircle   className="w-4 h-4 text-green-600  flex-shrink-0 mt-0.5" /> },
    red:     { bg: '#fef2f2', border: '#fca5a5', icon: <XCircle       className="w-4 h-4 text-red-500    flex-shrink-0 mt-0.5" /> },
    yellow:  { bg: '#fefce8', border: '#fde047', icon: <AlertTriangle  className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" /> },
    blue:    { bg: '#eff6ff', border: '#93c5fd', icon: <ArrowRight     className="w-4 h-4 text-blue-500   flex-shrink-0 mt-0.5" /> },
    neutral: { bg: '#f9fafb', border: '#d1d5db', icon: <Minus          className="w-4 h-4 text-gray-400   flex-shrink-0 mt-0.5" /> },
  };
  const s = cfg[variant] || cfg.neutral;
  return (
    <div className="flex items-start gap-3 p-3.5 border-2"
      style={{ backgroundColor: s.bg, borderColor: s.border }}>
      {number != null
        ? <span className="w-6 h-6 bg-black text-white text-xs font-black flex items-center justify-center flex-shrink-0">{number}</span>
        : s.icon}
      <span className="font-semibold text-sm leading-relaxed">{text}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHIP / TAG
// ─────────────────────────────────────────────────────────────
function Chip({ text, variant = 'default' }) {
  const map = {
    default: { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' },
    green:   { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
    red:     { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' },
    blue:    { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
    yellow:  { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    purple:  { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' },
  };
  const s = map[variant] || map.default;
  return (
    <span className="inline-block px-2.5 py-1 text-xs font-bold border"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
      {text}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// BULLET DIFF CARD
// ─────────────────────────────────────────────────────────────
function BulletCard({ bullet, index }) {
  const [showReason, setShowReason] = useState(false);
  return (
    <div className="border-3 border-black overflow-hidden">
      <div className="flex items-center justify-between bg-gray-100 border-b-2 border-black px-4 py-2.5">
        <span className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center font-black">
            {index + 1}
          </span>
          Rewrite #{index + 1}
        </span>
        <button
          onClick={() => setShowReason(r => !r)}
          className="text-[11px] font-black underline text-gray-500 hover:text-black"
        >
          {showReason ? 'Hide reason ↑' : 'Why this? ↓'}
        </button>
      </div>
      <div className="p-4 grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1.5">❌ Original</p>
          <p className="text-sm text-gray-500 line-through bg-red-50 border border-red-200 p-3 leading-relaxed">
            {bullet.original}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-1.5">✅ Improved</p>
          <p className="text-sm font-semibold bg-green-50 border border-green-200 p-3 leading-relaxed">
            {bullet.improved}
          </p>
        </div>
      </div>
      {showReason && bullet.reason && (
        <div className="px-4 pb-4">
          <p className="text-xs italic text-gray-700 bg-yellow-50 border border-yellow-200 p-3 leading-relaxed">
            💡 {bullet.reason}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STICKY SIDEBAR NAV
// ─────────────────────────────────────────────────────────────
const NAV = [
  { id: 'scorecard',    label: 'Score Card',        icon: BarChart2     },
  { id: 'ai-summary',   label: 'AI Summary',         icon: MessageSquare },
  { id: 'strengths',    label: 'Strengths',          icon: CheckCircle   },
  { id: 'weaknesses',   label: 'Weaknesses',         icon: XCircle       },
  { id: 'career',       label: 'Career Trajectory',  icon: TrendingUp    },
  { id: 'salary',       label: 'Salary Estimate',    icon: DollarSign    },
  { id: 'benchmark',    label: 'Benchmark',          icon: Trophy        },
  { id: 'skills',       label: 'Skills',             icon: Code          },
  { id: 'keywords',     label: 'Keywords',           icon: Target        },
  { id: 'projects',     label: 'Projects',           icon: Star          },
  { id: 'bullets',      label: 'Bullet Rewrites',    icon: Zap           },
  { id: 'summary-rw',   label: 'Summary Rewrite',    icon: FileText      },
  { id: 'improvements', label: 'Action Items',       icon: Lightbulb     },
  { id: 'interview',    label: 'Interview Prep',     icon: BookOpen      },
  { id: 'flags',        label: 'Red Flags',          icon: ShieldAlert   },
  { id: 'formatting',   label: 'Formatting',         icon: Eye           },
];

function SidebarNav({ active }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <nav className="space-y-0.5">
      {NAV.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => go(id)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-left transition-all
            ${active === id ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
        >
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export const AnalysisPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [analysis,    setAnalysis]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [roasting,    setRoasting]    = useState(false);
  const [roastResult, setRoastResult] = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [leaderboard, setLeaderboard] = useState(null);
  const [activeNav,   setActiveNav]   = useState('scorecard');
  const [iqTab,       setIqTab]       = useState('Hard');

  // IntersectionObserver → highlight active nav item as user scrolls
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); }),
      { rootMargin: '-15% 0px -75% 0px' }
    );
    NAV.forEach(({ id: nid }) => { const el = document.getElementById(nid); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [analysis]);

  useEffect(() => { if (id) fetchAnalysis(); }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const r = await resumeAPI.getAnalysis(id);
      setAnalysis(r.data);
      if (r.data?.targetDomain && r.data?.score !== undefined) fetchLeaderboard(r.data.targetDomain, r.data.score);
    } catch (e) {
      console.error('Fetch analysis error:', e);
      toast.error('Failed to load analysis');
      navigate('/dashboard');
    } finally { setLoading(false); }
  };

  const fetchLeaderboard = async (domain, score) => {
    try {
      if (historyAPI?.getLeaderboard) {
        const r = await historyAPI.getLeaderboard(domain, score);
        setLeaderboard(r.data);
      }
    } catch (e) { console.error('Leaderboard error:', e); }
  };

  const handleRoast = async () => {
    if (!analysis?.resumeText) { toast.error('No resume text available'); return; }
    setRoasting(true);
    try {
      const r = await resumeAPI.roastResume({ resumeText: analysis.resumeText });
      setRoastResult(r.data.roast);
    } catch (e) { toast.error('Failed to roast resume'); }
    finally { setRoasting(false); }
  };

  const copyRoast = () => {
    if (!roastResult) return;
    navigator.clipboard.writeText(roastResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── LOADING / NOT FOUND ──────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-neo-offwhite">
      <div className="neo-card p-10 text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
        <p className="font-space font-extrabold text-xl">Loading analysis…</p>
      </div>
    </div>
  );

  if (!analysis) return (
    <div className="min-h-screen flex items-center justify-center bg-neo-offwhite">
      <div className="neo-card p-10 text-center space-y-4">
        <p className="font-space font-extrabold text-xl">Analysis not found</p>
        <Link to="/dashboard" className="neo-button inline-block">← Dashboard</Link>
      </div>
    </div>
  );

  // ── DERIVED DATA ─────────────────────────────────────────────
  const displayDomain = analysis.targetDomain === 'other' && analysis.customDomain
    ? analysis.customDomain
    : (analysis.targetDomain || '').replace(/-/g, ' ');

  // ── FIX: Normalize all IQ items to use Hard/Medium/Easy difficulty
  const iq = arr(analysis.interview_questions).map(q => ({
    ...q,
    difficulty: normalizeDifficulty(q),
  }));
  const iqMap = {
    Hard:   iq.filter(q => q.difficulty === 'Hard'),
    Medium: iq.filter(q => q.difficulty === 'Medium'),
    Easy:   iq.filter(q => q.difficulty === 'Easy'),
  };

  const traj     = analysis.career_trajectory   || null;
  const salary   = analysis.salary_estimate     || null;
  const bench    = analysis.benchmark           || null;
  const summRw   = analysis.summary_rewrite     || null;
  const redFlags  = arr(analysis.red_flags);
  const scamFlags = arr(analysis.scam_flags);
  const hasFlags  = redFlags.length > 0 || scamFlags.length > 0;

  const trajDir   = (traj?.direction || '').toLowerCase();
  const trajIcon  = trajDir === 'upward'   ? <TrendingUp  className="w-5 h-5 text-green-600" />
                  : trajDir === 'downward' ? <TrendingDown className="w-5 h-5 text-red-600"   />
                  :                          <Minus        className="w-5 h-5 text-yellow-600" />;
  const trajColor = trajDir === 'upward'   ? '#16a34a'
                  : trajDir === 'downward' ? '#dc2626'
                  :                         '#ca8a04';

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neo-offwhite">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 py-6 flex gap-5 items-start">

        {/* ══ STICKY SIDEBAR ══════════════════════════════════════ */}
        <aside className="hidden xl:block w-48 flex-shrink-0 sticky top-6 self-start">
          <div className="neo-card p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-2">Navigate</p>
            <SidebarNav active={activeNav} />
          </div>
          <Link
            to="/dashboard"
            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-black px-2 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
        </aside>

        {/* ══ MAIN CONTENT ════════════════════════════════════════ */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              1. SCORE CARD
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div id="scorecard" className="neo-card overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b-3 border-black"
              style={{ backgroundColor: scoreHex(analysis.score) + '15' }}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Link to="/dashboard" className="text-gray-400 hover:text-black transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Analysis Result
                    </span>
                  </div>
                  <h1 className="font-space text-2xl sm:text-3xl font-extrabold leading-tight break-words">
                    {analysis.fileName || 'Resume Analysis'}
                  </h1>
                  <p className="text-sm font-semibold text-gray-500 mt-1 capitalize">
                    {displayDomain}
                    {analysis.createdAt && (
                      <> &bull; {new Date(analysis.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}</>
                    )}
                  </p>
                </div>
                {/* Big score badge */}
                <div className="text-center flex-shrink-0">
                  <div className={`font-space font-black text-6xl leading-none border-3 border-black ${scoreBg(analysis.score)} px-5 py-3 inline-block`}>
                    {analysis.score ?? '--'}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1.5">
                    {scoreLabel(analysis.score)}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-score rings + bars */}
            <div className="px-6 pt-6 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center mb-7">
                <ScoreRing score={analysis.ats_compatibility} label="ATS Score"   />
                <ScoreRing score={analysis.grammar_score}     label="Grammar"     />
                <ScoreRing score={analysis.readability_score} label="Readability" />
                <ScoreRing score={analysis.experience_match}  label="Domain Fit"  />
              </div>
              <div className="space-y-3">
                {[
                  { label: 'ATS Compatibility', v: analysis.ats_compatibility },
                  { label: 'Grammar Quality',   v: analysis.grammar_score     },
                  { label: 'Readability',       v: analysis.readability_score },
                  { label: 'Domain Experience', v: analysis.experience_match  },
                ].map(({ label, v }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 w-36 flex-shrink-0">{label}</span>
                    <div className="flex-1"><Bar value={v} /></div>
                    <span className="text-xs font-black w-8 text-right" style={{ color: scoreHex(v) }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            {leaderboard && leaderboard.totalUsers > 0 && (
              <div className="border-t-3 border-black px-6 py-4 bg-neo-yellow/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-700" />
                  <p className="font-black text-sm">
                    Better than{' '}
                    <span className="text-yellow-800 text-base">{leaderboard.percentile}%</span>
                    {' '}of {displayDomain} resumes
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  {[['Average', leaderboard.averageScore], ['Highest', leaderboard.highestScore], ['Total', leaderboard.totalUsers]].map(([lbl, val]) => (
                    <div key={lbl}>
                      <div className="font-space font-extrabold text-lg leading-none">{val}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              2. ROAST MY RESUME
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="neo-card border-3 border-neo-red overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-neo-red/10 border-b-3 border-neo-red">
              <h2 className="font-space font-extrabold flex items-center gap-2 text-neo-red uppercase tracking-wide">
                <Flame className="w-5 h-5" /> Roast My Resume
              </h2>
              <button
                onClick={handleRoast} disabled={roasting}
                className="neo-button-red flex items-center gap-2 px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {roasting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Roasting…</>
                  : <><Flame   className="w-4 h-4" /> Roast It!</>}
              </button>
            </div>
            {roastResult && (
              <div className="p-5">
                <div className="relative bg-neo-red/5 border-2 border-neo-red p-5">
                  <pre className="whitespace-pre-wrap font-bold text-sm leading-relaxed pr-10 text-gray-800">
                    {roastResult}
                  </pre>
                  <button
                    onClick={copyRoast}
                    className="absolute top-3 right-3 p-1.5 border-2 border-black hover:bg-neo-red/20 transition-colors"
                    title="Copy roast"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              3. AI EXECUTIVE SUMMARY
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {analysis.summary && (
            <Section id="ai-summary" icon={MessageSquare} title="AI Executive Summary" accentColor="#4f46e5">
              <p className="text-base leading-loose font-medium text-gray-800 bg-indigo-50 border-2 border-indigo-200 p-5">
                {analysis.summary}
              </p>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              4. STRENGTHS & WEAKNESSES  (side by side)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="grid md:grid-cols-2 gap-5">
            {arr(analysis.strengths).length > 0 && (
              <div id="strengths" className="neo-card overflow-hidden border-3 border-black">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-neo-green/30 border-b-3 border-black">
                  <CheckCircle className="w-4 h-4 text-green-700" />
                  <h2 className="font-space font-extrabold text-sm uppercase tracking-widest text-green-800">
                    Strengths ({arr(analysis.strengths).length})
                  </h2>
                </div>
                <div className="p-4 space-y-2">
                  {arr(analysis.strengths).map((s, i) => <ItemRow key={i} text={s} variant="green" />)}
                </div>
              </div>
            )}
            {arr(analysis.weaknesses).length > 0 && (
              <div id="weaknesses" className="neo-card overflow-hidden border-3 border-black">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-neo-red/20 border-b-3 border-black">
                  <XCircle className="w-4 h-4 text-red-700" />
                  <h2 className="font-space font-extrabold text-sm uppercase tracking-widest text-red-800">
                    Weaknesses ({arr(analysis.weaknesses).length})
                  </h2>
                </div>
                <div className="p-4 space-y-2">
                  {arr(analysis.weaknesses).map((w, i) => <ItemRow key={i} text={w} variant="red" />)}
                </div>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              5. CAREER TRAJECTORY
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {traj && (
            <Section id="career" icon={TrendingUp} title="Career Trajectory" accentColor={trajColor}>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                <div className="border-3 border-black p-4 text-center bg-white">
                  <div className="flex justify-center mb-2">{trajIcon}</div>
                  <div className="font-space font-extrabold text-xl capitalize">{traj.direction || 'Unclear'}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Direction</div>
                </div>
                <div className="border-3 border-black p-4 text-center bg-white">
                  <div className="font-space font-extrabold text-3xl text-blue-600">
                    {traj.avg_tenure_months ? `${traj.avg_tenure_months}` : '—'}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    Avg Tenure (months)
                  </div>
                </div>
                <div className="border-3 border-black p-4 text-center bg-white">
                  <div className="font-space font-extrabold text-3xl">
                    {traj.promotions_detected ? '✅' : '❌'}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    Promotions Detected
                  </div>
                </div>
              </div>
              {traj.assessment && (
                <div className="border-2 border-black p-4 bg-white">
                  <p className="text-sm font-semibold leading-relaxed text-gray-700">{traj.assessment}</p>
                </div>
              )}
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              6. SALARY ESTIMATE
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {salary && (salary.range_low > 0 || salary.range_high > 0) && (
            <Section id="salary" icon={DollarSign} title="Market Salary Estimate" accentColor="#16a34a">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="border-3 border-black px-8 py-5 bg-neo-green/20 text-center flex-shrink-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-1">
                    {salary.currency || 'USD'} Annual Range
                  </div>
                  <div className="font-space font-extrabold text-3xl text-green-800">
                    {formatSalary(salary.range_low, salary.currency)}
                    <span className="text-gray-400 mx-2 font-normal text-xl">–</span>
                    {formatSalary(salary.range_high, salary.currency)}
                  </div>
                </div>
                {salary.basis && (
                  <p className="text-sm font-medium text-gray-600 leading-relaxed italic flex-1">
                    💡 {salary.basis}
                  </p>
                )}
              </div>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              7. BENCHMARK
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {bench && (arr(bench.missing_compared_to_top_candidates).length > 0 || arr(bench.competitive_strengths).length > 0) && (
            <Section id="benchmark" icon={Trophy} title="Benchmark vs Top Candidates" accentColor="#b45309">
              <div className="grid md:grid-cols-2 gap-5">
                {arr(bench.missing_compared_to_top_candidates).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-3 flex items-center gap-1.5">
                      <XCircle className="w-3 h-3" /> What You're Missing
                    </p>
                    <div className="space-y-2">
                      {arr(bench.missing_compared_to_top_candidates).map((item, i) =>
                        <ItemRow key={i} text={item} variant="red" />
                      )}
                    </div>
                  </div>
                )}
                {arr(bench.competitive_strengths).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3" /> Competitive Strengths
                    </p>
                    <div className="space-y-2">
                      {arr(bench.competitive_strengths).map((item, i) =>
                        <ItemRow key={i} text={item} variant="green" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              8. SKILLS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <Section id="skills" icon={Code} title="Skills Detected" accentColor="#1d4ed8">
            <div className="space-y-5">
              {arr(analysis.hard_skills).length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2.5">Hard Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {arr(analysis.hard_skills).map((s, i) => <Chip key={i} text={s} variant="blue" />)}
                  </div>
                </div>
              )}
              {arr(analysis.soft_skills).length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-700 mb-2.5">Soft Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {arr(analysis.soft_skills).map((s, i) => <Chip key={i} text={s} variant="purple" />)}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              9. KEYWORDS & SECTIONS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <Section id="keywords" icon={Target} title="Keywords & Sections" accentColor="#7c3aed">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-5">
                {arr(analysis.keywords).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-2.5">
                      ✅ ATS Keywords Found
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arr(analysis.keywords).map((k, i) => <Chip key={i} text={k} variant="green" />)}
                    </div>
                  </div>
                )}
                {arr(analysis.sections_detected).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-700 mb-2.5">
                      📋 Sections Found
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arr(analysis.sections_detected).map((s, i) => <Chip key={i} text={s} variant="blue" />)}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-5">
                {arr(analysis.missing_keywords).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2.5">
                      ❌ Missing Keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arr(analysis.missing_keywords).map((k, i) => <Chip key={i} text={k} variant="red" />)}
                    </div>
                  </div>
                )}
                {arr(analysis.missing_sections).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-2.5">
                      ⚠️ Missing Sections
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {arr(analysis.missing_sections).map((s, i) => <Chip key={i} text={s} variant="yellow" />)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              10. TOP PROJECTS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {arr(analysis.top_projects).length > 0 && (
            <Section id="projects" icon={Star} title="Top Projects" accentColor="#0891b2">
              <div className="grid sm:grid-cols-2 gap-4">
                {arr(analysis.top_projects).map((p, i) => (
                  <div key={i} className="border-3 border-black p-5 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-space font-extrabold text-base leading-tight">
                        {p.name || `Project ${i + 1}`}
                      </h3>
                      <div className="flex-shrink-0 text-center">
                        <span className="font-space font-black text-2xl leading-none" style={{ color: scoreHex((p.score || 0) * 10) }}>
                          {p.score ?? '--'}
                        </span>
                        <span className="text-xs text-gray-400 font-bold">/10</span>
                      </div>
                    </div>
                    <Bar value={p.score || 0} max={10} />
                    <p className="text-xs text-gray-600 font-medium mt-3 leading-relaxed">{p.reason}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              11. BULLET REWRITES
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {arr(analysis.bullet_improvements).length > 0 && (
            <Section id="bullets" icon={Zap} title="Bullet Point Rewrites" accentColor="#b45309">
              <p className="text-xs font-semibold text-gray-400 mb-4">
                Tap "Why this?" to see the recruiter's exact reasoning.
              </p>
              <div className="space-y-4">
                {arr(analysis.bullet_improvements).map((b, i) => <BulletCard key={i} bullet={b} index={i} />)}
              </div>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              12. SUMMARY REWRITE
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {summRw?.improved && (
            <Section id="summary-rw" icon={FileText} title="Summary / Objective Rewrite" accentColor="#0f766e">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2">❌ Original</p>
                  <div className="border-2 border-red-200 bg-red-50 p-4 text-sm text-gray-600 leading-relaxed min-h-[80px]">
                    {summRw.original || 'None found in resume'}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-700 mb-2">✅ Improved</p>
                  <div className="border-2 border-green-300 bg-green-50 p-4 text-sm font-semibold leading-relaxed min-h-[80px]">
                    {summRw.improved}
                  </div>
                </div>
              </div>
              {summRw.reason && (
                <div className="border-2 border-neo-yellow bg-neo-yellow/20 p-3">
                  <p className="text-xs font-semibold text-yellow-900 italic">💡 {summRw.reason}</p>
                </div>
              )}
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              13. ACTION ITEMS (IMPROVEMENTS)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {arr(analysis.improvements).length > 0 && (
            <Section id="improvements" icon={Lightbulb} title="Action Items" accentColor="#16a34a">
              <div className="space-y-2.5">
                {arr(analysis.improvements).map((item, i) => (
                  <ItemRow key={i} text={item} variant="blue" number={i + 1} />
                ))}
              </div>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              14. INTERVIEW PREP
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {iq.length > 0 && (
            <Section id="interview" icon={BookOpen} title="Interview Preparation" accentColor="#7c3aed">
              {/* Tab strip */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {['Hard', 'Medium', 'Easy'].map((diff) => {
                  const count  = iqMap[diff].length;
                  const active = iqTab === diff;
                  const cols   = { Hard: '#dc2626', Medium: '#ca8a04', Easy: '#16a34a' };
                  return (
                    <button
                      key={diff}
                      onClick={() => setIqTab(diff)}
                      className="flex items-center gap-2 px-4 py-2 border-3 border-black font-black text-xs uppercase tracking-widest transition-all"
                      style={{
                        backgroundColor: active ? cols[diff] : 'white',
                        color:           active ? 'white' : '#374151',
                        transform:       active ? 'translate(2px,2px)' : '',
                        boxShadow:       active ? 'none' : '3px 3px 0 #000',
                      }}
                    >
                      {diff}
                      <span className="text-[10px] px-1.5 py-0.5 font-black bg-black/20">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {iqMap[iqTab].length === 0
                  ? <p className="text-sm text-gray-400 italic py-6 text-center">No {iqTab} questions generated.</p>
                  : iqMap[iqTab].map((q, i) => {
                    const lc = { Hard: '#dc2626', Medium: '#ca8a04', Easy: '#16a34a' };
                    return (
                      <div
                        key={i}
                        className="border-2 border-black bg-white p-4"
                        style={{ borderLeftWidth: '5px', borderLeftColor: lc[q.difficulty] || '#374151' }}
                      >
                        <p className="font-bold text-sm leading-relaxed mb-1.5">{q.question}</p>
                        {(q.reason || q.context) && (
                          <p className="text-xs text-gray-400 font-medium italic">{q.reason || q.context}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              15. RED FLAGS & SCAM FLAGS
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {hasFlags && (
            <Section id="flags" icon={ShieldAlert} title="Red Flags & Suspicious Claims" accentColor="#dc2626">
              {redFlags.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Timeline / Employment Issues
                  </p>
                  <div className="space-y-2">
                    {redFlags.map((f, i) => <ItemRow key={i} text={f} variant="yellow" />)}
                  </div>
                </div>
              )}
              {scamFlags.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" /> Suspicious / Overclaimed
                  </p>
                  <div className="space-y-2">
                    {scamFlags.map((f, i) => <ItemRow key={i} text={f} variant="red" />)}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              16. FORMATTING & GRAMMAR  (collapsible, lower priority)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {(arr(analysis.formatting_issues).length > 0 || arr(analysis.grammar_issues).length > 0) && (
            <Section
              id="formatting"
              icon={Eye}
              title="Formatting & Grammar Issues"
              accentColor="#ca8a04"
              collapsible
              defaultOpen={false}
            >
              <div className="grid md:grid-cols-2 gap-6">
                {arr(analysis.formatting_issues).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-700 mb-3">
                      ⚠️ Formatting Issues
                    </p>
                    <div className="space-y-2">
                      {arr(analysis.formatting_issues).map((iss, i) => <ItemRow key={i} text={iss} variant="yellow" />)}
                    </div>
                  </div>
                )}
                {arr(analysis.grammar_issues).length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-3">
                      ❌ Grammar Issues
                    </p>
                    <div className="space-y-2">
                      {arr(analysis.grammar_issues).map((iss, i) => <ItemRow key={i} text={iss} variant="red" />)}
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          <div className="h-20" />
        </main>
      </div>
    </div>
  );
};