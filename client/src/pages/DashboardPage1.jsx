
// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Navbar } from '../pages/Navbar';
// import { resumeAPI, historyAPI } from '../services/api';
// import { useSubscription } from '../hooks/useSubscription';
// import UpgradeModal from '../components/UpgradeModal';
// import FeaturePageGuard, { LockedUploadZone, LockedActionButton } from '../components/FeaturePageGuard';
// import toast from 'react-hot-toast';
// import {
//   FileText, Upload, Trash2, Loader2,
//   Target, Crown, Zap, Lock, AlertCircle
// } from 'lucide-react';

// const domains = [
//   { id: 'software-engineer',  name: 'Software Engineer', icon: '💻' },
//   { id: 'data-scientist',     name: 'Data Scientist',    icon: '📊' },
//   { id: 'marketing',          name: 'Marketing',         icon: '📢' },
//   { id: 'product-manager',    name: 'Product Manager',   icon: '📦' },
//   { id: 'design',             name: 'Design',            icon: '🎨' },
//   { id: 'sales',              name: 'Sales',             icon: '💰' },
//   { id: 'other',              name: 'Custom Domain',     icon: '✏️' },
// ];

// // Usage bar mini-component
// function UsageBar({ used, limit, label, color = '#3B82F6' }) {
//   if (limit === null) return (
//     <div className="flex items-center justify-between text-xs font-bold">
//       <span>{label}</span>
//       <span className="text-green-600 font-black">Unlimited</span>
//     </div>
//   );
//   if (limit === 0) return (
//     <div className="flex items-center justify-between text-xs font-bold">
//       <span>{label}</span>
//       <span className="flex items-center gap-1 text-gray-400"><Lock className="w-3 h-3" /> Locked</span>
//     </div>
//   );
//   const pct = Math.min(100, Math.round((used / limit) * 100));
//   const barColor = pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#22C55E';
//   return (
//     <div className="space-y-1">
//       <div className="flex items-center justify-between text-xs font-bold">
//         <span>{label}</span>
//         <span style={{ color: pct >= 90 ? '#EF4444' : '#6B7280' }}>{used}/{limit}</span>
//       </div>
//       <div className="w-full h-1.5 bg-gray-200 border border-black/10">
//         <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
//       </div>
//     </div>
//   );
// }

// export const DashboardPage = () => {
//   const { user, logout }  = useAuth();
//   const navigate          = useNavigate();
//   const {
//     plan, remainingDays, getUsageInfo, isFeatureAvailable, refresh,
//     subscriptionData, hasPendingPayment, pendingPlan
//   } = useSubscription();

//   const [history, setHistory]           = useState([]);
//   const [stats, setStats]               = useState(null);
//   const [loading, setLoading]           = useState(true);
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [customDomain, setCustomDomain] = useState('');
//   const [file, setFile]                 = useState(null);
//   const [analyzing, setAnalyzing]       = useState(false);
//   const [showUpgrade, setShowUpgrade]   = useState(false);

//   const analysisInfo = getUsageInfo('resume_analysis');
//   const canAnalyze   = isFeatureAvailable('resume_analysis');

//   useEffect(() => { fetchHistory(); fetchStats(); }, []);

//   const fetchHistory = async () => {
//     try { const r = await historyAPI.getHistory(); setHistory(r.data); }
//     catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   const fetchStats = async () => {
//     try { const r = await historyAPI.getStats(); setStats(r.data); }
//     catch (e) { console.error(e); }
//   };

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('File size must be less than 5MB'); return; }
//     setFile(f);
//   };

//   // Intercept file picker if limit reached
//   const handleUploadClick = (e) => {
//     if (!canAnalyze) {
//       e.preventDefault();
//       setShowUpgrade(true);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!canAnalyze) { setShowUpgrade(true); return; }
//     if (!selectedDomain || !file) { toast.error('Please select a domain and upload a file'); return; }
//     if (selectedDomain === 'other' && !customDomain.trim()) { toast.error('Please enter your custom domain'); return; }

//     setAnalyzing(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('targetDomain', selectedDomain === 'other' ? customDomain : selectedDomain);
//       const response = await resumeAPI.uploadAndAnalyze(formData);
//       toast.success('Analysis complete!');
//       await refresh(); // update usage counts
//       navigate(`/analysis/${response.data._id}`);
//     } catch (error) {
//       const errData = error.response?.data;
//       if (error.response?.status === 403 && (errData?.error === 'FEATURE_LOCKED' || errData?.error === 'LIMIT_REACHED')) {
//         setShowUpgrade(true);
//       } else {
//         toast.error(errData?.message || 'Analysis failed');
//       }
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Delete this analysis?')) return;
//     try { await historyAPI.deleteHistory(id); toast.success('Deleted'); fetchHistory(); fetchStats(); }
//     catch { toast.error('Failed to delete'); }
//   };

//   const getDomainName = (id) => domains.find(d => d.id === id)?.name || id;
//   const getScoreColor = (s) => s >= 80 ? 'bg-neo-green' : s >= 60 ? 'bg-neo-yellow' : 'bg-neo-red';

//   const planBadgeColor = plan === 'pro' ? '#C084FC' : plan === 'starter' ? '#86EFAC' : '#E5E7EB';
//   const planIcon       = plan === 'pro' ? '👑' : plan === 'starter' ? '⚡' : '🆓';

//   return (
//     <div className="min-h-screen bg-white">
//       <FeaturePageGuard action="resume_analysis" />
//       <Navbar />

//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

//         {/* ── Plan banner ── */}
//         <div
//           className="border-3 border-black p-4 flex flex-wrap items-center justify-between gap-3"
//           style={{ border: '3px solid black', backgroundColor: planBadgeColor, boxShadow: '4px 4px 0 #000' }}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">{planIcon}</span>
//             <div>
//               <p className="font-black text-sm uppercase tracking-wide">
//                 {plan === 'free' ? 'Free Plan' : plan === 'pro' ? 'Pro Plan' : 'Starter Plan'}
//               </p>
//               <p className="text-xs font-bold text-gray-700">
//                 {plan === 'free'
//                   ? `${analysisInfo.used}/4 resume analyses used (lifetime)`
//                   : `${remainingDays} days remaining · ${analysisInfo.used}/${analysisInfo.limit ?? '∞'} analyses this month`}
//               </p>
//             </div>
//           </div>
//           {plan === 'free' && (
//             <button
//               onClick={() => setShowUpgrade(true)}
//               className="border-2 border-black bg-black text-white px-4 py-2 font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition"
//               style={{ boxShadow: '3px 3px 0 #374151' }}
//             >
//               ✨ Upgrade Now
//             </button>
//           )}
//           {hasPendingPayment && (
//             <span className="text-xs font-black bg-yellow-200 border border-yellow-500 px-3 py-1.5 text-yellow-800">
//               ⏳ {pendingPlan} verification pending (~2 hrs)
//             </span>
//           )}
//         </div>

