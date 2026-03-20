// import { useState } from 'react';
// import { paymentAPI } from '../services/paymentService';
// import {
//   Check, Copy, CheckCheck, QrCode,
//   Eye, Loader2, X, ChevronDown, ChevronUp,
//   Zap, Crown, ShieldCheck, Clock, RefreshCw
// } from 'lucide-react';

// // ─── Plan config ──────────────────────────────────────────────────────────────
// const PLANS = {
//   starter: {
//     name:      'Starter',
//     price:     199,
//     duration:  '30 days',
//     emoji:     '⚡',
//     tag:       'Great value',
//     accentBg:  '#bbf7d0',   // green-200
//     accentDark:'#15803d',   // green-700
//     headerBg:  '#16a34a',   // green-600
//     stripeBg:  '#f0fdf4',
//     perks: [
//       '14 Resume Analyses / month',
//       'Full ATS Score + Suggestions',
//       'JD Match — 5 / month',
//       'Cover Letter — 5 / month',
//       'Cold Email — 3 / month',
//       'Resume Rewrite — 3 / month',
//       'Unlimited Interview Questions',
//       'AI Chat — 5 sessions',
//       'PDF Export',
//     ],
//   },
//   pro: {
//     name:      'Pro',
//     price:     499,
//     duration:  '30 days',
//     emoji:     '👑',
//     tag:       'Most popular',
//     accentBg:  '#e9d5ff',   // purple-200
//     accentDark:'#6b21a8',   // purple-800
//     headerBg:  '#7c3aed',   // violet-600
//     stripeBg:  '#faf5ff',
//     perks: [
//       'Everything Unlimited',
//       'Full ATS Score + Suggestions',
//       'Unlimited JD Match',
//       'Unlimited Cover Letter',
//       'Unlimited Cold Email',
//       'Unlimited Resume Rewrite',
//       '🔥 Roast My Resume — Exclusive',
//       'Unlimited AI Chat',
//       'Priority Support',
//     ],
//   },
// };

// const UPI_ID = '7877080701@ptaxis';

// const getQrUrl = (upiId, amount) =>
//   `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
//     `upi://pay?pa=${upiId}&pn=Resume%20AI&am=${amount}&cu=INR`
//   )}`;

// // ─── Small atoms ─────────────────────────────────────────────────────────────
// function PerkRow({ text }) {
//   return (
//     <li className="flex items-start gap-2.5 text-sm">
//       <span className="mt-0.5 w-4 h-4 rounded-sm bg-black flex items-center justify-center flex-shrink-0">
//         <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
//       </span>
//       <span className="font-semibold leading-snug">{text}</span>
//     </li>
//   );
// }

// function StepBadge({ n }) {
//   return (
//     <span className="w-6 h-6 rounded-sm bg-white text-black text-[11px] font-black flex items-center justify-center flex-shrink-0 border-2 border-white/40">
//       {n}
//     </span>
//   );
// }

// // ─── Main component ───────────────────────────────────────────────────────────
// export default function UpgradeModal({
//   isOpen,
//   onClose,
//   defaultPlan    = 'starter',
//   triggerAction,
//   errorType,
// }) {
//   const [plan,       setPlan]       = useState(defaultPlan);
//   const [utrNumber,  setUtrNumber]  = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted,  setSubmitted]  = useState(false);
//   const [error,      setError]      = useState('');
//   const [copiedUpi,  setCopiedUpi]  = useState(false);
//   const [showQr,     setShowQr]     = useState(false);
//   const [showUpiId,  setShowUpiId]  = useState(false);

//   if (!isOpen) return null;

//   const cfg     = PLANS[plan];
//   const upiLink = `upi://pay?pa=${UPI_ID}&pn=Resume%20AI&am=${cfg.price}&cu=INR`;
//   const qrUrl   = getQrUrl(UPI_ID, cfg.price);

//   const switchPlan = (p) => {
//     setPlan(p);
//     setShowQr(false);
//     setShowUpiId(false);
//     setUtrNumber('');
//     setError('');
//   };

