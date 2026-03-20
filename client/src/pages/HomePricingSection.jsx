/**
 * HomePricingSection.jsx
 * 
 * Replace the ENTIRE existing "Paid Plans Section" in HomePage1.jsx with:
 *   <HomePricingSection onUpgrade={openUpgrade} />
 * 
 * Props:
 *   onUpgrade(planId) — callback to open the UpgradeModal / PremiumCheckoutModal
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Lock, Zap, Crown, ArrowRight } from 'lucide-react';

const FREE_PERKS  = ['4 Resume Analyses (lifetime)', 'ATS Score — score only'];
const FREE_LOCKED = ['JD Match', 'Cover Letter', 'Cold Email', 'Resume Rewrite', 'AI Chat', 'Roast My Resume'];

const STARTER_PERKS = ['14 Resume Analyses / month', 'Full ATS Score + Suggestions', 'JD Match (5/month)', 'Cover Letter (5/month)', 'Cold Email (3/month)', 'Resume Rewrite (3/month)', 'Unlimited Interview Questions', 'AI Chat (5 total)', 'PDF Export'];
const PRO_PERKS     = ['Everything Unlimited', 'Full ATS Score + Suggestions', 'Unlimited JD Match', 'Unlimited Cover Letter', 'Unlimited Cold Email', 'Unlimited Resume Rewrite', '🔥 Roast My Resume (Exclusive)', 'Unlimited AI Chat', 'Priority Support'];

function FreeCard() {
  return (
    <div className="border-3 border-black/30 bg-white/10 backdrop-blur-sm p-6 flex flex-col" style={{ border: '3px solid rgba(255,255,255,0.2)' }}>
      <div className="mb-4">
        <span className="text-3xl">🆓</span>
        <h3 className="font-black text-xl uppercase text-white mt-1">Free Forever</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-3xl font-black text-white">₹0</span>
          <span className="text-gray-400 text-sm font-bold">/ forever</span>
        </div>
        <p className="text-xs text-gray-400 font-semibold mt-1">No credit card needed</p>
      </div>
      <div className="flex-1 space-y-2 mb-6">
        {FREE_PERKS.map((p) => (
          <div key={p} className="flex items-center gap-2 text-sm">
            <span className="text-green-400 font-black">✓</span>
            <span className="text-gray-300 font-semibold">{p}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-2 mt-2 space-y-1.5">
          {FREE_LOCKED.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm opacity-40">
              <Lock className="w-3 h-3 text-gray-500" />
              <span className="text-gray-500 font-semibold">{p}</span>
            </div>
          ))}
        </div>
      </div>
      <Link
        to="/dashboard"
        className="block w-full text-center py-2.5 border-2 border-white/30 text-white font-black text-xs uppercase tracking-widest hover:border-white/60 transition-colors"
      >
        Start Free →
      </Link>
    </div>
  );
}

function PaidCard({ id, name, price, duration, accentClass, glowColor, emoji, tag, perks, onUpgrade }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative border-4 border-black flex flex-col transition-transform ${hovered ? '-translate-y-2' : ''}`}
      style={{
        backgroundColor: '#fff',
        boxShadow: hovered ? `10px 10px 0 ${glowColor}` : '8px 8px 0 #000',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tag && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span
            className="text-[10px] font-black uppercase px-3 py-1 border-2 border-black tracking-widest"
            style={{ backgroundColor: glowColor }}
          >
            {tag}
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`border-b-4 border-black px-6 py-5 ${accentClass}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{emoji}</span>
          <h3 className="text-xl font-black uppercase text-black tracking-tight">{name}</h3>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black text-black">₹{price}</span>
          <span className="text-sm font-bold text-black/60">/ {duration}</span>
        </div>
        <div
          className="mt-2 inline-block text-[10px] font-black uppercase px-2 py-0.5 border border-black/20 tracking-wide"
          style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
        >
          One-time · No renewal
        </div>
      </div>

      {/* Perks */}
      <div className="flex-1 px-5 py-4 space-y-2.5">
        {perks.map((p) => (
          <div key={p} className="flex items-start gap-2 text-sm">
            <span className="text-green-600 font-black flex-shrink-0 mt-0.5">✓</span>
            <span className="font-semibold text-gray-800">{p}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onUpgrade(id)}
          className="w-full py-3 border-2 border-black font-black text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: '#000', color: '#fff', boxShadow: `4px 4px 0 ${glowColor}` }}
        >
          {emoji} Get {name} — ₹{price}
        </button>
        <p className="text-center text-[10px] text-gray-500 font-semibold mt-2">
          UPI payment · Activates within 2 hours
        </p>
      </div>
    </div>
  );
}

export default function HomePricingSection({ onUpgrade }) {
  return (
    <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }} className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border-2 border-yellow-400 bg-yellow-400/10 px-4 py-1.5 mb-5">
            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest">💎 Pricing Plans</span>
          </div>
          <h2 className="font-space text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            CHOOSE YOUR <span className="text-yellow-400">PLAN</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-semibold">
            Start free. Upgrade when you're ready.<br />
            <span className="text-yellow-300 font-black">One payment. No subscriptions.</span>
          </p>
        </div>

        {/* What you MISS on free — urgency strip */}
        <div className="mb-10 border-2 border-yellow-400/40 bg-yellow-400/5 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm font-bold text-yellow-100">
              <span className="text-yellow-400 font-black">Free users miss out on:</span>{' '}
              JD Match · Cover Letter · AI Chat · Resume Rewrite · Roast My Resume · Cold Email
            </p>
          </div>
          <button
            onClick={() => onUpgrade('starter')}
            className="flex items-center gap-1.5 bg-yellow-400 text-black border-2 border-black px-4 py-2 font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors whitespace-nowrap"
            style={{ boxShadow: '3px 3px 0 #000' }}
          >
            Unlock All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cards — Free (compact) + Starter + Pro */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

          {/* Free — compact dark card */}
          <FreeCard />

          {/* Starter */}
          <PaidCard
            id="starter"
            name="Starter"
            price={199}
            duration="30 days"
            accentClass="bg-green-200"
            glowColor="#86EFAC"
            emoji="⚡"
            tag="⚡ POPULAR"
            perks={STARTER_PERKS}
            onUpgrade={onUpgrade}
          />

          {/* Pro */}
          <PaidCard
            id="pro"
            name="Pro"
            price={499}
            duration="60 days"
            accentClass="bg-purple-200"
            glowColor="#C084FC"
            emoji="👑"
            tag="👑 BEST VALUE"
            perks={PRO_PERKS}
            onUpgrade={onUpgrade}
          />
        </div>

        {/* Bottom strip — comparison link + trust */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-400 font-semibold">
            {['🔒 Secure UPI Payment', '⏱ 2hr Activation', '🔁 No Auto-Renewal', '📧 24/7 Support'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <Link
            to="/pricing"
            className="text-yellow-400 font-black text-sm uppercase tracking-wide border-b-2 border-yellow-400/40 hover:border-yellow-400 transition-colors flex items-center gap-1"
          >
            Full comparison table <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center max-w-lg mx-auto">
          {[
            { num: '10K+', label: 'Resumes Analyzed' },
            { num: '95%', label: 'Improvement Rate' },
            { num: '< 2hr', label: 'Plan Activation' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div className="text-2xl font-black text-yellow-400">{num}</div>
              <div className="text-xs text-gray-500 font-semibold">{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}