//         {/* ── Stats row ── */}
//         {stats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: 'Total Analyses', value: stats.totalAnalyses },
//               { label: 'Avg Score',      value: stats.averageScore  },
//               { label: 'Best Score',     value: stats.bestScore     },
//               { label: 'Fav Domain',     value: getDomainName(stats.favoriteDomain), small: true },
//             ].map(({ label, value, small }) => (
//               <div key={label} className="neo-card p-5 text-center">
//                 <div className={`font-space font-extrabold ${small ? 'text-base' : 'text-3xl'}`}>{value ?? '—'}</div>
//                 <div className="font-bold text-gray-500 text-sm mt-1">{label}</div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── Upload section ── */}
//         <div className="neo-card p-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="font-space text-2xl font-extrabold">NEW ANALYSIS</h2>
//             {/* Usage indicator */}
//             {analysisInfo.limit !== null && (
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="font-bold text-gray-600">
//                   {analysisInfo.used}/{analysisInfo.limit} uses
//                 </span>
//                 <div className="w-24 h-2.5 bg-gray-200 border-2 border-black overflow-hidden">
//                   <div
//                     className="h-full transition-all"
//                     style={{
//                       width: `${Math.min(100, (analysisInfo.used / analysisInfo.limit) * 100)}%`,
//                       backgroundColor: analysisInfo.used >= analysisInfo.limit ? '#EF4444'
//                         : analysisInfo.used / analysisInfo.limit >= 0.7 ? '#F59E0B' : '#22C55E'
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Limit-reached banner */}
//           {!canAnalyze && (
//             <div
//               className="mb-6 border-3 border-red-500 bg-red-50 p-4 flex items-center justify-between gap-4"
//               style={{ border: '3px solid #EF4444' }}
//             >
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                 <p className="text-sm font-bold text-red-700">
//                   {analysisInfo.limit === 0
//                     ? 'Resume analysis is not available on the free plan.'
//                     : `You've used all ${analysisInfo.limit} ${analysisInfo.period} resume analyses.`}
//                   {' '}Upgrade to continue.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowUpgrade(true)}
//                 className="border-2 border-red-600 bg-red-600 text-white px-3 py-1.5 font-black text-xs uppercase whitespace-nowrap hover:bg-red-700 transition"
//               >
//                 Upgrade
//               </button>
//             </div>
//           )}

//           {/* Domain selector */}
//           <div className="mb-6">
//             <h3 className="font-bold mb-3">Select Target Domain</h3>
//             <div className="flex flex-wrap gap-3">
//               {domains.map((d) => (
//                 <button
//                   key={d.id}
//                   onClick={() => setSelectedDomain(d.id)}
//                   disabled={!canAnalyze}
//                   className={`px-4 py-2 border-3 border-black font-bold transition-all
//                     ${!canAnalyze ? 'opacity-40 cursor-not-allowed' : ''}
//                     ${selectedDomain === d.id ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]' : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'}`}
//                 >
//                   {d.icon} {d.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {selectedDomain === 'other' && canAnalyze && (
//             <div className="mb-6">
//               <h3 className="font-bold mb-3">Enter Custom Domain</h3>
//               <input
//                 type="text"
//                 value={customDomain}
//                 onChange={(e) => setCustomDomain(e.target.value)}
//                 placeholder="e.g., DevOps Engineer, Data Analyst…"
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>
//           )}

//           {/* File upload */}
//           <div className="mb-6">
//             <h3 className="font-bold mb-3">Upload Resume (PDF)</h3>
//             <div
//               className={`border-3 border-dashed border-black p-6 text-center relative transition-all
//                 ${!canAnalyze ? 'bg-gray-50 opacity-60' : 'bg-white cursor-pointer hover:bg-neo-offwhite'}`}
//               onClick={!canAnalyze ? () => setShowUpgrade(true) : undefined}
//             >
//               {!canAnalyze && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 cursor-pointer">
//                   <Lock className="w-10 h-10 text-gray-400 mb-2" />
//                   <span className="font-black text-sm text-gray-500">Upgrade to upload</span>
//                   <button
//                     onClick={() => setShowUpgrade(true)}
//                     className="mt-3 border-2 border-black bg-black text-white px-4 py-1.5 font-black text-xs uppercase hover:bg-gray-800"
//                   >
//                     See Plans
//                   </button>
//                 </div>
//               )}
//               {file ? (
//                 <div className="flex items-center justify-center gap-4">
//                   <FileText className="w-8 h-8" />
//                   <span className="font-bold">{file.name}</span>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); setFile(null); }}
//                     className="p-1 border-2 border-black hover:bg-neo-red font-black text-xs"
//                   >✕</button>
//                 </div>
//               ) : (
//                 <>
//                 <LockedUploadZone action="resume_analysis" className="border-3 border-dashed border-black bg-white p-6 text-center">
//   {/* your existing upload zone content — unchanged */}
//   <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//   <label className="neo-button cursor-pointer inline-block">
//     Browse Files
//     <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
//   </label>
// </LockedUploadZone>
//                   <p className="text-xs text-gray-500 mt-2 font-semibold">PDF only · Max 5MB</p>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Analyze button */}
//           <button
//             onClick={canAnalyze ? handleAnalyze : () => setShowUpgrade(true)}
//             disabled={canAnalyze && (!selectedDomain || !file || analyzing || (selectedDomain === 'other' && !customDomain.trim()))}
//             className={`w-full flex items-center justify-center gap-2 py-4 border-3 border-black font-black text-sm uppercase tracking-wider transition-all
//               ${!canAnalyze
//                 ? 'bg-gray-200 text-gray-500 cursor-pointer hover:bg-neo-yellow hover:text-black'
//                 : 'neo-button disabled:opacity-50 disabled:cursor-not-allowed'}`}
//             style={{ border: '3px solid black' }}
//           >
//             {analyzing ? (
//               <><Loader2 className="w-5 h-5 animate-spin" />Analyzing…</>
//             ) : !canAnalyze ? (
//               <><Lock className="w-5 h-5" />Upgrade to Analyze</>
//             ) : (
//               <><Target className="w-5 h-5" />ANALYZE RESUME</>
//             )}
//           </button>
//         </div>

