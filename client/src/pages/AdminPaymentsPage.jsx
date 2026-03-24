import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

const shadow  = (n = 6) => `${n}px ${n}px 0 #000`;
const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

function StatusPill({ status }) {
  const map = {
    approved: { bg: '#bbf7d0', text: '#14532d', label: '✓ APPROVED' },
    rejected: { bg: '#fecaca', text: '#7f1d1d', label: '✗ REJECTED' },
    pending:  { bg: '#fef08a', text: '#713f12', label: '⏳ PENDING'  },
  };
  const s = map[status] || map.pending;
  return (
    <span className="px-2.5 py-0.5 text-[11px] font-black border-2 border-black tracking-widest" style={{ backgroundColor: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

function PlanPill({ plan }) {
  const isPro = plan === 'pro';
  return (
    <span className="px-2.5 py-0.5 text-[11px] font-black border-2 border-black tracking-widest" style={{ backgroundColor: isPro ? '#e9d5ff' : '#bbf7d0', color: isPro ? '#4c1d95' : '#14532d' }}>
      {isPro ? '👑 PRO' : '⚡ STARTER'}
    </span>
  );
}

function StatCard({ label, value, bg = '#fff', accent }) {
  return (
    <div className="border-4 border-black p-4 flex flex-col gap-1" style={{ backgroundColor: bg, boxShadow: shadow(4) }}>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
      <span className="font-black text-3xl leading-none" style={{ color: accent }}>{value}</span>
    </div>
  );
}

export default function AdminPaymentsPage() {
  const navigate = useNavigate();

  const [secret,       setSecret]       = useState('');
  const [showSecret,   setShowSecret]   = useState(false);
  const [authed,       setAuthed]       = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [message,      setMessage]      = useState('');
  const [filter,       setFilter]       = useState('pending');
  const [loginErr,     setLoginErr]     = useState('');
  const [attempts,     setAttempts]     = useState(0);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(t);
  }, [message]);

  const fetchTransactions = async (s = secret) => {
    setLoading(true);
    try {
      let allTransactions = [];
      if (typeof paymentAPI.listAll === 'function') {
        const res = await paymentAPI.listAll(s);
        allTransactions = res.data.transactions || res.data || [];
      } else {
        const results = await Promise.allSettled([
          paymentAPI.listPending(s),
          typeof paymentAPI.listApproved === 'function' ? paymentAPI.listApproved(s) : Promise.reject('no endpoint'),
          typeof paymentAPI.listRejected === 'function' ? paymentAPI.listRejected(s) : Promise.reject('no endpoint'),
        ]);
        results.forEach(r => {
          if (r.status === 'fulfilled') {
            const txs = r.value?.data?.transactions || r.value?.data || [];
            allTransactions.push(...txs);
          }
        });
        const seen = new Set();
        allTransactions = allTransactions.filter(tx => {
          if (seen.has(tx._id)) return false;
          seen.add(tx._id);
          return true;
        });
      }
      allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(allTransactions);
    } catch (e) {
      setMessage('⚠ ' + (e.response?.data?.message || 'Failed to load transactions'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!secret.trim()) { setLoginErr('Secret cannot be empty.'); return; }
    setAttempts(a => a + 1);
    setAuthed(true);
    setLoginErr('');
    fetchTransactions(secret);
  };

  const handleApprove = async (txId) => {
    if (!window.confirm('Approve this payment and activate the subscription?')) return;
    try {
      const res = await paymentAPI.approvePayment(txId, secret);
      setMessage('✅ ' + res.data.message);
      fetchTransactions();
    } catch (e) {
      setMessage('⚠ ' + (e.response?.data?.message || 'Approval failed'));
    }
  };

  const handleReject = async (txId) => {
    const reason = window.prompt('Rejection reason (shown to user):') || 'Invalid UTR';
    try {
      const res = await paymentAPI.rejectPayment(txId, reason, secret);
      setMessage('✅ ' + res.data.message);
      fetchTransactions();
    } catch (e) {
      setMessage('⚠ ' + (e.response?.data?.message || 'Rejection failed'));
    }
  };

  const total    = transactions.length;
  const pending  = transactions.filter(t => t.status === 'pending').length;
  const approved = transactions.filter(t => t.status === 'approved').length;
  const rejected = transactions.filter(t => t.status === 'rejected').length;
  const filtered = transactions.filter(t => filter === 'all' ? true : t.status === filter);

  // ════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ════════════════════════════════════════════════════════════
  if (!authed) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ backgroundColor: '#0f0f0f', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,#1a1a1a 39px,#1a1a1a 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#1a1a1a 39px,#1a1a1a 40px)' }}
      >
        {/* ── BACK BUTTON ── */}
        <div className="w-full max-w-xl mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors group"
          >
            <span className="text-base group-hover:-translate-x-0.5 transition-transform">←</span>
            Back to Home
          </button>
        </div>

        {/* ── DANGER BANNER ── */}
        <div
          className="w-full max-w-xl mb-6 border-4 border-red-500 p-4 flex items-start gap-3"
          style={{ backgroundColor: '#1a0000', boxShadow: '6px 6px 0 #dc2626' }}
        >
          <span className="text-2xl flex-shrink-0">🚨</span>
          <div>
            <p className="font-black text-red-400 uppercase tracking-widest text-sm mb-1">Restricted Area</p>
            <p className="text-red-300 text-xs font-semibold leading-relaxed">
              This panel grants full control over user subscriptions and payments.
              Unauthorized access or misuse will result in immediate account termination.
            </p>
          </div>
        </div>

        {/* ── MAIN LOGIN CARD ── */}
        <div
          className="w-full max-w-xl border-4 border-yellow-400 overflow-hidden"
          style={{ backgroundColor: '#1c1c1c', boxShadow: '8px 8px 0 #ca8a04' }}
        >
          {/* card header */}
          <div
            className="px-6 py-4 border-b-4 border-yellow-400 flex items-center gap-3"
            style={{ backgroundColor: '#ca8a04' }}
          >
            <span className="text-2xl">🔐</span>
            <div>
              <h1 className="font-black text-black uppercase tracking-widest text-lg leading-none">Admin Verification</h1>
              <p className="text-black/70 text-xs font-bold mt-0.5 uppercase tracking-wide">Payment Management Console</p>
            </div>
          </div>

          <div className="p-8 space-y-5">

            {/* WARNING 1 */}
            <div className="border-2 border-orange-500 bg-orange-950/40 p-3.5 flex gap-3">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <div>
                <p className="font-black text-orange-400 text-xs uppercase tracking-widest mb-1">Do not enter on shared devices</p>
                <p className="text-orange-300/80 text-[11px] font-semibold leading-relaxed">
                  Never type the admin secret on a public computer, shared network, or while anyone else can see your screen. This secret is not saved in your browser.
                </p>
              </div>
            </div>

            {/* WARNING 2 */}
            <div className="border-2 border-yellow-600 bg-yellow-950/40 p-3.5 flex gap-3">
              <span className="text-lg flex-shrink-0">⚡</span>
              <div>
                <p className="font-black text-yellow-400 text-xs uppercase tracking-widest mb-1">Actions here are irreversible</p>
                <p className="text-yellow-300/80 text-[11px] font-semibold leading-relaxed">
                  Approving a payment immediately activates the user's subscription. Rejecting notifies them and closes the transaction. Review carefully before acting.
                </p>
              </div>
            </div>

            {/* INPUT */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Admin Secret</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => { setSecret(e.target.value); setLoginErr(''); }}
                    placeholder="Enter admin secret…"
                    className="w-full border-3 border-gray-600 bg-black text-white px-4 py-3 font-mono font-bold text-sm focus:outline-none focus:border-yellow-400 pr-16 placeholder-gray-600"
                    style={{ border: '3px solid #4b5563' }}
                    autoComplete="off"
                    spellCheck={false}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-black uppercase tracking-wide transition-colors"
                    tabIndex={-1}
                  >
                    {showSecret ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {loginErr && (
                  <p className="text-red-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {loginErr}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-yellow-400 text-black font-black uppercase tracking-widest border-3 border-black text-sm transition-all hover:bg-yellow-300 active:translate-y-0.5"
                style={{ border: '3px solid black', boxShadow: '4px 4px 0 #000' }}
              >
                Verify & Enter →
              </button>
            </form>

            {/* FOOTER NOTE */}
            <div className="border-t-2 border-gray-700 pt-4">
              <p className="text-[11px] font-semibold text-gray-500 text-center leading-relaxed">
                All access attempts are logged with IP and timestamp.
                <br />Unauthorized access is a violation of Terms of Service.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-gray-600 text-xs font-mono tracking-widest uppercase">ResumeLens · Internal Admin Console</p>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen p-5 md:p-8" style={{ backgroundColor: '#FFFDE7' }}>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* TOP BAR */}
        <div className="border-4 border-black bg-black px-6 py-4 flex flex-wrap items-center justify-between gap-4" style={{ boxShadow: shadow(6) }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="font-black text-white uppercase tracking-widest text-lg leading-none">Payment Admin Panel</h1>
              <p className="text-gray-400 text-xs font-bold tracking-wide mt-0.5">ResumeLens · Subscription Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pending > 0 && (
              <span className="px-3 py-1.5 bg-yellow-400 border-2 border-black text-black font-black text-xs uppercase tracking-widest animate-pulse">
                {pending} Pending
              </span>
            )}
            <button
              onClick={() => fetchTransactions()}
              className="border-2 border-yellow-400 bg-transparent text-yellow-400 px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => { setAuthed(false); setSecret(''); setTransactions([]); navigate('/'); }}
              className="border-2 border-red-400 bg-transparent text-red-400 px-4 py-2 font-black text-xs uppercase tracking-widest hover:bg-red-400 hover:text-white transition-all"
            >
              ✕ Logout
            </button>
          </div>
        </div>

        {/* ALERT BANNER */}
        {message && (
          <div
            className={`border-3 border-black px-5 py-3.5 flex items-center justify-between font-bold text-sm ${message.startsWith('✅') ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}`}
            style={{ boxShadow: shadow(4), border: '3px solid black' }}
          >
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-xs font-black uppercase tracking-wider underline opacity-60 hover:opacity-100">dismiss</button>
          </div>
        )}

        {/* STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total"    value={total}    bg="#fff"     accent="#111"     />
          <StatCard label="Pending"  value={pending}  bg="#fef9c3"  accent="#92400e"  />
          <StatCard label="Approved" value={approved} bg="#dcfce7"  accent="#14532d"  />
          <StatCard label="Rejected" value={rejected} bg="#fee2e2"  accent="#7f1d1d"  />
        </div>

        {/* TABLE CARD */}
        <div className="border-4 border-black overflow-hidden" style={{ boxShadow: shadow(6) }}>
          <div className="border-b-4 border-black bg-white px-4 py-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 mr-2">Filter:</span>
            {['pending', 'approved', 'rejected', 'all'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest border-2 border-black transition-all ${filter === s ? 'bg-black text-white translate-x-0.5 translate-y-0.5' : 'bg-white text-black hover:bg-gray-100'}`}
                style={{ boxShadow: filter === s ? 'none' : '3px 3px 0 #000' }}
              >
                {s}
                {s !== 'all' && (
                  <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] ${filter === s ? 'bg-white/20' : 'bg-black/10'}`}>
                    {transactions.filter(t => t.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-sm">Loading transactions…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-black uppercase tracking-widest text-sm text-gray-500">No {filter === 'all' ? '' : filter} transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b-4 border-black bg-gray-50">
                    {['#', 'User', 'Plan', 'Amount', 'UTR Number', 'Status', 'Submitted', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-black uppercase text-[11px] tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, i) => (
                    <tr key={tx._id} className="border-b-2 border-black transition-colors hover:bg-yellow-50" style={{ backgroundColor: tx.status === 'pending' ? '#fffef0' : i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td className="px-4 py-3 text-xs font-black text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-black text-sm leading-tight">{tx.userId?.name || '—'}</div>
                        <div className="font-mono text-[11px] text-gray-400 mt-0.5 break-all">{tx.userId?.email || String(tx.userId)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><PlanPill plan={tx.plan} /></td>
                      <td className="px-4 py-3 font-black text-base whitespace-nowrap">₹{tx.amount}</td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs font-black tracking-widest bg-gray-100 border border-gray-300 px-2 py-0.5">{tx.utrNumber}</code>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap"><StatusPill status={tx.status} /></td>
                      <td className="px-4 py-3 text-[11px] font-semibold text-gray-500 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {tx.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(tx._id)} className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider bg-green-400 border-2 border-black hover:bg-green-300 transition-all active:translate-y-0.5" style={{ boxShadow: '3px 3px 0 #000' }}>✓ Approve</button>
                            <button onClick={() => handleReject(tx._id)} className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider bg-red-300 border-2 border-black hover:bg-red-200 transition-all active:translate-y-0.5" style={{ boxShadow: '3px 3px 0 #000' }}>✗ Reject</button>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[11px] font-semibold text-gray-400 block">Reviewed</span>
                            <span className="text-[11px] font-black text-gray-500">{tx.reviewedAt ? fmtDate(tx.reviewedAt) : '—'}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t-2 border-black bg-gray-50 px-5 py-2.5 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Showing {filtered.length} of {total} transactions</span>
            <span className="text-[11px] font-mono text-gray-400">Last refreshed: {new Date().toLocaleTimeString('en-IN')}</span>
          </div>
        </div>

        {/* SECURITY REMINDER */}
        <div className="border-3 border-orange-400 bg-orange-50 p-4 flex items-start gap-3" style={{ border: '3px solid #fb923c', boxShadow: '4px 4px 0 #fb923c' }}>
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div className="space-y-1">
            <p className="font-black text-orange-800 text-xs uppercase tracking-widest">Security Reminder</p>
            <p className="text-orange-700 text-xs font-semibold leading-relaxed">
              You are logged into the admin panel. <strong>Click Logout when done.</strong> Do not leave this tab open unattended. Approvals and rejections are permanent and immediately affect user accounts.
            </p>
          </div>
        </div>

        {/* DEV CURL SNIPPETS */}
        <details className="border-2 border-dashed border-gray-400 bg-white overflow-hidden">
          <summary className="px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
            <span>🛠 Dev Testing — cURL Snippets</span>
            <span className="text-gray-300">▾</span>
          </summary>
          <div className="px-4 pb-4 pt-2 space-y-2 font-mono text-xs text-gray-500 border-t border-dashed border-gray-300">
            <p><span className="text-green-700 font-black">GET</span>  &nbsp;<code className="bg-gray-100 px-1.5 py-0.5">/api/payment/pending</code> + header <code className="bg-gray-100 px-1">admin-secret: Admin@7877</code></p>
            <p><span className="text-blue-700 font-black">POST</span> <code className="bg-gray-100 px-1.5 py-0.5">/api/payment/approve</code> + body <code className="bg-gray-100 px-1">{"{ transactionId }"}</code> + header <code className="bg-gray-100 px-1">admin-secret: Admin@7877</code></p>
            <p><span className="text-red-600 font-black">POST</span> <code className="bg-gray-100 px-1.5 py-0.5">/api/payment/reject</code>  + body <code className="bg-gray-100 px-1">{"{ transactionId, reason }"}</code> + header <code className="bg-gray-100 px-1">admin-secret: Admin@7877</code></p>
          </div>
        </details>

      </div>
    </div>
  );
}