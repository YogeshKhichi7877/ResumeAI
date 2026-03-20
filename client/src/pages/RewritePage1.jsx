
// // import { useState, useRef } from 'react';
// // import { Link } from 'react-router-dom';
// // import { resumeAPI } from '../services/api';
// // import toast from 'react-hot-toast';
// // import {
// //   ArrowLeft, Loader2, FileText, Send, Download, Copy, Check,
// //   Upload, RefreshCw, Home, ChevronDown, ChevronUp, AlertTriangle,
// //   TrendingUp, Target, Zap, BookOpen, Eye, Star, X,
// //   ArrowRight, Shield, List, BarChart2, Award
// // } from 'lucide-react';

// // // ─── Neobrutalism shared primitives ──────────────────────────────

// // const ScoreChip = ({ score, label, size = 'md' }) => {
// //   const s = Number(score);
// //   // Never render a red "0" chip for missing data
// //   if (!s && s !== 0) return label ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div><div style={{ fontWeight: 800, fontSize: 14, color: '#888' }}>—</div></div> : null;
// //   if (s === 0) return label ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div><div style={{ fontWeight: 800, fontSize: 14, color: '#888' }}>—</div></div> : null;
// //   const bg  = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
// //   const fz  = size === 'lg' ? 40 : size === 'md' ? 26 : 16;
// //   const pad = size === 'lg' ? '14px 22px' : size === 'md' ? '10px 16px' : '5px 10px';
// //   return (
// //     <div style={{ textAlign: 'center' }}>
// //       <div style={{
// //         background: bg, border: '3px solid #000',
// //         boxShadow: '4px 4px 0 #000', padding: pad,
// //         fontWeight: 900, fontSize: fz, color: '#000',
// //         display: 'inline-block', lineHeight: 1,
// //       }}>
// //         {s}
// //       </div>
// //       {label && (
// //         <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4,
// //                       textTransform: 'uppercase', color: '#555' }}>
// //           {label}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const GainChip = ({ gain }) => {
// //   const g   = Number(gain) || 0;
// //   const bg  = g > 0 ? '#A8FF78' : g < 0 ? '#FF6B6B' : '#F5F0E8';
// //   return (
// //     <span style={{
// //       background: bg, border: '2px solid #000',
// //       padding: '2px 10px', fontWeight: 800, fontSize: 13,
// //       display: 'inline-block',
// //     }}>
// //       {g > 0 ? `+${g}` : g}
// //     </span>
// //   );
// // };

// // const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
// //   <span style={{
// //     background: bg, border: '2px solid #000',
// //     padding: small ? '2px 8px' : '4px 12px',
// //     fontSize: small ? 11 : 12, fontWeight: 700,
// //     display: 'inline-block',
// //   }}>
// //     {text}
// //   </span>
// // );

// // const VerdictBadge = ({ verdict }) => {
// //   const map = {
// //     'READY TO SUBMIT':                   { bg: '#A8FF78', icon: '✅' },
// //     'SUBMIT AFTER FILLING PLACEHOLDERS': { bg: '#FFE566', icon: '📝' },
// //     'NEEDS CANDIDATE ADDITIONS':         { bg: '#FFA07A', icon: '⚠️' },
// //     'SIGNIFICANT GAPS REMAIN':           { bg: '#FF6B6B', icon: '❌' },
// //   };
// //   const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
// //   return (
// //     <span style={{
// //       background: cfg.bg, border: '3px solid #000',
// //       boxShadow: '4px 4px 0 #000', padding: '10px 20px',
// //       fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
// //       display: 'inline-flex', alignItems: 'center', gap: 8,
// //     }}>
// //       {cfg.icon} {verdict}
// //     </span>
// //   );
// // };

// // const CopyButton = ({ text, label = 'Copy' }) => {
// //   const [copied, setCopied] = useState(false);
// //   return (
// //     <button
// //       onClick={() => {
// //         navigator.clipboard.writeText(text);
// //         setCopied(true);
// //         setTimeout(() => setCopied(false), 2000);
// //       }}
// //       style={{
// //         background: copied ? '#A8FF78' : '#fff',
// //         border: '2px solid #000', padding: '6px 14px',
// //         fontWeight: 700, fontSize: 12, cursor: 'pointer',
// //         display: 'inline-flex', alignItems: 'center', gap: 6,
// //         boxShadow: '2px 2px 0 #000',
// //       }}
// //     >
// //       {copied ? <Check size={13} /> : <Copy size={13} />}
// //       {copied ? 'Copied!' : label}
// //     </button>
// //   );
// // };

// // // Collapsible accordion section
// // const Accordion = ({ title, icon: Icon, bg = '#F5F0E8', defaultOpen = false,
// //                      badge, children }) => {
// //   const [open, setOpen] = useState(defaultOpen);
// //   return (
// //     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
// //                   marginBottom: 20 }}>
// //       <button
// //         onClick={() => setOpen(o => !o)}
// //         style={{
// //           width: '100%', background: bg,
// //           border: 'none', borderBottom: open ? '3px solid #000' : 'none',
// //           padding: '14px 20px',
// //           display: 'flex', alignItems: 'center',
// //           justifyContent: 'space-between',
// //           cursor: 'pointer', fontWeight: 900,
// //           fontSize: 14, textTransform: 'uppercase',
// //         }}
// //       >
// //         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //           {Icon && <Icon size={18} />}
// //           {title}
// //           {badge !== undefined && (
// //             <span style={{
// //               background: '#000', color: '#FFE566',
// //               padding: '1px 8px', fontSize: 12, fontWeight: 900,
// //               borderRadius: 0,
// //             }}>
// //               {badge}
// //             </span>
// //           )}
// //         </span>
// //         {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
// //       </button>
// //       {open && (
// //         <div style={{ background: '#fff', padding: 20 }}>
// //           {children}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // ─── Strength bar (1–10) ─────────────────────────────────────────
// // const StrengthBar = ({ value }) => {
// //   const v   = Math.min(Math.max(Number(value) || 0, 0), 10);
// //   const pct = (v / 10) * 100;
// //   const bg  = v >= 8 ? '#A8FF78' : v >= 5 ? '#FFE566' : '#FF6B6B';
// //   return (
// //     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //       <div style={{
// //         flex: 1, height: 10, background: '#F5F0E8',
// //         border: '2px solid #000',
// //       }}>
// //         <div style={{
// //           width: `${pct}%`, height: '100%', background: bg,
// //           transition: 'width 0.4s',
// //         }} />
// //       </div>
// //       <span style={{ fontWeight: 800, fontSize: 12, minWidth: 28 }}>
// //         {v}/10
// //       </span>
// //     </div>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════════
// // // MAIN PAGE
// // // ═══════════════════════════════════════════════════════════════════
// // export const RewritePage = () => {
// //   const [loading,    setLoading]    = useState(false);
// //   const [result,     setResult]     = useState(null);   // full parsed object
// //   const [file,       setFile]       = useState(null);
// //   const [tone,       setTone]       = useState('Professional');
// //   const [targetRole, setTargetRole] = useState('');
// //   const [jobDesc,    setJobDesc]    = useState('');
// //   const resultRef = useRef(null);

// //   const TONES = [
// //     'Professional', 'Executive', 'Creative', 'Technical', 'Modern',
// //   ];

// //   // ── File handling ────────────────────────────────────────────────
// //   const handleFile = (f) => {
// //     if (!f) return;
// //     if (f.type !== 'application/pdf') { toast.error('PDF only'); return; }
// //     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');  return; }
// //     setFile(f);
// //   };

// //   // ── Submit ───────────────────────────────────────────────────────
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!file)              { toast.error('Upload a resume PDF');  return; }
// //     if (!targetRole.trim()) { toast.error('Enter the target role'); return; }

// //     setLoading(true);
// //     setResult(null);

// //     try {
// //       const fd = new FormData();
// //       fd.append('file', file);
// //       fd.append('targetRole', targetRole);
// //       fd.append('tone', tone);
// //       fd.append('jobDescription', jobDesc);

// //       const response = await resumeAPI.rewriteWithUpload(fd);

// //       // ── Normalize — handles nested (rewrittenResume.content) and flat (content) ──
// //       const data = response.data;
// //       const raw  = data?.parsed
// //         || (() => { try { return JSON.parse(data?.result); } catch { return null; } })()
// //         || data || {};

// //       const finalResult = {
// //         rewrittenResume: {
// //           content:                   raw?.rewrittenResume?.content  || raw?.content  || '',
// //           wordCount:                 raw?.rewrittenResume?.wordCount || raw?.wordCount || 0,
// //           sectionCount:              raw?.rewrittenResume?.sectionCount              || 0,
// //           estimatedAtsScore:         raw?.rewrittenResume?.estimatedAtsScore         || raw?.estimatedAtsScore         || null,
// //           estimatedReadabilityScore: raw?.rewrittenResume?.estimatedReadabilityScore || raw?.estimatedReadabilityScore || null,
// //         },
// //         summaryRewrite:        raw?.summaryRewrite        || {},
// //         bulletTransformations: raw?.bulletTransformations || [],
// //         skillsSectionRewrite:  raw?.skillsSectionRewrite  || { skillsAdded: [], skillsRemoved: [], rewritten: {} },
// //         keywordsAdded:         raw?.keywordsAdded         || [],
// //         keywordOptimization:   raw?.keywordOptimization   || { jdKeywordsAdded: [], jdKeywordsMissing: [], totalKeywordCoverage: 'N/A', atsPrediction: 'N/A' },
// //         sectionsAnalysis:      raw?.sectionsAnalysis      || { sectionsKept: [], sectionsAdded: [], sectionsRemoved: [], sectionsReordered: [] },
// //         scamFlagsAddressed:    raw?.scamFlagsAddressed    || [],
// //         metricsAdded:          raw?.metricsAdded          || [],
// //         actionVerbsReplaced:   raw?.actionVerbsReplaced   || [],
// //         beforeAfterScores:     raw?.beforeAfterScores     || {},
// //         improvements:          raw?.improvements          || [],
// //         metricsAddedList:      raw?.metricsAddedList      || [],
// //         actionVerbsUsed:       raw?.actionVerbsUsed       || [],
// //         remainingGaps:         raw?.remainingGaps         || [],
// //         placeholderGuide:      raw?.placeholderGuide      || [],
// //         overview:              raw?.overview              || {},
// //       };

// //       if (!finalResult.rewrittenResume.content) {
// //         throw new Error('Empty rewrite received — please retry.');
// //       }

// //       setResult(finalResult);
// //       toast.success('Resume rewritten successfully!');
// //       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

// //     } catch (err) {
// //       console.error(err);
// //       toast.error(err?.response?.data?.message || err.message || 'Rewrite failed');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const downloadResume = () => {
// //     const content = result?.rewrittenResume?.content;
// //     if (!content) return;
// //     const blob = new Blob([content], { type: 'text/markdown' });
// //     const url  = URL.createObjectURL(blob);
// //     const a    = document.createElement('a');
// //     a.href     = url;
// //     a.download = 'rewritten-resume.md';
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     URL.revokeObjectURL(url);
// //   };

// //   // ── Shortcuts ────────────────────────────────────────────────────
// //   const rr      = result?.rewrittenResume       || {};
// //   const summary = result?.summaryRewrite         || {};
// //   const bullets = result?.bulletTransformations  || [];
// //   const skills  = result?.skillsSectionRewrite   || {};
// //   const kwOpt   = result?.keywordOptimization    || {};
// //   const secAn   = result?.sectionsAnalysis       || {};
// //   const scam    = result?.scamFlagsAddressed     || [];
// //   const metrics = result?.metricsAdded           || [];
// //   const verbs   = result?.actionVerbsReplaced    || [];
// //   const bas     = result?.beforeAfterScores      || {};
// //   const gaps    = result?.remainingGaps          || [];
// //   const guide   = result?.placeholderGuide       || [];
// //   const ov      = result?.overview               || {};
// //   const imps    = result?.improvements           || [];
// //   const kwAdded = result?.keywordsAdded          || [];
// //   const verbsUsed = result?.actionVerbsUsed      || [];

// //   // ══════════════════════════════════════════════════════════════
// //   return (
// //     <div className="min-h-screen bg-neo-offwhite">

// //       {/* ── NAVBAR ── */}
// //       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
// //           <Link to="/dashboard"
// //             className="flex items-center gap-2 font-bold hover:text-neo-blue transition-colors">
// //             <ArrowLeft size={18} /> Back
// //           </Link>
// //           <div className="flex items-center gap-2">
// //             <div className="w-10 h-10 bg-neo-yellow border-3 border-black
// //                             flex items-center justify-center">
// //               <span className="font-space font-extrabold text-lg">R</span>
// //             </div>
// //             <span className="font-space font-extrabold text-xl">RESUME AI</span>
// //           </div>
// //           <Link to="/" className="flex items-center gap-1 font-bold hover:text-neo-blue">
// //             <Home size={16} />
// //             <span className="hidden sm:inline">Home</span>
// //           </Link>
// //         </div>
// //       </nav>

// //       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

// //         {/* ── FORM CARD ── */}
// //         <div style={{ background: '#fff', border: '3px solid #000',
// //                       boxShadow: '7px 7px 0 #000', padding: 32 }}>

// //           {/* Header */}
// //           <div className="flex items-center gap-4 mb-8">
// //             <div style={{ width: 64, height: 64, background: '#DDA0DD',
// //                           border: '3px solid #000',
// //                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //               <RefreshCw size={28} />
// //             </div>
// //             <div>
// //               <h1 className="font-space text-3xl font-extrabold">RESUME REWRITER</h1>
// //               <p style={{ color: '#666', fontWeight: 600 }}>
// //                 XYZ formula · ATS-optimized · Keyword-injected
// //               </p>
// //             </div>
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-6">