//         {/* ── Quick access to other features ── */}
//         <div>
//           <h2 className="font-space text-xl font-extrabold mb-4 uppercase">All Features</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {[
//               { to: '/jd-match',       action: 'jd_match',            label: 'JD Match',          icon: '🎯', color: '#BFDBFE' },
//               { to: '/cover-letter',   action: 'cover_letter',         label: 'Cover Letter',      icon: '✉️',  color: '#BBF7D0' },
//               { to: '/rewrite',        action: 'resume_rewrite',       label: 'Resume Rewrite',    icon: '✏️',  color: '#FDE68A' },
//               { to: '/cold-outreach',  action: 'mail_gen',             label: 'Cold Email',        icon: '📧', color: '#FED7AA' },
//               { to: '/mock-interview', action: 'interview_questions',  label: 'Mock Interview',    icon: '🧠', color: '#E9D5FF' },
//               { to: '/chat',           action: 'chat',                 label: 'AI Chat',           icon: '💬', color: '#BAE6FD' },
//             ].map(({ to, action, label, icon, color }) => {
//               const available = isFeatureAvailable(action);
//               const info      = getUsageInfo(action);
//               return (
//                 <Link
//                   key={to}
//                   to={to}
//                   className="border-3 border-black p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-all relative group"
//                   style={{ border: '3px solid black', backgroundColor: available ? color : '#F3F4F6', boxShadow: '4px 4px 0 #000' }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-2xl">{icon}</span>
//                     {!available && <Lock className="w-4 h-4 text-gray-400" />}
//                     {available && info.limit !== null && info.limit !== 0 && (
//                       <span className="text-[10px] font-black bg-black/10 px-1.5 py-0.5 border border-black/20">
//                         {info.used}/{info.limit}
//                       </span>
//                     )}
//                     {available && info.limit === null && (
//                       <span className="text-[10px] font-black text-green-600">∞</span>
//                     )}
//                   </div>
//                   <span className="font-black text-sm">{label}</span>
//                   {!available && (
//                     <span className="text-[10px] font-bold text-gray-500 uppercase">Upgrade Required</span>
//                   )}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>

//         {/* ── Subscription usage summary ── */}
//         {subscriptionData && (
//           <div className="neo-card p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-space text-lg font-extrabold uppercase">Usage This Month</h2>
//               <span
//                 className="text-xs font-black px-3 py-1 border-2 border-black uppercase"
//                 style={{ backgroundColor: planBadgeColor }}
//               >
//                 {planIcon} {plan}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {[
//                 { key: 'resume_analysis',     label: 'Analyses'       },
//                 { key: 'jd_match',            label: 'JD Matches'     },
//                 { key: 'cover_letter',        label: 'Cover Letters'  },
//                 { key: 'mail_gen',            label: 'Cold Emails'    },
//                 { key: 'resume_rewrite',      label: 'Rewrites'       },
//                 { key: 'chat',                label: 'AI Chat'        },
//               ].map(({ key, label }) => {
//                 const i = getUsageInfo(key);
//                 return (
//                   <UsageBar
//                     key={key}
//                     used={i.used}
//                     limit={i.limit}
//                     label={label}
//                   />
//                 );
//               })}
//             </div>
//             {plan === 'free' && (
//               <button
//                 onClick={() => setShowUpgrade(true)}
//                 className="mt-5 w-full py-2.5 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition"
//               >
//                 ✨ Upgrade for More
//               </button>
//             )}
//           </div>
//         )}

//         {/* ── History ── */}
//         <div className="neo-card p-8">
//           <h2 className="font-space text-2xl font-extrabold mb-6">ANALYSIS HISTORY</h2>
//           {loading ? (
//             <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
//           ) : history.length === 0 ? (
//             <div className="text-center py-12">
//               <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <p className="text-xl font-bold mb-2">No analyses yet</p>
//               <p className="text-gray-500 font-semibold">Upload your resume above to get started!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {history.map((item) => (
//                 <div key={item._id} className="flex items-center justify-between border-3 border-black p-4 bg-white hover:bg-neo-offwhite transition-colors" style={{ border: '3px solid black' }}>
//                   <div className="flex items-center gap-4">
//                     <div className={`w-14 h-14 flex items-center justify-center text-xl font-black border-3 border-black ${getScoreColor(item.score)}`} style={{ border: '3px solid black' }}>
//                       {item.score || '—'}
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-sm">{item.fileName}</h3>
//                       <p className="text-xs text-gray-500 font-semibold">
//                         {getDomainName(item.targetDomain)} · {new Date(item.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Link to={`/analysis/${item.analysisId?._id || item.analysisId}`} className="neo-button-blue px-3 py-1.5 text-xs">View</Link>
//                     <button onClick={() => handleDelete(item._id)} className="p-2 border-2 border-black hover:bg-neo-red transition-colors">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>

//       {/* ── Upgrade modal ── */}
//       {showUpgrade && (
//         <UpgradeModal
//           isOpen
//           onClose={() => setShowUpgrade(false)}
//           triggerAction="resume_analysis"
//           errorType={!canAnalyze ? (analysisInfo.limit === 0 ? 'FEATURE_LOCKED' : 'LIMIT_REACHED') : null}
//         />
//       )}
//     </div>
//   );
// };





























// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Navbar } from '../pages/Navbar';
// import { resumeAPI, historyAPI } from '../services/api';
// import { useSubscription } from '../hooks/useSubscription';
// import UpgradeModal from '../components/UpgradeModal';
// import FeaturePageGuard, { LockedUploadZone, LockedActionButton } from '../components/FeaturePageGuard';
// import toast from 'react-hot-toast';
// import {
//   FileText, Upload, Trash2, Loader2,
//   Target, Crown, Zap, Lock, AlertCircle
// } from 'lucide-react';
 
// const domains = [
//   { id: 'software-engineer',  name: 'Software Engineer', icon: '💻' },
//   { id: 'data-scientist',     name: 'Data Scientist',    icon: '📊' },
//   { id: 'marketing',          name: 'Marketing',         icon: '📢' },
//   { id: 'product-manager',    name: 'Product Manager',   icon: '📦' },
//   { id: 'design',             name: 'Design',            icon: '🎨' },
//   { id: 'sales',              name: 'Sales',             icon: '💰' },
//   { id: 'other',              name: 'Custom Domain',     icon: '✏️' },
// ];
 
// // Usage bar mini-component
// function UsageBar({ used, limit, label, loading = false }) {
//   if (loading) return (
//     <div className="flex items-center justify-between text-xs font-bold">
//       <span>{label}</span>
//       <span className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
//     </div>
//   );
//   if (limit === null) return (
//     <div className="flex items-center justify-between text-xs font-bold">
//       <span>{label}</span>
//       <span className="text-green-600 font-black">Unlimited</span>
//     </div>
//   );
//   if (limit === 0) return (
//     <div className="flex items-center justify-between text-xs font-bold">
//       <span>{label}</span>
//       <span className="flex items-center gap-1 text-gray-400"><Lock className="w-3 h-3" /> Locked</span>
//     </div>
//   );
//   const pct = Math.min(100, Math.round((used / limit) * 100));
//   const barColor = pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#22C55E';
//   return (
//     <div className="space-y-1">
//       <div className="flex items-center justify-between text-xs font-bold">
//         <span>{label}</span>
//         <span style={{ color: pct >= 90 ? '#EF4444' : '#6B7280' }}>{used}/{limit}</span>
//       </div>
//       <div className="w-full h-1.5 bg-gray-200 border border-black/10">
//         <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
//       </div>
//     </div>
//   );
// }
 
