import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumCheckoutModal from '../PremiumCheckoutModal';
import { useSubscription } from '../../hooks/useSubscription';
import { SEO } from '../SEO';
import { ArrowLeft, Check, X, Zap, Crown, Gift, Shield, Clock, CreditCard } from 'lucide-react';

const FEATURES = [
  { label: 'Resume Analysis',       free: '4 lifetime',      starter: '14 / month',   pro: 'Unlimited'   },
  { label: 'ATS Score',             free: 'Score only',      starter: 'Full Details', pro: 'Full Details' },
  { label: 'JD Match',              free: false,             starter: '5 / month',    pro: 'Unlimited'   },
  { label: 'Cover Letter',          free: false,             starter: '5 / month',    pro: 'Unlimited'   },
  { label: 'Cold Email / Outreach', free: false,             starter: '3 / month',    pro: 'Unlimited'   },
  { label: 'Resume Rewrite',        free: false,             starter: '3 / month',    pro: 'Unlimited'   },
  { label: 'Interview Questions',   free: false,             starter: true,           pro: 'Unlimited'   },
  { label: 'AI Chat Bot',           free: false,             starter: '5 total',      pro: 'Unlimited'   },
  { label: '🔥 Roast My Resume',    free: false,             starter: false,          pro: true          },
  { label: 'PDF Export',            free: false,             starter: true,           pro: true          },
];

function Cell({ val }) {
  if (val === false)    return <span className="text-gray-300 text-lg font-black">—</span>;
  if (val === true)     return <span className="text-green-500 font-black text-base">✓</span>;
  return <span className="font-bold text-xs text-gray-700 text-center leading-tight">{val}</span>;
}

