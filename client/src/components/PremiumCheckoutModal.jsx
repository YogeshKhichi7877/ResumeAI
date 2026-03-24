import { useState, useEffect } from 'react';
import { usePayment } from '../hooks/usePayment';

const UPI_ID = import.meta.env.VITE_UPI_ID || '7877080701@ptaxis';

/**
 * PremiumCheckoutModal
 * Props: isOpen, onClose, plan ('starter'|'pro'), price (number)
 */
export default function PremiumCheckoutModal({ isOpen, onClose, plan, price }) {
  const [utr, setUtr]           = useState('');
  const [utrError, setUtrError] = useState('');
  const [copied, setCopied]     = useState(false);
  const { submitUtrPayment, loading, success, error, reset } = usePayment();

  useEffect(() => {
    if (isOpen) { setUtr(''); setUtrError(''); setCopied(false); reset(); }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPro      = plan === 'pro';
  const planLabel  = isPro ? 'Pro' : 'Starter';
  const accentColor = isPro ? '#C084FC' : '#86EFAC';
  const bgColor    = isPro ? '#FAF0FF' : '#F0FFF4';
  const upiLink    = `upi://pay?pa=${UPI_ID}&pn=ResumeAI&am=${price}&cu=INR&tn=ResumeAI_${planLabel}`;

  const handleUtrChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 12);
    setUtr(val);
    setUtrError(val.length > 0 && val.length < 12 ? 'UTR must be exactly 12 digits' : '');
  };

  const handleSubmit = async () => {
    if (utr.length !== 12) { setUtrError('UTR must be exactly 12 digits'); return; }
    await submitUtrPayment(plan, utr);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg border-4 border-black overflow-y-auto"
        style={{ backgroundColor: bgColor, boxShadow: '10px 10px 0px 0px #000', maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black" style={{ backgroundColor: accentColor }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{isPro ? '👑' : '⚡'}</span>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight leading-none">Upgrade to {planLabel}</h2>
              <p className="text-sm font-bold opacity-70">₹{price} / {isPro ? '60 days' : '30 days'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 border-2 border-black bg-white font-black text-lg flex items-center justify-center hover:bg-black hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-5">
          {success ? (
            /* SUCCESS */
            <div className="border-4 border-black p-6 text-center space-y-3" style={{ backgroundColor: '#D1FAE5', boxShadow: '6px 6px 0 black' }}>
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-black uppercase">Payment Submitted!</h3>
              <p className="font-semibold text-sm leading-relaxed">
                Your UTR has been received. We will verify and activate your <strong>{planLabel} plan</strong> within <span className="underline decoration-2">2 hours</span>.
              </p>
              <p className="text-xs font-mono bg-white border-2 border-black px-3 py-1 inline-block">UTR: <strong>{utr}</strong></p>
              <p className="text-xs text-gray-500">Questions? <a href="mailto:support@resumelens.me" className="underline font-bold">support@resumelens.me</a></p>
              <button onClick={onClose} className="mt-2 w-full py-3 bg-black text-white font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-colors" style={{ border: '3px solid black' }}>
                Got It — Close
              </button>
            </div>
          ) : (
            <>
              {/* STEP 1: Pay */}
              <div className="border-4 border-black p-4 space-y-3" style={{ backgroundColor: '#FFFDE7', boxShadow: '5px 5px 0 black' }}>
                <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                  <span className="font-black bg-black text-white px-2 py-0.5 text-lg">01</span>
                  <span className="font-black uppercase text-sm tracking-wider">Pay via UPI</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="border-4 border-black p-1 bg-white" style={{ boxShadow: '4px 4px 0 black' }}>
                    <img
                      src="/paytm-qr.jpg"
                      alt="UPI QR Code"
                      className="w-44 h-44 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`;
                      }}
                    />
                  </div>
                  <p className="text-xs font-bold text-gray-600 text-center">Scan with GPay, PhonePe, Paytm…</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 border-2 border-black bg-white px-3 py-2 font-mono text-sm font-bold truncate">{UPI_ID}</div>
                  <button onClick={copyUpiId} className="border-2 border-black bg-yellow-300 px-3 py-2 font-black text-xs uppercase hover:bg-yellow-400 transition whitespace-nowrap">
                    {copied ? '✓ Copied' : 'Copy ID'}
                  </button>
                </div>
                <a href={upiLink} className="block w-full text-center py-3 font-black uppercase text-sm tracking-widest transition-all hover:-translate-y-0.5" style={{ border: '3px solid black', backgroundColor: accentColor, boxShadow: '4px 4px 0 black' }}>
                  📱 Open UPI App — Pay ₹{price}
                </a>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="bg-black text-white px-2 py-0.5">AMOUNT</span>
                  <span className="font-black text-base">₹{price}</span>
                </div>
              </div>

              {/* STEP 2: UTR */}
              <div className="border-4 border-black p-4 space-y-3" style={{ backgroundColor: '#EDE9FE', boxShadow: '5px 5px 0 black' }}>
                <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                  <span className="font-black bg-black text-white px-2 py-0.5 text-lg">02</span>
                  <span className="font-black uppercase text-sm tracking-wider">Enter UTR / Reference No.</span>
                </div>
                <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                  After paying, find the <strong>12-digit UTR</strong> in your UPI app under transaction history and enter it below.
                </p>
                <div className="space-y-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    value={utr}
                    onChange={handleUtrChange}
                    placeholder="e.g. 423156789012"
                    className="w-full bg-white px-4 py-3 font-mono text-base font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black tracking-widest"
                    style={{ border: '3px solid black' }}
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center">
                    {utrError ? <span className="text-xs text-red-600 font-bold">⚠ {utrError}</span> : <span />}
                    <span className={`text-xs font-black ml-auto ${utr.length === 12 ? 'text-green-600' : 'text-gray-400'}`}>{utr.length}/12</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-white border-2 border-black">
                  <div className="h-full transition-all duration-300" style={{ width: `${(utr.length / 12) * 100}%`, backgroundColor: utr.length === 12 ? '#16a34a' : '#a855f7' }} />
                </div>
                {error && (
                  <div className="border-2 border-red-600 bg-red-50 px-3 py-2 text-xs text-red-700 font-bold">⚠ {error}</div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={loading || utr.length !== 12}
                  className="w-full py-3 font-black uppercase text-sm tracking-widest transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                  style={{ border: '3px solid black', backgroundColor: utr.length === 12 ? '#000' : '#9CA3AF', color: '#fff', boxShadow: utr.length === 12 ? '4px 4px 0 #374151' : 'none' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Submitting…
                    </span>
                  ) : '✓ Submit for Verification'}
                </button>
                <p className="text-center text-xs text-gray-500 font-semibold">🕐 Verified within 2 hours · Safe & Secure</p>
              </div>

              {/* Plan strip */}
              <div className="border-2 border-black p-3 flex items-center justify-between text-xs font-bold" style={{ backgroundColor: accentColor }}>
                <span className="uppercase tracking-wide">{isPro ? '👑 Pro Plan — 60 Days' : '⚡ Starter Plan — 30 Days'}</span>
                <span className="bg-black text-white px-2 py-0.5 text-sm font-black">₹{price}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}