// export const DashboardPage = () => {
//   const { user, logout }  = useAuth();
//   const navigate          = useNavigate();
//   const {
//     plan, remainingDays, getUsageInfo, isFeatureAvailable, refresh,
//     subscriptionData, hasPendingPayment, pendingPlan, loading: subscriptionLoading
//   } = useSubscription();
 
//   const [history, setHistory]           = useState([]);
//   const [stats, setStats]               = useState(null);
//   const [loading, setLoading]           = useState(true);
//   const [selectedDomain, setSelectedDomain] = useState(null);
//   const [customDomain, setCustomDomain] = useState('');
//   const [file, setFile]                 = useState(null);
//   const [analyzing, setAnalyzing]       = useState(false);
//   const [showUpgrade, setShowUpgrade]   = useState(false);
 
//   const analysisInfo = getUsageInfo('resume_analysis');
//   // Don't block access while subscription data is still loading — prevents false "Locked" flash
//   const canAnalyze   = subscriptionLoading ? true : isFeatureAvailable('resume_analysis');
 
//   useEffect(() => { fetchHistory(); fetchStats(); }, []);
 
//   const fetchHistory = async () => {
//     try { const r = await historyAPI.getHistory(); setHistory(r.data); }
//     catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };
 
//   const fetchStats = async () => {
//     try { const r = await historyAPI.getStats(); setStats(r.data); }
//     catch (e) { console.error(e); }
//   };
 
//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('File size must be less than 5MB'); return; }
//     setFile(f);
//   };
 
//   // Intercept file picker if limit reached
//   const handleUploadClick = (e) => {
//     if (!canAnalyze) {
//       e.preventDefault();
//       setShowUpgrade(true);
//     }
//   };
 
//   const handleAnalyze = async () => {
//     if (!canAnalyze) { setShowUpgrade(true); return; }
//     if (!selectedDomain || !file) { toast.error('Please select a domain and upload a file'); return; }
//     if (selectedDomain === 'other' && !customDomain.trim()) { toast.error('Please enter your custom domain'); return; }
 
//     setAnalyzing(true);
//     try {
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('targetDomain', selectedDomain === 'other' ? customDomain : selectedDomain);
//       const response = await resumeAPI.uploadAndAnalyze(formData);
//       toast.success('Analysis complete!');
//       await refresh(); // update usage counts
//       navigate(`/analysis/${response.data._id}`);
//     } catch (error) {
//       const errData = error.response?.data;
//       if (error.response?.status === 403 && (errData?.error === 'FEATURE_LOCKED' || errData?.error === 'LIMIT_REACHED')) {
//         setShowUpgrade(true);
//       } else {
//         toast.error(errData?.message || 'Analysis failed');
//       }
//     } finally {
//       setAnalyzing(false);
//     }
//   };
 
//   const handleDelete = async (id) => {
//     if (!confirm('Delete this analysis?')) return;
//     try { await historyAPI.deleteHistory(id); toast.success('Deleted'); fetchHistory(); fetchStats(); }
//     catch { toast.error('Failed to delete'); }
//   };
 
//   const getDomainName = (id) => domains.find(d => d.id === id)?.name || id;
//   const getScoreColor = (s) => s >= 80 ? 'bg-neo-green' : s >= 60 ? 'bg-neo-yellow' : 'bg-neo-red';
 
//   const planBadgeColor = plan === 'pro' ? '#C084FC' : plan === 'starter' ? '#86EFAC' : '#E5E7EB';
//   const planIcon       = plan === 'pro' ? '👑' : plan === 'starter' ? '⚡' : '🆓';
 
//   return (
//     <div className="min-h-screen bg-white">
//       <FeaturePageGuard action="resume_analysis" />
//       <Navbar />
 
//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
 
//         {/* ── Plan banner ── */}
//         <div
//           className="border-3 border-black p-4 flex flex-wrap items-center justify-between gap-3"
//           style={{ border: '3px solid black', backgroundColor: planBadgeColor, boxShadow: '4px 4px 0 #000' }}
//         >
//           <div className="flex items-center gap-3">
//             <span className="text-2xl">{planIcon}</span>
//             <div>
//               <p className="font-black text-sm uppercase tracking-wide">
//                 {plan === 'free' ? 'Free Plan' : plan === 'pro' ? 'Pro Plan' : 'Starter Plan'}
//               </p>
//               <p className="text-xs font-bold text-gray-700">
//                 {plan === 'free'
//                   ? `${analysisInfo.used}/4 resume analyses used (lifetime)`
//                   : `${remainingDays} days remaining · ${analysisInfo.used}/${analysisInfo.limit ?? '∞'} analyses this month`}
//               </p>
//             </div>
//           </div>
//           {plan === 'free' && (
//             <button
//               onClick={() => setShowUpgrade(true)}
//               className="border-2 border-black bg-black text-white px-4 py-2 font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition"
//               style={{ boxShadow: '3px 3px 0 #374151' }}
//             >
//               ✨ Upgrade Now
//             </button>
//           )}
//           {hasPendingPayment && (
//             <span className="text-xs font-black bg-yellow-200 border border-yellow-500 px-3 py-1.5 text-yellow-800">
//               ⏳ {pendingPlan} verification pending (~2 hrs)
//             </span>
//           )}
//         </div>
 
//         {/* ── Stats row ── */}
//         {stats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: 'Total Analyses', value: stats.totalAnalyses },
//               { label: 'Avg Score',      value: stats.averageScore  },
//               { label: 'Best Score',     value: stats.bestScore     },
//               { label: 'Fav Domain',     value: getDomainName(stats.favoriteDomain), small: true },
//             ].map(({ label, value, small }) => (
//               <div key={label} className="neo-card p-5 text-center">
//                 <div className={`font-space font-extrabold ${small ? 'text-base' : 'text-3xl'}`}>{value ?? '—'}</div>
//                 <div className="font-bold text-gray-500 text-sm mt-1">{label}</div>
//               </div>
//             ))}
//           </div>
//         )}
 
//         {/* ── Upload section ── */}
//         <div className="neo-card p-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="font-space text-2xl font-extrabold">NEW ANALYSIS</h2>
//             {/* Usage indicator */}
//             {analysisInfo.limit !== null && (
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="font-bold text-gray-600">
//                   {analysisInfo.used}/{analysisInfo.limit} uses
//                 </span>
//                 <div className="w-24 h-2.5 bg-gray-200 border-2 border-black overflow-hidden">
//                   <div
//                     className="h-full transition-all"
//                     style={{
//                       width: `${Math.min(100, (analysisInfo.used / analysisInfo.limit) * 100)}%`,
//                       backgroundColor: analysisInfo.used >= analysisInfo.limit ? '#EF4444'
//                         : analysisInfo.used / analysisInfo.limit >= 0.7 ? '#F59E0B' : '#22C55E'
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
 