function PlanCard({ id, name, price, duration, accent, bg, emoji, tag, tagColor, perks, locked, isCurrent, isPending, onSelect }) {
  const isFree = id === 'free';
  return (
    <div
      className="relative border-4 border-black flex flex-col overflow-hidden transition-transform hover:-translate-y-1"
      style={{ backgroundColor: bg, boxShadow: '8px 8px 0 #000' }}
    >
      {/* Popular tag */}
      {tag && (
        <div
          className="absolute top-0 right-0 text-[10px] font-black uppercase px-3 py-1 border-b-2 border-l-2 border-black tracking-widest"
          style={{ backgroundColor: tagColor, color: '#000' }}
        >
          {tag}
        </div>
      )}

      {/* Header */}
      <div className="border-b-4 border-black px-6 py-5" style={{ backgroundColor: accent }}>
        <div className="flex items-center gap-2 mb-2 pr-16">
          <span className="text-2xl">{emoji}</span>
          <h3 className="text-xl font-black uppercase tracking-tight">{name}</h3>
          {isCurrent && <span className="ml-auto text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase">Active</span>}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black">{isFree ? 'Free' : `₹${price}`}</span>
          {!isFree && <span className="text-sm font-bold opacity-60">/ {duration}</span>}
        </div>
        {isFree && <p className="text-xs font-bold mt-1 opacity-60">Forever · No card needed</p>}
      </div>

      {/* Perks */}
      <div className="flex-1 px-5 py-4 space-y-2.5">
        {perks.map((p) => (
          <div key={p.label} className={`flex items-start gap-2 text-sm ${!p.val ? 'opacity-30' : ''}`}>
            <span className={`flex-shrink-0 mt-0.5 font-black ${p.val ? 'text-green-600' : 'text-gray-400'}`}>
              {p.val ? '✓' : '—'}
            </span>
            <span className="font-semibold text-gray-800 leading-tight">
              {p.label}
              {p.val && p.val !== true && (
                <span className="ml-1 text-[11px] font-black text-gray-500">({p.val})</span>
              )}
            </span>
          </div>
        ))}
        {locked.map((l) => (
          <div key={l} className="flex items-start gap-2 text-sm opacity-25">
            <span className="flex-shrink-0 mt-0.5 text-gray-400">—</span>
            <span className="font-semibold text-gray-500">{l}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-2">
        {isFree ? (
          <div className="w-full py-2.5 text-center border-2 border-black bg-white text-xs font-black uppercase text-gray-500 tracking-wide">
            {isCurrent ? '✓ Your Current Plan' : 'Always Free'}
          </div>
        ) : isCurrent ? (
          <div className="w-full py-2.5 text-center border-2 border-black text-xs font-black uppercase tracking-wide" style={{ backgroundColor: accent }}>
            ✓ Active Plan
          </div>
        ) : isPending ? (
          <div className="w-full py-2.5 text-center border-2 border-yellow-500 bg-yellow-50 text-xs font-black uppercase text-yellow-700">
            ⏳ Pending Verification
          </div>
        ) : (
          <button
            onClick={() => onSelect(id, price)}
            className="w-full py-3 border-2 border-black font-black text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: '#000', color: '#fff', boxShadow: '4px 4px 0 #555' }}
          >
            {emoji} Get {name} — ₹{price}
          </button>
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [checkout, setCheckout]   = useState({ open: false, plan: null, price: null });
  const [openFaq, setOpenFaq]     = useState(null);
  const { plan: currentPlan, hasPendingPayment, pendingPlan, remainingDays } = useSubscription();

  const plans = [
    {
      id: 'free', name: 'Free', price: 0, duration: '—', accent: '#E5E7EB', bg: '#F9FAFB', emoji: '🆓', tag: null,
      perks: [
        { label: 'Resume Analysis', val: '4 lifetime' },
        { label: 'ATS Score (score only)', val: true },
      ],
      locked: ['JD Match', 'Cover Letter', 'Cold Email', 'Resume Rewrite', 'Interview Qs', 'AI Chat', 'Roast My Resume'],
    },
    {
      id: 'starter', name: 'Starter', price: 199, duration: '30 days', accent: '#86EFAC', bg: '#F0FFF4', emoji: '⚡',
      tag: 'POPULAR', tagColor: '#86EFAC',
      perks: [
        { label: 'Resume Analysis', val: '14 / month' },
        { label: 'ATS Score (full)', val: true },
        { label: 'JD Match', val: '5 / month' },
        { label: 'Cover Letter', val: '5 / month' },
        { label: 'Cold Email / Outreach', val: '3 / month' },
        { label: 'Resume Rewrite', val: '3 / month' },
        { label: 'Interview Questions', val: true },
        { label: 'AI Chat Bot', val: '5 total' },
        { label: 'PDF Export', val: true },
      ],
      locked: ['🔥 Roast My Resume'],
    },
    {
      id: 'pro', name: 'Pro', price: 499, duration: '60 days', accent: '#C084FC', bg: '#FAF0FF', emoji: '👑',
      tag: 'BEST VALUE', tagColor: '#C084FC',
      perks: [
        { label: 'Everything Unlimited', val: true },
        { label: 'Resume Analysis', val: 'Unlimited' },
        { label: 'JD Match', val: 'Unlimited' },
        { label: 'Cover Letter', val: 'Unlimited' },
        { label: 'Cold Email / Outreach', val: 'Unlimited' },
        { label: 'Resume Rewrite', val: 'Unlimited' },
        { label: 'AI Chat Bot', val: 'Unlimited' },
        { label: '🔥 Roast My Resume', val: 'Unlimited — Exclusive' },
        { label: 'PDF Export', val: true },
      ],
      locked: [],
    },
  ];

  const faqs = [
    { q: 'How does payment work?', a: 'Pay via any UPI app (GPay, PhonePe, Paytm) using our QR code or UPI ID. Then enter the 12-digit UTR reference number from your payment app. We verify and activate within 2 hours.' },
    { q: 'What is a UTR number?', a: 'A UTR (Unique Transaction Reference) is a 12-digit code generated for every UPI payment. Find it in your UPI app under "Transaction History" → tap the payment → copy the UTR/Reference number.' },
    { q: 'Can I use the free plan forever?', a: 'Yes! The free plan has no expiry. You get 4 lifetime resume analyses and ATS scores (score only, suggestions are locked). Other features require a paid plan.' },
    { q: 'What if my payment is not verified?', a: 'Verification is usually within 2 hours. If it takes longer, email us at support@resumelens.me with your UTR number and we will manually activate within 24 hours.' },
    { q: 'Can I upgrade Starter → Pro?', a: 'Absolutely. Pay for Pro and submit the new UTR. Your plan upgrades to Pro for 60 days from that activation date.' },
  ];

  return (
    <>
      <SEO
        title="Pricing"
        description="Choose the best ResumeLens plan for your job search. Free and premium plans available with AI resume analysis, ATS scoring, JD matching, and more."
        keywords="resume pricing, ATS plan, premium resume, job seeker subscription, resume ai plans"
      />
      <div className="min-h-screen" style={{ backgroundColor: '#FFFDE7' }}>

      {/* ── Top bar with back button ── */}
      <div
        className="sticky top-0 z-30 border-b-4 border-black px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: '#FEF08A' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 font-black text-sm uppercase hover:bg-black hover:text-white transition-all"
          style={{ boxShadow: '3px 3px 0 #000' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest opacity-60">ResumeLens</span>
          <span className="text-xs font-black opacity-40">/</span>
          <span className="text-xs font-black uppercase tracking-widest">Pricing</span>
        </div>

        {/* Plan status pill */}
        {currentPlan !== 'free' && (
          <div
            className="border-2 border-black px-3 py-1.5 text-xs font-black uppercase"
            style={{ backgroundColor: currentPlan === 'pro' ? '#C084FC' : '#86EFAC', boxShadow: '2px 2px 0 #000' }}
          >
            {currentPlan === 'pro' ? '👑' : '⚡'} {currentPlan} · {remainingDays}d left
          </div>
        )}
        {currentPlan === 'free' && <div className="w-24" />}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* ── Hero ── */}
        <div className="text-center space-y-4">
          <div
            className="inline-block border-4 border-black px-5 py-1.5"
            style={{ backgroundColor: '#FDE68A', boxShadow: '4px 4px 0 #000' }}
          >
            <span className="text-xs font-black uppercase tracking-[0.2em]">💎 Simple One-Time Pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
            Pick Your<br />
            <span
              className="inline-block border-4 border-black px-3 mt-1"
              style={{ backgroundColor: '#C084FC' }}
            >Plan</span>
          </h1>
          <p className="text-base font-semibold text-gray-600 max-w-lg mx-auto">
            No subscriptions. Pay once, use for the full duration.<br />
            <span className="font-black text-black">Manual UPI verification within 2 hours.</span>
          </p>

          {hasPendingPayment && (
            <div className="inline-flex items-center gap-2 border-2 border-yellow-500 bg-yellow-50 px-4 py-2.5 mx-auto">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-bold text-yellow-700">
                Payment pending for <strong className="capitalize">{pendingPlan}</strong> plan — verifying shortly
              </span>
            </div>
          )}
        </div>

        {/* ── Value props strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Shield className="w-5 h-5" />, text: 'Secure UPI', sub: 'GPay / PhonePe' },
            { icon: <Clock className="w-5 h-5" />,  text: '2hr Activation', sub: 'After UTR submit' },
            { icon: <CreditCard className="w-5 h-5" />, text: 'One-Time Pay', sub: 'No recurring fee' },
            { icon: <Gift className="w-5 h-5" />,   text: 'Free Plan', sub: 'Always available' },
          ].map(({ icon, text, sub }) => (
            <div
              key={text}
              className="border-2 border-black bg-white p-3 flex items-center gap-3"
              style={{ boxShadow: '3px 3px 0 #000' }}
            >
              <div className="w-8 h-8 border-2 border-black bg-yellow-200 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="font-black text-xs uppercase">{text}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              {...p}
              isCurrent={currentPlan === p.id}
              isPending={hasPendingPayment && pendingPlan === p.id}
              onSelect={(id, price) => setCheckout({ open: true, plan: id, price })}
            />
          ))}
        </div>

        {/* ── Comparison table ── */}
        <div>
          <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">
            Full Feature Comparison
          </h2>
          <div className="border-4 border-black overflow-hidden" style={{ boxShadow: '6px 6px 0 #000' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-4 border-black" style={{ backgroundColor: '#FEF08A' }}>
                  <th className="px-4 py-3 text-left font-black uppercase text-xs tracking-wide w-2/5">Feature</th>
                  <th className="px-3 py-3 text-center font-black uppercase text-xs tracking-wide">Free 🆓</th>
                  <th className="px-3 py-3 text-center font-black uppercase text-xs tracking-wide border-l-2 border-black" style={{ backgroundColor: '#86EFAC' }}>Starter ⚡</th>
                  <th className="px-3 py-3 text-center font-black uppercase text-xs tracking-wide border-l-2 border-black" style={{ backgroundColor: '#C084FC' }}>Pro 👑</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row, i) => (
                  <tr key={row.label} className="border-b-2 border-black" style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td className="px-4 py-2.5 font-semibold text-xs">{row.label}</td>
                    <td className="px-3 py-2.5 text-center"><Cell val={row.free} /></td>
                    <td className="px-3 py-2.5 text-center border-l-2 border-black"><Cell val={row.starter} /></td>
                    <td className="px-3 py-2.5 text-center border-l-2 border-black"><Cell val={row.pro} /></td>
                  </tr>
                ))}
                <tr className="border-t-4 border-black font-black" style={{ backgroundColor: '#FEF08A' }}>
                  <td className="px-4 py-3 font-black uppercase text-xs">Price</td>
                  <td className="px-3 py-3 text-center font-black text-sm">₹0</td>
                  <td className="px-3 py-3 text-center font-black text-sm border-l-2 border-black">₹199 / 30d</td>
                  <td className="px-3 py-3 text-center font-black text-sm border-l-2 border-black">₹499 / 60d</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── How payment works ── */}
        <div>
          <h2 className="text-2xl font-black uppercase mb-5 border-b-4 border-black pb-2">
            How Payment Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Choose a Plan', desc: 'Click "Get Starter" or "Get Pro" above to open the payment screen.', color: '#FDE68A' },
              { step: '02', title: 'Pay via UPI', desc: 'Scan the QR code or use our UPI ID in GPay, PhonePe, or Paytm. Send the exact amount.', color: '#86EFAC' },
              { step: '03', title: 'Enter UTR & Done', desc: 'Find the 12-digit UTR in your UPI app, enter it in the form. We activate your plan within 2 hours.', color: '#C084FC' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="border-3 border-black p-5" style={{ border: '3px solid black', backgroundColor: color, boxShadow: '5px 5px 0 #000' }}>
                <div className="text-4xl font-black opacity-30 mb-2">{step}</div>
                <h3 className="font-black text-base uppercase mb-1">{title}</h3>
                <p className="text-sm font-semibold text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ accordion ── */}
        <div>
          <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">FAQ</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-2 border-black overflow-hidden" style={{ boxShadow: '3px 3px 0 #000' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-neo-offwhite transition-colors text-left"
                >
                  <span className="font-black text-sm">{faq.q}</span>
                  <span className="font-black text-lg ml-4">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="border-t-2 border-black px-4 py-3 bg-yellow-50">
                    <p className="text-sm font-semibold text-gray-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Checkout modal */}
      {checkout.open && (
        <PremiumCheckoutModal
          isOpen
          onClose={() => setCheckout({ open: false, plan: null, price: null })}
          plan={checkout.plan}
          price={checkout.price}
        />
      )}
      </div>
    </>
  );
}