//   const copyUpiId = () => {
//     navigator.clipboard.writeText(UPI_ID);
//     setCopiedUpi(true);
//     setTimeout(() => setCopiedUpi(false), 2200);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!/^\d{12}$/.test(utrNumber.trim())) {
//       setError('UTR must be exactly 12 digits.');
//       return;
//     }
//     setError('');
//     setSubmitting(true);
//     try {
//       await paymentAPI.submitUtr(plan, utrNumber.trim());
//       setSubmitted(true);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Submission failed. Please try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── SUCCESS ──────────────────────────────────────────────────────────────
//   if (submitted) {
//     return (
//       <div
//         className="fixed inset-0 z-50 flex items-center justify-center p-4"
//         style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
//       >
//         <div
//           className="bg-white border-4 border-black w-full max-w-sm p-8 text-center space-y-5"
//           style={{ boxShadow: '10px 10px 0 #000' }}
//         >
//           <div className="text-6xl">🎉</div>
//           <div>
//             <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight">Submitted!</h2>
//             <p className="text-sm font-semibold text-gray-500 mt-1">
//               {cfg.name} plan · ₹{cfg.price}
//             </p>
//           </div>
//           <p className="text-sm font-semibold text-gray-700 leading-relaxed border-2 border-black p-4 bg-yellow-50">
//             Your plan activates within <strong>2 hours</strong> once we verify the payment. You'll see your plan update in the dashboard.
//           </p>
//           <div className="flex items-center gap-2 text-xs font-black text-gray-400 justify-center uppercase tracking-widest">
//             <Clock className="w-3.5 h-3.5" /> Usually 30 min – 2 hrs on business days
//           </div>
//           <button
//             onClick={onClose}
//             className="w-full py-3.5 bg-black text-white font-black text-sm uppercase tracking-widest border-2 border-black hover:bg-gray-800 transition-colors"
//             style={{ boxShadow: '4px 4px 0 #374151' }}
//           >
//             Back to Dashboard →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── MAIN MODAL ────────────────────────────────────────────────────────────
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
//       style={{ backgroundColor: 'rgba(0,0,0,0.78)' }}
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div
//         className="relative bg-white border-4 border-black w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col"
//         style={{ boxShadow: '12px 12px 0 #000' }}
//       >

//         {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
//         <div
//           className="flex items-center justify-between px-6 py-4 border-b-4 border-black flex-shrink-0"
//           style={{ backgroundColor: cfg.headerBg }}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-3xl leading-none">{cfg.emoji}</span>
//             <div>
//               <h2 className="font-space font-extrabold text-xl text-white uppercase leading-none tracking-tight">
//                 Upgrade to {cfg.name}
//               </h2>
//               <p className="text-white/80 text-xs font-bold mt-0.5 uppercase tracking-widest">
//                 ₹{cfg.price} / {cfg.duration} · No auto-renewal
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-9 h-9 border-2 border-white/40 bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* ══ PLAN SWITCHER ════════════════════════════════════════════════════ */}
//         <div className="flex border-b-4 border-black flex-shrink-0">
//           {Object.entries(PLANS).map(([key, p]) => (
//             <button
//               key={key}
//               onClick={() => switchPlan(key)}
//               className={`relative flex-1 py-3 px-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest border-r-2 last:border-r-0 border-black transition-all
//                 ${plan === key
//                   ? 'bg-black text-white'
//                   : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
//             >
//               <span className="text-base leading-none">{p.emoji}</span>
//               <span>{p.name}</span>
//               <span
//                 className={`font-black text-sm ${plan === key ? 'text-white' : 'text-gray-800'}`}
//               >
//                 ₹{p.price}
//               </span>
//               {p.tag && plan === key && (
//                 <span
//                   className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border-2 border-black whitespace-nowrap"
//                   style={{ backgroundColor: p.accentBg, color: p.accentDark }}
//                 >
//                   {p.tag}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* ══ BODY (scrollable) ════════════════════════════════════════════════ */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="grid md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">

//             {/* ── LEFT COL: Perks ──────────────────────────────────────────── */}
//             <div className="p-6 space-y-5" style={{ backgroundColor: cfg.stripeBg }}>
//               {/* Price hero */}
//               <div
//                 className="border-3 border-black p-4 flex items-center justify-between"
//                 style={{ border: '3px solid black', backgroundColor: cfg.accentBg }}
//               >
//                 <div>
//                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
//                     {cfg.name} Plan
//                   </p>
//                   <p className="font-space font-extrabold text-4xl leading-none mt-0.5">
//                     ₹{cfg.price}
//                   </p>
//                   <p className="text-xs font-bold text-gray-600 mt-0.5">
//                     per {cfg.duration} · one-time
//                   </p>
//                 </div>
//                 <span className="text-5xl leading-none">{cfg.emoji}</span>
//               </div>