//           {/* Limit-reached banner */}
//           {!canAnalyze && (
//             <div
//               className="mb-6 border-3 border-red-500 bg-red-50 p-4 flex items-center justify-between gap-4"
//               style={{ border: '3px solid #EF4444' }}
//             >
//               <div className="flex items-center gap-3">
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                 <p className="text-sm font-bold text-red-700">
//                   {analysisInfo.limit === 0
//                     ? 'Resume analysis is not available on the free plan.'
//                     : `You've used all ${analysisInfo.limit} ${analysisInfo.period} resume analyses.`}
//                   {' '}Upgrade to continue.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowUpgrade(true)}
//                 className="border-2 border-red-600 bg-red-600 text-white px-3 py-1.5 font-black text-xs uppercase whitespace-nowrap hover:bg-red-700 transition"
//               >
//                 Upgrade
//               </button>
//             </div>
//           )}
 
//           {/* Domain selector */}
//           <div className="mb-6">
//             <h3 className="font-bold mb-3">Select Target Domain</h3>
//             <div className="flex flex-wrap gap-3">
//               {domains.map((d) => (
//                 <button
//                   key={d.id}
//                   onClick={() => setSelectedDomain(d.id)}
//                   disabled={!canAnalyze}
//                   className={`px-4 py-2 border-3 border-black font-bold transition-all
//                     ${!canAnalyze ? 'opacity-40 cursor-not-allowed' : ''}
//                     ${selectedDomain === d.id ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]' : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'}`}
//                 >
//                   {d.icon} {d.name}
//                 </button>
//               ))}
//             </div>
//           </div>
 
//           {selectedDomain === 'other' && canAnalyze && (
//             <div className="mb-6">
//               <h3 className="font-bold mb-3">Enter Custom Domain</h3>
//               <input
//                 type="text"
//                 value={customDomain}
//                 onChange={(e) => setCustomDomain(e.target.value)}
//                 placeholder="e.g., DevOps Engineer, Data Analyst…"
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>
//           )}
 
//           {/* File upload */}
//           <div className="mb-6">
//             <h3 className="font-bold mb-3">Upload Resume (PDF)</h3>
//             <div
//               className={`border-3 border-dashed border-black p-6 text-center relative transition-all
//                 ${!canAnalyze ? 'bg-gray-50 opacity-60' : 'bg-white cursor-pointer hover:bg-neo-offwhite'}`}
//               onClick={!canAnalyze ? () => setShowUpgrade(true) : undefined}
//             >
//               {!canAnalyze && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 cursor-pointer">
//                   <Lock className="w-10 h-10 text-gray-400 mb-2" />
//                   <span className="font-black text-sm text-gray-500">Upgrade to upload</span>
//                   <button
//                     onClick={() => setShowUpgrade(true)}
//                     className="mt-3 border-2 border-black bg-black text-white px-4 py-1.5 font-black text-xs uppercase hover:bg-gray-800"
//                   >
//                     See Plans
//                   </button>
//                 </div>
//               )}
//               {file ? (
//                 <div className="flex items-center justify-center gap-4">
//                   <FileText className="w-8 h-8" />
//                   <span className="font-bold">{file.name}</span>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); setFile(null); }}
//                     className="p-1 border-2 border-black hover:bg-neo-red font-black text-xs"
//                   >✕</button>
//                 </div>
//               ) : (
//                 <>
//                 <LockedUploadZone action="resume_analysis" className="border-3 border-dashed border-black bg-white p-6 text-center">
//   {/* your existing upload zone content — unchanged */}
//   <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//   <label className="neo-button cursor-pointer inline-block">
//     Browse Files
//     <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
//   </label>
// </LockedUploadZone>
//                   <p className="text-xs text-gray-500 mt-2 font-semibold">PDF only · Max 5MB</p>
//                 </>
//               )}
//             </div>
//           </div>
 
//           {/* Analyze button */}
//           <button
//             onClick={canAnalyze ? handleAnalyze : () => setShowUpgrade(true)}
//             disabled={canAnalyze && (!selectedDomain || !file || analyzing || (selectedDomain === 'other' && !customDomain.trim()))}
//             className={`w-full flex items-center justify-center gap-2 py-4 border-3 border-black font-black text-sm uppercase tracking-wider transition-all
//               ${!canAnalyze
//                 ? 'bg-gray-200 text-gray-500 cursor-pointer hover:bg-neo-yellow hover:text-black'
//                 : 'neo-button disabled:opacity-50 disabled:cursor-not-allowed'}`}
//             style={{ border: '3px solid black' }}
//           >
//             {analyzing ? (
//               <><Loader2 className="w-5 h-5 animate-spin" />Analyzing…</>
//             ) : !canAnalyze ? (
//               <><Lock className="w-5 h-5" />Upgrade to Analyze</>
//             ) : (
//               <><Target className="w-5 h-5" />ANALYZE RESUME</>
//             )}
//           </button>
//         </div>
 
//         {/* ── Quick access to other features ── */}
//         <div>
//           <h2 className="font-space text-xl font-extrabold mb-4 uppercase">All Features</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {[
//               { to: '/jd-match',       action: 'jd_match',            label: 'JD Match',          icon: '🎯', color: '#BFDBFE' },
//               { to: '/cover-letter',   action: 'cover_letter',         label: 'Cover Letter',      icon: '✉️',  color: '#BBF7D0' },
//               { to: '/rewrite',        action: 'resume_rewrite',       label: 'Resume Rewrite',    icon: '✏️',  color: '#FDE68A' },
//               { to: '/cold-outreach',  action: 'mail_gen',             label: 'Cold Email',        icon: '📧', color: '#FED7AA' },
//               { to: '/mock-interview', action: 'interview_questions',  label: 'Mock Interview',    icon: '🧠', color: '#E9D5FF' },
//               { to: '/chat',           action: 'chat',                 label: 'AI Chat',           icon: '💬', color: '#BAE6FD' },
//             ].map(({ to, action, label, icon, color }) => {
//               // While subscription is loading, treat all features as available (prevents false "Locked" flash)
//               const available = subscriptionLoading ? true : isFeatureAvailable(action);
//               const info      = getUsageInfo(action);
//               return (
//                 <Link
//                   key={to}
//                   to={to}
//                   className="border-3 border-black p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-all relative group"
//                   style={{ border: '3px solid black', backgroundColor: available ? color : '#F3F4F6', boxShadow: '4px 4px 0 #000' }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="text-2xl">{icon}</span>
//                     {subscriptionLoading ? (
//                       <span className="w-6 h-3 bg-black/10 rounded animate-pulse" />
//                     ) : !available ? (
//                       <Lock className="w-4 h-4 text-gray-400" />
//                     ) : info.limit !== null && info.limit !== 0 ? (
//                       <span className="text-[10px] font-black bg-black/10 px-1.5 py-0.5 border border-black/20">
//                         {info.used}/{info.limit}
//                       </span>
//                     ) : info.limit === null ? (
//                       <span className="text-[10px] font-black text-green-600">∞</span>
//                     ) : null}
//                   </div>
//                   <span className="font-black text-sm">{label}</span>
//                   {!subscriptionLoading && !available && (
//                     <span className="text-[10px] font-bold text-gray-500 uppercase">Upgrade Required</span>
//                   )}
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
 