// //             {/* PDF Upload */}
// //             <div>
// //               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
// //                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
// //               </label>
// //               <div
// //                 onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
// //                 onDragOver={e => e.preventDefault()}
// //                 style={{
// //                   border: '3px dashed #000',
// //                   background: file ? '#A8FF78' : '#F5F0E8',
// //                   padding: 28, textAlign: 'center',
// //                   transition: 'background 0.2s',
// //                 }}
// //               >
// //                 {file ? (
// //                   <div className="flex items-center justify-center gap-4">
// //                     <FileText size={26} />
// //                     <span style={{ fontWeight: 800 }}>{file.name}</span>
// //                     <span style={{ color: '#555', fontSize: 12 }}>
// //                       ({(file.size / 1024).toFixed(0)} KB)
// //                     </span>
// //                     <button
// //                       type="button" onClick={() => setFile(null)}
// //                       style={{ background: '#FF6B6B', border: '2px solid #000',
// //                                padding: '2px 8px', cursor: 'pointer', fontWeight: 900 }}>
// //                       <X size={14} />
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <Upload size={36} style={{ margin: '0 auto 12px',
// //                                                display: 'block', opacity: 0.4 }} />
// //                     <label style={{ cursor: 'pointer' }}>
// //                       <span style={{
// //                         background: '#FFE566', border: '3px solid #000',
// //                         boxShadow: '3px 3px 0 #000', padding: '10px 24px',
// //                         fontWeight: 800, display: 'inline-block',
// //                       }}>
// //                         Browse or Drop PDF
// //                       </span>
// //                       <input type="file" accept=".pdf" className="hidden"
// //                              onChange={e => handleFile(e.target.files[0])} />
// //                     </label>
// //                     <p style={{ marginTop: 10, fontSize: 12, color: '#888',
// //                                 fontWeight: 600 }}>
// //                       PDF only · Max 5MB
// //                     </p>
// //                   </>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Target Role */}
// //             <div>
// //               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
// //                 Target Role <span style={{ color: '#FF6B6B' }}>*</span>
// //               </label>
// //               <input
// //                 type="text" value={targetRole}
// //                 onChange={e => setTargetRole(e.target.value)}
// //                 placeholder="e.g. Senior Software Engineer, Data Scientist..."
// //                 style={{ width: '100%', border: '3px solid #000',
// //                          padding: '12px 16px', fontWeight: 700,
// //                          fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
// //               />
// //             </div>

// //             {/* Job Description */}
// //             <div>
// //               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
// //                 Job Description
// //                 <span style={{ fontWeight: 500, fontSize: 12,
// //                                marginLeft: 8, color: '#555' }}>
// //                   (Paste for ATS keyword injection)
// //                 </span>
// //               </label>
// //               <textarea
// //                 value={jobDesc}
// //                 onChange={e => setJobDesc(e.target.value)}
// //                 placeholder="Paste the job description to inject exact keywords..."
// //                 rows={4}
// //                 style={{ width: '100%', border: '3px solid #000',
// //                          padding: '12px 16px', fontWeight: 600,
// //                          fontSize: 14, outline: 'none', resize: 'vertical',
// //                          boxSizing: 'border-box', fontFamily: 'inherit' }}
// //               />
// //             </div>

// //             {/* Tone */}
// //             <div>
// //               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
// //                 Resume Tone
// //               </label>
// //               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
// //                 {TONES.map(t => (
// //                   <button key={t} type="button" onClick={() => setTone(t)}
// //                     style={{
// //                       background: tone === t ? '#FFE566' : '#fff',
// //                       border: '3px solid #000', fontWeight: 800,
// //                       padding: '8px 18px', cursor: 'pointer', fontSize: 13,
// //                       boxShadow: tone === t ? '2px 2px 0 #000' : '4px 4px 0 #000',
// //                       transform: tone === t ? 'translate(2px,2px)' : 'none',
// //                       transition: 'all 0.1s',
// //                     }}>
// //                     {t}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Submit */}
// //             <button type="submit" disabled={loading || !file}
// //               style={{
// //                 width: '100%',
// //                 background: loading || !file ? '#ccc' : '#000',
// //                 color: '#fff', border: '3px solid #000',
// //                 boxShadow: loading || !file ? 'none' : '5px 5px 0 #DDA0DD',
// //                 padding: 16, fontWeight: 900, fontSize: 16,
// //                 cursor: loading || !file ? 'not-allowed' : 'pointer',
// //                 textTransform: 'uppercase', letterSpacing: 1,
// //                 display: 'flex', alignItems: 'center',
// //                 justifyContent: 'center', gap: 10,
// //               }}>
// //               {loading
// //                 ? <><Loader2 size={20} className="animate-spin" /> Rewriting your resume...</>
// //                 : <><Send size={20} /> Rewrite Resume</>}
// //             </button>
// //           </form>
// //         </div>

// //         {/* ════════════════════════════════════════════════════════
// //             RESULTS
// //         ════════════════════════════════════════════════════════ */}
// //         {result && (
// //           <div ref={resultRef} className="space-y-6">

// //             {/* ── OVERVIEW BANNER ── */}
// //             <div style={{ background: '#000', color: '#fff',
// //                           border: '3px solid #000', boxShadow: '7px 7px 0 #DDA0DD',
// //                           padding: '24px 28px' }}>

// //               {/* Verdict + Quality */}
// //               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16,
// //                             alignItems: 'flex-start', marginBottom: 20,
// //                             justifyContent: 'space-between' }}>
// //                 <div>
// //                   <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700,
// //                                 textTransform: 'uppercase', marginBottom: 8 }}>
// //                     Rewrite Verdict
// //                   </div>
// //                   <VerdictBadge verdict={ov.finalVerdict || 'NEEDS CANDIDATE ADDITIONS'} />
// //                   <div style={{ marginTop: 8, fontSize: 13, color: '#bbb',
// //                                 fontWeight: 600, maxWidth: 420 }}>
// //                     {ov.finalVerdictReason}
// //                   </div>
// //                 </div>
// //                 <div style={{ textAlign: 'center' }}>
// //                   <ScoreChip score={ov.rewriteQualityScore || 0} size="lg" />
// //                   <div style={{ fontSize: 11, color: '#aaa', marginTop: 4,
// //                                 fontWeight: 700 }}>
// //                     Rewrite Quality
// //                   </div>
// //                   <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
// //                     {ov.rewriteQuality}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Stats grid */}
// //               <div style={{ display: 'grid',
// //                             gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
// //                             gap: 14, marginBottom: 16 }}>
// //                 {[
// //                   { label: 'Bullets Rewritten',    value: ov.totalBulletsRewritten },
// //                   { label: 'Keywords Added',        value: ov.totalKeywordsAdded },
// //                   { label: 'Metrics Injected',      value: ov.totalMetricsAdded },
// //                   { label: 'Banned Phrases Fixed',  value: ov.totalBannedPhrasesRemoved },
// //                   { label: 'ATS Pass Rate',         value: ov.atsPassPercent },
// //                   { label: 'Readiness',             value: ov.readinessLevel },
// //                 ].map(item => (
// //                   <div key={item.label} style={{
// //                     background: '#1a1a1a', border: '1px solid #333',
// //                     padding: '10px 14px',
// //                   }}>
// //                     <div style={{ fontSize: 10, color: '#888',
// //                                   textTransform: 'uppercase', fontWeight: 700 }}>
// //                       {item.label}
// //                     </div>
// //                     <div style={{ fontWeight: 900, fontSize: 18,
// //                                   color: '#FFE566', marginTop: 2 }}>
// //                       {item.value ?? '—'}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Hiring manager reaction */}
// //               {ov.hiringManagerReaction && (
// //                 <div style={{
// //                   background: '#1a1a1a', border: '2px solid #444',
// //                   padding: '10px 16px', fontSize: 13,
// //                   fontStyle: 'italic', color: '#ccc',
// //                 }}>
// //                   <span style={{ fontStyle: 'normal', fontWeight: 800,
// //                                  color: '#FFE566', marginRight: 8 }}>
// //                     Hiring Manager:
// //                   </span>
// //                   "{ov.hiringManagerReaction}"
// //                 </div>
// //               )}
// //             </div>

// //             {/* ── BEFORE / AFTER SCORES ── */}
// //             {bas.before && bas.after && (
// //               <div style={{ border: '3px solid #000',
// //                             boxShadow: '5px 5px 0 #000' }}>
// //                 <div style={{ background: '#74B9FF', border: 'none',
// //                               borderBottom: '3px solid #000',
// //                               padding: '12px 20px', fontWeight: 900,
// //                               fontSize: 14, textTransform: 'uppercase',
// //                               display: 'flex', alignItems: 'center', gap: 8 }}>
// //                   <BarChart2 size={18} /> Before → After Score Comparison
// //                 </div>
// //                 <div style={{ background: '#fff', padding: 20 }}>
// //                   <div style={{ display: 'grid',
// //                                 gridTemplateColumns: '1fr auto 1fr', gap: 16,
// //                                 alignItems: 'center', marginBottom: 20 }}>
// //                     {/* Before */}
// //                     <div style={{ border: '2px solid #000', padding: 16,
// //                                   background: '#FFF0F0' }}>
// //                       <div style={{ fontWeight: 800, fontSize: 12,
// //                                     textTransform: 'uppercase',
// //                                     marginBottom: 12, color: '#c00' }}>
// //                         Before
// //                       </div>
// //                       <div style={{ display: 'flex', gap: 12,
// //                                     justifyContent: 'center', marginBottom: 12 }}>
// //                         <ScoreChip score={bas.before.estimatedScore}   label="Score" />
// //                         <ScoreChip score={bas.before.estimatedAts}     label="ATS" />
// //                         <ScoreChip score={bas.before.estimatedReadability} label="Read" />
// //                       </div>
// //                       {bas.before.mainProblems?.map((p, i) => (
// //                         <div key={i} style={{ display: 'flex', gap: 6,
// //                                               fontSize: 12, fontWeight: 600,
// //                                               marginBottom: 4 }}>
// //                           <X size={13} style={{ color: '#c00', flexShrink: 0,
// //                                                 marginTop: 2 }} />
// //                           {p}
// //                         </div>
// //                       ))}
// //                     </div>

// //                     {/* Arrows */}
// //                     <div style={{ textAlign: 'center' }}>
// //                       <div style={{ fontWeight: 900, fontSize: 20 }}>→</div>
// //                       <div style={{ marginTop: 8, display: 'flex',
// //                                     flexDirection: 'column', gap: 4 }}>
// //                         <GainChip gain={bas.scoreGain} />
// //                         <GainChip gain={bas.atsGain} />
// //                         <GainChip gain={bas.readabilityGain} />
// //                       </div>
// //                     </div>

// //                     {/* After */}
// //                     <div style={{ border: '2px solid #000', padding: 16,
// //                                   background: '#F0FFF0' }}>
// //                       <div style={{ fontWeight: 800, fontSize: 12,
// //                                     textTransform: 'uppercase',
// //                                     marginBottom: 12, color: '#2a7a2a' }}>
// //                         After
// //                       </div>
// //                       <div style={{ display: 'flex', gap: 12,
// //                                     justifyContent: 'center', marginBottom: 12 }}>
// //                         <ScoreChip score={bas.after.estimatedScore}   label="Score" />
// //                         <ScoreChip score={bas.after.estimatedAts}     label="ATS" />
// //                         <ScoreChip score={bas.after.estimatedReadability} label="Read" />
// //                       </div>
// //                       {bas.after.mainImprovements?.map((p, i) => (
// //                         <div key={i} style={{ display: 'flex', gap: 6,
// //                                               fontSize: 12, fontWeight: 600,
// //                                               marginBottom: 4 }}>
// //                           <Check size={13} style={{ color: '#2a7a2a',
// //                                                      flexShrink: 0, marginTop: 2 }} />
// //                           {p}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* Top 3 wins + remaining */}
// //                   <div style={{ display: 'grid',
// //                                 gridTemplateColumns: '1fr 1fr', gap: 16 }}>
// //                     {ov.topThreeWins?.length > 0 && (
// //                       <div style={{ background: '#F0FFF0',
// //                                     border: '2px solid #000', padding: 14 }}>
// //                         <div style={{ fontWeight: 800, fontSize: 12,
// //                                       textTransform: 'uppercase', marginBottom: 8 }}>
// //                           Top Wins
// //                         </div>
// //                         {ov.topThreeWins.map((w, i) => (
// //                           <div key={i} style={{ display: 'flex', gap: 6,
// //                                                 fontSize: 12, fontWeight: 600,
// //                                                 marginBottom: 6 }}>
// //                             <Star size={13} style={{ color: '#B45309',
// //                                                       flexShrink: 0, marginTop: 2 }} />
// //                             {w}
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                     {ov.topThreeRemaining?.length > 0 && (
// //                       <div style={{ background: '#FFF8E1',
// //                                     border: '2px solid #000', padding: 14 }}>
// //                         <div style={{ fontWeight: 800, fontSize: 12,
// //                                       textTransform: 'uppercase', marginBottom: 8 }}>
// //                           Still Needed
// //                         </div>
// //                         {ov.topThreeRemaining.map((w, i) => (
// //                           <div key={i} style={{ display: 'flex', gap: 6,
// //                                                 fontSize: 12, fontWeight: 600,
// //                                                 marginBottom: 6 }}>
// //                             <AlertTriangle size={13}
// //                               style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
// //                             {w}
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             {/* ── REWRITTEN RESUME ── */}
// //             <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
// //               <div style={{ background: '#A8FF78', borderBottom: '3px solid #000',
// //                             padding: '14px 20px',
// //                             display: 'flex', alignItems: 'center',
// //                             justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //                   <FileText size={20} />
// //                   <span style={{ fontWeight: 900, fontSize: 15,
// //                                  textTransform: 'uppercase' }}>
// //                     Rewritten Resume
// //                   </span>
// //                   <div style={{ display: 'flex', gap: 8 }}>
// //                     {rr.wordCount && <Tag text={`${rr.wordCount} words`} small />}
// //                     {rr.sectionCount && <Tag text={`${rr.sectionCount} sections`} small />}
// //                     {rr.estimatedAtsScore && (
// //                       <Tag text={`ATS: ${rr.estimatedAtsScore}`}
// //                            bg={rr.estimatedAtsScore >= 80 ? '#A8FF78' : '#FFE566'} small />
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div style={{ display: 'flex', gap: 8 }}>
// //                   <CopyButton text={rr.content || ''} label="Copy Resume" />
// //                   <button onClick={downloadResume} style={{
// //                     background: '#000', color: '#fff',
// //                     border: '2px solid #000', padding: '6px 14px',
// //                     fontWeight: 700, fontSize: 12, cursor: 'pointer',
// //                     display: 'inline-flex', alignItems: 'center', gap: 6,
// //                     boxShadow: '2px 2px 0 #555',
// //                   }}>
// //                     <Download size={13} /> Download .md
// //                   </button>
// //                 </div>
// //               </div>
// //               <div style={{ background: '#fff', padding: 28 }}>
// //                 <div style={{
// //                   background: '#FAFAF8', border: '2px solid #ddd',
// //                   padding: '28px 32px', fontFamily: 'monospace',
// //                   lineHeight: 1.8, fontSize: 14,
// //                   maxHeight: 600, overflowY: 'auto',
// //                 }}>
// //                   {(rr.content || '').split('\n').map((line, i) => {
// //                     // Render markdown headers visually
// //                     if (line.startsWith('## ')) {
// //                       return (
// //                         <div key={i} style={{
// //                           fontWeight: 900, fontSize: 16, marginTop: 20,
// //                           marginBottom: 6, borderBottom: '2px solid #000',
// //                           paddingBottom: 4, fontFamily: 'sans-serif',
// //                         }}>
// //                           {line.replace('## ', '')}
// //                         </div>
// //                       );
// //                     }
// //                     if (line.startsWith('# ')) {
// //                       return (
// //                         <div key={i} style={{
// //                           fontWeight: 900, fontSize: 20, marginBottom: 8,
// //                           fontFamily: 'sans-serif',
// //                         }}>
// //                           {line.replace('# ', '')}
// //                         </div>
// //                       );
// //                     }
// //                     return (
// //                       <p key={i} style={{
// //                         margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
// //                         minHeight: line.trim() === '' ? 8 : 'auto',
// //                       }}>
// //                         {line}
// //                       </p>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* ── SUMMARY REWRITE ── */}
// //             {summary.original !== undefined && (
// //               <Accordion title="Summary Rewrite" icon={FileText}
// //                          bg="#FFE566" defaultOpen>
// //                 <div style={{ display: 'grid',
// //                               gridTemplateColumns: '1fr 1fr', gap: 16,
// //                               marginBottom: 14 }}>
// //                   <div style={{ border: '2px solid #000', padding: 14,
// //                                 background: '#FFF0F0' }}>
// //                     <div style={{ fontWeight: 800, fontSize: 11,
// //                                   textTransform: 'uppercase',
// //                                   marginBottom: 8, color: '#c00' }}>
// //                       Original
// //                     </div>
// //                     <p style={{ fontSize: 13, fontStyle: 'italic',
// //                                 lineHeight: 1.7, color: '#666' }}>
// //                       {summary.original || 'No summary detected'}
// //                     </p>
// //                   </div>
// //                   <div style={{ border: '2px solid #000', padding: 14,
// //                                 background: '#F0FFF0' }}>
// //                     <div style={{ fontWeight: 800, fontSize: 11,
// //                                   textTransform: 'uppercase',
// //                                   marginBottom: 8, color: '#2a7a2a' }}>
// //                       Rewritten
// //                     </div>
// //                     <p style={{ fontSize: 13, fontWeight: 600,
// //                                 lineHeight: 1.7 }}>
// //                       {summary.rewritten}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 {summary.whyBetter && (
// //                   <div style={{
// //                     background: '#E8F5E9', border: '2px solid #000',
// //                     padding: '10px 14px', borderLeft: '5px solid #000',
// //                     fontSize: 13, fontWeight: 600,
// //                   }}>
// //                     <span style={{ fontWeight: 800 }}>Why it's better: </span>
// //                     {summary.whyBetter}
// //                   </div>
// //                 )}
// //               </Accordion>
// //             )}

// //             {/* ── BULLET TRANSFORMATIONS ── */}
// //             {bullets.length > 0 && (
// //               <Accordion title="Bullet Transformations"
// //                          icon={Zap} bg="#FFA07A"
// //                          badge={bullets.length}>
// //                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
// //                             marginBottom: 16 }}>
// //                   Every bullet rewritten using the XYZ formula:
// //                 </p>
// //                 <div className="space-y-4">
// //                   {bullets.map((b, i) => (
// //                     <div key={i} style={{
// //                       border: '2px solid #000', padding: 16,
// //                       background: i % 2 === 0 ? '#FAFAFA' : '#fff',
// //                     }}>
// //                       {/* Header row */}
// //                       <div style={{ display: 'flex', flexWrap: 'wrap',
// //                                     gap: 6, marginBottom: 10 }}>
// //                         {b.section  && <Tag text={b.section}  bg="#E8F4FF" small />}
// //                         {b.company  && <Tag text={b.company}  bg="#FFF9E6" small />}
// //                         {b.formulaApplied && (
// //                           <Tag text={b.formulaApplied} bg="#A8FF78" small />
// //                         )}
// //                         {b.weaknessFixed && (
// //                           <Tag text={`Fixed: ${b.weaknessFixed}`} bg="#FFE0E0" small />
// //                         )}
// //                         {b.keywordInjected && (
// //                           <Tag text={`Keyword: ${b.keywordInjected}`} bg="#E8FFE8" small />
// //                         )}
// //                         {b.actionVerbUsed && (
// //                           <Tag text={b.actionVerbUsed} bg="#FFE566" small />
// //                         )}
// //                       </div>

// //                       {/* Before → After */}
// //                       <div style={{ display: 'grid',
// //                                     gridTemplateColumns: '1fr auto 1fr',
// //                                     gap: 10, alignItems: 'center',
// //                                     marginBottom: 10 }}>
// //                         <div style={{ background: '#FFF0F0',
// //                                       border: '1px solid #ddd', padding: 10 }}>
// //                           <div style={{ fontSize: 11, fontWeight: 800,
// //                                         color: '#c00', marginBottom: 4 }}>
// //                             ORIGINAL
// //                           </div>
// //                           <p style={{ fontSize: 13, lineHeight: 1.6,
// //                                       textDecoration: 'line-through',
// //                                       color: '#888' }}>
// //                             {b.original}
// //                           </p>
// //                         </div>
// //                         <ArrowRight size={18} />
// //                         <div style={{ background: '#F0FFF0',
// //                                       border: '1px solid #ddd', padding: 10 }}>
// //                           <div style={{ fontSize: 11, fontWeight: 800,
// //                                         color: '#2a7a2a', marginBottom: 4 }}>
// //                             REWRITTEN
// //                           </div>
// //                           <p style={{ fontSize: 13, fontWeight: 600,
// //                                       lineHeight: 1.6 }}>
// //                             {b.rewritten}
// //                           </p>
// //                         </div>
// //                       </div>

// //                       {/* Strength bar */}
// //                       {b.strengthImprovement !== undefined && (
// //                         <div style={{ display: 'flex', alignItems: 'center',
// //                                       gap: 10 }}>
// //                           <span style={{ fontSize: 11, fontWeight: 700,
// //                                          minWidth: 90 }}>
// //                             Strength gain:
// //                           </span>
// //                           <StrengthBar value={b.strengthImprovement} />
// //                           {b.metricAdded && (
// //                             <Tag text={`Metric: ${b.metricAdded}`}
// //                                  bg="#FFF9E6" small />
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </Accordion>
// //             )}

// //             {/* ── SKILLS SECTION REWRITE ── */}
// //             {(skills.skillsAdded?.length > 0
// //               || Object.keys(skills.rewritten || {}).length > 0) && (
// //               <Accordion title="Skills Section Rewrite"
// //                          icon={List} bg="#74B9FF">
// //                 {/* Categorized skills */}
// //                 {Object.entries(skills.rewritten || {}).map(([cat, list]) =>
// //                   Array.isArray(list) && list.length > 0 ? (
// //                     <div key={cat} style={{ marginBottom: 12 }}>
// //                       <div style={{ fontWeight: 800, fontSize: 12,
// //                                     textTransform: 'uppercase',
// //                                     marginBottom: 6, color: '#333' }}>
// //                         {cat}
// //                       </div>
// //                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
// //                         {list.map((s, i) => (
// //                           <Tag key={i} text={s} bg="#E8F4FF" small />
// //                         ))}
// //                       </div>
// //                     </div>
// //                   ) : null
// //                 )}

// //                 {/* Added / Removed */}
// //                 <div style={{ display: 'grid',
// //                               gridTemplateColumns: '1fr 1fr',
// //                               gap: 12, marginTop: 14 }}>
// //                   {skills.skillsAdded?.length > 0 && (
// //                     <div style={{ background: '#F0FFF0',
// //                                   border: '2px solid #000', padding: 12 }}>
// //                       <div style={{ fontWeight: 800, fontSize: 11,
// //                                     textTransform: 'uppercase', marginBottom: 8 }}>
// //                         Skills Added
// //                       </div>
// //                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
// //                         {skills.skillsAdded.map((s, i) => (
// //                           <Tag key={i} text={s} bg="#A8FF78" small />
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}
// //                   {skills.skillsRemoved?.length > 0 && (
// //                     <div style={{ background: '#FFF0F0',
// //                                   border: '2px solid #000', padding: 12 }}>
// //                       <div style={{ fontWeight: 800, fontSize: 11,
// //                                     textTransform: 'uppercase', marginBottom: 8 }}>
// //                         Skills Removed
// //                       </div>
// //                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
// //                         {skills.skillsRemoved.map((s, i) => (
// //                           <Tag key={i} text={s} bg="#FF6B6B" small />
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {skills.whyReordered && (
// //                   <div style={{
// //                     marginTop: 12, background: '#FFF9E6',
// //                     border: '2px solid #000', padding: '8px 14px',
// //                     fontSize: 12, fontWeight: 600,
// //                   }}>
// //                     <span style={{ fontWeight: 800 }}>Reorder reasoning: </span>
// //                     {skills.whyReordered}
// //                   </div>
// //                 )}
// //               </Accordion>
// //             )}

// //             {/* ── KEYWORD OPTIMIZATION ── */}
// //             {(kwOpt.jdKeywordsAdded?.length > 0
// //               || kwOpt.jdKeywordsMissing?.length > 0) && (
// //               <Accordion title="Keyword Optimization"
// //                          icon={Target} bg="#A8FF78">

// //                 {/* Coverage summary */}
// //                 <div style={{ display: 'flex', gap: 16,
// //                               flexWrap: 'wrap', marginBottom: 16 }}>
// //                   {kwOpt.totalKeywordCoverage && (
// //                     <div style={{ background: '#F0FFF0',
// //                                   border: '2px solid #000', padding: '10px 16px' }}>
// //                       <div style={{ fontSize: 11, fontWeight: 700,
// //                                     textTransform: 'uppercase' }}>
// //                         JD Coverage
// //                       </div>
// //                       <div style={{ fontWeight: 900, fontSize: 24 }}>
// //                         {kwOpt.totalKeywordCoverage}
// //                       </div>
// //                     </div>
// //                   )}
// //                   {kwOpt.atsPrediction && (
// //                     <div style={{ background: '#E8F4FF',
// //                                   border: '2px solid #000', padding: '10px 16px' }}>
// //                       <div style={{ fontSize: 11, fontWeight: 700,
// //                                     textTransform: 'uppercase' }}>
// //                         ATS Prediction
// //                       </div>
// //                       <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>
// //                         {kwOpt.atsPrediction}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Keywords added */}
// //                 {kwOpt.jdKeywordsAdded?.length > 0 && (
// //                   <div style={{ marginBottom: 14 }}>
// //                     <div style={{ fontWeight: 800, fontSize: 12,
// //                                   textTransform: 'uppercase', marginBottom: 8 }}>
// //                       Keywords Injected ({kwOpt.jdKeywordsAdded.length})
// //                     </div>
// //                     {kwOpt.jdKeywordsAdded.map((k, i) => (
// //                       <div key={i} style={{
// //                         border: '1px solid #ddd', padding: 10,
// //                         marginBottom: 6, background: '#F0FFF0',
// //                       }}>
// //                         <div style={{ display: 'flex', gap: 8,
// //                                       alignItems: 'center', marginBottom: 4 }}>
// //                           <Tag text={k.keyword}  bg="#A8FF78" small />
// //                           <Tag text={`→ ${k.addedTo}`} bg="#E8F4FF" small />
// //                         </div>
// //                         {k.inSentence && (
// //                           <p style={{ fontSize: 12, color: '#555',
// //                                       fontStyle: 'italic', margin: 0 }}>
// //                             "{k.inSentence}"
// //                           </p>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {/* Keywords still missing */}
// //                 {kwOpt.jdKeywordsMissing?.length > 0 && (
// //                   <div>
// //                     <div style={{ fontWeight: 800, fontSize: 12,
// //                                   textTransform: 'uppercase', marginBottom: 8,
// //                                   color: '#c00' }}>
// //                       Still Missing ({kwOpt.jdKeywordsMissing.length})
// //                     </div>
// //                     {kwOpt.jdKeywordsMissing.map((k, i) => (
// //                       <div key={i} style={{
// //                         border: '1px solid #ddd', padding: 10,
// //                         marginBottom: 6, background: '#FFF0F0',
// //                       }}>
// //                         <div style={{ display: 'flex', gap: 8,
// //                                       alignItems: 'center', marginBottom: 4 }}>
// //                           <Tag text={k.keyword} bg="#FF6B6B" small />
// //                         </div>
// //                         <div style={{ fontSize: 12, fontWeight: 600 }}>
// //                           {k.reason}
// //                         </div>
// //                         {k.suggestion && (
// //                           <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
// //                             → {k.suggestion}
// //                           </div>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Accordion>
// //             )}

// //             {/* ── ACTION VERBS REPLACED ── */}
// //             {verbs.length > 0 && (
// //               <Accordion title="Action Verbs Replaced"
// //                          icon={Zap} bg="#FFE566"
// //                          badge={verbs.length}>
// //                 <div style={{ display: 'grid',
// //                               gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))',
// //                               gap: 12 }}>
// //                   {verbs.map((v, i) => (
// //                     <div key={i} style={{
// //                       border: '2px solid #000', padding: 12, background: '#FAFAFA',
// //                     }}>
// //                       <div style={{ display: 'flex', gap: 8,
// //                                     alignItems: 'center', marginBottom: 6 }}>
// //                         <Tag text={v.verbUsed} bg="#FFE566" small />
// //                         {v.tier && <Tag text={v.tier} bg="#F5F0E8" small />}
// //                       </div>
// //                       <div style={{ fontSize: 12, color: '#888',
// //                                     textDecoration: 'line-through', marginBottom: 4 }}>
// //                         {v.original}
// //                       </div>
// //                       <div style={{ fontSize: 12, fontWeight: 700 }}>
// //                         {v.replaced}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 {verbsUsed.length > 0 && (
// //                   <div style={{ marginTop: 14 }}>
// //                     <div style={{ fontWeight: 800, fontSize: 12,
// //                                   textTransform: 'uppercase', marginBottom: 8 }}>
// //                       Full verb arsenal used:
// //                     </div>
// //                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
// //                       {verbsUsed.map((v, i) => (
// //                         <Tag key={i} text={v} bg="#FFE566" small />
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}
// //               </Accordion>
// //             )}

// //             {/* ── SECTIONS ANALYSIS ── */}
// //             {(secAn.sectionsAdded?.length > 0
// //               || secAn.sectionsRemoved?.length > 0
// //               || secAn.sectionsReordered?.length > 0) && (
// //               <Accordion title="Sections Analysis"
// //                          icon={BookOpen} bg="#DDA0DD">
// //                 {secAn.sectionsAdded?.length > 0 && (
// //                   <div style={{ marginBottom: 14 }}>
// //                     <div style={{ fontWeight: 800, fontSize: 12,
// //                                   textTransform: 'uppercase',
// //                                   marginBottom: 8 }}>
// //                       Sections Added
// //                     </div>
// //                     {secAn.sectionsAdded.map((s, i) => (
// //                       <div key={i} style={{ display: 'flex', gap: 8,
// //                                             marginBottom: 6, fontSize: 13 }}>
// //                         <Tag text={s.section} bg="#A8FF78" small />
// //                         <span style={{ fontWeight: 600, color: '#555' }}>
// //                           {s.reason}
// //                         </span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //                 {secAn.sectionsRemoved?.length > 0 && (
// //                   <div style={{ marginBottom: 14 }}>
// //                     <div style={{ fontWeight: 800, fontSize: 12,
// //                                   textTransform: 'uppercase',
// //                                   marginBottom: 8 }}>
// //                       Sections Removed
// //                     </div>
// //                     {secAn.sectionsRemoved.map((s, i) => (
// //                       <div key={i} style={{ display: 'flex', gap: 8,
// //                                             marginBottom: 6, fontSize: 13 }}>
// //                         <Tag text={s.section} bg="#FF6B6B" small />
// //                         <span style={{ fontWeight: 600, color: '#555' }}>
// //                           {s.reason}
// //                         </span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //                 {secAn.sectionsReordered?.length > 0 && (
// //                   <div>
// //                     <div style={{ fontWeight: 800, fontSize: 12,
// //                                   textTransform: 'uppercase',
// //                                   marginBottom: 8 }}>
// //                       Sections Reordered
// //                     </div>
// //                     {secAn.sectionsReordered.map((s, i) => (
// //                       <div key={i} style={{
// //                         border: '1px solid #ddd', padding: 10,
// //                         marginBottom: 6, fontSize: 12, fontWeight: 600,
// //                       }}>
// //                         <span style={{ fontWeight: 800 }}>{s.section}</span>
// //                         {' '}moved from position {s.movedFrom} → {s.movedTo}.{' '}
// //                         <span style={{ color: '#555' }}>{s.reason}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </Accordion>
// //             )}

// //             {/* ── METRICS ADDED ── */}
// //             {metrics.length > 0 && (
// //               <Accordion title="Metric Placeholders Added"
// //                          icon={TrendingUp} bg="#74B9FF"
// //                          badge={metrics.length}>
// //                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
// //                             marginBottom: 14 }}>
// //                   Fill these placeholders with real data before applying:
// //                 </p>
// //                 {metrics.map((m, i) => (
// //                   <div key={i} style={{
// //                     border: '2px solid #000', padding: 14,
// //                     marginBottom: 10, background: '#F8FBFF',
// //                   }}>
// //                     <div style={{ display: 'flex', gap: 8,
// //                                   marginBottom: 8, flexWrap: 'wrap' }}>
// //                       <Tag text={m.placeholder} bg="#FFE566" />
// //                       {m.section && <Tag text={m.section} bg="#E8F4FF" small />}
// //                     </div>
// //                     {m.bullet && (
// //                       <p style={{ fontSize: 12, fontStyle: 'italic',
// //                                   color: '#555', marginBottom: 6 }}>
// //                         In: "{m.bullet}"
// //                       </p>
// //                     )}
// //                     <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
// //                       Data needed: {m.dataNeeded}
// //                     </div>
// //                     <div style={{ fontSize: 12, color: '#666' }}>
// //                       How to find: {m.howToFill}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </Accordion>
// //             )}

// //             {/* ── PLACEHOLDER GUIDE ── */}
// //             {guide.length > 0 && (
// //               <Accordion title="Placeholder Fill Guide"
// //                          icon={BookOpen} bg="#FFE566"
// //                          badge={guide.length}>
// //                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
// //                             marginBottom: 14 }}>
// //                   Step-by-step instructions to fill every placeholder:
// //                 </p>
// //                 {guide.map((g, i) => (
// //                   <div key={i} style={{
// //                     border: '2px solid #000', padding: 14,
// //                     marginBottom: 10,
// //                     background: i % 2 === 0 ? '#FFFDF0' : '#fff',
// //                   }}>
// //                     <div style={{ display: 'flex', gap: 10,
// //                                   alignItems: 'flex-start', marginBottom: 8 }}>
// //                       <div style={{
// //                         background: '#000', color: '#FFE566',
// //                         fontWeight: 900, fontSize: 14,
// //                         minWidth: 28, height: 28,
// //                         display: 'flex', alignItems: 'center',
// //                         justifyContent: 'center', flexShrink: 0,
// //                       }}>
// //                         {i + 1}
// //                       </div>
// //                       <Tag text={g.placeholder} bg="#FFE566" />
// //                     </div>
// //                     <div style={{ fontSize: 12, color: '#555',
// //                                   marginBottom: 4, fontStyle: 'italic' }}>
// //                       Location: {g.location}
// //                     </div>
// //                     <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
// //                       What you need: {g.dataNeeded}
// //                     </div>
// //                     <div style={{
// //                       background: '#E8F5E9', border: '1px solid #000',
// //                       padding: '6px 10px', fontSize: 12, fontWeight: 600,
// //                       borderLeft: '4px solid #000',
// //                     }}>
// //                       How to find: {g.howToFind}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </Accordion>
// //             )}

// //             {/* ── SCAM FLAGS ── */}
// //             {scam.length > 0 && (
// //               <Accordion title="Scam Flags Addressed"
// //                          icon={Shield} bg="#FF6B6B"
// //                          badge={scam.length}>
// //                 {scam.map((s, i) => (
// //                   <div key={i} style={{
// //                     border: '2px solid #000', padding: 14,
// //                     marginBottom: 10, background: '#FFF0F0',
// //                   }}>
// //                     <div style={{ display: 'flex', gap: 8,
// //                                   marginBottom: 8 }}>
// //                       <Tag text={s.action} bg={
// //                         s.action === 'Removed' ? '#FF6B6B'
// //                         : s.action === 'Reframed' ? '#FFE566' : '#FFA07A'
// //                       } small />
// //                     </div>
// //                     <div style={{ fontSize: 12, marginBottom: 4 }}>
// //                       <span style={{ fontWeight: 800 }}>Original: </span>
// //                       <span style={{ textDecoration: 'line-through',
// //                                      color: '#888' }}>
// //                         {s.originalClaim}
// //                       </span>
// //                     </div>
// //                     {s.revisedVersion && (
// //                       <div style={{ fontSize: 12, fontWeight: 600,
// //                                     marginBottom: 4 }}>
// //                         <span style={{ fontWeight: 800 }}>Revised: </span>
// //                         {s.revisedVersion}
// //                       </div>
// //                     )}
// //                     <div style={{ fontSize: 12, color: '#666' }}>
// //                       {s.reason}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </Accordion>
// //             )}

// //             {/* ── REMAINING GAPS ── */}
// //             {gaps.length > 0 && (
// //               <Accordion title="Remaining Gaps (Honest Assessment)"
// //                          icon={AlertTriangle} bg="#FFA07A"
// //                          badge={gaps.length}>
// //                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
// //                             marginBottom: 14 }}>
// //                   These issues could not be fixed by rewriting alone.
// //                   You must take real-world action:
// //                 </p>
// //                 {gaps.map((g, i) => (
// //                   <div key={i} style={{
// //                     border: '2px solid #000', padding: 14,
// //                     marginBottom: 10, background: '#FFF8F0',
// //                   }}>
// //                     <div style={{ fontWeight: 800, fontSize: 13,
// //                                   marginBottom: 4 }}>
// //                       Gap: {g.gap}
// //                     </div>
// //                     <div style={{ fontSize: 12, color: '#666',
// //                                   marginBottom: 8 }}>
// //                       Why it couldn't be fixed: {g.why}
// //                     </div>
// //                     <div style={{
// //                       background: '#FFE566', border: '2px solid #000',
// //                       padding: '8px 12px', fontSize: 12, fontWeight: 700,
// //                     }}>
// //                       ➡️ Action needed: {g.candidateAction}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </Accordion>
// //             )}

// //             {/* ── IMPROVEMENTS SUMMARY ── */}
// //             {imps.length > 0 && (
// //               <Accordion title="All Improvements Made"
// //                          icon={Award} bg="#A8FF78">
// //                 {imps.map((imp, i) => (
// //                   <div key={i} style={{
// //                     display: 'flex', gap: 10,
// //                     marginBottom: 10, alignItems: 'flex-start',
// //                   }}>
// //                     <div style={{
// //                       background: '#000', color: '#FFE566',
// //                       fontWeight: 900, fontSize: 13,
// //                       minWidth: 26, height: 26,
// //                       display: 'flex', alignItems: 'center',
// //                       justifyContent: 'center', flexShrink: 0,
// //                     }}>
// //                       {i + 1}
// //                     </div>
// //                     <span style={{ fontSize: 13, fontWeight: 600 }}>
// //                       {imp}
// //                     </span>
// //                   </div>
// //                 ))}
// //               </Accordion>
// //             )}

// //             {/* ── WHAT STILL NEEDS WORK ── */}
// //             {ov.whatStillNeedsWork && (
// //               <div style={{
// //                 background: '#FFF8E1', border: '3px solid #000',
// //                 boxShadow: '4px 4px 0 #000', padding: '16px 20px',
// //               }}>
// //                 <div style={{ fontWeight: 900, fontSize: 13,
// //                               textTransform: 'uppercase', marginBottom: 6 }}>
// //                   ⚠️ What still needs work
// //                 </div>
// //                 <p style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>
// //                   {ov.whatStillNeedsWork}
// //                 </p>
// //               </div>
// //             )}

// //             {/* ── REGENERATE ── */}
// //             <div style={{ textAlign: 'center', paddingBottom: 32 }}>
// //               <button
// //                 onClick={() => {
// //                   setResult(null);
// //                   window.scrollTo({ top: 0, behavior: 'smooth' });
// //                 }}
// //                 style={{
// //                   background: '#fff', border: '3px solid #000',
// //                   boxShadow: '5px 5px 0 #000', padding: '12px 32px',
// //                   fontWeight: 800, cursor: 'pointer', fontSize: 14,
// //                   textTransform: 'uppercase',
// //                   display: 'inline-flex', alignItems: 'center', gap: 8,
// //                 }}
// //               >
// //                 <RefreshCw size={16} /> Rewrite Another Resume
// //               </button>
// //             </div>

// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // };

// // export default RewritePage;



































// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft, Loader2, FileText, Send, Download, Copy, Check,
//   Upload, RefreshCw, Home, ChevronDown, ChevronUp, AlertTriangle,
//   TrendingUp, Target, Zap, BookOpen, Eye, Star, X,
//   ArrowRight, Shield, List, BarChart2, Award
// } from 'lucide-react';

// // ─── ScoreChip — hides when score is 0/missing, never shows red 0 ──
// const ScoreChip = ({ score, label, size = 'md' }) => {
//   const s = Number(score);
//   if (!s) {
//     return label ? (
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div>
//         <div style={{ fontWeight: 800, fontSize: 18, color: '#888' }}>—</div>
//       </div>
//     ) : null;
//   }
//   const bg  = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
//   const fz  = size === 'lg' ? 40 : size === 'md' ? 26 : 16;
//   const pad = size === 'lg' ? '14px 22px' : size === 'md' ? '10px 16px' : '5px 10px';
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div style={{ background: bg, border: '3px solid #000', boxShadow: '4px 4px 0 #000',
//                     padding: pad, fontWeight: 900, fontSize: fz, color: '#000',
//                     display: 'inline-block', lineHeight: 1 }}>
//         {s}
//       </div>
//       {label && (
//         <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', color: '#555' }}>
//           {label}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── StatBox — renders number/string stats, shows "—" only when truly missing ──
// const StatBox = ({ label, value, accent = '#FFE566' }) => {
//   const display = (value !== undefined && value !== null && value !== '') ? value : null;
//   return (
//     <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '10px 14px' }}>
//       <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
//         {label}
//       </div>
//       <div style={{
//         fontWeight: 900,
//         fontSize: display === null ? 18 : typeof display === 'number' ? 24 : 14,
//         color: display === null ? '#555' : accent,
//         lineHeight: 1.3,
//       }}>
//         {display ?? '—'}
//       </div>
//     </div>
//   );
// };

// const GainChip = ({ gain }) => {
//   const g  = Number(gain) || 0;
//   const bg = g > 0 ? '#A8FF78' : g < 0 ? '#FF6B6B' : '#F5F0E8';
//   return (
//     <span style={{ background: bg, border: '2px solid #000', padding: '3px 12px',
//                    fontWeight: 800, fontSize: 14, display: 'inline-block' }}>
//       {g > 0 ? `+${g}` : g}
//     </span>
//   );
// };

// const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
//   <span style={{ background: bg, border: '2px solid #000',
//                  padding: small ? '2px 8px' : '4px 12px',
//                  fontSize: small ? 11 : 12, fontWeight: 700, display: 'inline-block' }}>
//     {text}
//   </span>
// );

// const VerdictBadge = ({ verdict }) => {
//   if (!verdict) return null;
//   const map = {
//     'READY TO SUBMIT':                   { bg: '#A8FF78', icon: '✅' },
//     'SUBMIT AFTER FILLING PLACEHOLDERS': { bg: '#FFE566', icon: '📝' },
//     'NEEDS CANDIDATE ADDITIONS':         { bg: '#FFA07A', icon: '⚠️' },
//     'SIGNIFICANT GAPS REMAIN':           { bg: '#FF6B6B', icon: '❌' },
//   };
//   const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
//   return (
//     <span style={{ background: cfg.bg, border: '3px solid #000', boxShadow: '4px 4px 0 #000',
//                    padding: '10px 20px', fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
//                    display: 'inline-flex', alignItems: 'center', gap: 8 }}>
//       {cfg.icon} {verdict}
//     </span>
//   );
// };

// const CopyButton = ({ text, label = 'Copy' }) => {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//       style={{ background: copied ? '#A8FF78' : '#fff', border: '2px solid #000', padding: '6px 14px',
//                fontWeight: 700, fontSize: 12, cursor: 'pointer',
//                display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #000' }}>
//       {copied ? <Check size={13} /> : <Copy size={13} />}
//       {copied ? 'Copied!' : label}
//     </button>
//   );
// };

// const Accordion = ({ title, icon: Icon, bg = '#F5F0E8', defaultOpen = false, badge, children }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', marginBottom: 20 }}>
//       <button onClick={() => setOpen(o => !o)}
//         style={{ width: '100%', background: bg, border: 'none',
//                  borderBottom: open ? '3px solid #000' : 'none', padding: '14px 20px',
//                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                  cursor: 'pointer', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
//         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           {Icon && <Icon size={18} />}
//           {title}
//           {badge != null && (
//             <span style={{ background: '#000', color: '#FFE566', padding: '1px 8px', fontSize: 12, fontWeight: 900 }}>
//               {badge}
//             </span>
//           )}
//         </span>
//         {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>
//       {open && <div style={{ background: '#fff', padding: 20 }}>{children}</div>}
//     </div>
//   );
// };

// const StrengthBar = ({ value }) => {
//   const v   = Math.min(Math.max(Number(value) || 0, 0), 10);
//   const pct = (v / 10) * 100;
//   const bg  = v >= 8 ? '#A8FF78' : v >= 5 ? '#FFE566' : '#FF6B6B';
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       <div style={{ flex: 1, height: 10, background: '#F5F0E8', border: '2px solid #000' }}>
//         <div style={{ width: `${pct}%`, height: '100%', background: bg, transition: 'width 0.4s' }} />
//       </div>
//       <span style={{ fontWeight: 800, fontSize: 12, minWidth: 28 }}>{v}/10</span>
//     </div>
//   );
// };

// // ─── Markdown-aware resume renderer ──────────────────────────────
// const ResumeContent = ({ content }) => (
//   <div style={{ background: '#FAFAF8', border: '2px solid #ddd', padding: '28px 32px',
//                 fontFamily: 'monospace', lineHeight: 1.8, fontSize: 14,
//                 maxHeight: 600, overflowY: 'auto' }}>
//     {(content || '').split('\n').map((line, i) => {
//       if (line.startsWith('## '))
//         return <div key={i} style={{ fontWeight: 900, fontSize: 16, marginTop: 20, marginBottom: 6,
//                                       borderBottom: '2px solid #000', paddingBottom: 4,
//                                       fontFamily: 'sans-serif' }}>{line.replace('## ', '')}</div>;
//       if (line.startsWith('# '))
//         return <div key={i} style={{ fontWeight: 900, fontSize: 22, marginBottom: 8,
//                                       fontFamily: 'sans-serif' }}>{line.replace('# ', '')}</div>;
//       if (line.startsWith('• ') || line.startsWith('- '))
//         return (
//           <div key={i} style={{ paddingLeft: 16, marginBottom: 3, fontSize: 13 }}>
//             <span style={{ marginRight: 6, fontWeight: 700 }}>•</span>
//             {line.replace(/^[•\-]\s/, '')}
//           </div>
//         );
//       return (
//         <p key={i} style={{ margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
//                              minHeight: line.trim() === '' ? 8 : 'auto' }}>
//           {line}
//         </p>
//       );
//     })}
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════
// export const RewritePage = () => {
//   const [loading,    setLoading]    = useState(false);
//   const [result,     setResult]     = useState(null);
//   const [file,       setFile]       = useState(null);
//   const [tone,       setTone]       = useState('Professional');
//   const [targetRole, setTargetRole] = useState('');
//   const [jobDesc,    setJobDesc]    = useState('');
//   const resultRef = useRef(null);

//   const TONES = ['Professional', 'Executive', 'Creative', 'Technical', 'Modern'];

//   const handleFile = (f) => {
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('PDF only'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');  return; }
//     setFile(f);
//   };

//   // ── Submit ───────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)              { toast.error('Upload a resume PDF');   return; }
//     if (!targetRole.trim()) { toast.error('Enter the target role'); return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       const fd = new FormData();
//       fd.append('file', file);
//       fd.append('targetRole', targetRole);
//       fd.append('tone', tone);
//       fd.append('jobDescription', jobDesc);

//       const response = await resumeAPI.rewriteWithUpload(fd);
//       const data = response.data;

//       // ── Bulletproof normalizer — handles every possible backend shape ──
//       // Shape A: { parsed: { rewrittenResume:{}, overview:{}, ... }, result:"...", modelUsed:"..." }
//       // Shape B: { result: "<JSON string>", modelUsed: "..." }  (no parsed key)
//       // Shape C: data IS the result object itself
//       let raw = null;
//       if (data?.parsed && typeof data.parsed === 'object') {
//         raw = data.parsed;                                    // Shape A
//       } else if (data?.result && typeof data.result === 'string') {
//         try { raw = JSON.parse(data.result); } catch { raw = null; }  // Shape B
//       }
//       if (!raw || typeof raw !== 'object') raw = data || {};  // Shape C

//       // Normalise into one consistent structure
//       const finalResult = {
//         rewrittenResume: {
//           content:                   raw?.rewrittenResume?.content  || raw?.content  || '',
//           wordCount:                 raw?.rewrittenResume?.wordCount || raw?.wordCount || 0,
//           sectionCount:              raw?.rewrittenResume?.sectionCount || 0,
//           estimatedAtsScore:         raw?.rewrittenResume?.estimatedAtsScore    || raw?.estimatedAtsScore    || null,
//           estimatedReadabilityScore: raw?.rewrittenResume?.estimatedReadabilityScore || raw?.estimatedReadabilityScore || null,
//         },
//         summaryRewrite:        raw?.summaryRewrite        || {},
//         bulletTransformations: raw?.bulletTransformations || [],
//         skillsSectionRewrite:  raw?.skillsSectionRewrite  || {},
//         keywordsAdded:         raw?.keywordsAdded         || [],
//         keywordOptimization:   raw?.keywordOptimization   || {},
//         sectionsAnalysis:      raw?.sectionsAnalysis      || {},
//         scamFlagsAddressed:    raw?.scamFlagsAddressed    || [],
//         metricsAdded:          raw?.metricsAdded          || [],
//         actionVerbsReplaced:   raw?.actionVerbsReplaced   || [],
//         beforeAfterScores:     raw?.beforeAfterScores     || {},
//         improvements:          raw?.improvements          || [],
//         metricsAddedList:      raw?.metricsAddedList      || [],
//         actionVerbsUsed:       raw?.actionVerbsUsed       || [],
//         remainingGaps:         raw?.remainingGaps         || [],
//         placeholderGuide:      raw?.placeholderGuide      || [],
//         overview:              raw?.overview              || {},
//       };

//       if (!finalResult.rewrittenResume.content) {
//         throw new Error('Empty rewrite received — please retry.');
//       }

//       setResult(finalResult);
//       toast.success('Resume rewritten successfully!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Rewrite failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadResume = () => {
//     const content = result?.rewrittenResume?.content;
//     if (!content) return;
//     const blob = new Blob([content], { type: 'text/markdown' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href = url; a.download = 'rewritten-resume.md';
//     document.body.appendChild(a); a.click();
//     document.body.removeChild(a); URL.revokeObjectURL(url);
//   };

//   // ── Shortcuts ────────────────────────────────────────────────────
//   const rr        = result?.rewrittenResume       || {};
//   const sumRw     = result?.summaryRewrite        || {};
//   const bullets   = result?.bulletTransformations || [];
//   const skills    = result?.skillsSectionRewrite  || {};
//   const kwOpt     = result?.keywordOptimization   || {};
//   const scam      = result?.scamFlagsAddressed    || [];
//   const metrics   = result?.metricsAdded          || [];
//   const verbs     = result?.actionVerbsReplaced   || [];
//   const bas       = result?.beforeAfterScores     || {};
//   const gaps      = result?.remainingGaps         || [];
//   const guide     = result?.placeholderGuide      || [];
//   const ov        = result?.overview              || {};
//   const imps      = result?.improvements          || [];
//   const kwAdded   = result?.keywordsAdded         || [];
//   const verbsUsed = result?.actionVerbsUsed       || [];

//   // FIX: backend sometimes uses g.action instead of g.candidateAction
//   const gapAction = (g) => g?.candidateAction || g?.action || '';

//   return (
//     <div className="min-h-screen bg-neo-offwhite">

//       {/* ── NAVBAR ── */}
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <Link to="/dashboard" className="flex items-center gap-2 font-bold hover:text-neo-blue">
//             <ArrowLeft size={18} /> Back
//           </Link>
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
//               <span className="font-space font-extrabold text-lg">R</span>
//             </div>
//             <span className="font-space font-extrabold text-xl">RESUME AI</span>
//           </div>
//           <Link to="/" className="flex items-center gap-1 font-bold hover:text-neo-blue">
//             <Home size={16} /><span className="hidden sm:inline">Home</span>
//           </Link>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

//         {/* ── FORM CARD ── */}
//         <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '7px 7px 0 #000', padding: 32 }}>
//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#DDA0DD', border: '3px solid #000',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <RefreshCw size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">RESUME REWRITER</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>XYZ formula · ATS-optimized · Keyword-injected</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* PDF Upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
//                 onDragOver={e => e.preventDefault()}
//                 style={{ border: '3px dashed #000', background: file ? '#A8FF78' : '#F5F0E8',
//                          padding: 28, textAlign: 'center', transition: 'background 0.2s' }}>
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={26} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ color: '#555', fontSize: 12 }}>({(file.size / 1024).toFixed(0)} KB)</span>
//                     <button type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000', padding: '2px 8px',
//                                cursor: 'pointer', fontWeight: 900 }}>
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
//                     <label style={{ cursor: 'pointer' }}>
//                       <span style={{ background: '#FFE566', border: '3px solid #000', boxShadow: '3px 3px 0 #000',
//                                      padding: '10px 24px', fontWeight: 800, display: 'inline-block' }}>
//                         Browse or Drop PDF
//                       </span>
//                       <input type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888', fontWeight: 600 }}>PDF only · Max 5MB</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Target Role */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Target Role <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
//                 placeholder="e.g. Senior Software Engineer, Data Scientist..."
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                          fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//             </div>

//             {/* Job Description */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Description
//                 <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8, color: '#555' }}>
//                   (Paste for targeted keyword injection)
//                 </span>
//               </label>
//               <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
//                 placeholder="Paste the job description here for better keyword matching..."
//                 rows={4}
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px', fontWeight: 600,
//                          fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
//                          fontFamily: 'inherit' }} />
//             </div>

//             {/* Tone */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Tone</label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                 {TONES.map(t => (
//                   <button key={t} type="button" onClick={() => setTone(t)}
//                     style={{ background: tone === t ? '#FFE566' : '#fff', border: '3px solid #000',
//                              fontWeight: 800, padding: '8px 18px', cursor: 'pointer', fontSize: 13,
//                              boxShadow: tone === t ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                              transform: tone === t ? 'translate(2px,2px)' : 'none', transition: 'all 0.1s' }}>
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button type="submit" disabled={loading || !file}
//               style={{ width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
//                        border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #DDA0DD',
//                        padding: 16, fontWeight: 900, fontSize: 16,
//                        cursor: loading || !file ? 'not-allowed' : 'pointer',
//                        textTransform: 'uppercase', letterSpacing: 1,
//                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Rewriting your resume...</>
//                 : <><Send size={20} /> Rewrite Resume</>}
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════════════════════════════════════════
//             ALL RESULTS — single guard block
//         ════════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* ── OVERVIEW BANNER ── */}
//             <div style={{ background: '#000', color: '#fff', border: '3px solid #000',
//                           boxShadow: '7px 7px 0 #DDA0DD', padding: '24px 28px' }}>

//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start',
//                             justifyContent: 'space-between', marginBottom: 20 }}>
//                 <div>
//                   <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700,
//                                 textTransform: 'uppercase', marginBottom: 8 }}>
//                     Rewrite Verdict
//                   </div>
//                   {/* FIX: VerdictBadge returns null when verdict is falsy — no more empty colored square */}
//                   <VerdictBadge verdict={ov.finalVerdict} />
//                   {ov.finalVerdictReason && (
//                     <div style={{ marginTop: 8, fontSize: 13, color: '#bbb', fontWeight: 600, maxWidth: 420 }}>
//                       {ov.finalVerdictReason}
//                     </div>
//                   )}
//                 </div>
//                 {/* FIX: quality score — only show chip when value is real (not 0) */}
//                 <div style={{ textAlign: 'center' }}>
//                   {ov.rewriteQualityScore ? (
//                     <>
//                       <ScoreChip score={ov.rewriteQualityScore} size="lg" />
//                       <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Rewrite Quality</div>
//                       {ov.rewriteQuality && (
//                         <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{ov.rewriteQuality}</div>
//                       )}
//                     </>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Stats grid — FIX: StatBox correctly shows numbers/strings vs "—" */}
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
//                             gap: 14, marginBottom: 16 }}>
//                 <StatBox label="Bullets Rewritten"   value={ov.totalBulletsRewritten} />
//                 <StatBox label="Keywords Added"       value={ov.totalKeywordsAdded} />
//                 <StatBox label="Metrics Injected"     value={ov.totalMetricsAdded} />
//                 <StatBox label="Banned Phrases Fixed" value={ov.totalBannedPhrasesRemoved} />
//                 <StatBox label="ATS Pass Rate"        value={ov.atsPassPercent}   accent="#74B9FF" />
//                 <StatBox label="Readiness"            value={ov.readinessLevel}   accent="#A8FF78" />
//               </div>

//               {ov.hiringManagerReaction && (
//                 <div style={{ background: '#1a1a1a', border: '2px solid #444', padding: '10px 16px',
//                               fontSize: 13, fontStyle: 'italic', color: '#ccc' }}>
//                   <span style={{ fontStyle: 'normal', fontWeight: 800, color: '#FFE566', marginRight: 8 }}>
//                     Hiring Manager:
//                   </span>
//                   "{ov.hiringManagerReaction}"
//                 </div>
//               )}
//             </div>

//             {/* ── BEFORE / AFTER SCORES ── */}
//             {bas.before && bas.after && (
//               <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000' }}>
//                 <div style={{ background: '#74B9FF', borderBottom: '3px solid #000', padding: '12px 20px',
//                               fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
//                               display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <BarChart2 size={18} /> Before → After Score Comparison
//                 </div>
//                 <div style={{ background: '#fff', padding: 20 }}>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16,
//                                 alignItems: 'center', marginBottom: 20 }}>
//                     {/* Before */}
//                     <div style={{ border: '2px solid #000', padding: 16, background: '#FFF0F0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
//                                     marginBottom: 12, color: '#c00' }}>Before</div>
//                       <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
//                         <ScoreChip score={bas.before.estimatedScore}       label="Score" />
//                         <ScoreChip score={bas.before.estimatedAts}         label="ATS"   />
//                         <ScoreChip score={bas.before.estimatedReadability} label="Read"  />
//                       </div>
//                       {(bas.before.mainProblems || []).map((p, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                           <X size={13} style={{ color: '#c00', flexShrink: 0, marginTop: 2 }} />{p}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Gains */}
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>→</div>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                         <GainChip gain={bas.scoreGain} />
//                         <GainChip gain={bas.atsGain} />
//                         <GainChip gain={bas.readabilityGain} />
//                       </div>
//                     </div>

//                     {/* After */}
//                     <div style={{ border: '2px solid #000', padding: 16, background: '#F0FFF0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
//                                     marginBottom: 12, color: '#2a7a2a' }}>After</div>
//                       <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
//                         <ScoreChip score={bas.after.estimatedScore}       label="Score" />
//                         <ScoreChip score={bas.after.estimatedAts}         label="ATS"   />
//                         <ScoreChip score={bas.after.estimatedReadability} label="Read"  />
//                       </div>
//                       {(bas.after.mainImprovements || []).map((p, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                           <Check size={13} style={{ color: '#2a7a2a', flexShrink: 0, marginTop: 2 }} />{p}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Top wins + remaining */}
//                   {(ov.topThreeWins?.length > 0 || ov.topThreeRemaining?.length > 0) && (
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                       {ov.topThreeWins?.length > 0 && (
//                         <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: 14 }}>
//                           <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
//                             Top Wins
//                           </div>
//                           {ov.topThreeWins.map((w, i) => (
//                             <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
//                               <Star size={13} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />{w}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                       {ov.topThreeRemaining?.length > 0 && (
//                         <div style={{ background: '#FFF8E1', border: '2px solid #000', padding: 14 }}>
//                           <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
//                             Still Needed
//                           </div>
//                           {ov.topThreeRemaining.map((w, i) => (
//                             <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
//                               <AlertTriangle size={13} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />{w}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── REWRITTEN RESUME ── */}
//             <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
//               <div style={{ background: '#A8FF78', borderBottom: '3px solid #000', padding: '14px 20px',
//                             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                             flexWrap: 'wrap', gap: 12 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <FileText size={20} />
//                   <span style={{ fontWeight: 900, fontSize: 15, textTransform: 'uppercase' }}>Rewritten Resume</span>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     {rr.wordCount > 0 && <Tag text={`${rr.wordCount} words`} small />}
//                     {rr.estimatedAtsScore && (
//                       <Tag text={`ATS: ${rr.estimatedAtsScore}`}
//                            bg={rr.estimatedAtsScore >= 80 ? '#A8FF78' : '#FFE566'} small />
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <CopyButton text={rr.content || ''} label="Copy Resume" />
//                   <button onClick={downloadResume}
//                     style={{ background: '#000', color: '#fff', border: '2px solid #000', padding: '6px 14px',
//                              fontWeight: 700, fontSize: 12, cursor: 'pointer',
//                              display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #555' }}>
//                     <Download size={13} /> Download .md
//                   </button>
//                 </div>
//               </div>
//               <div style={{ background: '#fff', padding: 28 }}>
//                 <ResumeContent content={rr.content} />
//               </div>
//             </div>

//             {/* ── SUMMARY REWRITE ── */}
//             {/* FIX: was checking summary.original !== undefined — works even when summary={} */}
//             {sumRw.rewritten && (
//               <Accordion title="Summary Rewrite" icon={FileText} bg="#FFE566" defaultOpen>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
//                   <div style={{ border: '2px solid #000', padding: 14, background: '#FFF0F0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#c00' }}>Original</div>
//                     <p style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.7, color: '#666' }}>
//                       {sumRw.original || 'No original summary detected'}
//                     </p>
//                   </div>
//                   <div style={{ border: '2px solid #000', padding: 14, background: '#F0FFF0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#2a7a2a' }}>Rewritten</div>
//                     <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.7 }}>{sumRw.rewritten}</p>
//                   </div>
//                 </div>
//                 {sumRw.whyBetter && (
//                   <div style={{ background: '#E8F5E9', border: '2px solid #000', padding: '10px 14px',
//                                 borderLeft: '5px solid #000', fontSize: 13, fontWeight: 600 }}>
//                     <span style={{ fontWeight: 800 }}>Why it's better: </span>{sumRw.whyBetter}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── IMPROVEMENTS SUMMARY ── always shown if populated ── */}
//             {imps.length > 0 && (
//               <Accordion title="All Improvements Made" icon={Award} bg="#A8FF78" defaultOpen badge={imps.length}>
//                 {imps.map((imp, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
//                     <div style={{ background: '#000', color: '#FFE566', fontWeight: 900, fontSize: 13,
//                                   minWidth: 26, height: 26, display: 'flex', alignItems: 'center',
//                                   justifyContent: 'center', flexShrink: 0 }}>
//                       {i + 1}
//                     </div>
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>{imp}</span>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── BULLET TRANSFORMATIONS ── */}
//             {bullets.length > 0 && (
//               <Accordion title="Bullet Transformations" icon={Zap} bg="#FFA07A" badge={bullets.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
//                   Every bullet rewritten using the XYZ impact formula:
//                 </p>
//                 {bullets.map((b, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 16,
//                                         marginBottom: 12, background: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
//                       {b.section        && <Tag text={b.section}                   bg="#E8F4FF" small />}
//                       {b.formulaApplied && <Tag text={b.formulaApplied}            bg="#A8FF78" small />}
//                       {b.weaknessFixed  && <Tag text={`Fixed: ${b.weaknessFixed}`} bg="#FFE0E0" small />}
//                       {b.actionVerbUsed && <Tag text={b.actionVerbUsed}            bg="#FFE566" small />}
//                       {b.metricAdded    && <Tag text={`Metric: ${b.metricAdded}`}  bg="#FFF9E6" small />}
//                     </div>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10,
//                                   alignItems: 'center', marginBottom: 10 }}>
//                       <div style={{ background: '#FFF0F0', border: '1px solid #ddd', padding: 10 }}>
//                         <div style={{ fontSize: 11, fontWeight: 800, color: '#c00', marginBottom: 4 }}>ORIGINAL</div>
//                         <p style={{ fontSize: 13, lineHeight: 1.6, textDecoration: 'line-through', color: '#888' }}>
//                           {b.original}
//                         </p>
//                       </div>
//                       <ArrowRight size={18} />
//                       <div style={{ background: '#F0FFF0', border: '1px solid #ddd', padding: 10 }}>
//                         <div style={{ fontSize: 11, fontWeight: 800, color: '#2a7a2a', marginBottom: 4 }}>REWRITTEN</div>
//                         <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{b.rewritten}</p>
//                       </div>
//                     </div>
//                     {b.strengthImprovement != null && (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <span style={{ fontSize: 11, fontWeight: 700, minWidth: 90 }}>Strength gain:</span>
//                         <StrengthBar value={b.strengthImprovement} />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── SKILLS SECTION REWRITE ── */}
//             {/* FIX: guard now checks skillsAdded/skillsRemoved, not the empty rewritten object */}
//             {(skills.skillsAdded?.length > 0 || skills.skillsRemoved?.length > 0) && (
//               <Accordion title="Skills Section Rewrite" icon={List} bg="#74B9FF">
//                 {Object.entries(skills.rewritten || {}).map(([cat, list]) =>
//                   Array.isArray(list) && list.length > 0 ? (
//                     <div key={cat} style={{ marginBottom: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>{cat}</div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {list.map((s, i) => <Tag key={i} text={s} bg="#E8F4FF" small />)}
//                       </div>
//                     </div>
//                   ) : null
//                 )}
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
//                   {skills.skillsAdded?.length > 0 && (
//                     <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
//                         Skills Added ({skills.skillsAdded.length})
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {skills.skillsAdded.map((s, i) => <Tag key={i} text={s} bg="#A8FF78" small />)}
//                       </div>
//                     </div>
//                   )}
//                   {skills.skillsRemoved?.length > 0 && (
//                     <div style={{ background: '#FFF0F0', border: '2px solid #000', padding: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
//                         Skills Removed ({skills.skillsRemoved.length})
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {skills.skillsRemoved.map((s, i) => <Tag key={i} text={s} bg="#FF6B6B" small />)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── KEYWORDS ── shows even when only flat kwAdded array exists */}
//             {(kwAdded.length > 0 || kwOpt.jdKeywordsAdded?.length > 0) && (
//               <Accordion title="Keywords Injected" icon={Target} bg="#A8FF78"
//                          badge={kwOpt.jdKeywordsAdded?.length || kwAdded.length}>
//                 {(kwOpt.totalKeywordCoverage || kwOpt.atsPrediction) && (
//                   <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
//                     {kwOpt.totalKeywordCoverage && (
//                       <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: '10px 16px' }}>
//                         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>JD Coverage</div>
//                         <div style={{ fontWeight: 900, fontSize: 20 }}>{kwOpt.totalKeywordCoverage}</div>
//                       </div>
//                     )}
//                     {kwOpt.atsPrediction && (
//                       <div style={{ background: '#E8F4FF', border: '2px solid #000', padding: '10px 16px' }}>
//                         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>ATS Prediction</div>
//                         <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{kwOpt.atsPrediction}</div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {/* Rich format */}
//                 {kwOpt.jdKeywordsAdded?.length > 0 ? (
//                   kwOpt.jdKeywordsAdded.map((k, i) => (
//                     <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 6, background: '#F0FFF0' }}>
//                       <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                         <Tag text={typeof k === 'string' ? k : k.keyword} bg="#A8FF78" small />
//                         {k.addedTo && <Tag text={`→ ${k.addedTo}`} bg="#E8F4FF" small />}
//                       </div>
//                       {k.inSentence && (
//                         <p style={{ fontSize: 12, color: '#555', fontStyle: 'italic', margin: '4px 0 0' }}>
//                           "{k.inSentence}"
//                         </p>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   // Simple flat array fallback
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {kwAdded.map((kw, i) => <Tag key={i} text={kw} bg="#A8FF78" small />)}
//                   </div>
//                 )}
//                 {kwOpt.jdKeywordsMissing?.length > 0 && (
//                   <div style={{ marginTop: 14 }}>
//                     <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#c00' }}>
//                       Still Missing ({kwOpt.jdKeywordsMissing.length})
//                     </div>
//                     {kwOpt.jdKeywordsMissing.map((k, i) => (
//                       <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 6, background: '#FFF0F0' }}>
//                         <Tag text={typeof k === 'string' ? k : k.keyword} bg="#FF6B6B" small />
//                         {k.reason && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{k.reason}</div>}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── ACTION VERBS ── shows rich format OR flat list */}
//             {(verbs.length > 0 || verbsUsed.length > 0) && (
//               <Accordion title="Action Verbs Used" icon={Zap} bg="#FFE566"
//                          badge={verbs.length || verbsUsed.length}>
//                 {verbs.length > 0 ? (
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
//                     {verbs.map((v, i) => (
//                       <div key={i} style={{ border: '2px solid #000', padding: 12, background: '#FAFAFA' }}>
//                         <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
//                           <Tag text={v.verbUsed} bg="#FFE566" small />
//                           {v.tier && <Tag text={v.tier} bg="#F5F0E8" small />}
//                         </div>
//                         {v.original && (
//                           <div style={{ fontSize: 12, color: '#888', textDecoration: 'line-through', marginBottom: 4 }}>
//                             {v.original}
//                           </div>
//                         )}
//                         {v.replaced && <div style={{ fontSize: 12, fontWeight: 700 }}>{v.replaced}</div>}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {verbsUsed.map((v, i) => <Tag key={i} text={v} bg="#FFE566" small />)}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── METRICS / PLACEHOLDERS ADDED ── */}
//             {metrics.length > 0 && (
//               <Accordion title="Metric Placeholders Added" icon={TrendingUp} bg="#DDA0DD" badge={metrics.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
//                   Fill these with your real performance data before submitting:
//                 </p>
//                 {metrics.map((m, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10,
//                                         background: i % 2 === 0 ? '#F8F4FF' : '#fff' }}>
//                     <Tag text={m.placeholder} bg="#DDA0DD" />
//                     {m.bullet && (
//                       <div style={{ fontSize: 12, color: '#555', marginTop: 6, fontStyle: 'italic' }}>
//                         In: {m.bullet}
//                       </div>
//                     )}
//                     {m.howToFill && (
//                       <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '6px 10px',
//                                     fontSize: 12, fontWeight: 600, marginTop: 8, borderLeft: '4px solid #000' }}>
//                         How to find: {m.howToFill}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── PLACEHOLDER FILL GUIDE ── */}
//             {guide.length > 0 && (
//               <Accordion title="Placeholder Fill Guide" icon={BookOpen} bg="#FFF9E6" badge={guide.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
//                   Every [X]% in your resume — what it means and where to find the real number:
//                 </p>
//                 {guide.map((g, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10,
//                                         background: i % 2 === 0 ? '#FFFDF0' : '#fff' }}>
//                     <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
//                       <div style={{ background: '#000', color: '#FFE566', fontWeight: 900, fontSize: 14,
//                                     minWidth: 28, height: 28, display: 'flex', alignItems: 'center',
//                                     justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
//                       <Tag text={g.placeholder} bg="#FFE566" />
//                     </div>
//                     {g.location   && <div style={{ fontSize: 12, color: '#555', marginBottom: 4, fontStyle: 'italic' }}>Location: {g.location}</div>}
//                     {g.dataNeeded && <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>What you need: {g.dataNeeded}</div>}
//                     {g.howToFind  && (
//                       <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '6px 10px',
//                                     fontSize: 12, fontWeight: 600, borderLeft: '4px solid #000' }}>
//                         How to find: {g.howToFind}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── REMAINING GAPS ── */}
//             {gaps.length > 0 && (
//               <Accordion title="Remaining Gaps (Honest Assessment)" icon={AlertTriangle}
//                          bg="#FFA07A" badge={gaps.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
//                   These issues couldn't be fixed by rewriting alone:
//                 </p>
//                 {gaps.map((g, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF8F0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>Gap: {g.gap}</div>
//                     {/* FIX: backend uses g.why OR just g alone, both handled */}
//                     {g.why && <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Why: {g.why}</div>}
//                     {gapAction(g) && (
//                       <div style={{ background: '#FFE566', border: '2px solid #000', padding: '8px 12px',
//                                     fontSize: 12, fontWeight: 700 }}>
//                         ➡️ Action: {gapAction(g)}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── SCAM FLAGS ── */}
//             {scam.length > 0 && (
//               <Accordion title="Scam Flags Addressed" icon={Shield} bg="#FF6B6B" badge={scam.length}>
//                 {scam.map((s, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF0F0' }}>
//                     {s.action && <Tag text={s.action} bg={s.action === 'Removed' ? '#FF6B6B' : '#FFE566'} small />}
//                     {s.originalClaim && (
//                       <div style={{ fontSize: 12, marginTop: 8, marginBottom: 4 }}>
//                         <span style={{ fontWeight: 800 }}>Original: </span>
//                         <span style={{ textDecoration: 'line-through', color: '#888' }}>{s.originalClaim}</span>
//                       </div>
//                     )}
//                     {s.revisedVersion && (
//                       <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                         <span style={{ fontWeight: 800 }}>Revised: </span>{s.revisedVersion}
//                       </div>
//                     )}
//                     {s.reason && <div style={{ fontSize: 12, color: '#666' }}>{s.reason}</div>}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── BIGGEST TRANSFORMATION + STILL NEEDS WORK ── */}
//             {(ov.biggestTransformation || ov.whatStillNeedsWork) && (
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                 {ov.biggestTransformation && (
//                   <div style={{ background: '#F0FFF0', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
//                     <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
//                       🏆 Biggest Transformation
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, color: '#2a7a2a' }}>{ov.biggestTransformation}</p>
//                   </div>
//                 )}
//                 {ov.whatStillNeedsWork && (
//                   <div style={{ background: '#FFF8E1', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
//                     <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
//                       ⚠️ Still Needs Work
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>{ov.whatStillNeedsWork}</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── READINESS BADGES ── */}
//             {(ov.interviewReadiness || ov.atsPassPrediction || ov.atsPassPercent) && (
//               <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000',
//                             padding: '16px 20px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
//                 {ov.interviewReadiness && (
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
//                       Interview Readiness
//                     </div>
//                     <Tag text={ov.interviewReadiness}
//                          bg={ov.interviewReadiness === 'Interview-ready' ? '#A8FF78' : '#FFE566'} />
//                   </div>
//                 )}
//                 {ov.atsPassPrediction && (
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
//                       ATS Prediction
//                     </div>
//                     <Tag text={ov.atsPassPrediction}
//                          bg={['Likely Pass', 'Will Pass ATS'].includes(ov.atsPassPrediction) ? '#A8FF78' : '#FFE566'} />
//                   </div>
//                 )}
//                 {ov.atsPassPercent && (
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
//                       ATS Pass Rate
//                     </div>
//                     <div style={{ fontWeight: 900, fontSize: 22 }}>{ov.atsPassPercent}</div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── REGENERATE ── */}
//             <div style={{ textAlign: 'center', paddingBottom: 32 }}>
//               <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//                 style={{ background: '#fff', border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                          padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
//                          textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
//                 <RefreshCw size={16} /> Rewrite Another Resume
//               </button>
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default RewritePage;




















// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft, Loader2, FileText, Send, Download, Copy, Check,
//   Upload, RefreshCw, Home, ChevronDown, ChevronUp, AlertTriangle,
//   TrendingUp, Target, Zap, BookOpen, Eye, Star, X,
//   ArrowRight, Shield, List, BarChart2, Award
// } from 'lucide-react';

// // ─── Neobrutalism shared primitives ──────────────────────────────

// const ScoreChip = ({ score, label, size = 'md' }) => {
//   const s = Number(score);
//   // Never render a red "0" chip for missing data
//   if (!s && s !== 0) return label ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div><div style={{ fontWeight: 800, fontSize: 14, color: '#888' }}>—</div></div> : null;
//   if (s === 0) return label ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div><div style={{ fontWeight: 800, fontSize: 14, color: '#888' }}>—</div></div> : null;
//   const bg  = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
//   const fz  = size === 'lg' ? 40 : size === 'md' ? 26 : 16;
//   const pad = size === 'lg' ? '14px 22px' : size === 'md' ? '10px 16px' : '5px 10px';
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div style={{
//         background: bg, border: '3px solid #000',
//         boxShadow: '4px 4px 0 #000', padding: pad,
//         fontWeight: 900, fontSize: fz, color: '#000',
//         display: 'inline-block', lineHeight: 1,
//       }}>
//         {s}
//       </div>
//       {label && (
//         <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4,
//                       textTransform: 'uppercase', color: '#555' }}>
//           {label}
//         </div>
//       )}
//     </div>
//   );
// };

// const GainChip = ({ gain }) => {
//   const g   = Number(gain) || 0;
//   const bg  = g > 0 ? '#A8FF78' : g < 0 ? '#FF6B6B' : '#F5F0E8';
//   return (
//     <span style={{
//       background: bg, border: '2px solid #000',
//       padding: '2px 10px', fontWeight: 800, fontSize: 13,
//       display: 'inline-block',
//     }}>
//       {g > 0 ? `+${g}` : g}
//     </span>
//   );
// };

// const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
//   <span style={{
//     background: bg, border: '2px solid #000',
//     padding: small ? '2px 8px' : '4px 12px',
//     fontSize: small ? 11 : 12, fontWeight: 700,
//     display: 'inline-block',
//   }}>
//     {text}
//   </span>
// );

// const VerdictBadge = ({ verdict }) => {
//   const map = {
//     'READY TO SUBMIT':                   { bg: '#A8FF78', icon: '✅' },
//     'SUBMIT AFTER FILLING PLACEHOLDERS': { bg: '#FFE566', icon: '📝' },
//     'NEEDS CANDIDATE ADDITIONS':         { bg: '#FFA07A', icon: '⚠️' },
//     'SIGNIFICANT GAPS REMAIN':           { bg: '#FF6B6B', icon: '❌' },
//   };
//   const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
//   return (
//     <span style={{
//       background: cfg.bg, border: '3px solid #000',
//       boxShadow: '4px 4px 0 #000', padding: '10px 20px',
//       fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
//       display: 'inline-flex', alignItems: 'center', gap: 8,
//     }}>
//       {cfg.icon} {verdict}
//     </span>
//   );
// };

// const CopyButton = ({ text, label = 'Copy' }) => {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button
//       onClick={() => {
//         navigator.clipboard.writeText(text);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       }}
//       style={{
//         background: copied ? '#A8FF78' : '#fff',
//         border: '2px solid #000', padding: '6px 14px',
//         fontWeight: 700, fontSize: 12, cursor: 'pointer',
//         display: 'inline-flex', alignItems: 'center', gap: 6,
//         boxShadow: '2px 2px 0 #000',
//       }}
//     >
//       {copied ? <Check size={13} /> : <Copy size={13} />}
//       {copied ? 'Copied!' : label}
//     </button>
//   );
// };

// // Collapsible accordion section
// const Accordion = ({ title, icon: Icon, bg = '#F5F0E8', defaultOpen = false,
//                      badge, children }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                   marginBottom: 20 }}>
//       <button
//         onClick={() => setOpen(o => !o)}
//         style={{
//           width: '100%', background: bg,
//           border: 'none', borderBottom: open ? '3px solid #000' : 'none',
//           padding: '14px 20px',
//           display: 'flex', alignItems: 'center',
//           justifyContent: 'space-between',
//           cursor: 'pointer', fontWeight: 900,
//           fontSize: 14, textTransform: 'uppercase',
//         }}
//       >
//         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           {Icon && <Icon size={18} />}
//           {title}
//           {badge !== undefined && (
//             <span style={{
//               background: '#000', color: '#FFE566',
//               padding: '1px 8px', fontSize: 12, fontWeight: 900,
//               borderRadius: 0,
//             }}>
//               {badge}
//             </span>
//           )}
//         </span>
//         {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>
//       {open && (
//         <div style={{ background: '#fff', padding: 20 }}>
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Strength bar (1–10) ─────────────────────────────────────────
// const StrengthBar = ({ value }) => {
//   const v   = Math.min(Math.max(Number(value) || 0, 0), 10);
//   const pct = (v / 10) * 100;
//   const bg  = v >= 8 ? '#A8FF78' : v >= 5 ? '#FFE566' : '#FF6B6B';
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       <div style={{
//         flex: 1, height: 10, background: '#F5F0E8',
//         border: '2px solid #000',
//       }}>
//         <div style={{
//           width: `${pct}%`, height: '100%', background: bg,
//           transition: 'width 0.4s',
//         }} />
//       </div>
//       <span style={{ fontWeight: 800, fontSize: 12, minWidth: 28 }}>
//         {v}/10
//       </span>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════
// export const RewritePage = () => {
//   const [loading,    setLoading]    = useState(false);
//   const [result,     setResult]     = useState(null);   // full parsed object
//   const [file,       setFile]       = useState(null);
//   const [tone,       setTone]       = useState('Professional');
//   const [targetRole, setTargetRole] = useState('');
//   const [jobDesc,    setJobDesc]    = useState('');
//   const resultRef = useRef(null);

//   const TONES = [
//     'Professional', 'Executive', 'Creative', 'Technical', 'Modern',
//   ];

//   // ── File handling ────────────────────────────────────────────────
//   const handleFile = (f) => {
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('PDF only'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');  return; }
//     setFile(f);
//   };

//   // ── Submit ───────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)              { toast.error('Upload a resume PDF');  return; }
//     if (!targetRole.trim()) { toast.error('Enter the target role'); return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       const fd = new FormData();
//       fd.append('file', file);
//       fd.append('targetRole', targetRole);
//       fd.append('tone', tone);
//       fd.append('jobDescription', jobDesc);

//       const response = await resumeAPI.rewriteWithUpload(fd);

//       // ── Normalize — handles nested (rewrittenResume.content) and flat (content) ──
//       const data = response.data;
//       const raw  = data?.parsed
//         || (() => { try { return JSON.parse(data?.result); } catch { return null; } })()
//         || data || {};

//       const finalResult = {
//         rewrittenResume: {
//           content:                   raw?.rewrittenResume?.content  || raw?.content  || '',
//           wordCount:                 raw?.rewrittenResume?.wordCount || raw?.wordCount || 0,
//           sectionCount:              raw?.rewrittenResume?.sectionCount              || 0,
//           estimatedAtsScore:         raw?.rewrittenResume?.estimatedAtsScore         || raw?.estimatedAtsScore         || null,
//           estimatedReadabilityScore: raw?.rewrittenResume?.estimatedReadabilityScore || raw?.estimatedReadabilityScore || null,
//         },
//         summaryRewrite:        raw?.summaryRewrite        || {},
//         bulletTransformations: raw?.bulletTransformations || [],
//         skillsSectionRewrite:  raw?.skillsSectionRewrite  || { skillsAdded: [], skillsRemoved: [], rewritten: {} },
//         keywordsAdded:         raw?.keywordsAdded         || [],
//         keywordOptimization:   raw?.keywordOptimization   || { jdKeywordsAdded: [], jdKeywordsMissing: [], totalKeywordCoverage: 'N/A', atsPrediction: 'N/A' },
//         sectionsAnalysis:      raw?.sectionsAnalysis      || { sectionsKept: [], sectionsAdded: [], sectionsRemoved: [], sectionsReordered: [] },
//         scamFlagsAddressed:    raw?.scamFlagsAddressed    || [],
//         metricsAdded:          raw?.metricsAdded          || [],
//         actionVerbsReplaced:   raw?.actionVerbsReplaced   || [],
//         beforeAfterScores:     raw?.beforeAfterScores     || {},
//         improvements:          raw?.improvements          || [],
//         metricsAddedList:      raw?.metricsAddedList      || [],
//         actionVerbsUsed:       raw?.actionVerbsUsed       || [],
//         remainingGaps:         raw?.remainingGaps         || [],
//         placeholderGuide:      raw?.placeholderGuide      || [],
//         overview:              raw?.overview              || {},
//       };

//       if (!finalResult.rewrittenResume.content) {
//         throw new Error('Empty rewrite received — please retry.');
//       }

//       setResult(finalResult);
//       toast.success('Resume rewritten successfully!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Rewrite failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadResume = () => {
//     const content = result?.rewrittenResume?.content;
//     if (!content) return;
//     const blob = new Blob([content], { type: 'text/markdown' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href     = url;
//     a.download = 'rewritten-resume.md';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   // ── Shortcuts ────────────────────────────────────────────────────
//   const rr      = result?.rewrittenResume       || {};
//   const summary = result?.summaryRewrite         || {};
//   const bullets = result?.bulletTransformations  || [];
//   const skills  = result?.skillsSectionRewrite   || {};
//   const kwOpt   = result?.keywordOptimization    || {};
//   const secAn   = result?.sectionsAnalysis       || {};
//   const scam    = result?.scamFlagsAddressed     || [];
//   const metrics = result?.metricsAdded           || [];
//   const verbs   = result?.actionVerbsReplaced    || [];
//   const bas     = result?.beforeAfterScores      || {};
//   const gaps    = result?.remainingGaps          || [];
//   const guide   = result?.placeholderGuide       || [];
//   const ov      = result?.overview               || {};
//   const imps    = result?.improvements           || [];
//   const kwAdded = result?.keywordsAdded          || [];
//   const verbsUsed = result?.actionVerbsUsed      || [];

//   // ══════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-neo-offwhite">

//       {/* ── NAVBAR ── */}
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <Link to="/dashboard"
//             className="flex items-center gap-2 font-bold hover:text-neo-blue transition-colors">
//             <ArrowLeft size={18} /> Back
//           </Link>
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-neo-yellow border-3 border-black
//                             flex items-center justify-center">
//               <span className="font-space font-extrabold text-lg">R</span>
//             </div>
//             <span className="font-space font-extrabold text-xl">RESUME AI</span>
//           </div>
//           <Link to="/" className="flex items-center gap-1 font-bold hover:text-neo-blue">
//             <Home size={16} />
//             <span className="hidden sm:inline">Home</span>
//           </Link>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

//         {/* ── FORM CARD ── */}
//         <div style={{ background: '#fff', border: '3px solid #000',
//                       boxShadow: '7px 7px 0 #000', padding: 32 }}>

//           {/* Header */}
//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#DDA0DD',
//                           border: '3px solid #000',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <RefreshCw size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">RESUME REWRITER</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>
//                 XYZ formula · ATS-optimized · Keyword-injected
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* PDF Upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div
//                 onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
//                 onDragOver={e => e.preventDefault()}
//                 style={{
//                   border: '3px dashed #000',
//                   background: file ? '#A8FF78' : '#F5F0E8',
//                   padding: 28, textAlign: 'center',
//                   transition: 'background 0.2s',
//                 }}
//               >
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={26} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ color: '#555', fontSize: 12 }}>
//                       ({(file.size / 1024).toFixed(0)} KB)
//                     </span>
//                     <button
//                       type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000',
//                                padding: '2px 8px', cursor: 'pointer', fontWeight: 900 }}>
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload size={36} style={{ margin: '0 auto 12px',
//                                                display: 'block', opacity: 0.4 }} />
//                     <label style={{ cursor: 'pointer' }}>
//                       <span style={{
//                         background: '#FFE566', border: '3px solid #000',
//                         boxShadow: '3px 3px 0 #000', padding: '10px 24px',
//                         fontWeight: 800, display: 'inline-block',
//                       }}>
//                         Browse or Drop PDF
//                       </span>
//                       <input type="file" accept=".pdf" className="hidden"
//                              onChange={e => handleFile(e.target.files[0])} />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888',
//                                 fontWeight: 600 }}>
//                       PDF only · Max 5MB
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Target Role */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Target Role <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <input
//                 type="text" value={targetRole}
//                 onChange={e => setTargetRole(e.target.value)}
//                 placeholder="e.g. Senior Software Engineer, Data Scientist..."
//                 style={{ width: '100%', border: '3px solid #000',
//                          padding: '12px 16px', fontWeight: 700,
//                          fontSize: 15, outline: 'none', boxSizing: 'border-box' }}
//               />
//             </div>

//             {/* Job Description */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Description
//                 <span style={{ fontWeight: 500, fontSize: 12,
//                                marginLeft: 8, color: '#555' }}>
//                   (Paste for ATS keyword injection)
//                 </span>
//               </label>
//               <textarea
//                 value={jobDesc}
//                 onChange={e => setJobDesc(e.target.value)}
//                 placeholder="Paste the job description to inject exact keywords..."
//                 rows={4}
//                 style={{ width: '100%', border: '3px solid #000',
//                          padding: '12px 16px', fontWeight: 600,
//                          fontSize: 14, outline: 'none', resize: 'vertical',
//                          boxSizing: 'border-box', fontFamily: 'inherit' }}
//               />
//             </div>

//             {/* Tone */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Resume Tone
//               </label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                 {TONES.map(t => (
//                   <button key={t} type="button" onClick={() => setTone(t)}
//                     style={{
//                       background: tone === t ? '#FFE566' : '#fff',
//                       border: '3px solid #000', fontWeight: 800,
//                       padding: '8px 18px', cursor: 'pointer', fontSize: 13,
//                       boxShadow: tone === t ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                       transform: tone === t ? 'translate(2px,2px)' : 'none',
//                       transition: 'all 0.1s',
//                     }}>
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button type="submit" disabled={loading || !file}
//               style={{
//                 width: '100%',
//                 background: loading || !file ? '#ccc' : '#000',
//                 color: '#fff', border: '3px solid #000',
//                 boxShadow: loading || !file ? 'none' : '5px 5px 0 #DDA0DD',
//                 padding: 16, fontWeight: 900, fontSize: 16,
//                 cursor: loading || !file ? 'not-allowed' : 'pointer',
//                 textTransform: 'uppercase', letterSpacing: 1,
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 10,
//               }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Rewriting your resume...</>
//                 : <><Send size={20} /> Rewrite Resume</>}
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════════════════════════════════════════
//             RESULTS
//         ════════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* ── OVERVIEW BANNER ── */}
//             <div style={{ background: '#000', color: '#fff',
//                           border: '3px solid #000', boxShadow: '7px 7px 0 #DDA0DD',
//                           padding: '24px 28px' }}>

//               {/* Verdict + Quality */}
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16,
//                             alignItems: 'flex-start', marginBottom: 20,
//                             justifyContent: 'space-between' }}>
//                 <div>
//                   <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700,
//                                 textTransform: 'uppercase', marginBottom: 8 }}>
//                     Rewrite Verdict
//                   </div>
//                   <VerdictBadge verdict={ov.finalVerdict || 'NEEDS CANDIDATE ADDITIONS'} />
//                   <div style={{ marginTop: 8, fontSize: 13, color: '#bbb',
//                                 fontWeight: 600, maxWidth: 420 }}>
//                     {ov.finalVerdictReason}
//                   </div>
//                 </div>
//                 <div style={{ textAlign: 'center' }}>
//                   <ScoreChip score={ov.rewriteQualityScore || 0} size="lg" />
//                   <div style={{ fontSize: 11, color: '#aaa', marginTop: 4,
//                                 fontWeight: 700 }}>
//                     Rewrite Quality
//                   </div>
//                   <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
//                     {ov.rewriteQuality}
//                   </div>
//                 </div>
//               </div>

//               {/* Stats grid */}
//               <div style={{ display: 'grid',
//                             gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
//                             gap: 14, marginBottom: 16 }}>
//                 {[
//                   { label: 'Bullets Rewritten',    value: ov.totalBulletsRewritten },
//                   { label: 'Keywords Added',        value: ov.totalKeywordsAdded },
//                   { label: 'Metrics Injected',      value: ov.totalMetricsAdded },
//                   { label: 'Banned Phrases Fixed',  value: ov.totalBannedPhrasesRemoved },
//                   { label: 'ATS Pass Rate',         value: ov.atsPassPercent },
//                   { label: 'Readiness',             value: ov.readinessLevel },
//                 ].map(item => (
//                   <div key={item.label} style={{
//                     background: '#1a1a1a', border: '1px solid #333',
//                     padding: '10px 14px',
//                   }}>
//                     <div style={{ fontSize: 10, color: '#888',
//                                   textTransform: 'uppercase', fontWeight: 700 }}>
//                       {item.label}
//                     </div>
//                     <div style={{ fontWeight: 900, fontSize: 18,
//                                   color: '#FFE566', marginTop: 2 }}>
//                       {item.value ?? '—'}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Hiring manager reaction */}
//               {ov.hiringManagerReaction && (
//                 <div style={{
//                   background: '#1a1a1a', border: '2px solid #444',
//                   padding: '10px 16px', fontSize: 13,
//                   fontStyle: 'italic', color: '#ccc',
//                 }}>
//                   <span style={{ fontStyle: 'normal', fontWeight: 800,
//                                  color: '#FFE566', marginRight: 8 }}>
//                     Hiring Manager:
//                   </span>
//                   "{ov.hiringManagerReaction}"
//                 </div>
//               )}
//             </div>

//             {/* ── BEFORE / AFTER SCORES ── */}
//             {bas.before && bas.after && (
//               <div style={{ border: '3px solid #000',
//                             boxShadow: '5px 5px 0 #000' }}>
//                 <div style={{ background: '#74B9FF', border: 'none',
//                               borderBottom: '3px solid #000',
//                               padding: '12px 20px', fontWeight: 900,
//                               fontSize: 14, textTransform: 'uppercase',
//                               display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <BarChart2 size={18} /> Before → After Score Comparison
//                 </div>
//                 <div style={{ background: '#fff', padding: 20 }}>
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: '1fr auto 1fr', gap: 16,
//                                 alignItems: 'center', marginBottom: 20 }}>
//                     {/* Before */}
//                     <div style={{ border: '2px solid #000', padding: 16,
//                                   background: '#FFF0F0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12,
//                                     textTransform: 'uppercase',
//                                     marginBottom: 12, color: '#c00' }}>
//                         Before
//                       </div>
//                       <div style={{ display: 'flex', gap: 12,
//                                     justifyContent: 'center', marginBottom: 12 }}>
//                         <ScoreChip score={bas.before.estimatedScore}   label="Score" />
//                         <ScoreChip score={bas.before.estimatedAts}     label="ATS" />
//                         <ScoreChip score={bas.before.estimatedReadability} label="Read" />
//                       </div>
//                       {bas.before.mainProblems?.map((p, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6,
//                                               fontSize: 12, fontWeight: 600,
//                                               marginBottom: 4 }}>
//                           <X size={13} style={{ color: '#c00', flexShrink: 0,
//                                                 marginTop: 2 }} />
//                           {p}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Arrows */}
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{ fontWeight: 900, fontSize: 20 }}>→</div>
//                       <div style={{ marginTop: 8, display: 'flex',
//                                     flexDirection: 'column', gap: 4 }}>
//                         <GainChip gain={bas.scoreGain} />
//                         <GainChip gain={bas.atsGain} />
//                         <GainChip gain={bas.readabilityGain} />
//                       </div>
//                     </div>

//                     {/* After */}
//                     <div style={{ border: '2px solid #000', padding: 16,
//                                   background: '#F0FFF0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12,
//                                     textTransform: 'uppercase',
//                                     marginBottom: 12, color: '#2a7a2a' }}>
//                         After
//                       </div>
//                       <div style={{ display: 'flex', gap: 12,
//                                     justifyContent: 'center', marginBottom: 12 }}>
//                         <ScoreChip score={bas.after.estimatedScore}   label="Score" />
//                         <ScoreChip score={bas.after.estimatedAts}     label="ATS" />
//                         <ScoreChip score={bas.after.estimatedReadability} label="Read" />
//                       </div>
//                       {bas.after.mainImprovements?.map((p, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6,
//                                               fontSize: 12, fontWeight: 600,
//                                               marginBottom: 4 }}>
//                           <Check size={13} style={{ color: '#2a7a2a',
//                                                      flexShrink: 0, marginTop: 2 }} />
//                           {p}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Top 3 wins + remaining */}
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                     {ov.topThreeWins?.length > 0 && (
//                       <div style={{ background: '#F0FFF0',
//                                     border: '2px solid #000', padding: 14 }}>
//                         <div style={{ fontWeight: 800, fontSize: 12,
//                                       textTransform: 'uppercase', marginBottom: 8 }}>
//                           Top Wins
//                         </div>
//                         {ov.topThreeWins.map((w, i) => (
//                           <div key={i} style={{ display: 'flex', gap: 6,
//                                                 fontSize: 12, fontWeight: 600,
//                                                 marginBottom: 6 }}>
//                             <Star size={13} style={{ color: '#B45309',
//                                                       flexShrink: 0, marginTop: 2 }} />
//                             {w}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {ov.topThreeRemaining?.length > 0 && (
//                       <div style={{ background: '#FFF8E1',
//                                     border: '2px solid #000', padding: 14 }}>
//                         <div style={{ fontWeight: 800, fontSize: 12,
//                                       textTransform: 'uppercase', marginBottom: 8 }}>
//                           Still Needed
//                         </div>
//                         {ov.topThreeRemaining.map((w, i) => (
//                           <div key={i} style={{ display: 'flex', gap: 6,
//                                                 fontSize: 12, fontWeight: 600,
//                                                 marginBottom: 6 }}>
//                             <AlertTriangle size={13}
//                               style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
//                             {w}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── REWRITTEN RESUME ── */}
//             <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
//               <div style={{ background: '#A8FF78', borderBottom: '3px solid #000',
//                             padding: '14px 20px',
//                             display: 'flex', alignItems: 'center',
//                             justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <FileText size={20} />
//                   <span style={{ fontWeight: 900, fontSize: 15,
//                                  textTransform: 'uppercase' }}>
//                     Rewritten Resume
//                   </span>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     {rr.wordCount && <Tag text={`${rr.wordCount} words`} small />}
//                     {rr.sectionCount && <Tag text={`${rr.sectionCount} sections`} small />}
//                     {rr.estimatedAtsScore && (
//                       <Tag text={`ATS: ${rr.estimatedAtsScore}`}
//                            bg={rr.estimatedAtsScore >= 80 ? '#A8FF78' : '#FFE566'} small />
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <CopyButton text={rr.content || ''} label="Copy Resume" />
//                   <button onClick={downloadResume} style={{
//                     background: '#000', color: '#fff',
//                     border: '2px solid #000', padding: '6px 14px',
//                     fontWeight: 700, fontSize: 12, cursor: 'pointer',
//                     display: 'inline-flex', alignItems: 'center', gap: 6,
//                     boxShadow: '2px 2px 0 #555',
//                   }}>
//                     <Download size={13} /> Download .md
//                   </button>
//                 </div>
//               </div>
//               <div style={{ background: '#fff', padding: 28 }}>
//                 <div style={{
//                   background: '#FAFAF8', border: '2px solid #ddd',
//                   padding: '28px 32px', fontFamily: 'monospace',
//                   lineHeight: 1.8, fontSize: 14,
//                   maxHeight: 600, overflowY: 'auto',
//                 }}>
//                   {(rr.content || '').split('\n').map((line, i) => {
//                     // Render markdown headers visually
//                     if (line.startsWith('## ')) {
//                       return (
//                         <div key={i} style={{
//                           fontWeight: 900, fontSize: 16, marginTop: 20,
//                           marginBottom: 6, borderBottom: '2px solid #000',
//                           paddingBottom: 4, fontFamily: 'sans-serif',
//                         }}>
//                           {line.replace('## ', '')}
//                         </div>
//                       );
//                     }
//                     if (line.startsWith('# ')) {
//                       return (
//                         <div key={i} style={{
//                           fontWeight: 900, fontSize: 20, marginBottom: 8,
//                           fontFamily: 'sans-serif',
//                         }}>
//                           {line.replace('# ', '')}
//                         </div>
//                       );
//                     }
//                     return (
//                       <p key={i} style={{
//                         margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
//                         minHeight: line.trim() === '' ? 8 : 'auto',
//                       }}>
//                         {line}
//                       </p>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* ── SUMMARY REWRITE ── */}
//             {summary.original !== undefined && (
//               <Accordion title="Summary Rewrite" icon={FileText}
//                          bg="#FFE566" defaultOpen>
//                 <div style={{ display: 'grid',
//                               gridTemplateColumns: '1fr 1fr', gap: 16,
//                               marginBottom: 14 }}>
//                   <div style={{ border: '2px solid #000', padding: 14,
//                                 background: '#FFF0F0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11,
//                                   textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#c00' }}>
//                       Original
//                     </div>
//                     <p style={{ fontSize: 13, fontStyle: 'italic',
//                                 lineHeight: 1.7, color: '#666' }}>
//                       {summary.original || 'No summary detected'}
//                     </p>
//                   </div>
//                   <div style={{ border: '2px solid #000', padding: 14,
//                                 background: '#F0FFF0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11,
//                                   textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#2a7a2a' }}>
//                       Rewritten
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600,
//                                 lineHeight: 1.7 }}>
//                       {summary.rewritten}
//                     </p>
//                   </div>
//                 </div>
//                 {summary.whyBetter && (
//                   <div style={{
//                     background: '#E8F5E9', border: '2px solid #000',
//                     padding: '10px 14px', borderLeft: '5px solid #000',
//                     fontSize: 13, fontWeight: 600,
//                   }}>
//                     <span style={{ fontWeight: 800 }}>Why it's better: </span>
//                     {summary.whyBetter}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── BULLET TRANSFORMATIONS ── */}
//             {bullets.length > 0 && (
//               <Accordion title="Bullet Transformations"
//                          icon={Zap} bg="#FFA07A"
//                          badge={bullets.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
//                             marginBottom: 16 }}>
//                   Every bullet rewritten using the XYZ formula:
//                 </p>
//                 <div className="space-y-4">
//                   {bullets.map((b, i) => (
//                     <div key={i} style={{
//                       border: '2px solid #000', padding: 16,
//                       background: i % 2 === 0 ? '#FAFAFA' : '#fff',
//                     }}>
//                       {/* Header row */}
//                       <div style={{ display: 'flex', flexWrap: 'wrap',
//                                     gap: 6, marginBottom: 10 }}>
//                         {b.section  && <Tag text={b.section}  bg="#E8F4FF" small />}
//                         {b.company  && <Tag text={b.company}  bg="#FFF9E6" small />}
//                         {b.formulaApplied && (
//                           <Tag text={b.formulaApplied} bg="#A8FF78" small />
//                         )}
//                         {b.weaknessFixed && (
//                           <Tag text={`Fixed: ${b.weaknessFixed}`} bg="#FFE0E0" small />
//                         )}
//                         {b.keywordInjected && (
//                           <Tag text={`Keyword: ${b.keywordInjected}`} bg="#E8FFE8" small />
//                         )}
//                         {b.actionVerbUsed && (
//                           <Tag text={b.actionVerbUsed} bg="#FFE566" small />
//                         )}
//                       </div>

//                       {/* Before → After */}
//                       <div style={{ display: 'grid',
//                                     gridTemplateColumns: '1fr auto 1fr',
//                                     gap: 10, alignItems: 'center',
//                                     marginBottom: 10 }}>
//                         <div style={{ background: '#FFF0F0',
//                                       border: '1px solid #ddd', padding: 10 }}>
//                           <div style={{ fontSize: 11, fontWeight: 800,
//                                         color: '#c00', marginBottom: 4 }}>
//                             ORIGINAL
//                           </div>
//                           <p style={{ fontSize: 13, lineHeight: 1.6,
//                                       textDecoration: 'line-through',
//                                       color: '#888' }}>
//                             {b.original}
//                           </p>
//                         </div>
//                         <ArrowRight size={18} />
//                         <div style={{ background: '#F0FFF0',
//                                       border: '1px solid #ddd', padding: 10 }}>
//                           <div style={{ fontSize: 11, fontWeight: 800,
//                                         color: '#2a7a2a', marginBottom: 4 }}>
//                             REWRITTEN
//                           </div>
//                           <p style={{ fontSize: 13, fontWeight: 600,
//                                       lineHeight: 1.6 }}>
//                             {b.rewritten}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Strength bar */}
//                       {b.strengthImprovement !== undefined && (
//                         <div style={{ display: 'flex', alignItems: 'center',
//                                       gap: 10 }}>
//                           <span style={{ fontSize: 11, fontWeight: 700,
//                                          minWidth: 90 }}>
//                             Strength gain:
//                           </span>
//                           <StrengthBar value={b.strengthImprovement} />
//                           {b.metricAdded && (
//                             <Tag text={`Metric: ${b.metricAdded}`}
//                                  bg="#FFF9E6" small />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── SKILLS SECTION REWRITE ── */}
//             {(skills.skillsAdded?.length > 0
//               || Object.keys(skills.rewritten || {}).length > 0) && (
//               <Accordion title="Skills Section Rewrite"
//                          icon={List} bg="#74B9FF">
//                 {/* Categorized skills */}
//                 {Object.entries(skills.rewritten || {}).map(([cat, list]) =>
//                   Array.isArray(list) && list.length > 0 ? (
//                     <div key={cat} style={{ marginBottom: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 12,
//                                     textTransform: 'uppercase',
//                                     marginBottom: 6, color: '#333' }}>
//                         {cat}
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {list.map((s, i) => (
//                           <Tag key={i} text={s} bg="#E8F4FF" small />
//                         ))}
//                       </div>
//                     </div>
//                   ) : null
//                 )}

//                 {/* Added / Removed */}
//                 <div style={{ display: 'grid',
//                               gridTemplateColumns: '1fr 1fr',
//                               gap: 12, marginTop: 14 }}>
//                   {skills.skillsAdded?.length > 0 && (
//                     <div style={{ background: '#F0FFF0',
//                                   border: '2px solid #000', padding: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 8 }}>
//                         Skills Added
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {skills.skillsAdded.map((s, i) => (
//                           <Tag key={i} text={s} bg="#A8FF78" small />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {skills.skillsRemoved?.length > 0 && (
//                     <div style={{ background: '#FFF0F0',
//                                   border: '2px solid #000', padding: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 8 }}>
//                         Skills Removed
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {skills.skillsRemoved.map((s, i) => (
//                           <Tag key={i} text={s} bg="#FF6B6B" small />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {skills.whyReordered && (
//                   <div style={{
//                     marginTop: 12, background: '#FFF9E6',
//                     border: '2px solid #000', padding: '8px 14px',
//                     fontSize: 12, fontWeight: 600,
//                   }}>
//                     <span style={{ fontWeight: 800 }}>Reorder reasoning: </span>
//                     {skills.whyReordered}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── KEYWORD OPTIMIZATION ── */}
//             {(kwOpt.jdKeywordsAdded?.length > 0
//               || kwOpt.jdKeywordsMissing?.length > 0) && (
//               <Accordion title="Keyword Optimization"
//                          icon={Target} bg="#A8FF78">

//                 {/* Coverage summary */}
//                 <div style={{ display: 'flex', gap: 16,
//                               flexWrap: 'wrap', marginBottom: 16 }}>
//                   {kwOpt.totalKeywordCoverage && (
//                     <div style={{ background: '#F0FFF0',
//                                   border: '2px solid #000', padding: '10px 16px' }}>
//                       <div style={{ fontSize: 11, fontWeight: 700,
//                                     textTransform: 'uppercase' }}>
//                         JD Coverage
//                       </div>
//                       <div style={{ fontWeight: 900, fontSize: 24 }}>
//                         {kwOpt.totalKeywordCoverage}
//                       </div>
//                     </div>
//                   )}
//                   {kwOpt.atsPrediction && (
//                     <div style={{ background: '#E8F4FF',
//                                   border: '2px solid #000', padding: '10px 16px' }}>
//                       <div style={{ fontSize: 11, fontWeight: 700,
//                                     textTransform: 'uppercase' }}>
//                         ATS Prediction
//                       </div>
//                       <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>
//                         {kwOpt.atsPrediction}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Keywords added */}
//                 {kwOpt.jdKeywordsAdded?.length > 0 && (
//                   <div style={{ marginBottom: 14 }}>
//                     <div style={{ fontWeight: 800, fontSize: 12,
//                                   textTransform: 'uppercase', marginBottom: 8 }}>
//                       Keywords Injected ({kwOpt.jdKeywordsAdded.length})
//                     </div>
//                     {kwOpt.jdKeywordsAdded.map((k, i) => (
//                       <div key={i} style={{
//                         border: '1px solid #ddd', padding: 10,
//                         marginBottom: 6, background: '#F0FFF0',
//                       }}>
//                         <div style={{ display: 'flex', gap: 8,
//                                       alignItems: 'center', marginBottom: 4 }}>
//                           <Tag text={k.keyword}  bg="#A8FF78" small />
//                           <Tag text={`→ ${k.addedTo}`} bg="#E8F4FF" small />
//                         </div>
//                         {k.inSentence && (
//                           <p style={{ fontSize: 12, color: '#555',
//                                       fontStyle: 'italic', margin: 0 }}>
//                             "{k.inSentence}"
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Keywords still missing */}
//                 {kwOpt.jdKeywordsMissing?.length > 0 && (
//                   <div>
//                     <div style={{ fontWeight: 800, fontSize: 12,
//                                   textTransform: 'uppercase', marginBottom: 8,
//                                   color: '#c00' }}>
//                       Still Missing ({kwOpt.jdKeywordsMissing.length})
//                     </div>
//                     {kwOpt.jdKeywordsMissing.map((k, i) => (
//                       <div key={i} style={{
//                         border: '1px solid #ddd', padding: 10,
//                         marginBottom: 6, background: '#FFF0F0',
//                       }}>
//                         <div style={{ display: 'flex', gap: 8,
//                                       alignItems: 'center', marginBottom: 4 }}>
//                           <Tag text={k.keyword} bg="#FF6B6B" small />
//                         </div>
//                         <div style={{ fontSize: 12, fontWeight: 600 }}>
//                           {k.reason}
//                         </div>
//                         {k.suggestion && (
//                           <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
//                             → {k.suggestion}
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── ACTION VERBS REPLACED ── */}
//             {verbs.length > 0 && (
//               <Accordion title="Action Verbs Replaced"
//                          icon={Zap} bg="#FFE566"
//                          badge={verbs.length}>
//                 <div style={{ display: 'grid',
//                               gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))',
//                               gap: 12 }}>
//                   {verbs.map((v, i) => (
//                     <div key={i} style={{
//                       border: '2px solid #000', padding: 12, background: '#FAFAFA',
//                     }}>
//                       <div style={{ display: 'flex', gap: 8,
//                                     alignItems: 'center', marginBottom: 6 }}>
//                         <Tag text={v.verbUsed} bg="#FFE566" small />
//                         {v.tier && <Tag text={v.tier} bg="#F5F0E8" small />}
//                       </div>
//                       <div style={{ fontSize: 12, color: '#888',
//                                     textDecoration: 'line-through', marginBottom: 4 }}>
//                         {v.original}
//                       </div>
//                       <div style={{ fontSize: 12, fontWeight: 700 }}>
//                         {v.replaced}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {verbsUsed.length > 0 && (
//                   <div style={{ marginTop: 14 }}>
//                     <div style={{ fontWeight: 800, fontSize: 12,
//                                   textTransform: 'uppercase', marginBottom: 8 }}>
//                       Full verb arsenal used:
//                     </div>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                       {verbsUsed.map((v, i) => (
//                         <Tag key={i} text={v} bg="#FFE566" small />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── SECTIONS ANALYSIS ── */}
//             {(secAn.sectionsAdded?.length > 0
//               || secAn.sectionsRemoved?.length > 0
//               || secAn.sectionsReordered?.length > 0) && (
//               <Accordion title="Sections Analysis"
//                          icon={BookOpen} bg="#DDA0DD">
//                 {secAn.sectionsAdded?.length > 0 && (
//                   <div style={{ marginBottom: 14 }}>
//                     <div style={{ fontWeight: 800, fontSize: 12,
//                                   textTransform: 'uppercase',
//                                   marginBottom: 8 }}>
//                       Sections Added
//                     </div>
//                     {secAn.sectionsAdded.map((s, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8,
//                                             marginBottom: 6, fontSize: 13 }}>
//                         <Tag text={s.section} bg="#A8FF78" small />
//                         <span style={{ fontWeight: 600, color: '#555' }}>
//                           {s.reason}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {secAn.sectionsRemoved?.length > 0 && (
//                   <div style={{ marginBottom: 14 }}>
//                     <div style={{ fontWeight: 800, fontSize: 12,
//                                   textTransform: 'uppercase',
//                                   marginBottom: 8 }}>
//                       Sections Removed
//                     </div>
//                     {secAn.sectionsRemoved.map((s, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8,
//                                             marginBottom: 6, fontSize: 13 }}>
//                         <Tag text={s.section} bg="#FF6B6B" small />
//                         <span style={{ fontWeight: 600, color: '#555' }}>
//                           {s.reason}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {secAn.sectionsReordered?.length > 0 && (
//                   <div>
//                     <div style={{ fontWeight: 800, fontSize: 12,
//                                   textTransform: 'uppercase',
//                                   marginBottom: 8 }}>
//                       Sections Reordered
//                     </div>
//                     {secAn.sectionsReordered.map((s, i) => (
//                       <div key={i} style={{
//                         border: '1px solid #ddd', padding: 10,
//                         marginBottom: 6, fontSize: 12, fontWeight: 600,
//                       }}>
//                         <span style={{ fontWeight: 800 }}>{s.section}</span>
//                         {' '}moved from position {s.movedFrom} → {s.movedTo}.{' '}
//                         <span style={{ color: '#555' }}>{s.reason}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── METRICS ADDED ── */}
//             {metrics.length > 0 && (
//               <Accordion title="Metric Placeholders Added"
//                          icon={TrendingUp} bg="#74B9FF"
//                          badge={metrics.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
//                             marginBottom: 14 }}>
//                   Fill these placeholders with real data before applying:
//                 </p>
//                 {metrics.map((m, i) => (
//                   <div key={i} style={{
//                     border: '2px solid #000', padding: 14,
//                     marginBottom: 10, background: '#F8FBFF',
//                   }}>
//                     <div style={{ display: 'flex', gap: 8,
//                                   marginBottom: 8, flexWrap: 'wrap' }}>
//                       <Tag text={m.placeholder} bg="#FFE566" />
//                       {m.section && <Tag text={m.section} bg="#E8F4FF" small />}
//                     </div>
//                     {m.bullet && (
//                       <p style={{ fontSize: 12, fontStyle: 'italic',
//                                   color: '#555', marginBottom: 6 }}>
//                         In: "{m.bullet}"
//                       </p>
//                     )}
//                     <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
//                       Data needed: {m.dataNeeded}
//                     </div>
//                     <div style={{ fontSize: 12, color: '#666' }}>
//                       How to find: {m.howToFill}
//                     </div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── PLACEHOLDER GUIDE ── */}
//             {guide.length > 0 && (
//               <Accordion title="Placeholder Fill Guide"
//                          icon={BookOpen} bg="#FFE566"
//                          badge={guide.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
//                             marginBottom: 14 }}>
//                   Step-by-step instructions to fill every placeholder:
//                 </p>
//                 {guide.map((g, i) => (
//                   <div key={i} style={{
//                     border: '2px solid #000', padding: 14,
//                     marginBottom: 10,
//                     background: i % 2 === 0 ? '#FFFDF0' : '#fff',
//                   }}>
//                     <div style={{ display: 'flex', gap: 10,
//                                   alignItems: 'flex-start', marginBottom: 8 }}>
//                       <div style={{
//                         background: '#000', color: '#FFE566',
//                         fontWeight: 900, fontSize: 14,
//                         minWidth: 28, height: 28,
//                         display: 'flex', alignItems: 'center',
//                         justifyContent: 'center', flexShrink: 0,
//                       }}>
//                         {i + 1}
//                       </div>
//                       <Tag text={g.placeholder} bg="#FFE566" />
//                     </div>
//                     <div style={{ fontSize: 12, color: '#555',
//                                   marginBottom: 4, fontStyle: 'italic' }}>
//                       Location: {g.location}
//                     </div>
//                     <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
//                       What you need: {g.dataNeeded}
//                     </div>
//                     <div style={{
//                       background: '#E8F5E9', border: '1px solid #000',
//                       padding: '6px 10px', fontSize: 12, fontWeight: 600,
//                       borderLeft: '4px solid #000',
//                     }}>
//                       How to find: {g.howToFind}
//                     </div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── SCAM FLAGS ── */}
//             {scam.length > 0 && (
//               <Accordion title="Scam Flags Addressed"
//                          icon={Shield} bg="#FF6B6B"
//                          badge={scam.length}>
//                 {scam.map((s, i) => (
//                   <div key={i} style={{
//                     border: '2px solid #000', padding: 14,
//                     marginBottom: 10, background: '#FFF0F0',
//                   }}>
//                     <div style={{ display: 'flex', gap: 8,
//                                   marginBottom: 8 }}>
//                       <Tag text={s.action} bg={
//                         s.action === 'Removed' ? '#FF6B6B'
//                         : s.action === 'Reframed' ? '#FFE566' : '#FFA07A'
//                       } small />
//                     </div>
//                     <div style={{ fontSize: 12, marginBottom: 4 }}>
//                       <span style={{ fontWeight: 800 }}>Original: </span>
//                       <span style={{ textDecoration: 'line-through',
//                                      color: '#888' }}>
//                         {s.originalClaim}
//                       </span>
//                     </div>
//                     {s.revisedVersion && (
//                       <div style={{ fontSize: 12, fontWeight: 600,
//                                     marginBottom: 4 }}>
//                         <span style={{ fontWeight: 800 }}>Revised: </span>
//                         {s.revisedVersion}
//                       </div>
//                     )}
//                     <div style={{ fontSize: 12, color: '#666' }}>
//                       {s.reason}
//                     </div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── REMAINING GAPS ── */}
//             {gaps.length > 0 && (
//               <Accordion title="Remaining Gaps (Honest Assessment)"
//                          icon={AlertTriangle} bg="#FFA07A"
//                          badge={gaps.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
//                             marginBottom: 14 }}>
//                   These issues could not be fixed by rewriting alone.
//                   You must take real-world action:
//                 </p>
//                 {gaps.map((g, i) => (
//                   <div key={i} style={{
//                     border: '2px solid #000', padding: 14,
//                     marginBottom: 10, background: '#FFF8F0',
//                   }}>
//                     <div style={{ fontWeight: 800, fontSize: 13,
//                                   marginBottom: 4 }}>
//                       Gap: {g.gap}
//                     </div>
//                     <div style={{ fontSize: 12, color: '#666',
//                                   marginBottom: 8 }}>
//                       Why it couldn't be fixed: {g.why}
//                     </div>
//                     <div style={{
//                       background: '#FFE566', border: '2px solid #000',
//                       padding: '8px 12px', fontSize: 12, fontWeight: 700,
//                     }}>
//                       ➡️ Action needed: {g.candidateAction}
//                     </div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── IMPROVEMENTS SUMMARY ── */}
//             {imps.length > 0 && (
//               <Accordion title="All Improvements Made"
//                          icon={Award} bg="#A8FF78">
//                 {imps.map((imp, i) => (
//                   <div key={i} style={{
//                     display: 'flex', gap: 10,
//                     marginBottom: 10, alignItems: 'flex-start',
//                   }}>
//                     <div style={{
//                       background: '#000', color: '#FFE566',
//                       fontWeight: 900, fontSize: 13,
//                       minWidth: 26, height: 26,
//                       display: 'flex', alignItems: 'center',
//                       justifyContent: 'center', flexShrink: 0,
//                     }}>
//                       {i + 1}
//                     </div>
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>
//                       {imp}
//                     </span>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── WHAT STILL NEEDS WORK ── */}
//             {ov.whatStillNeedsWork && (
//               <div style={{
//                 background: '#FFF8E1', border: '3px solid #000',
//                 boxShadow: '4px 4px 0 #000', padding: '16px 20px',
//               }}>
//                 <div style={{ fontWeight: 900, fontSize: 13,
//                               textTransform: 'uppercase', marginBottom: 6 }}>
//                   ⚠️ What still needs work
//                 </div>
//                 <p style={{ fontSize: 14, fontWeight: 600, color: '#555' }}>
//                   {ov.whatStillNeedsWork}
//                 </p>
//               </div>
//             )}

//             {/* ── REGENERATE ── */}
//             <div style={{ textAlign: 'center', paddingBottom: 32 }}>
//               <button
//                 onClick={() => {
//                   setResult(null);
//                   window.scrollTo({ top: 0, behavior: 'smooth' });
//                 }}
//                 style={{
//                   background: '#fff', border: '3px solid #000',
//                   boxShadow: '5px 5px 0 #000', padding: '12px 32px',
//                   fontWeight: 800, cursor: 'pointer', fontSize: 14,
//                   textTransform: 'uppercase',
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                 }}
//               >
//                 <RefreshCw size={16} /> Rewrite Another Resume
//               </button>
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default RewritePage;



































// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar } from '../pages/Navbar';
// import { resumeAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import FeaturePageGuard from '../components/FeaturePageGuard';
// import {
//   ArrowLeft, Loader2, FileText, Send, Download, Copy, Check,
//   Upload, RefreshCw, Home, ChevronDown, ChevronUp, AlertTriangle,
//   TrendingUp, Target, Zap, BookOpen, Eye, Star, X,
//   ArrowRight, Shield, List, BarChart2, Award
// } from 'lucide-react';

// // ─── ScoreChip — hides when score is 0/missing, never shows red 0 ──
// const ScoreChip = ({ score, label, size = 'md' }) => {
//   const s = Number(score);
//   if (!s) {
//     return label ? (
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div>
//         <div style={{ fontWeight: 800, fontSize: 18, color: '#888' }}>—</div>
//       </div>
//     ) : null;
//   }
//   const bg  = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
//   const fz  = size === 'lg' ? 40 : size === 'md' ? 26 : 16;
//   const pad = size === 'lg' ? '14px 22px' : size === 'md' ? '10px 16px' : '5px 10px';
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div style={{ background: bg, border: '3px solid #000', boxShadow: '4px 4px 0 #000',
//                     padding: pad, fontWeight: 900, fontSize: fz, color: '#000',
//                     display: 'inline-block', lineHeight: 1 }}>
//         {s}
//       </div>
//       {label && (
//         <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', color: '#555' }}>
//           {label}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── StatBox — renders number/string stats, shows "—" only when truly missing ──
// const StatBox = ({ label, value, accent = '#FFE566' }) => {
//   const display = (value !== undefined && value !== null && value !== '') ? value : null;
//   return (
//     <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '10px 14px' }}>
//       <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
//         {label}
//       </div>
//       <div style={{
//         fontWeight: 900,
//         fontSize: display === null ? 18 : typeof display === 'number' ? 24 : 14,
//         color: display === null ? '#555' : accent,
//         lineHeight: 1.3,
//       }}>
//         {display ?? '—'}
//       </div>
//     </div>
//   );
// };

// const GainChip = ({ gain }) => {
//   const g  = Number(gain) || 0;
//   const bg = g > 0 ? '#A8FF78' : g < 0 ? '#FF6B6B' : '#F5F0E8';
//   return (
//     <span style={{ background: bg, border: '2px solid #000', padding: '3px 12px',
//                    fontWeight: 800, fontSize: 14, display: 'inline-block' }}>
//       {g > 0 ? `+${g}` : g}
//     </span>
//   );
// };

// const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
//   <span style={{ background: bg, border: '2px solid #000',
//                  padding: small ? '2px 8px' : '4px 12px',
//                  fontSize: small ? 11 : 12, fontWeight: 700, display: 'inline-block' }}>
//     {text}
//   </span>
// );

// const VerdictBadge = ({ verdict }) => {
//   if (!verdict) return null;
//   const map = {
//     'READY TO SUBMIT':                   { bg: '#A8FF78', icon: '✅' },
//     'SUBMIT AFTER FILLING PLACEHOLDERS': { bg: '#FFE566', icon: '📝' },
//     'NEEDS CANDIDATE ADDITIONS':         { bg: '#FFA07A', icon: '⚠️' },
//     'SIGNIFICANT GAPS REMAIN':           { bg: '#FF6B6B', icon: '❌' },
//   };
//   const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
//   return (
//     <span style={{ background: cfg.bg, border: '3px solid #000', boxShadow: '4px 4px 0 #000',
//                    padding: '10px 20px', fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
//                    display: 'inline-flex', alignItems: 'center', gap: 8 }}>
//       {cfg.icon} {verdict}
//     </span>
//   );
// };

// const CopyButton = ({ text, label = 'Copy' }) => {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//       style={{ background: copied ? '#A8FF78' : '#fff', border: '2px solid #000', padding: '6px 14px',
//                fontWeight: 700, fontSize: 12, cursor: 'pointer',
//                display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #000' }}>
//       {copied ? <Check size={13} /> : <Copy size={13} />}
//       {copied ? 'Copied!' : label}
//     </button>
//   );
// };

// const Accordion = ({ title, icon: Icon, bg = '#F5F0E8', defaultOpen = false, badge, children }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', marginBottom: 20 }}>
//       <button onClick={() => setOpen(o => !o)}
//         style={{ width: '100%', background: bg, border: 'none',
//                  borderBottom: open ? '3px solid #000' : 'none', padding: '14px 20px',
//                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                  cursor: 'pointer', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
//         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           {Icon && <Icon size={18} />}
//           {title}
//           {badge != null && (
//             <span style={{ background: '#000', color: '#FFE566', padding: '1px 8px', fontSize: 12, fontWeight: 900 }}>
//               {badge}
//             </span>
//           )}
//         </span>
//         {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>
//       {open && <div style={{ background: '#fff', padding: 20 }}>{children}</div>}
//     </div>
//   );
// };

// const StrengthBar = ({ value }) => {
//   const v   = Math.min(Math.max(Number(value) || 0, 0), 10);
//   const pct = (v / 10) * 100;
//   const bg  = v >= 8 ? '#A8FF78' : v >= 5 ? '#FFE566' : '#FF6B6B';
//   return (
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       <div style={{ flex: 1, height: 10, background: '#F5F0E8', border: '2px solid #000' }}>
//         <div style={{ width: `${pct}%`, height: '100%', background: bg, transition: 'width 0.4s' }} />
//       </div>
//       <span style={{ fontWeight: 800, fontSize: 12, minWidth: 28 }}>{v}/10</span>
//     </div>
//   );
// };

// // ─── Markdown-aware resume renderer ──────────────────────────────
// const ResumeContent = ({ content }) => (
//   <div style={{ background: '#FAFAF8', border: '2px solid #ddd', padding: '28px 32px',
//                 fontFamily: 'monospace', lineHeight: 1.8, fontSize: 14,
//                 maxHeight: 600, overflowY: 'auto' }}>
//     {(content || '').split('\n').map((line, i) => {
//       if (line.startsWith('## '))
//         return <div key={i} style={{ fontWeight: 900, fontSize: 16, marginTop: 20, marginBottom: 6,
//                                       borderBottom: '2px solid #000', paddingBottom: 4,
//                                       fontFamily: 'sans-serif' }}>{line.replace('## ', '')}</div>;
//       if (line.startsWith('# '))
//         return <div key={i} style={{ fontWeight: 900, fontSize: 22, marginBottom: 8,
//                                       fontFamily: 'sans-serif' }}>{line.replace('# ', '')}</div>;
//       if (line.startsWith('• ') || line.startsWith('- '))
//         return (
//           <div key={i} style={{ paddingLeft: 16, marginBottom: 3, fontSize: 13 }}>
//             <span style={{ marginRight: 6, fontWeight: 700 }}>•</span>
//             {line.replace(/^[•\-]\s/, '')}
//           </div>
//         );
//       return (
//         <p key={i} style={{ margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
//                              minHeight: line.trim() === '' ? 8 : 'auto' }}>
//           {line}
//         </p>
//       );
//     })}
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════
// export const RewritePage = () => {
//   const [loading,    setLoading]    = useState(false);
//   const [result,     setResult]     = useState(null);
//   const [file,       setFile]       = useState(null);
//   const [tone,       setTone]       = useState('Professional');
//   const [targetRole, setTargetRole] = useState('');
//   const [jobDesc,    setJobDesc]    = useState('');
//   const resultRef = useRef(null);

//   const TONES = ['Professional', 'Executive', 'Creative', 'Technical', 'Modern'];

//   const handleFile = (f) => {
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('PDF only'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');  return; }
//     setFile(f);
//   };

//   // ── Submit ───────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)              { toast.error('Upload a resume PDF');   return; }
//     if (!targetRole.trim()) { toast.error('Enter the target role'); return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       const fd = new FormData();
//       fd.append('file', file);
//       fd.append('targetRole', targetRole);
//       fd.append('tone', tone);
//       fd.append('jobDescription', jobDesc);

//       const response = await resumeAPI.rewriteWithUpload(fd);
//       const data = response.data;

//       // ── Bulletproof normalizer — handles every possible backend shape ──
//       // Shape A: { parsed: { rewrittenResume:{}, overview:{}, ... }, result:"...", modelUsed:"..." }
//       // Shape B: { result: "<JSON string>", modelUsed: "..." }  (no parsed key)
//       // Shape C: data IS the result object itself
//       let raw = null;
//       if (data?.parsed && typeof data.parsed === 'object') {
//         raw = data.parsed;                                    // Shape A
//       } else if (data?.result && typeof data.result === 'string') {
//         try { raw = JSON.parse(data.result); } catch { raw = null; }  // Shape B
//       }
//       if (!raw || typeof raw !== 'object') raw = data || {};  // Shape C

//       // Normalise into one consistent structure
//       const finalResult = {
//         rewrittenResume: {
//           content:                   raw?.rewrittenResume?.content  || raw?.content  || '',
//           wordCount:                 raw?.rewrittenResume?.wordCount || raw?.wordCount || 0,
//           sectionCount:              raw?.rewrittenResume?.sectionCount || 0,
//           estimatedAtsScore:         raw?.rewrittenResume?.estimatedAtsScore    || raw?.estimatedAtsScore    || null,
//           estimatedReadabilityScore: raw?.rewrittenResume?.estimatedReadabilityScore || raw?.estimatedReadabilityScore || null,
//         },
//         summaryRewrite:        raw?.summaryRewrite        || {},
//         bulletTransformations: raw?.bulletTransformations || [],
//         skillsSectionRewrite:  raw?.skillsSectionRewrite  || {},
//         keywordsAdded:         raw?.keywordsAdded         || [],
//         keywordOptimization:   raw?.keywordOptimization   || {},
//         sectionsAnalysis:      raw?.sectionsAnalysis      || {},
//         scamFlagsAddressed:    raw?.scamFlagsAddressed    || [],
//         metricsAdded:          raw?.metricsAdded          || [],
//         actionVerbsReplaced:   raw?.actionVerbsReplaced   || [],
//         beforeAfterScores:     raw?.beforeAfterScores     || {},
//         improvements:          raw?.improvements          || [],
//         metricsAddedList:      raw?.metricsAddedList      || [],
//         actionVerbsUsed:       raw?.actionVerbsUsed       || [],
//         remainingGaps:         raw?.remainingGaps         || [],
//         placeholderGuide:      raw?.placeholderGuide      || [],
//         overview:              raw?.overview              || {},
//       };

//       if (!finalResult.rewrittenResume.content) {
//         throw new Error('Empty rewrite received — please retry.');
//       }

//       setResult(finalResult);
//       toast.success('Resume rewritten successfully!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Rewrite failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadResume = () => {
//     const content = result?.rewrittenResume?.content;
//     if (!content) return;
//     const blob = new Blob([content], { type: 'text/markdown' });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement('a');
//     a.href = url; a.download = 'rewritten-resume.md';
//     document.body.appendChild(a); a.click();
//     document.body.removeChild(a); URL.revokeObjectURL(url);
//   };

//   // ── Shortcuts ────────────────────────────────────────────────────
//   const rr        = result?.rewrittenResume       || {};
//   const sumRw     = result?.summaryRewrite        || {};
//   const bullets   = result?.bulletTransformations || [];
//   const skills    = result?.skillsSectionRewrite  || {};
//   const kwOpt     = result?.keywordOptimization   || {};
//   const scam      = result?.scamFlagsAddressed    || [];
//   const metrics   = result?.metricsAdded          || [];
//   const verbs     = result?.actionVerbsReplaced   || [];
//   const bas       = result?.beforeAfterScores     || {};
//   const gaps      = result?.remainingGaps         || [];
//   const guide     = result?.placeholderGuide      || [];
//   const ov        = result?.overview              || {};
//   const imps      = result?.improvements          || [];
//   const kwAdded   = result?.keywordsAdded         || [];
//   const verbsUsed = result?.actionVerbsUsed       || [];

//   // FIX: backend sometimes uses g.action instead of g.candidateAction
//   const gapAction = (g) => g?.candidateAction || g?.action || '';

//   return (
//     <div className="min-h-screen bg-neo-offwhite">
//          <FeaturePageGuard action="resume_rewrite" />
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

//         {/* ── FORM CARD ── */}
//         <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '7px 7px 0 #000', padding: 32 }}>
//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#DDA0DD', border: '3px solid #000',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <RefreshCw size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">RESUME REWRITER</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>XYZ formula · ATS-optimized · Keyword-injected</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* PDF Upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
//                 onDragOver={e => e.preventDefault()}
//                 style={{ border: '3px dashed #000', background: file ? '#A8FF78' : '#F5F0E8',
//                          padding: 28, textAlign: 'center', transition: 'background 0.2s' }}>
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={26} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ color: '#555', fontSize: 12 }}>({(file.size / 1024).toFixed(0)} KB)</span>
//                     <button type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000', padding: '2px 8px',
//                                cursor: 'pointer', fontWeight: 900 }}>
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
//                     <label style={{ cursor: 'pointer' }}>
//                       <span style={{ background: '#FFE566', border: '3px solid #000', boxShadow: '3px 3px 0 #000',
//                                      padding: '10px 24px', fontWeight: 800, display: 'inline-block' }}>
//                         Browse or Drop PDF
//                       </span>
//                       <input type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888', fontWeight: 600 }}>PDF only · Max 5MB</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Target Role */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Target Role <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
//                 placeholder="e.g. Senior Software Engineer, Data Scientist..."
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                          fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//             </div>

//             {/* Job Description */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Description
//                 <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8, color: '#555' }}>
//                   (Paste for targeted keyword injection)
//                 </span>
//               </label>
//               <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
//                 placeholder="Paste the job description here for better keyword matching..."
//                 rows={4}
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px', fontWeight: 600,
//                          fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
//                          fontFamily: 'inherit' }} />
//             </div>

//             {/* Tone */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Tone</label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                 {TONES.map(t => (
//                   <button key={t} type="button" onClick={() => setTone(t)}
//                     style={{ background: tone === t ? '#FFE566' : '#fff', border: '3px solid #000',
//                              fontWeight: 800, padding: '8px 18px', cursor: 'pointer', fontSize: 13,
//                              boxShadow: tone === t ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                              transform: tone === t ? 'translate(2px,2px)' : 'none', transition: 'all 0.1s' }}>
//                     {t}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Submit */}
//             <button type="submit" disabled={loading || !file}
//               style={{ width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
//                        border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #DDA0DD',
//                        padding: 16, fontWeight: 900, fontSize: 16,
//                        cursor: loading || !file ? 'not-allowed' : 'pointer',
//                        textTransform: 'uppercase', letterSpacing: 1,
//                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Rewriting your resume...</>
//                 : <><Send size={20} /> Rewrite Resume</>}
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════════════════════════════════════════
//             ALL RESULTS — single guard block
//         ════════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* ── OVERVIEW BANNER ── */}
//             <div style={{ background: '#000', color: '#fff', border: '3px solid #000',
//                           boxShadow: '7px 7px 0 #DDA0DD', padding: '24px 28px' }}>

//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start',
//                             justifyContent: 'space-between', marginBottom: 20 }}>
//                 <div>
//                   <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700,
//                                 textTransform: 'uppercase', marginBottom: 8 }}>
//                     Rewrite Verdict
//                   </div>
//                   {/* FIX: VerdictBadge returns null when verdict is falsy — no more empty colored square */}
//                   <VerdictBadge verdict={ov.finalVerdict} />
//                   {ov.finalVerdictReason && (
//                     <div style={{ marginTop: 8, fontSize: 13, color: '#bbb', fontWeight: 600, maxWidth: 420 }}>
//                       {ov.finalVerdictReason}
//                     </div>
//                   )}
//                 </div>
//                 {/* FIX: quality score — only show chip when value is real (not 0) */}
//                 <div style={{ textAlign: 'center' }}>
//                   {ov.rewriteQualityScore ? (
//                     <>
//                       <ScoreChip score={ov.rewriteQualityScore} size="lg" />
//                       <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Rewrite Quality</div>
//                       {ov.rewriteQuality && (
//                         <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{ov.rewriteQuality}</div>
//                       )}
//                     </>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Stats grid — FIX: StatBox correctly shows numbers/strings vs "—" */}
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
//                             gap: 14, marginBottom: 16 }}>
//                 <StatBox label="Bullets Rewritten"   value={ov.totalBulletsRewritten} />
//                 <StatBox label="Keywords Added"       value={ov.totalKeywordsAdded} />
//                 <StatBox label="Metrics Injected"     value={ov.totalMetricsAdded} />
//                 <StatBox label="Banned Phrases Fixed" value={ov.totalBannedPhrasesRemoved} />
//                 <StatBox label="ATS Pass Rate"        value={ov.atsPassPercent}   accent="#74B9FF" />
//                 <StatBox label="Readiness"            value={ov.readinessLevel}   accent="#A8FF78" />
//               </div>

//               {ov.hiringManagerReaction && (
//                 <div style={{ background: '#1a1a1a', border: '2px solid #444', padding: '10px 16px',
//                               fontSize: 13, fontStyle: 'italic', color: '#ccc' }}>
//                   <span style={{ fontStyle: 'normal', fontWeight: 800, color: '#FFE566', marginRight: 8 }}>
//                     Hiring Manager:
//                   </span>
//                   "{ov.hiringManagerReaction}"
//                 </div>
//               )}
//             </div>

//             {/* ── BEFORE / AFTER SCORES ── */}
//             {bas.before && bas.after && (
//               <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000' }}>
//                 <div style={{ background: '#74B9FF', borderBottom: '3px solid #000', padding: '12px 20px',
//                               fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
//                               display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <BarChart2 size={18} /> Before → After Score Comparison
//                 </div>
//                 <div style={{ background: '#fff', padding: 20 }}>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16,
//                                 alignItems: 'center', marginBottom: 20 }}>
//                     {/* Before */}
//                     <div style={{ border: '2px solid #000', padding: 16, background: '#FFF0F0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
//                                     marginBottom: 12, color: '#c00' }}>Before</div>
//                       <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
//                         <ScoreChip score={bas.before.estimatedScore}       label="Score" />
//                         <ScoreChip score={bas.before.estimatedAts}         label="ATS"   />
//                         <ScoreChip score={bas.before.estimatedReadability} label="Read"  />
//                       </div>
//                       {(bas.before.mainProblems || []).map((p, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                           <X size={13} style={{ color: '#c00', flexShrink: 0, marginTop: 2 }} />{p}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Gains */}
//                     <div style={{ textAlign: 'center' }}>
//                       <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>→</div>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//                         <GainChip gain={bas.scoreGain} />
//                         <GainChip gain={bas.atsGain} />
//                         <GainChip gain={bas.readabilityGain} />
//                       </div>
//                     </div>

//                     {/* After */}
//                     <div style={{ border: '2px solid #000', padding: 16, background: '#F0FFF0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
//                                     marginBottom: 12, color: '#2a7a2a' }}>After</div>
//                       <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
//                         <ScoreChip score={bas.after.estimatedScore}       label="Score" />
//                         <ScoreChip score={bas.after.estimatedAts}         label="ATS"   />
//                         <ScoreChip score={bas.after.estimatedReadability} label="Read"  />
//                       </div>
//                       {(bas.after.mainImprovements || []).map((p, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                           <Check size={13} style={{ color: '#2a7a2a', flexShrink: 0, marginTop: 2 }} />{p}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Top wins + remaining */}
//                   {(ov.topThreeWins?.length > 0 || ov.topThreeRemaining?.length > 0) && (
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                       {ov.topThreeWins?.length > 0 && (
//                         <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: 14 }}>
//                           <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
//                             Top Wins
//                           </div>
//                           {ov.topThreeWins.map((w, i) => (
//                             <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
//                               <Star size={13} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />{w}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                       {ov.topThreeRemaining?.length > 0 && (
//                         <div style={{ background: '#FFF8E1', border: '2px solid #000', padding: 14 }}>
//                           <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
//                             Still Needed
//                           </div>
//                           {ov.topThreeRemaining.map((w, i) => (
//                             <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
//                               <AlertTriangle size={13} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />{w}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* ── REWRITTEN RESUME ── */}
//             <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
//               <div style={{ background: '#A8FF78', borderBottom: '3px solid #000', padding: '14px 20px',
//                             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                             flexWrap: 'wrap', gap: 12 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                   <FileText size={20} />
//                   <span style={{ fontWeight: 900, fontSize: 15, textTransform: 'uppercase' }}>Rewritten Resume</span>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     {rr.wordCount > 0 && <Tag text={`${rr.wordCount} words`} small />}
//                     {rr.estimatedAtsScore && (
//                       <Tag text={`ATS: ${rr.estimatedAtsScore}`}
//                            bg={rr.estimatedAtsScore >= 80 ? '#A8FF78' : '#FFE566'} small />
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ display: 'flex', gap: 8 }}>
//                   <CopyButton text={rr.content || ''} label="Copy Resume" />
//                   <button onClick={downloadResume}
//                     style={{ background: '#000', color: '#fff', border: '2px solid #000', padding: '6px 14px',
//                              fontWeight: 700, fontSize: 12, cursor: 'pointer',
//                              display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #555' }}>
//                     <Download size={13} /> Download .md
//                   </button>
//                 </div>
//               </div>
//               <div style={{ background: '#fff', padding: 28 }}>
//                 <ResumeContent content={rr.content} />
//               </div>
//             </div>

//             {/* ── SUMMARY REWRITE ── */}
//             {/* FIX: was checking summary.original !== undefined — works even when summary={} */}
//             {sumRw.rewritten && (
//               <Accordion title="Summary Rewrite" icon={FileText} bg="#FFE566" defaultOpen>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
//                   <div style={{ border: '2px solid #000', padding: 14, background: '#FFF0F0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#c00' }}>Original</div>
//                     <p style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.7, color: '#666' }}>
//                       {sumRw.original || 'No original summary detected'}
//                     </p>
//                   </div>
//                   <div style={{ border: '2px solid #000', padding: 14, background: '#F0FFF0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#2a7a2a' }}>Rewritten</div>
//                     <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.7 }}>{sumRw.rewritten}</p>
//                   </div>
//                 </div>
//                 {sumRw.whyBetter && (
//                   <div style={{ background: '#E8F5E9', border: '2px solid #000', padding: '10px 14px',
//                                 borderLeft: '5px solid #000', fontSize: 13, fontWeight: 600 }}>
//                     <span style={{ fontWeight: 800 }}>Why it's better: </span>{sumRw.whyBetter}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── IMPROVEMENTS SUMMARY ── always shown if populated ── */}
//             {imps.length > 0 && (
//               <Accordion title="All Improvements Made" icon={Award} bg="#A8FF78" defaultOpen badge={imps.length}>
//                 {imps.map((imp, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
//                     <div style={{ background: '#000', color: '#FFE566', fontWeight: 900, fontSize: 13,
//                                   minWidth: 26, height: 26, display: 'flex', alignItems: 'center',
//                                   justifyContent: 'center', flexShrink: 0 }}>
//                       {i + 1}
//                     </div>
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>{imp}</span>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── BULLET TRANSFORMATIONS ── */}
//             {bullets.length > 0 && (
//               <Accordion title="Bullet Transformations" icon={Zap} bg="#FFA07A" badge={bullets.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
//                   Every bullet rewritten using the XYZ impact formula:
//                 </p>
//                 {bullets.map((b, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 16,
//                                         marginBottom: 12, background: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
//                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
//                       {b.section        && <Tag text={b.section}                   bg="#E8F4FF" small />}
//                       {b.formulaApplied && <Tag text={b.formulaApplied}            bg="#A8FF78" small />}
//                       {b.weaknessFixed  && <Tag text={`Fixed: ${b.weaknessFixed}`} bg="#FFE0E0" small />}
//                       {b.actionVerbUsed && <Tag text={b.actionVerbUsed}            bg="#FFE566" small />}
//                       {b.metricAdded    && <Tag text={`Metric: ${b.metricAdded}`}  bg="#FFF9E6" small />}
//                     </div>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10,
//                                   alignItems: 'center', marginBottom: 10 }}>
//                       <div style={{ background: '#FFF0F0', border: '1px solid #ddd', padding: 10 }}>
//                         <div style={{ fontSize: 11, fontWeight: 800, color: '#c00', marginBottom: 4 }}>ORIGINAL</div>
//                         <p style={{ fontSize: 13, lineHeight: 1.6, textDecoration: 'line-through', color: '#888' }}>
//                           {b.original}
//                         </p>
//                       </div>
//                       <ArrowRight size={18} />
//                       <div style={{ background: '#F0FFF0', border: '1px solid #ddd', padding: 10 }}>
//                         <div style={{ fontSize: 11, fontWeight: 800, color: '#2a7a2a', marginBottom: 4 }}>REWRITTEN</div>
//                         <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{b.rewritten}</p>
//                       </div>
//                     </div>
//                     {b.strengthImprovement != null && (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <span style={{ fontSize: 11, fontWeight: 700, minWidth: 90 }}>Strength gain:</span>
//                         <StrengthBar value={b.strengthImprovement} />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── SKILLS SECTION REWRITE ── */}
//             {/* FIX: guard now checks skillsAdded/skillsRemoved, not the empty rewritten object */}
//             {(skills.skillsAdded?.length > 0 || skills.skillsRemoved?.length > 0) && (
//               <Accordion title="Skills Section Rewrite" icon={List} bg="#74B9FF">
//                 {Object.entries(skills.rewritten || {}).map(([cat, list]) =>
//                   Array.isArray(list) && list.length > 0 ? (
//                     <div key={cat} style={{ marginBottom: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>{cat}</div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {list.map((s, i) => <Tag key={i} text={s} bg="#E8F4FF" small />)}
//                       </div>
//                     </div>
//                   ) : null
//                 )}
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
//                   {skills.skillsAdded?.length > 0 && (
//                     <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
//                         Skills Added ({skills.skillsAdded.length})
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {skills.skillsAdded.map((s, i) => <Tag key={i} text={s} bg="#A8FF78" small />)}
//                       </div>
//                     </div>
//                   )}
//                   {skills.skillsRemoved?.length > 0 && (
//                     <div style={{ background: '#FFF0F0', border: '2px solid #000', padding: 12 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
//                         Skills Removed ({skills.skillsRemoved.length})
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
//                         {skills.skillsRemoved.map((s, i) => <Tag key={i} text={s} bg="#FF6B6B" small />)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── KEYWORDS ── shows even when only flat kwAdded array exists */}
//             {(kwAdded.length > 0 || kwOpt.jdKeywordsAdded?.length > 0) && (
//               <Accordion title="Keywords Injected" icon={Target} bg="#A8FF78"
//                          badge={kwOpt.jdKeywordsAdded?.length || kwAdded.length}>
//                 {(kwOpt.totalKeywordCoverage || kwOpt.atsPrediction) && (
//                   <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
//                     {kwOpt.totalKeywordCoverage && (
//                       <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: '10px 16px' }}>
//                         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>JD Coverage</div>
//                         <div style={{ fontWeight: 900, fontSize: 20 }}>{kwOpt.totalKeywordCoverage}</div>
//                       </div>
//                     )}
//                     {kwOpt.atsPrediction && (
//                       <div style={{ background: '#E8F4FF', border: '2px solid #000', padding: '10px 16px' }}>
//                         <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>ATS Prediction</div>
//                         <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{kwOpt.atsPrediction}</div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {/* Rich format */}
//                 {kwOpt.jdKeywordsAdded?.length > 0 ? (
//                   kwOpt.jdKeywordsAdded.map((k, i) => (
//                     <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 6, background: '#F0FFF0' }}>
//                       <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                         <Tag text={typeof k === 'string' ? k : k.keyword} bg="#A8FF78" small />
//                         {k.addedTo && <Tag text={`→ ${k.addedTo}`} bg="#E8F4FF" small />}
//                       </div>
//                       {k.inSentence && (
//                         <p style={{ fontSize: 12, color: '#555', fontStyle: 'italic', margin: '4px 0 0' }}>
//                           "{k.inSentence}"
//                         </p>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   // Simple flat array fallback
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {kwAdded.map((kw, i) => <Tag key={i} text={kw} bg="#A8FF78" small />)}
//                   </div>
//                 )}
//                 {kwOpt.jdKeywordsMissing?.length > 0 && (
//                   <div style={{ marginTop: 14 }}>
//                     <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
//                                   marginBottom: 8, color: '#c00' }}>
//                       Still Missing ({kwOpt.jdKeywordsMissing.length})
//                     </div>
//                     {kwOpt.jdKeywordsMissing.map((k, i) => (
//                       <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 6, background: '#FFF0F0' }}>
//                         <Tag text={typeof k === 'string' ? k : k.keyword} bg="#FF6B6B" small />
//                         {k.reason && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{k.reason}</div>}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── ACTION VERBS ── shows rich format OR flat list */}
//             {(verbs.length > 0 || verbsUsed.length > 0) && (
//               <Accordion title="Action Verbs Used" icon={Zap} bg="#FFE566"
//                          badge={verbs.length || verbsUsed.length}>
//                 {verbs.length > 0 ? (
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
//                     {verbs.map((v, i) => (
//                       <div key={i} style={{ border: '2px solid #000', padding: 12, background: '#FAFAFA' }}>
//                         <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
//                           <Tag text={v.verbUsed} bg="#FFE566" small />
//                           {v.tier && <Tag text={v.tier} bg="#F5F0E8" small />}
//                         </div>
//                         {v.original && (
//                           <div style={{ fontSize: 12, color: '#888', textDecoration: 'line-through', marginBottom: 4 }}>
//                             {v.original}
//                           </div>
//                         )}
//                         {v.replaced && <div style={{ fontSize: 12, fontWeight: 700 }}>{v.replaced}</div>}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {verbsUsed.map((v, i) => <Tag key={i} text={v} bg="#FFE566" small />)}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* ── METRICS / PLACEHOLDERS ADDED ── */}
//             {metrics.length > 0 && (
//               <Accordion title="Metric Placeholders Added" icon={TrendingUp} bg="#DDA0DD" badge={metrics.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
//                   Fill these with your real performance data before submitting:
//                 </p>
//                 {metrics.map((m, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10,
//                                         background: i % 2 === 0 ? '#F8F4FF' : '#fff' }}>
//                     <Tag text={m.placeholder} bg="#DDA0DD" />
//                     {m.bullet && (
//                       <div style={{ fontSize: 12, color: '#555', marginTop: 6, fontStyle: 'italic' }}>
//                         In: {m.bullet}
//                       </div>
//                     )}
//                     {m.howToFill && (
//                       <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '6px 10px',
//                                     fontSize: 12, fontWeight: 600, marginTop: 8, borderLeft: '4px solid #000' }}>
//                         How to find: {m.howToFill}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── PLACEHOLDER FILL GUIDE ── */}
//             {guide.length > 0 && (
//               <Accordion title="Placeholder Fill Guide" icon={BookOpen} bg="#FFF9E6" badge={guide.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
//                   Every [X]% in your resume — what it means and where to find the real number:
//                 </p>
//                 {guide.map((g, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10,
//                                         background: i % 2 === 0 ? '#FFFDF0' : '#fff' }}>
//                     <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
//                       <div style={{ background: '#000', color: '#FFE566', fontWeight: 900, fontSize: 14,
//                                     minWidth: 28, height: 28, display: 'flex', alignItems: 'center',
//                                     justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
//                       <Tag text={g.placeholder} bg="#FFE566" />
//                     </div>
//                     {g.location   && <div style={{ fontSize: 12, color: '#555', marginBottom: 4, fontStyle: 'italic' }}>Location: {g.location}</div>}
//                     {g.dataNeeded && <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>What you need: {g.dataNeeded}</div>}
//                     {g.howToFind  && (
//                       <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '6px 10px',
//                                     fontSize: 12, fontWeight: 600, borderLeft: '4px solid #000' }}>
//                         How to find: {g.howToFind}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── REMAINING GAPS ── */}
//             {gaps.length > 0 && (
//               <Accordion title="Remaining Gaps (Honest Assessment)" icon={AlertTriangle}
//                          bg="#FFA07A" badge={gaps.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
//                   These issues couldn't be fixed by rewriting alone:
//                 </p>
//                 {gaps.map((g, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF8F0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>Gap: {g.gap}</div>
//                     {/* FIX: backend uses g.why OR just g alone, both handled */}
//                     {g.why && <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Why: {g.why}</div>}
//                     {gapAction(g) && (
//                       <div style={{ background: '#FFE566', border: '2px solid #000', padding: '8px 12px',
//                                     fontSize: 12, fontWeight: 700 }}>
//                         ➡️ Action: {gapAction(g)}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── SCAM FLAGS ── */}
//             {scam.length > 0 && (
//               <Accordion title="Scam Flags Addressed" icon={Shield} bg="#FF6B6B" badge={scam.length}>
//                 {scam.map((s, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF0F0' }}>
//                     {s.action && <Tag text={s.action} bg={s.action === 'Removed' ? '#FF6B6B' : '#FFE566'} small />}
//                     {s.originalClaim && (
//                       <div style={{ fontSize: 12, marginTop: 8, marginBottom: 4 }}>
//                         <span style={{ fontWeight: 800 }}>Original: </span>
//                         <span style={{ textDecoration: 'line-through', color: '#888' }}>{s.originalClaim}</span>
//                       </div>
//                     )}
//                     {s.revisedVersion && (
//                       <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                         <span style={{ fontWeight: 800 }}>Revised: </span>{s.revisedVersion}
//                       </div>
//                     )}
//                     {s.reason && <div style={{ fontSize: 12, color: '#666' }}>{s.reason}</div>}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── BIGGEST TRANSFORMATION + STILL NEEDS WORK ── */}
//             {(ov.biggestTransformation || ov.whatStillNeedsWork) && (
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                 {ov.biggestTransformation && (
//                   <div style={{ background: '#F0FFF0', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
//                     <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
//                       🏆 Biggest Transformation
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, color: '#2a7a2a' }}>{ov.biggestTransformation}</p>
//                   </div>
//                 )}
//                 {ov.whatStillNeedsWork && (
//                   <div style={{ background: '#FFF8E1', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
//                     <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
//                       ⚠️ Still Needs Work
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>{ov.whatStillNeedsWork}</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── READINESS BADGES ── */}
//             {(ov.interviewReadiness || ov.atsPassPrediction || ov.atsPassPercent) && (
//               <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000',
//                             padding: '16px 20px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
//                 {ov.interviewReadiness && (
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
//                       Interview Readiness
//                     </div>
//                     <Tag text={ov.interviewReadiness}
//                          bg={ov.interviewReadiness === 'Interview-ready' ? '#A8FF78' : '#FFE566'} />
//                   </div>
//                 )}
//                 {ov.atsPassPrediction && (
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
//                       ATS Prediction
//                     </div>
//                     <Tag text={ov.atsPassPrediction}
//                          bg={['Likely Pass', 'Will Pass ATS'].includes(ov.atsPassPrediction) ? '#A8FF78' : '#FFE566'} />
//                   </div>
//                 )}
//                 {ov.atsPassPercent && (
//                   <div>
//                     <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
//                       ATS Pass Rate
//                     </div>
//                     <div style={{ fontWeight: 900, fontSize: 22 }}>{ov.atsPassPercent}</div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── REGENERATE ── */}
//             <div style={{ textAlign: 'center', paddingBottom: 32 }}>
//               <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//                 style={{ background: '#fff', border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                          padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
//                          textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
//                 <RefreshCw size={16} /> Rewrite Another Resume
//               </button>
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default RewritePage;





























import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { SEO } from '../components/SEO';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import FeaturePageGuard, { LockedUploadZone, LockedActionButton } from '../components/FeaturePageGuard';
import {
  ArrowLeft, Loader2, FileText, Send, Download, Copy, Check,
  Upload, RefreshCw, Home, ChevronDown, ChevronUp, AlertTriangle,
  TrendingUp, Target, Zap, BookOpen, Eye, Star, X,
  ArrowRight, Shield, List, BarChart2, Award
} from 'lucide-react';

// ─── ScoreChip — hides when score is 0/missing, never shows red 0 ──
const ScoreChip = ({ score, label, size = 'md' }) => {
  const s = Number(score);
  if (!s) {
    return label ? (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>{label}</div>
        <div style={{ fontWeight: 800, fontSize: 18, color: '#888' }}>—</div>
      </div>
    ) : null;
  }
  const bg  = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
  const fz  = size === 'lg' ? 40 : size === 'md' ? 26 : 16;
  const pad = size === 'lg' ? '14px 22px' : size === 'md' ? '10px 16px' : '5px 10px';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ background: bg, border: '3px solid #000', boxShadow: '4px 4px 0 #000',
                    padding: pad, fontWeight: 900, fontSize: fz, color: '#000',
                    display: 'inline-block', lineHeight: 1 }}>
        {s}
      </div>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', color: '#555' }}>
          {label}
        </div>
      )}
    </div>
  );
};

// ─── StatBox — renders number/string stats, shows "—" only when truly missing ──
const StatBox = ({ label, value, accent = '#FFE566' }) => {
  const display = (value !== undefined && value !== null && value !== '') ? value : null;
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '10px 14px' }}>
      <div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontWeight: 900,
        fontSize: display === null ? 18 : typeof display === 'number' ? 24 : 14,
        color: display === null ? '#555' : accent,
        lineHeight: 1.3,
      }}>
        {display ?? '—'}
      </div>
    </div>
  );
};

const GainChip = ({ gain }) => {
  const g  = Number(gain) || 0;
  const bg = g > 0 ? '#A8FF78' : g < 0 ? '#FF6B6B' : '#F5F0E8';
  return (
    <span style={{ background: bg, border: '2px solid #000', padding: '3px 12px',
                   fontWeight: 800, fontSize: 14, display: 'inline-block' }}>
      {g > 0 ? `+${g}` : g}
    </span>
  );
};

const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
  <span style={{ background: bg, border: '2px solid #000',
                 padding: small ? '2px 8px' : '4px 12px',
                 fontSize: small ? 11 : 12, fontWeight: 700, display: 'inline-block' }}>
    {text}
  </span>
);

const VerdictBadge = ({ verdict }) => {
  if (!verdict) return null;
  const map = {
    'READY TO SUBMIT':                   { bg: '#A8FF78', icon: '✅' },
    'SUBMIT AFTER FILLING PLACEHOLDERS': { bg: '#FFE566', icon: '📝' },
    'NEEDS CANDIDATE ADDITIONS':         { bg: '#FFA07A', icon: '⚠️' },
    'SIGNIFICANT GAPS REMAIN':           { bg: '#FF6B6B', icon: '❌' },
  };
  const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
  return (
    <span style={{ background: cfg.bg, border: '3px solid #000', boxShadow: '4px 4px 0 #000',
                   padding: '10px 20px', fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
                   display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {cfg.icon} {verdict}
    </span>
  );
};

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? '#A8FF78' : '#fff', border: '2px solid #000', padding: '6px 14px',
               fontWeight: 700, fontSize: 12, cursor: 'pointer',
               display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #000' }}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

const Accordion = ({ title, icon: Icon, bg = '#F5F0E8', defaultOpen = false, badge, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: bg, border: 'none',
                 borderBottom: open ? '3px solid #000' : 'none', padding: '14px 20px',
                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 cursor: 'pointer', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icon && <Icon size={18} />}
          {title}
          {badge != null && (
            <span style={{ background: '#000', color: '#FFE566', padding: '1px 8px', fontSize: 12, fontWeight: 900 }}>
              {badge}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div style={{ background: '#fff', padding: 20 }}>{children}</div>}
    </div>
  );
};

const StrengthBar = ({ value }) => {
  const v   = Math.min(Math.max(Number(value) || 0, 0), 10);
  const pct = (v / 10) * 100;
  const bg  = v >= 8 ? '#A8FF78' : v >= 5 ? '#FFE566' : '#FF6B6B';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 10, background: '#F5F0E8', border: '2px solid #000' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: bg, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontWeight: 800, fontSize: 12, minWidth: 28 }}>{v}/10</span>
    </div>
  );
};

// ─── Markdown-aware resume renderer ──────────────────────────────
const ResumeContent = ({ content }) => (
  <div style={{ background: '#FAFAF8', border: '2px solid #ddd', padding: '28px 32px',
                fontFamily: 'monospace', lineHeight: 1.8, fontSize: 14,
                maxHeight: 600, overflowY: 'auto' }}>
    {(content || '').split('\n').map((line, i) => {
      if (line.startsWith('## '))
        return <div key={i} style={{ fontWeight: 900, fontSize: 16, marginTop: 20, marginBottom: 6,
                                      borderBottom: '2px solid #000', paddingBottom: 4,
                                      fontFamily: 'sans-serif' }}>{line.replace('## ', '')}</div>;
      if (line.startsWith('# '))
        return <div key={i} style={{ fontWeight: 900, fontSize: 22, marginBottom: 8,
                                      fontFamily: 'sans-serif' }}>{line.replace('# ', '')}</div>;
      if (line.startsWith('• ') || line.startsWith('- '))
        return (
          <div key={i} style={{ paddingLeft: 16, marginBottom: 3, fontSize: 13 }}>
            <span style={{ marginRight: 6, fontWeight: 700 }}>•</span>
            {line.replace(/^[•\-]\s/, '')}
          </div>
        );
      return (
        <p key={i} style={{ margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
                             minHeight: line.trim() === '' ? 8 : 'auto' }}>
          {line}
        </p>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export const RewritePage = () => {
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [file,       setFile]       = useState(null);
  const [tone,       setTone]       = useState('Professional');
  const [targetRole, setTargetRole] = useState('');
  const [jobDesc,    setJobDesc]    = useState('');
  const resultRef = useRef(null);

  const TONES = ['Professional', 'Executive', 'Creative', 'Technical', 'Modern'];

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('PDF only'); return; }
    if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');  return; }
    setFile(f);
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)              { toast.error('Upload a resume PDF');   return; }
    if (!targetRole.trim()) { toast.error('Enter the target role'); return; }

    setLoading(true);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('targetRole', targetRole);
      fd.append('tone', tone);
      fd.append('jobDescription', jobDesc);

      const response = await resumeAPI.rewriteWithUpload(fd);
      const data = response.data;

      // ── Bulletproof normalizer — handles every possible backend shape ──
      // Shape A: { parsed: { rewrittenResume:{}, overview:{}, ... }, result:"...", modelUsed:"..." }
      // Shape B: { result: "<JSON string>", modelUsed: "..." }  (no parsed key)
      // Shape C: data IS the result object itself
      let raw = null;
      if (data?.parsed && typeof data.parsed === 'object') {
        raw = data.parsed;                                    // Shape A
      } else if (data?.result && typeof data.result === 'string') {
        try { raw = JSON.parse(data.result); } catch { raw = null; }  // Shape B
      }
      if (!raw || typeof raw !== 'object') raw = data || {};  // Shape C

      // Normalise into one consistent structure
      const finalResult = {
        rewrittenResume: {
          content:                   raw?.rewrittenResume?.content  || raw?.content  || '',
          wordCount:                 raw?.rewrittenResume?.wordCount || raw?.wordCount || 0,
          sectionCount:              raw?.rewrittenResume?.sectionCount || 0,
          estimatedAtsScore:         raw?.rewrittenResume?.estimatedAtsScore    || raw?.estimatedAtsScore    || null,
          estimatedReadabilityScore: raw?.rewrittenResume?.estimatedReadabilityScore || raw?.estimatedReadabilityScore || null,
        },
        summaryRewrite:        raw?.summaryRewrite        || {},
        bulletTransformations: raw?.bulletTransformations || [],
        skillsSectionRewrite:  raw?.skillsSectionRewrite  || {},
        keywordsAdded:         raw?.keywordsAdded         || [],
        keywordOptimization:   raw?.keywordOptimization   || {},
        sectionsAnalysis:      raw?.sectionsAnalysis      || {},
        scamFlagsAddressed:    raw?.scamFlagsAddressed    || [],
        metricsAdded:          raw?.metricsAdded          || [],
        actionVerbsReplaced:   raw?.actionVerbsReplaced   || [],
        beforeAfterScores:     raw?.beforeAfterScores     || {},
        improvements:          raw?.improvements          || [],
        metricsAddedList:      raw?.metricsAddedList      || [],
        actionVerbsUsed:       raw?.actionVerbsUsed       || [],
        remainingGaps:         raw?.remainingGaps         || [],
        placeholderGuide:      raw?.placeholderGuide      || [],
        overview:              raw?.overview              || {},
      };

      if (!finalResult.rewrittenResume.content) {
        throw new Error('Empty rewrite received — please retry.');
      }

      setResult(finalResult);
      toast.success('Resume rewritten successfully!');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Rewrite failed');
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = () => {
    const content = result?.rewrittenResume?.content;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'rewritten-resume.md';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // ── Shortcuts ────────────────────────────────────────────────────
  const rr        = result?.rewrittenResume       || {};
  const sumRw     = result?.summaryRewrite        || {};
  const bullets   = result?.bulletTransformations || [];
  const skills    = result?.skillsSectionRewrite  || {};
  const kwOpt     = result?.keywordOptimization   || {};
  const scam      = result?.scamFlagsAddressed    || [];
  const metrics   = result?.metricsAdded          || [];
  const verbs     = result?.actionVerbsReplaced   || [];
  const bas       = result?.beforeAfterScores     || {};
  const gaps      = result?.remainingGaps         || [];
  const guide     = result?.placeholderGuide      || [];
  const ov        = result?.overview              || {};
  const imps      = result?.improvements          || [];
  const kwAdded   = result?.keywordsAdded         || [];
  const verbsUsed = result?.actionVerbsUsed       || [];

  // FIX: backend sometimes uses g.action instead of g.candidateAction
  const gapAction = (g) => g?.candidateAction || g?.action || '';

  return (
    <div className="min-h-screen bg-neo-offwhite">
         <FeaturePageGuard action="resume_rewrite" />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── FORM CARD ── */}
        <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '7px 7px 0 #000', padding: 32 }}>
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: 64, height: 64, background: '#DDA0DD', border: '3px solid #000',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={28} />
            </div>
            <div>
              <h1 className="font-space text-3xl font-extrabold">RESUME REWRITER</h1>
              <p style={{ color: '#666', fontWeight: 600 }}>XYZ formula · ATS-optimized · Keyword-injected</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* PDF Upload */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <LockedUploadZone action="resume_rewrite">
                <div onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  onDragOver={e => e.preventDefault()}
                  style={{ border: '3px dashed #000', background: file ? '#A8FF78' : '#F5F0E8',
                           padding: 28, textAlign: 'center', transition: 'background 0.2s' }}>
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileText size={26} />
                      <span style={{ fontWeight: 800 }}>{file.name}</span>
                      <span style={{ color: '#555', fontSize: 12 }}>({(file.size / 1024).toFixed(0)} KB)</span>
                      <button type="button" onClick={() => setFile(null)}
                        style={{ background: '#FF6B6B', border: '2px solid #000', padding: '2px 8px',
                                 cursor: 'pointer', fontWeight: 900 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                      <label style={{ cursor: 'pointer' }}>
                        <span style={{ background: '#FFE566', border: '3px solid #000', boxShadow: '3px 3px 0 #000',
                                       padding: '10px 24px', fontWeight: 800, display: 'inline-block' }}>
                          Browse or Drop PDF
                        </span>
                        <input type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                      </label>
                      <p style={{ marginTop: 10, fontSize: 12, color: '#888', fontWeight: 600 }}>PDF only · Max 5MB</p>
                    </>
                  )}
                </div>
              </LockedUploadZone>
            </div>

            {/* Target Role */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Target Role <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <input type="text" value={targetRole} onChange={e => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer, Data Scientist..."
                style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
                         fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Job Description */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Job Description
                <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8, color: '#555' }}>
                  (Paste for targeted keyword injection)
                </span>
              </label>
              <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the job description here for better keyword matching..."
                rows={4}
                style={{ width: '100%', border: '3px solid #000', padding: '12px 16px', fontWeight: 600,
                         fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                         fontFamily: 'inherit' }} />
            </div>

            {/* Tone */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Tone</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {TONES.map(t => (
                  <button key={t} type="button" onClick={() => setTone(t)}
                    style={{ background: tone === t ? '#FFE566' : '#fff', border: '3px solid #000',
                             fontWeight: 800, padding: '8px 18px', cursor: 'pointer', fontSize: 13,
                             boxShadow: tone === t ? '2px 2px 0 #000' : '4px 4px 0 #000',
                             transform: tone === t ? 'translate(2px,2px)' : 'none', transition: 'all 0.1s' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <LockedActionButton
              action="resume_rewrite"
              onClick={handleSubmit}
              disabled={loading || !file}
              style={{ width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
                       border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #DDA0DD',
                       padding: 16, fontWeight: 900, fontSize: 16,
                       cursor: loading || !file ? 'not-allowed' : 'pointer',
                       textTransform: 'uppercase', letterSpacing: 1,
                       display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Rewriting your resume...</>
                : <><Send size={20} /> Rewrite Resume</>}
            </LockedActionButton>
          </form>
        </div>

        {/* ════════════════════════════════════════════════════════
            ALL RESULTS — single guard block
        ════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="space-y-6">

            {/* ── OVERVIEW BANNER ── */}
            <div style={{ background: '#000', color: '#fff', border: '3px solid #000',
                          boxShadow: '7px 7px 0 #DDA0DD', padding: '24px 28px' }}>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start',
                            justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700,
                                textTransform: 'uppercase', marginBottom: 8 }}>
                    Rewrite Verdict
                  </div>
                  {/* FIX: VerdictBadge returns null when verdict is falsy — no more empty colored square */}
                  <VerdictBadge verdict={ov.finalVerdict} />
                  {ov.finalVerdictReason && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#bbb', fontWeight: 600, maxWidth: 420 }}>
                      {ov.finalVerdictReason}
                    </div>
                  )}
                </div>
                {/* FIX: quality score — only show chip when value is real (not 0) */}
                <div style={{ textAlign: 'center' }}>
                  {ov.rewriteQualityScore ? (
                    <>
                      <ScoreChip score={ov.rewriteQualityScore} size="lg" />
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Rewrite Quality</div>
                      {ov.rewriteQuality && (
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{ov.rewriteQuality}</div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              {/* Stats grid — FIX: StatBox correctly shows numbers/strings vs "—" */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                            gap: 14, marginBottom: 16 }}>
                <StatBox label="Bullets Rewritten"   value={ov.totalBulletsRewritten} />
                <StatBox label="Keywords Added"       value={ov.totalKeywordsAdded} />
                <StatBox label="Metrics Injected"     value={ov.totalMetricsAdded} />
                <StatBox label="Banned Phrases Fixed" value={ov.totalBannedPhrasesRemoved} />
                <StatBox label="ATS Pass Rate"        value={ov.atsPassPercent}   accent="#74B9FF" />
                <StatBox label="Readiness"            value={ov.readinessLevel}   accent="#A8FF78" />
              </div>

              {ov.hiringManagerReaction && (
                <div style={{ background: '#1a1a1a', border: '2px solid #444', padding: '10px 16px',
                              fontSize: 13, fontStyle: 'italic', color: '#ccc' }}>
                  <span style={{ fontStyle: 'normal', fontWeight: 800, color: '#FFE566', marginRight: 8 }}>
                    Hiring Manager:
                  </span>
                  "{ov.hiringManagerReaction}"
                </div>
              )}
            </div>

            {/* ── BEFORE / AFTER SCORES ── */}
            {bas.before && bas.after && (
              <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000' }}>
                <div style={{ background: '#74B9FF', borderBottom: '3px solid #000', padding: '12px 20px',
                              fontWeight: 900, fontSize: 14, textTransform: 'uppercase',
                              display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart2 size={18} /> Before → After Score Comparison
                </div>
                <div style={{ background: '#fff', padding: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16,
                                alignItems: 'center', marginBottom: 20 }}>
                    {/* Before */}
                    <div style={{ border: '2px solid #000', padding: 16, background: '#FFF0F0' }}>
                      <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
                                    marginBottom: 12, color: '#c00' }}>Before</div>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
                        <ScoreChip score={bas.before.estimatedScore}       label="Score" />
                        <ScoreChip score={bas.before.estimatedAts}         label="ATS"   />
                        <ScoreChip score={bas.before.estimatedReadability} label="Read"  />
                      </div>
                      {(bas.before.mainProblems || []).map((p, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                          <X size={13} style={{ color: '#c00', flexShrink: 0, marginTop: 2 }} />{p}
                        </div>
                      ))}
                    </div>

                    {/* Gains */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>→</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <GainChip gain={bas.scoreGain} />
                        <GainChip gain={bas.atsGain} />
                        <GainChip gain={bas.readabilityGain} />
                      </div>
                    </div>

                    {/* After */}
                    <div style={{ border: '2px solid #000', padding: 16, background: '#F0FFF0' }}>
                      <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
                                    marginBottom: 12, color: '#2a7a2a' }}>After</div>
                      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
                        <ScoreChip score={bas.after.estimatedScore}       label="Score" />
                        <ScoreChip score={bas.after.estimatedAts}         label="ATS"   />
                        <ScoreChip score={bas.after.estimatedReadability} label="Read"  />
                      </div>
                      {(bas.after.mainImprovements || []).map((p, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                          <Check size={13} style={{ color: '#2a7a2a', flexShrink: 0, marginTop: 2 }} />{p}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top wins + remaining */}
                  {(ov.topThreeWins?.length > 0 || ov.topThreeRemaining?.length > 0) && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {ov.topThreeWins?.length > 0 && (
                        <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: 14 }}>
                          <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
                            Top Wins
                          </div>
                          {ov.topThreeWins.map((w, i) => (
                            <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                              <Star size={13} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />{w}
                            </div>
                          ))}
                        </div>
                      )}
                      {ov.topThreeRemaining?.length > 0 && (
                        <div style={{ background: '#FFF8E1', border: '2px solid #000', padding: 14 }}>
                          <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
                            Still Needed
                          </div>
                          {ov.topThreeRemaining.map((w, i) => (
                            <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                              <AlertTriangle size={13} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />{w}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── REWRITTEN RESUME ── */}
            <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
              <div style={{ background: '#A8FF78', borderBottom: '3px solid #000', padding: '14px 20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileText size={20} />
                  <span style={{ fontWeight: 900, fontSize: 15, textTransform: 'uppercase' }}>Rewritten Resume</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {rr.wordCount > 0 && <Tag text={`${rr.wordCount} words`} small />}
                    {rr.estimatedAtsScore && (
                      <Tag text={`ATS: ${rr.estimatedAtsScore}`}
                           bg={rr.estimatedAtsScore >= 80 ? '#A8FF78' : '#FFE566'} small />
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <CopyButton text={rr.content || ''} label="Copy Resume" />
                  <button onClick={downloadResume}
                    style={{ background: '#000', color: '#fff', border: '2px solid #000', padding: '6px 14px',
                             fontWeight: 700, fontSize: 12, cursor: 'pointer',
                             display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #555' }}>
                    <Download size={13} /> Download .md
                  </button>
                </div>
              </div>
              <div style={{ background: '#fff', padding: 28 }}>
                <ResumeContent content={rr.content} />
              </div>
            </div>

            {/* ── SUMMARY REWRITE ── */}
            {/* FIX: was checking summary.original !== undefined — works even when summary={} */}
            {sumRw.rewritten && (
              <Accordion title="Summary Rewrite" icon={FileText} bg="#FFE566" defaultOpen>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                  <div style={{ border: '2px solid #000', padding: 14, background: '#FFF0F0' }}>
                    <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase',
                                  marginBottom: 8, color: '#c00' }}>Original</div>
                    <p style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 1.7, color: '#666' }}>
                      {sumRw.original || 'No original summary detected'}
                    </p>
                  </div>
                  <div style={{ border: '2px solid #000', padding: 14, background: '#F0FFF0' }}>
                    <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase',
                                  marginBottom: 8, color: '#2a7a2a' }}>Rewritten</div>
                    <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.7 }}>{sumRw.rewritten}</p>
                  </div>
                </div>
                {sumRw.whyBetter && (
                  <div style={{ background: '#E8F5E9', border: '2px solid #000', padding: '10px 14px',
                                borderLeft: '5px solid #000', fontSize: 13, fontWeight: 600 }}>
                    <span style={{ fontWeight: 800 }}>Why it's better: </span>{sumRw.whyBetter}
                  </div>
                )}
              </Accordion>
            )}

            {/* ── IMPROVEMENTS SUMMARY ── always shown if populated ── */}
            {imps.length > 0 && (
              <Accordion title="All Improvements Made" icon={Award} bg="#A8FF78" defaultOpen badge={imps.length}>
                {imps.map((imp, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <div style={{ background: '#000', color: '#FFE566', fontWeight: 900, fontSize: 13,
                                  minWidth: 26, height: 26, display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{imp}</span>
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── BULLET TRANSFORMATIONS ── */}
            {bullets.length > 0 && (
              <Accordion title="Bullet Transformations" icon={Zap} bg="#FFA07A" badge={bullets.length}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
                  Every bullet rewritten using the XYZ impact formula:
                </p>
                {bullets.map((b, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 16,
                                        marginBottom: 12, background: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {b.section        && <Tag text={b.section}                   bg="#E8F4FF" small />}
                      {b.formulaApplied && <Tag text={b.formulaApplied}            bg="#A8FF78" small />}
                      {b.weaknessFixed  && <Tag text={`Fixed: ${b.weaknessFixed}`} bg="#FFE0E0" small />}
                      {b.actionVerbUsed && <Tag text={b.actionVerbUsed}            bg="#FFE566" small />}
                      {b.metricAdded    && <Tag text={`Metric: ${b.metricAdded}`}  bg="#FFF9E6" small />}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10,
                                  alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ background: '#FFF0F0', border: '1px solid #ddd', padding: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#c00', marginBottom: 4 }}>ORIGINAL</div>
                        <p style={{ fontSize: 13, lineHeight: 1.6, textDecoration: 'line-through', color: '#888' }}>
                          {b.original}
                        </p>
                      </div>
                      <ArrowRight size={18} />
                      <div style={{ background: '#F0FFF0', border: '1px solid #ddd', padding: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#2a7a2a', marginBottom: 4 }}>REWRITTEN</div>
                        <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>{b.rewritten}</p>
                      </div>
                    </div>
                    {b.strengthImprovement != null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, minWidth: 90 }}>Strength gain:</span>
                        <StrengthBar value={b.strengthImprovement} />
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── SKILLS SECTION REWRITE ── */}
            {/* FIX: guard now checks skillsAdded/skillsRemoved, not the empty rewritten object */}
            {(skills.skillsAdded?.length > 0 || skills.skillsRemoved?.length > 0) && (
              <Accordion title="Skills Section Rewrite" icon={List} bg="#74B9FF">
                {Object.entries(skills.rewritten || {}).map(([cat, list]) =>
                  Array.isArray(list) && list.length > 0 ? (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>{cat}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {list.map((s, i) => <Tag key={i} text={s} bg="#E8F4FF" small />)}
                      </div>
                    </div>
                  ) : null
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                  {skills.skillsAdded?.length > 0 && (
                    <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
                        Skills Added ({skills.skillsAdded.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {skills.skillsAdded.map((s, i) => <Tag key={i} text={s} bg="#A8FF78" small />)}
                      </div>
                    </div>
                  )}
                  {skills.skillsRemoved?.length > 0 && (
                    <div style={{ background: '#FFF0F0', border: '2px solid #000', padding: 12 }}>
                      <div style={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>
                        Skills Removed ({skills.skillsRemoved.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {skills.skillsRemoved.map((s, i) => <Tag key={i} text={s} bg="#FF6B6B" small />)}
                      </div>
                    </div>
                  )}
                </div>
              </Accordion>
            )}

            {/* ── KEYWORDS ── shows even when only flat kwAdded array exists */}
            {(kwAdded.length > 0 || kwOpt.jdKeywordsAdded?.length > 0) && (
              <Accordion title="Keywords Injected" icon={Target} bg="#A8FF78"
                         badge={kwOpt.jdKeywordsAdded?.length || kwAdded.length}>
                {(kwOpt.totalKeywordCoverage || kwOpt.atsPrediction) && (
                  <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                    {kwOpt.totalKeywordCoverage && (
                      <div style={{ background: '#F0FFF0', border: '2px solid #000', padding: '10px 16px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>JD Coverage</div>
                        <div style={{ fontWeight: 900, fontSize: 20 }}>{kwOpt.totalKeywordCoverage}</div>
                      </div>
                    )}
                    {kwOpt.atsPrediction && (
                      <div style={{ background: '#E8F4FF', border: '2px solid #000', padding: '10px 16px' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>ATS Prediction</div>
                        <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>{kwOpt.atsPrediction}</div>
                      </div>
                    )}
                  </div>
                )}
                {/* Rich format */}
                {kwOpt.jdKeywordsAdded?.length > 0 ? (
                  kwOpt.jdKeywordsAdded.map((k, i) => (
                    <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 6, background: '#F0FFF0' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Tag text={typeof k === 'string' ? k : k.keyword} bg="#A8FF78" small />
                        {k.addedTo && <Tag text={`→ ${k.addedTo}`} bg="#E8F4FF" small />}
                      </div>
                      {k.inSentence && (
                        <p style={{ fontSize: 12, color: '#555', fontStyle: 'italic', margin: '4px 0 0' }}>
                          "{k.inSentence}"
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  // Simple flat array fallback
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {kwAdded.map((kw, i) => <Tag key={i} text={kw} bg="#A8FF78" small />)}
                  </div>
                )}
                {kwOpt.jdKeywordsMissing?.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase',
                                  marginBottom: 8, color: '#c00' }}>
                      Still Missing ({kwOpt.jdKeywordsMissing.length})
                    </div>
                    {kwOpt.jdKeywordsMissing.map((k, i) => (
                      <div key={i} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 6, background: '#FFF0F0' }}>
                        <Tag text={typeof k === 'string' ? k : k.keyword} bg="#FF6B6B" small />
                        {k.reason && <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{k.reason}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </Accordion>
            )}

            {/* ── ACTION VERBS ── shows rich format OR flat list */}
            {(verbs.length > 0 || verbsUsed.length > 0) && (
              <Accordion title="Action Verbs Used" icon={Zap} bg="#FFE566"
                         badge={verbs.length || verbsUsed.length}>
                {verbs.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
                    {verbs.map((v, i) => (
                      <div key={i} style={{ border: '2px solid #000', padding: 12, background: '#FAFAFA' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <Tag text={v.verbUsed} bg="#FFE566" small />
                          {v.tier && <Tag text={v.tier} bg="#F5F0E8" small />}
                        </div>
                        {v.original && (
                          <div style={{ fontSize: 12, color: '#888', textDecoration: 'line-through', marginBottom: 4 }}>
                            {v.original}
                          </div>
                        )}
                        {v.replaced && <div style={{ fontSize: 12, fontWeight: 700 }}>{v.replaced}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {verbsUsed.map((v, i) => <Tag key={i} text={v} bg="#FFE566" small />)}
                  </div>
                )}
              </Accordion>
            )}

            {/* ── METRICS / PLACEHOLDERS ADDED ── */}
            {metrics.length > 0 && (
              <Accordion title="Metric Placeholders Added" icon={TrendingUp} bg="#DDA0DD" badge={metrics.length}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
                  Fill these with your real performance data before submitting:
                </p>
                {metrics.map((m, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10,
                                        background: i % 2 === 0 ? '#F8F4FF' : '#fff' }}>
                    <Tag text={m.placeholder} bg="#DDA0DD" />
                    {m.bullet && (
                      <div style={{ fontSize: 12, color: '#555', marginTop: 6, fontStyle: 'italic' }}>
                        In: {m.bullet}
                      </div>
                    )}
                    {m.howToFill && (
                      <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '6px 10px',
                                    fontSize: 12, fontWeight: 600, marginTop: 8, borderLeft: '4px solid #000' }}>
                        How to find: {m.howToFill}
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── PLACEHOLDER FILL GUIDE ── */}
            {guide.length > 0 && (
              <Accordion title="Placeholder Fill Guide" icon={BookOpen} bg="#FFF9E6" badge={guide.length}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
                  Every [X]% in your resume — what it means and where to find the real number:
                </p>
                {guide.map((g, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10,
                                        background: i % 2 === 0 ? '#FFFDF0' : '#fff' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ background: '#000', color: '#FFE566', fontWeight: 900, fontSize: 14,
                                    minWidth: 28, height: 28, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                      <Tag text={g.placeholder} bg="#FFE566" />
                    </div>
                    {g.location   && <div style={{ fontSize: 12, color: '#555', marginBottom: 4, fontStyle: 'italic' }}>Location: {g.location}</div>}
                    {g.dataNeeded && <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>What you need: {g.dataNeeded}</div>}
                    {g.howToFind  && (
                      <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '6px 10px',
                                    fontSize: 12, fontWeight: 600, borderLeft: '4px solid #000' }}>
                        How to find: {g.howToFind}
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── REMAINING GAPS ── */}
            {gaps.length > 0 && (
              <Accordion title="Remaining Gaps (Honest Assessment)" icon={AlertTriangle}
                         bg="#FFA07A" badge={gaps.length}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 14 }}>
                  These issues couldn't be fixed by rewriting alone:
                </p>
                {gaps.map((g, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF8F0' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>Gap: {g.gap}</div>
                    {/* FIX: backend uses g.why OR just g alone, both handled */}
                    {g.why && <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Why: {g.why}</div>}
                    {gapAction(g) && (
                      <div style={{ background: '#FFE566', border: '2px solid #000', padding: '8px 12px',
                                    fontSize: 12, fontWeight: 700 }}>
                        ➡️ Action: {gapAction(g)}
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── SCAM FLAGS ── */}
            {scam.length > 0 && (
              <Accordion title="Scam Flags Addressed" icon={Shield} bg="#FF6B6B" badge={scam.length}>
                {scam.map((s, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF0F0' }}>
                    {s.action && <Tag text={s.action} bg={s.action === 'Removed' ? '#FF6B6B' : '#FFE566'} small />}
                    {s.originalClaim && (
                      <div style={{ fontSize: 12, marginTop: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800 }}>Original: </span>
                        <span style={{ textDecoration: 'line-through', color: '#888' }}>{s.originalClaim}</span>
                      </div>
                    )}
                    {s.revisedVersion && (
                      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800 }}>Revised: </span>{s.revisedVersion}
                      </div>
                    )}
                    {s.reason && <div style={{ fontSize: 12, color: '#666' }}>{s.reason}</div>}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── BIGGEST TRANSFORMATION + STILL NEEDS WORK ── */}
            {(ov.biggestTransformation || ov.whatStillNeedsWork) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {ov.biggestTransformation && (
                  <div style={{ background: '#F0FFF0', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
                    <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
                      🏆 Biggest Transformation
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#2a7a2a' }}>{ov.biggestTransformation}</p>
                  </div>
                )}
                {ov.whatStillNeedsWork && (
                  <div style={{ background: '#FFF8E1', border: '3px solid #000', boxShadow: '4px 4px 0 #000', padding: '16px 20px' }}>
                    <div style={{ fontWeight: 900, fontSize: 12, textTransform: 'uppercase', marginBottom: 6 }}>
                      ⚠️ Still Needs Work
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>{ov.whatStillNeedsWork}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── READINESS BADGES ── */}
            {(ov.interviewReadiness || ov.atsPassPrediction || ov.atsPassPercent) && (
              <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000',
                            padding: '16px 20px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {ov.interviewReadiness && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
                      Interview Readiness
                    </div>
                    <Tag text={ov.interviewReadiness}
                         bg={ov.interviewReadiness === 'Interview-ready' ? '#A8FF78' : '#FFE566'} />
                  </div>
                )}
                {ov.atsPassPrediction && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
                      ATS Prediction
                    </div>
                    <Tag text={ov.atsPassPrediction}
                         bg={['Likely Pass', 'Will Pass ATS'].includes(ov.atsPassPrediction) ? '#A8FF78' : '#FFE566'} />
                  </div>
                )}
                {ov.atsPassPercent && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>
                      ATS Pass Rate
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 22 }}>{ov.atsPassPercent}</div>
                  </div>
                )}
              </div>
            )}

            {/* ── REGENERATE ── */}
            <div style={{ textAlign: 'center', paddingBottom: 32 }}>
              <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ background: '#fff', border: '3px solid #000', boxShadow: '5px 5px 0 #000',
                         padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
                         textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={16} /> Rewrite Another Resume
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default RewritePage;