//               {/* Perks */}
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
//                   What's included
//                 </p>
//                 <ul className="space-y-2.5">
//                   {cfg.perks.map(p => <PerkRow key={p} text={p} />)}
//                 </ul>
//               </div>

//               {/* Trust badges */}
//               <div className="border-t-2 border-black/10 pt-4 grid grid-cols-3 gap-2">
//                 {[
//                   { icon: ShieldCheck, label: 'Secure UPI' },
//                   { icon: Clock,       label: '2hr Activation' },
//                   { icon: RefreshCw,   label: 'No Renewal' },
//                 ].map(({ icon: Icon, label }) => (
//                   <div key={label} className="flex flex-col items-center gap-1 text-center">
//                     <Icon className="w-4 h-4 text-gray-400" />
//                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">{label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* ── RIGHT COL: Payment ───────────────────────────────────────── */}
//             <div className="p-6 space-y-4 bg-white">

//               {/* ── STEP 1 ─────────────────────────────────────────────────── */}
//               <div>
//                 <div
//                   className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-black mb-0"
//                   style={{ backgroundColor: '#111', color: '#fff' }}
//                 >
//                   <StepBadge n="01" />
//                   <span className="font-black text-xs uppercase tracking-widest">Pay via UPI</span>
//                 </div>

//                 <div className="border-2 border-t-0 border-black p-4 space-y-3" style={{ backgroundColor: '#FFFDE7' }}>

//                   {/* Open UPI — ALWAYS VISIBLE */}
//                   <a
//                     href={upiLink}
//                     className="flex items-center justify-center gap-2.5 w-full py-3.5 font-black text-sm uppercase tracking-widest border-3 border-black text-white transition-all hover:opacity-90 active:translate-y-0.5"
//                     style={{
//                       border: '3px solid #000',
//                       backgroundColor: cfg.headerBg,
//                       boxShadow: '4px 4px 0 #000',
//                     }}
//                   >
//                     📱 Open UPI App — Pay ₹{cfg.price}
//                   </a>

//                   {/* Divider */}
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 border-t-2 border-dashed border-black/20" />
//                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
//                       or scan / copy
//                     </span>
//                     <div className="flex-1 border-t-2 border-dashed border-black/20" />
//                   </div>

//                   {/* QR — hidden until revealed */}
//                   <div className="border-2 border-black overflow-hidden bg-white">
//                     <button
//                       onClick={() => setShowQr(v => !v)}
//                       className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
//                     >
//                       <span className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
//                         <QrCode className="w-4 h-4" />
//                         Show QR Code
//                       </span>
//                       {showQr
//                         ? <ChevronUp   className="w-4 h-4 text-gray-400" />
//                         : <ChevronDown className="w-4 h-4 text-gray-400" />}
//                     </button>
//                     {showQr && (
//                       <div className="border-t-2 border-black p-4 flex flex-col items-center gap-2 bg-white">
//                         <img
//                           src={qrUrl}
//                           alt="UPI QR Code"
//                           className="w-48 h-48 border-2 border-black"
//                           onError={(e) => { e.target.style.display = 'none'; }}
//                         />
//                         <p className="text-[11px] font-semibold text-gray-400">
//                           Scan with GPay, PhonePe, Paytm…
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* UPI ID — hidden until revealed */}
//                   <div className="border-2 border-black overflow-hidden bg-white">
//                     <button
//                       onClick={() => setShowUpiId(v => !v)}
//                       className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
//                     >
//                       <span className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
//                         <Eye className="w-4 h-4" />
//                         Show UPI ID
//                       </span>
//                       {showUpiId
//                         ? <ChevronUp   className="w-4 h-4 text-gray-400" />
//                         : <ChevronDown className="w-4 h-4 text-gray-400" />}
//                     </button>
//                     {showUpiId && (
//                       <div className="border-t-2 border-black p-3 flex items-center gap-2 bg-white">
//                         <input
//                           readOnly
//                           value={UPI_ID}
//                           className="flex-1 border-2 border-black px-3 py-2 font-mono font-bold text-sm bg-gray-50 focus:outline-none min-w-0"
//                         />
//                         <button
//                           onClick={copyUpiId}
//                           className="flex items-center gap-1.5 px-3 py-2 border-2 border-black font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all hover:opacity-80"
//                           style={{
//                             backgroundColor: copiedUpi ? '#16a34a' : '#000',
//                             color: '#fff',
//                             boxShadow: '2px 2px 0 #374151',
//                           }}
//                         >
//                           {copiedUpi
//                             ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
//                             : <><Copy       className="w-3.5 h-3.5" /> Copy</>}
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Amount row */}
//                   <div className="flex items-center justify-between pt-1">
//                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-black/20 px-2 py-0.5">Amount</span>
//                     <span className="font-space font-extrabold text-lg" style={{ color: cfg.headerBg }}>
//                       ₹{cfg.price}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* ── STEP 2 ─────────────────────────────────────────────────── */}
//               <div>
//                 <div
//                   className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-black"
//                   style={{ backgroundColor: '#111', color: '#fff' }}
//                 >
//                   <StepBadge n="02" />
//                   <span className="font-black text-xs uppercase tracking-widest">Enter UTR / Reference No.</span>
//                 </div>