//         {/* ── Subscription usage summary ── */}
//         {subscriptionData && (
//           <div className="neo-card p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="font-space text-lg font-extrabold uppercase">Usage This Month</h2>
//               <span
//                 className="text-xs font-black px-3 py-1 border-2 border-black uppercase"
//                 style={{ backgroundColor: planBadgeColor }}
//               >
//                 {planIcon} {plan}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {[
//                 { key: 'resume_analysis',     label: 'Analyses'       },
//                 { key: 'jd_match',            label: 'JD Matches'     },
//                 { key: 'cover_letter',        label: 'Cover Letters'  },
//                 { key: 'mail_gen',            label: 'Cold Emails'    },
//                 { key: 'resume_rewrite',      label: 'Rewrites'       },
//                 { key: 'chat',                label: 'AI Chat'        },
//               ].map(({ key, label }) => {
//                 const i = getUsageInfo(key);
//                 return (
//                   <UsageBar
//                     key={key}
//                     used={i.used}
//                     limit={i.limit}
//                     label={label}
//                     loading={subscriptionLoading}
//                   />
//                 );
//               })}
//             </div>
//             {plan === 'free' && (
//               <button
//                 onClick={() => setShowUpgrade(true)}
//                 className="mt-5 w-full py-2.5 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition"
//               >
//                 ✨ Upgrade for More
//               </button>
//             )}
//           </div>
//         )}
 
//         {/* ── History ── */}
//         <div className="neo-card p-8">
//           <h2 className="font-space text-2xl font-extrabold mb-6">ANALYSIS HISTORY</h2>
//           {loading ? (
//             <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
//           ) : history.length === 0 ? (
//             <div className="text-center py-12">
//               <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//               <p className="text-xl font-bold mb-2">No analyses yet</p>
//               <p className="text-gray-500 font-semibold">Upload your resume above to get started!</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {history.map((item) => (
//                 <div key={item._id} className="flex items-center justify-between border-3 border-black p-4 bg-white hover:bg-neo-offwhite transition-colors" style={{ border: '3px solid black' }}>
//                   <div className="flex items-center gap-4">
//                     <div className={`w-14 h-14 flex items-center justify-center text-xl font-black border-3 border-black ${getScoreColor(item.score)}`} style={{ border: '3px solid black' }}>
//                       {item.score || '—'}
//                     </div>
//                     <div>
//                       <h3 className="font-bold text-sm">{item.fileName}</h3>
//                       <p className="text-xs text-gray-500 font-semibold">
//                         {getDomainName(item.targetDomain)} · {new Date(item.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Link to={`/analysis/${item.analysisId?._id || item.analysisId}`} className="neo-button-blue px-3 py-1.5 text-xs">View</Link>
//                     <button onClick={() => handleDelete(item._id)} className="p-2 border-2 border-black hover:bg-neo-red transition-colors">
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
 
//       </div>
 
//       {/* ── Upgrade modal ── */}
//       {showUpgrade && (
//         <UpgradeModal
//           isOpen
//           onClose={() => setShowUpgrade(false)}
//           triggerAction="resume_analysis"
//           errorType={!canAnalyze ? (analysisInfo.limit === 0 ? 'FEATURE_LOCKED' : 'LIMIT_REACHED') : null}
//         />
//       )}
//     </div>
//   );
// };




















import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../pages/Navbar';
import { resumeAPI, historyAPI } from '../services/api';
import { useSubscription } from '../hooks/useSubscription';
import UpgradeModal from '../components/UpgradeModal';
import FeaturePageGuard from '../components/FeaturePageGuard';
import toast from 'react-hot-toast';
import {
  FileText, Upload, Trash2, Loader2,
  Target, Lock, AlertCircle
} from 'lucide-react';

const domains = [
  { id: 'software-engineer',  name: 'Software Engineer', icon: '💻' },
  { id: 'data-scientist',     name: 'Data Scientist',    icon: '📊' },
  { id: 'marketing',          name: 'Marketing',         icon: '📢' },
  { id: 'product-manager',    name: 'Product Manager',   icon: '📦' },
  { id: 'design',             name: 'Design',            icon: '🎨' },
  { id: 'sales',              name: 'Sales',             icon: '💰' },
  { id: 'other',              name: 'Custom Domain',     icon: '✏️' },
];