//                 <form
//                   onSubmit={handleSubmit}
//                   className="border-2 border-t-0 border-black p-4 space-y-3"
//                 >
//                   <p className="text-xs font-semibold text-gray-500 leading-relaxed">
//                     After paying, find the <strong>12-digit UTR</strong> in your UPI app under{' '}
//                     <em>Transaction History</em> and enter it below.
//                   </p>

//                   <div className="relative">
//                     <input
//                       type="text"
//                       inputMode="numeric"
//                       value={utrNumber}
//                       onChange={(e) => {
//                         setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12));
//                         setError('');
//                       }}
//                       placeholder="e.g. 423156789012"
//                       maxLength={12}
//                       className="w-full border-3 border-black px-4 py-3 font-mono font-bold text-sm focus:outline-none placeholder-gray-300 pr-16"
//                       style={{ border: '3px solid black' }}
//                     />
//                     <span
//                       className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black tabular-nums
//                         ${utrNumber.length === 12 ? 'text-green-600' : 'text-gray-300'}`}
//                     >
//                       {utrNumber.length}/12
//                     </span>
//                   </div>

//                   {error && (
//                     <p className="text-red-600 text-xs font-bold border-2 border-red-300 bg-red-50 px-3 py-2 flex items-center gap-1.5">
//                       ⚠ {error}
//                     </p>
//                   )}

//                   <button
//                     type="submit"
//                     disabled={submitting || utrNumber.length !== 12}
//                     className="w-full py-4 font-black text-sm uppercase tracking-widest border-3 border-black transition-all disabled:opacity-35 disabled:cursor-not-allowed text-white"
//                     style={{
//                       border: '3px solid black',
//                       backgroundColor: utrNumber.length === 12 && !submitting ? cfg.headerBg : '#9ca3af',
//                       boxShadow: utrNumber.length === 12 && !submitting ? '4px 4px 0 #000' : 'none',
//                     }}
//                   >
//                     {submitting ? (
//                       <span className="flex items-center justify-center gap-2">
//                         <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
//                       </span>
//                     ) : (
//                       '✓ Submit Payment'
//                     )}
//                   </button>
//                 </form>
//               </div>

//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }





















import { useState } from 'react';
import { paymentAPI } from '../services/paymentService';
import {
  Check, Copy, CheckCheck, QrCode,
  Eye, Loader2, X, ChevronDown, ChevronUp,
  Zap, Crown, ShieldCheck, Clock, RefreshCw
} from 'lucide-react';

// ─── Plan config ──────────────────────────────────────────────────────────────
const PLANS = {
  starter: {
    name:      'Starter',
    price:     199,
    duration:  '30 days',
    emoji:     '⚡',
    tag:       'Great value',
    accentBg:  '#bbf7d0',   // green-200
    accentDark:'#15803d',   // green-700
    headerBg:  '#16a34a',   // green-600
    stripeBg:  '#f0fdf4',
    perks: [
      '14 Resume Analyses / month',
      'Full ATS Score + Suggestions',
      'JD Match — 5 / month',
      'Cover Letter — 5 / month',
      'Cold Email — 3 / month',
      'Resume Rewrite — 3 / month',
      'Unlimited Interview Questions',
      'AI Chat — 5 sessions',
      'PDF Export',
    ],
  },
  pro: {
    name:      'Pro',
    price:     499,
    duration:  '30 days',
    emoji:     '👑',
    tag:       'Most popular',
    accentBg:  '#e9d5ff',   // purple-200
    accentDark:'#6b21a8',   // purple-800
    headerBg:  '#7c3aed',   // violet-600
    stripeBg:  '#faf5ff',
    perks: [
      'Everything Unlimited',
      'Full ATS Score + Suggestions',
      'Unlimited JD Match',
      'Unlimited Cover Letter',
      'Unlimited Cold Email',
      'Unlimited Resume Rewrite',
      '🔥 Roast My Resume — Exclusive',
      'Unlimited AI Chat',
      'Priority Support',
    ],
  },
};

const UPI_ID = '7877080701@ptaxis';

const getQrUrl = (upiId, amount) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=Resume%20AI&am=${amount}&cu=INR`
  )}`;

// ─── Small atoms ─────────────────────────────────────────────────────────────
function PerkRow({ text }) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 w-4 h-4 rounded-sm bg-black flex items-center justify-center flex-shrink-0">
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      </span>
      <span className="font-semibold leading-snug">{text}</span>
    </li>
  );
}

function StepBadge({ n }) {
  return (
    <span className="w-6 h-6 rounded-sm bg-white text-black text-[11px] font-black flex items-center justify-center flex-shrink-0 border-2 border-white/40">
      {n}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UpgradeModal({
  isOpen,
  onClose,
  defaultPlan    = 'starter',
  triggerAction,
  errorType,
}) {
  const [plan,       setPlan]       = useState(defaultPlan);
  const [utrNumber,  setUtrNumber]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState('');
  const [copiedUpi,  setCopiedUpi]  = useState(false);
  const [showQr,     setShowQr]     = useState(false);
  const [showUpiId,  setShowUpiId]  = useState(false);

  if (!isOpen) return null;

  const cfg     = PLANS[plan];
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=Resume%20AI&am=${cfg.price}&cu=INR`;
  const qrUrl   = getQrUrl(UPI_ID, cfg.price);

  const switchPlan = (p) => {
    setPlan(p);
    setShowQr(false);
    setShowUpiId(false);
    setUtrNumber('');
    setError('');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(utrNumber.trim())) {
      setError('UTR must be exactly 12 digits.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await paymentAPI.submitUtr(plan, utrNumber.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      >
        <div
          className="bg-white border-4 border-black w-full max-w-sm p-8 text-center space-y-5"
          style={{ boxShadow: '10px 10px 0 #000' }}
        >
          <div className="text-6xl">🎉</div>
          <div>
            <h2 className="font-space font-extrabold text-2xl uppercase tracking-tight">Submitted!</h2>
            <p className="text-sm font-semibold text-gray-500 mt-1">
              {cfg.name} plan · ₹{cfg.price}
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-700 leading-relaxed border-2 border-black p-4 bg-yellow-50">
            Your plan activates within <strong>2 hours</strong> once we verify the payment. You'll see your plan update in the dashboard.
          </p>
          <div className="flex items-center gap-2 text-xs font-black text-gray-400 justify-center uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5" /> Usually 30 min – 2 hrs on business days
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-black text-white font-black text-sm uppercase tracking-widest border-2 border-black hover:bg-gray-800 transition-colors"
            style={{ boxShadow: '4px 4px 0 #374151' }}
          >
            Back to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN MODAL ────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.78)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative bg-white border-4 border-black w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col"
        style={{ boxShadow: '12px 12px 0 #000' }}
      >

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b-4 border-black flex-shrink-0"
          style={{ backgroundColor: cfg.headerBg }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none">{cfg.emoji}</span>
            <div>
              <h2 className="font-space font-extrabold text-xl text-white uppercase leading-none tracking-tight">
                Upgrade to {cfg.name}
              </h2>
              <p className="text-white/80 text-xs font-bold mt-0.5 uppercase tracking-widest">
                ₹{cfg.price} / {cfg.duration} · No auto-renewal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 border-2 border-white/40 bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ══ PLAN SWITCHER ════════════════════════════════════════════════════ */}
        <div className="flex gap-3 px-5 py-4 border-b-4 border-black flex-shrink-0 bg-gray-100">
          {Object.entries(PLANS).map(([key, p]) => {
            const isActive = plan === key;
            return (
              <button
                key={key}
                onClick={() => switchPlan(key)}
                className="flex-1 flex flex-col items-center gap-1.5 pt-2 pb-3 px-4 font-black uppercase tracking-widest border-3 border-black transition-all active:translate-y-0.5"
                style={{
                  border: '3px solid black',
                  backgroundColor: isActive ? p.headerBg : '#fff',
                  color:           isActive ? '#fff'      : '#374151',
                  boxShadow:       isActive ? '4px 4px 0 #000' : '3px 3px 0 #9ca3af',
                  transform:       isActive ? 'translateY(1px)' : '',
                }}
              >
                {/* tag — sits cleanly inside the button at the top */}
                {p.tag && (
                  <span
                    className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 border-2 border-black whitespace-nowrap"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : p.accentBg,
                      color:           isActive ? '#fff'                    : p.accentDark,
                      borderColor:     isActive ? 'rgba(255,255,255,0.4)'   : 'black',
                    }}
                  >
                    {p.tag}
                  </span>
                )}
                {/* emoji + name + price row */}
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{p.emoji}</span>
                  <div className="text-left">
                    <div className="text-sm leading-none">{p.name}</div>
                    <div className={`text-base font-black leading-tight mt-0.5 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                      ₹{p.price}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ══ BODY (scrollable) ════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">

            {/* ── LEFT COL: Perks ──────────────────────────────────────────── */}
            <div className="p-6 space-y-5" style={{ backgroundColor: cfg.stripeBg }}>
              {/* Price hero */}
              <div
                className="border-3 border-black p-4 flex items-center justify-between"
                style={{ border: '3px solid black', backgroundColor: cfg.accentBg }}
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {cfg.name} Plan
                  </p>
                  <p className="font-space font-extrabold text-4xl leading-none mt-0.5">
                    ₹{cfg.price}
                  </p>
                  <p className="text-xs font-bold text-gray-600 mt-0.5">
                    per {cfg.duration} · one-time
                  </p>
                </div>
                <span className="text-5xl leading-none">{cfg.emoji}</span>
              </div>

              {/* Perks */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  What's included
                </p>
                <ul className="space-y-2.5">
                  {cfg.perks.map(p => <PerkRow key={p} text={p} />)}
                </ul>
              </div>

              {/* Trust badges */}
              <div className="border-t-2 border-black/10 pt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: 'Secure UPI' },
                  { icon: Clock,       label: '2hr Activation' },
                  { icon: RefreshCw,   label: 'No Renewal' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT COL: Payment ───────────────────────────────────────── */}
            <div className="p-6 space-y-4 bg-white">

              {/* ── STEP 1 ─────────────────────────────────────────────────── */}
              <div>
                <div
                  className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-black mb-0"
                  style={{ backgroundColor: '#111', color: '#fff' }}
                >
                  <StepBadge n="01" />
                  <span className="font-black text-xs uppercase tracking-widest">Pay via UPI</span>
                </div>

                <div className="border-2 border-t-0 border-black p-4 space-y-3" style={{ backgroundColor: '#FFFDE7' }}>

                  {/* Open UPI — ALWAYS VISIBLE */}
                  <a
                    href={upiLink}
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 font-black text-sm uppercase tracking-widest border-3 border-black text-white transition-all hover:opacity-90 active:translate-y-0.5"
                    style={{
                      border: '3px solid #000',
                      backgroundColor: cfg.headerBg,
                      boxShadow: '4px 4px 0 #000',
                    }}
                  >
                    📱 Open UPI App — Pay ₹{cfg.price}
                  </a>

                  {/* Divider */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-t-2 border-dashed border-black/20" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
                      or scan / copy
                    </span>
                    <div className="flex-1 border-t-2 border-dashed border-black/20" />
                  </div>

                  {/* QR — hidden until revealed */}
                  <div className="border-2 border-black overflow-hidden bg-white">
                    <button
                      onClick={() => setShowQr(v => !v)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                        <QrCode className="w-4 h-4" />
                        Show QR Code
                      </span>
                      {showQr
                        ? <ChevronUp   className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {showQr && (
                      <div className="border-t-2 border-black p-4 flex flex-col items-center gap-2 bg-white">
                        <img
                          src={qrUrl}
                          alt="UPI QR Code"
                          className="w-48 h-48 border-2 border-black"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <p className="text-[11px] font-semibold text-gray-400">
                          Scan with GPay, PhonePe, Paytm…
                        </p>
                      </div>
                    )}
                  </div>

                  {/* UPI ID — hidden until revealed */}
                  <div className="border-2 border-black overflow-hidden bg-white">
                    <button
                      onClick={() => setShowUpiId(v => !v)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                        <Eye className="w-4 h-4" />
                        Show UPI ID
                      </span>
                      {showUpiId
                        ? <ChevronUp   className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    {showUpiId && (
                      <div className="border-t-2 border-black p-3 flex items-center gap-2 bg-white">
                        <input
                          readOnly
                          value={UPI_ID}
                          className="flex-1 border-2 border-black px-3 py-2 font-mono font-bold text-sm bg-gray-50 focus:outline-none min-w-0"
                        />
                        <button
                          onClick={copyUpiId}
                          className="flex items-center gap-1.5 px-3 py-2 border-2 border-black font-black text-xs uppercase tracking-wider whitespace-nowrap transition-all hover:opacity-80"
                          style={{
                            backgroundColor: copiedUpi ? '#16a34a' : '#000',
                            color: '#fff',
                            boxShadow: '2px 2px 0 #374151',
                          }}
                        >
                          {copiedUpi
                            ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</>
                            : <><Copy       className="w-3.5 h-3.5" /> Copy</>}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Amount row */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border border-black/20 px-2 py-0.5">Amount</span>
                    <span className="font-space font-extrabold text-lg" style={{ color: cfg.headerBg }}>
                      ₹{cfg.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── STEP 2 ─────────────────────────────────────────────────── */}
              <div>
                <div
                  className="flex items-center gap-2.5 px-4 py-2.5 border-2 border-black"
                  style={{ backgroundColor: '#111', color: '#fff' }}
                >
                  <StepBadge n="02" />
                  <span className="font-black text-xs uppercase tracking-widest">Enter UTR / Reference No.</span>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="border-2 border-t-0 border-black p-4 space-y-3"
                >
                  <p className="text-xs font-semibold text-gray-500 leading-relaxed">
                    After paying, find the <strong>12-digit UTR</strong> in your UPI app under{' '}
                    <em>Transaction History</em> and enter it below.
                  </p>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={utrNumber}
                        onChange={(e) => {
                          setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12));
                          setError('');
                        }}
                        placeholder="e.g. 423156789012"
                        maxLength={12}
                        className="w-full border-3 border-black px-4 py-3 font-mono font-bold text-sm focus:outline-none placeholder-gray-300 pr-16"
                        style={{ border: '3px solid black' }}
                      />
                      <span
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black tabular-nums
                          ${utrNumber.length === 12 ? 'text-green-600' : 'text-gray-300'}`}
                      >
                        {utrNumber.length}/12
                      </span>
                    </div>

                    {/* ── Segmented progress bar — 12 blocks, fills as digits typed ── */}
                    <div className="flex gap-1">
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const filled = idx < utrNumber.length;
                        const isLast = idx === utrNumber.length - 1;
                        return (
                          <div
                            key={idx}
                            className="flex-1 h-2 border border-black transition-all duration-150"
                            style={{
                              backgroundColor: filled ? cfg.headerBg : '#e5e7eb',
                              transform: isLast ? 'scaleY(1.4)' : 'scaleY(1)',
                              transformOrigin: 'bottom',
                              opacity: filled ? 1 : 0.5,
                            }}
                          />
                        );
                      })}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                      {utrNumber.length === 12
                        ? '✓ 12 digits — ready to submit'
                        : `${12 - utrNumber.length} more digit${12 - utrNumber.length !== 1 ? 's' : ''} needed`}
                    </p>
                  </div>

                  {error && (
                    <p className="text-red-600 text-xs font-bold border-2 border-red-300 bg-red-50 px-3 py-2 flex items-center gap-1.5">
                      ⚠ {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || utrNumber.length !== 12}
                    className="w-full py-4 font-black text-sm uppercase tracking-widest border-3 border-black transition-all disabled:opacity-35 disabled:cursor-not-allowed text-white"
                    style={{
                      border: '3px solid black',
                      backgroundColor: utrNumber.length === 12 && !submitting ? cfg.headerBg : '#9ca3af',
                      boxShadow: utrNumber.length === 12 && !submitting ? '4px 4px 0 #000' : 'none',
                    }}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                      </span>
                    ) : (
                      '✓ Submit Payment'
                    )}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}