// -----------------------------------------------------------
// UsageBar
// FIX: loading guard is now FIRST — prevents limit===0 branch
// from rendering while hook is still resolving (caused "Locked"
// flash for Pro users).
// limit === null  → Unlimited  (Pro)
// limit > 0       → progress bar (capped plan)
// limit === 0     → Locked (feature not in plan)
// -----------------------------------------------------------
function UsageBar({ used, limit, label, loading = false }) {
  if (loading) return (
    <div className="flex items-center justify-between text-xs font-bold">
      <span>{label}</span>
      <span className="w-14 h-3 bg-gray-200 rounded animate-pulse" />
    </div>
  );

  if (limit === null || limit === undefined) return (
    <div className="flex items-center justify-between text-xs font-bold">
      <span>{label}</span>
      <span className="text-green-600 font-black">∞ Unlimited</span>
    </div>
  );

  if (limit === 0) return (
    <div className="flex items-center justify-between text-xs font-bold">
      <span className="text-gray-400">{label}</span>
      <span className="flex items-center gap-1 text-gray-400">
        <Lock className="w-3 h-3" /> Locked
      </span>
    </div>
  );

  const safeUsed = Number(used) || 0;
  const pct      = Math.min(100, Math.round((safeUsed / limit) * 100));
  const barColor = pct >= 90 ? '#EF4444' : pct >= 60 ? '#F59E0B' : '#22C55E';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold">
        <span>{label}</span>
        <span style={{ color: pct >= 90 ? '#EF4444' : '#6B7280' }}>{safeUsed}/{limit}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 border border-black/10">
        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

export const DashboardPage = () => {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const {
    plan, remainingDays, getUsageInfo, isFeatureAvailable, refresh,
    subscriptionData, hasPendingPayment, pendingPlan, loading: subscriptionLoading
  } = useSubscription();

  const [history,        setHistory]        = useState([]);
  const [stats,          setStats]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [customDomain,   setCustomDomain]   = useState('');
  const [file,           setFile]           = useState(null);
  const [analyzing,      setAnalyzing]      = useState(false);
  const [showUpgrade,    setShowUpgrade]    = useState(false);

  const analysisInfo = getUsageInfo('resume_analysis');

  // KEY FIX: while subscription is still loading we optimistically
  // allow access so Pro users never see a false "Locked" state.
  const canAnalyze = subscriptionLoading ? true : isFeatureAvailable('resume_analysis');

  useEffect(() => { fetchHistory(); fetchStats(); }, []);

  const fetchHistory = async () => {
    try { const r = await historyAPI.getHistory(); setHistory(r.data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try { const r = await historyAPI.getStats(); setStats(r.data); }
    catch (e) { console.error(e); }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Only PDF files are allowed'); return; }
    if (f.size > 5 * 1024 * 1024)    { toast.error('File size must be less than 5MB'); return; }
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) { setShowUpgrade(true); return; }
    if (!selectedDomain || !file) { toast.error('Please select a domain and upload a file'); return; }
    if (selectedDomain === 'other' && !customDomain.trim()) {
      toast.error('Please enter your custom domain'); return;
    }
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetDomain', selectedDomain === 'other' ? customDomain : selectedDomain);
      const response = await resumeAPI.uploadAndAnalyze(formData);
      toast.success('Analysis complete!');
      await refresh();
      navigate('/analysis/' + response.data._id);
    } catch (error) {
      const errData = error.response?.data;
      if (error.response?.status === 403 &&
          (errData?.error === 'FEATURE_LOCKED' || errData?.error === 'LIMIT_REACHED')) {
        setShowUpgrade(true);
      } else {
        toast.error(errData?.message || 'Analysis failed');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this analysis?')) return;
    try { await historyAPI.deleteHistory(id); toast.success('Deleted'); fetchHistory(); fetchStats(); }
    catch { toast.error('Failed to delete'); }
  };

  const getDomainName = (id) => domains.find(d => d.id === id)?.name || id;
  const getScoreColor = (s) => s >= 80 ? 'bg-neo-green' : s >= 60 ? 'bg-neo-yellow' : 'bg-neo-red';

  const planBadgeColor = plan === 'pro' ? '#C084FC' : plan === 'starter' ? '#86EFAC' : '#E5E7EB';
  const planIcon       = plan === 'pro' ? '👑' : plan === 'starter' ? '⚡' : '🆓';

  return (
    <div className="min-h-screen bg-white">
      <FeaturePageGuard action="resume_analysis" />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Plan banner */}
        <div
          className="border-3 border-black p-4 flex flex-wrap items-center justify-between gap-3"
          style={{ border: '3px solid black', backgroundColor: planBadgeColor, boxShadow: '4px 4px 0 #000' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{planIcon}</span>
            <div>
              <p className="font-black text-sm uppercase tracking-wide">
                {plan === 'free' ? 'Free Plan' : plan === 'pro' ? 'Pro Plan' : 'Starter Plan'}
              </p>
              <p className="text-xs font-bold text-gray-700">
                {plan === 'free'
                  ? ((analysisInfo.used ?? 0) + '/4 resume analyses used (lifetime)')
                  : (remainingDays + ' days remaining · ' + (analysisInfo.used ?? 0) + '/' + (analysisInfo.limit ?? '∞') + ' analyses this month')}
              </p>
            </div>
          </div>
          {plan === 'free' && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="border-2 border-black bg-black text-white px-4 py-2 font-black text-xs uppercase tracking-wider hover:bg-gray-800 transition"
              style={{ boxShadow: '3px 3px 0 #374151' }}
            >
              ✨ Upgrade Now
            </button>
          )}
          {hasPendingPayment && (
            <span className="text-xs font-black bg-yellow-200 border border-yellow-500 px-3 py-1.5 text-yellow-800">
              ⏳ {pendingPlan} verification pending (~2 hrs)
            </span>
          )}
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Analyses', value: stats.totalAnalyses },
              { label: 'Avg Score',      value: stats.averageScore  },
              { label: 'Best Score',     value: stats.bestScore     },
              { label: 'Fav Domain',     value: getDomainName(stats.favoriteDomain), small: true },
            ].map(({ label, value, small }) => (
              <div key={label} className="neo-card p-5 text-center">
                <div className={'font-space font-extrabold ' + (small ? 'text-base' : 'text-3xl')}>{value ?? '—'}</div>
                <div className="font-bold text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Upload section */}
        <div className="neo-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-space text-2xl font-extrabold">NEW ANALYSIS</h2>
            {/* Capped plan: show usage bar */}
            {!subscriptionLoading && analysisInfo.limit !== null && analysisInfo.limit > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-600">{analysisInfo.used}/{analysisInfo.limit} uses</span>
                <div className="w-24 h-2.5 bg-gray-200 border-2 border-black overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: (Math.min(100, ((analysisInfo.used ?? 0) / analysisInfo.limit) * 100)) + '%',
                      backgroundColor: (analysisInfo.used ?? 0) >= analysisInfo.limit ? '#EF4444'
                        : (analysisInfo.used ?? 0) / analysisInfo.limit >= 0.7 ? '#F59E0B' : '#22C55E'
                    }}
                  />
                </div>
              </div>
            )}
            {/* Pro plan: show ∞ badge */}
            {!subscriptionLoading && analysisInfo.limit === null && (
              <span className="text-xs font-black text-green-600 border border-green-300 bg-green-50 px-2 py-1">
                ∞ Unlimited
              </span>
            )}
          </div>

          {/* Limit-reached banner — only after subscription has loaded */}
          {!subscriptionLoading && !canAnalyze && (
            <div
              className="mb-6 border-3 border-red-500 bg-red-50 p-4 flex items-center justify-between gap-4"
              style={{ border: '3px solid #EF4444' }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm font-bold text-red-700">
                  {analysisInfo.limit === 0
                    ? 'Resume analysis is not available on the free plan.'
                    : 'You\'ve used all ' + analysisInfo.limit + ' ' + (analysisInfo.period ?? '') + ' resume analyses.'}
                  {' '}Upgrade to continue.
                </p>
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                className="border-2 border-red-600 bg-red-600 text-white px-3 py-1.5 font-black text-xs uppercase whitespace-nowrap hover:bg-red-700 transition"
              >
                Upgrade
              </button>
            </div>
          )}

          {/* Domain selector */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Select Target Domain</h3>
            <div className="flex flex-wrap gap-3">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  disabled={!canAnalyze}
                  className={'px-4 py-2 border-3 border-black font-bold transition-all ' +
                    (!canAnalyze ? 'opacity-40 cursor-not-allowed ' : '') +
                    (selectedDomain === d.id
                      ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]'
                      : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]')}
                >
                  {d.icon} {d.name}
                </button>
              ))}
            </div>
          </div>

          {selectedDomain === 'other' && canAnalyze && (
            <div className="mb-6">
              <h3 className="font-bold mb-3">Enter Custom Domain</h3>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="e.g., DevOps Engineer, Data Analyst…"
                className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
              />
            </div>
          )}

          {/* File upload
              FIX: removed nested LockedUploadZone — it had its own
              isFeatureAvailable() call with no subscriptionLoading guard,
              which blocked Pro users during the hook resolution window.
              The outer div's !canAnalyze guard is sufficient. */}
          <div className="mb-6">
            <h3 className="font-bold mb-3">Upload Resume (PDF)</h3>
            <div
              className={'border-3 border-dashed border-black p-6 text-center relative transition-all ' +
                (!canAnalyze ? 'bg-gray-50' : 'bg-white hover:bg-neo-offwhite')}
              onClick={!canAnalyze ? () => setShowUpgrade(true) : undefined}
            >
              {/* Lock overlay — only after subscription confirmed locked */}
              {!subscriptionLoading && !canAnalyze && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 cursor-pointer">
                  <Lock className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="font-black text-sm text-gray-500">Upgrade to upload</span>
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="mt-3 border-2 border-black bg-black text-white px-4 py-1.5 font-black text-xs uppercase hover:bg-gray-800"
                  >
                    See Plans
                  </button>
                </div>
              )}
              {file ? (
                <div className="flex items-center justify-center gap-4">
                  <FileText className="w-8 h-8" />
                  <span className="font-bold">{file.name}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="p-1 border-2 border-black hover:bg-neo-red font-black text-xs"
                  >✕</button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <label className="neo-button cursor-pointer inline-block">
                    Browse Files
                    <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">PDF only · Max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={canAnalyze ? handleAnalyze : () => setShowUpgrade(true)}
            disabled={canAnalyze && (!selectedDomain || !file || analyzing || (selectedDomain === 'other' && !customDomain.trim()))}
            className={'w-full flex items-center justify-center gap-2 py-4 border-3 border-black font-black text-sm uppercase tracking-wider transition-all ' +
              (!canAnalyze
                ? 'bg-gray-200 text-gray-500 cursor-pointer hover:bg-neo-yellow hover:text-black'
                : 'neo-button disabled:opacity-50 disabled:cursor-not-allowed')}
            style={{ border: '3px solid black' }}
          >
            {analyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Analyzing…</>
            ) : !canAnalyze ? (
              <><Lock className="w-5 h-5" />Upgrade to Analyze</>
            ) : (
              <><Target className="w-5 h-5" />ANALYZE RESUME</>
            )}
          </button>
        </div>

        {/* All features grid */}
        <div>
          <h2 className="font-space text-xl font-extrabold mb-4 uppercase">All Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/jd-match',       action: 'jd_match',           label: 'JD Match',       icon: '🎯', color: '#BFDBFE' },
              { to: '/cover-letter',   action: 'cover_letter',        label: 'Cover Letter',   icon: '✉️',  color: '#BBF7D0' },
              { to: '/rewrite',        action: 'resume_rewrite',      label: 'Resume Rewrite', icon: '✏️',  color: '#FDE68A' },
              { to: '/cold-outreach',  action: 'mail_gen',            label: 'Cold Email',     icon: '📧', color: '#FED7AA' },
              { to: '/mock-interview', action: 'interview_questions', label: 'Mock Interview', icon: '🧠', color: '#E9D5FF' },
              { to: '/chat',           action: 'chat',                label: 'AI Chat',        icon: '💬', color: '#BAE6FD' },
            ].map(({ to, action, label, icon, color }) => {
              const available = subscriptionLoading ? true : isFeatureAvailable(action);
              const info      = getUsageInfo(action);
              return (
                <Link
                  key={to}
                  to={to}
                  className="border-3 border-black p-4 flex flex-col gap-2 hover:-translate-y-0.5 transition-all relative group"
                  style={{
                    border: '3px solid black',
                    backgroundColor: available ? color : '#F3F4F6',
                    boxShadow: '4px 4px 0 #000',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{icon}</span>
                    {subscriptionLoading && (
                      <span className="w-6 h-3 bg-black/10 rounded animate-pulse" />
                    )}
                    {!subscriptionLoading && !available && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                    {!subscriptionLoading && available && info.limit === null && (
                      <span className="text-[10px] font-black text-green-600">∞</span>
                    )}
                    {!subscriptionLoading && available && info.limit !== null && info.limit > 0 && (
                      <span className="text-[10px] font-black bg-black/10 px-1.5 py-0.5 border border-black/20">
                        {info.used}/{info.limit}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-sm">{label}</span>
                  {!subscriptionLoading && !available && (
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Upgrade Required</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Usage This Month */}
        {subscriptionData && (
          <div className="neo-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-space text-lg font-extrabold uppercase">Usage This Month</h2>
              <span
                className="text-xs font-black px-3 py-1 border-2 border-black uppercase"
                style={{ backgroundColor: planBadgeColor }}
              >
                {planIcon} {plan}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              {[
                { key: 'resume_analysis', label: 'Analyses'      },
                { key: 'jd_match',        label: 'JD Matches'    },
                { key: 'cover_letter',    label: 'Cover Letters' },
                { key: 'mail_gen',        label: 'Cold Emails'   },
                { key: 'resume_rewrite',  label: 'Rewrites'      },
                { key: 'chat',            label: 'AI Chat'       },
              ].map(({ key, label }) => {
                const info = getUsageInfo(key);
                return (
                  <UsageBar
                    key={key}
                    used={info.used}
                    limit={info.limit}
                    label={label}
                    loading={subscriptionLoading}
                  />
                );
              })}
            </div>
            {plan === 'free' && (
              <button
                onClick={() => setShowUpgrade(true)}
                className="mt-5 w-full py-2.5 border-2 border-black bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition"
              >
                ✨ Upgrade for More
              </button>
            )}
          </div>
        )}

        {/* Analysis history */}
        <div className="neo-card p-8">
          <h2 className="font-space text-2xl font-extrabold mb-6">ANALYSIS HISTORY</h2>
          {loading ? (
            <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-bold mb-2">No analyses yet</p>
              <p className="text-gray-500 font-semibold">Upload your resume above to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-3 border-black p-4 bg-white hover:bg-neo-offwhite transition-colors"
                  style={{ border: '3px solid black' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={'w-14 h-14 flex items-center justify-center text-xl font-black border-3 border-black ' + getScoreColor(item.score)}
                      style={{ border: '3px solid black' }}
                    >
                      {item.score || '—'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{item.fileName}</h3>
                      <p className="text-xs text-gray-500 font-semibold">
                        {getDomainName(item.targetDomain)} · {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={'/analysis/' + (item.analysisId?._id || item.analysisId)} className="neo-button-blue px-3 py-1.5 text-xs">View</Link>
                    <button onClick={() => handleDelete(item._id)} className="p-2 border-2 border-black hover:bg-neo-red transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {showUpgrade && (
        <UpgradeModal
          isOpen
          onClose={() => setShowUpgrade(false)}
          triggerAction="resume_analysis"
          errorType={!canAnalyze ? (analysisInfo.limit === 0 ? 'FEATURE_LOCKED' : 'LIMIT_REACHED') : null}
        />
      )}
    </div>
  );
};