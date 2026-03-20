// // import { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { resumeAPI, historyAPI } from '../services/api';
// // import toast from 'react-hot-toast';
// // import { 
// //   ArrowLeft, Loader2, FileText, Send, Copy, Check, Home, Upload
// // } from 'lucide-react';

// // const tones = [
// //   { id: 'Professional', name: 'Professional' },
// //   { id: 'Casual', name: 'Casual' },
// //   { id: 'Formal', name: 'Formal' },
// //   { id: 'Friendly', name: 'Friendly' },
// //   { id: 'Confident', name: 'Confident' },
// // ];

// // export const CoverLetterPage = () => {
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [copied, setCopied] = useState(false);
// //   const [file, setFile] = useState(null);
// //   const [formData, setFormData] = useState({
// //     jobTitle: '',
// //     userName: '',
// //     companyName: '',
// //     tone: 'Professional'
// //   });

// //   useEffect(() => {
// //     fetchHistory();
// //   }, []);

// //   const fetchHistory = async () => {
// //     try {
// //       const response = await historyAPI.getHistory();
// //     } catch (error) {
// //       console.error('Failed to fetch history:', error);
// //     }
// //   };

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       if (selectedFile.type !== 'application/pdf') {
// //         toast.error('Only PDF files are allowed');
// //         return;
// //       }
// //       if (selectedFile.size > 5 * 1024 * 1024) {
// //         toast.error('File size must be less than 5MB');
// //         return;
// //       }
// //       setFile(selectedFile);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!file) {
// //       toast.error('Please upload your resume');
// //       return;
// //     }

// //     let resumeText = '';

// //     setLoading(true);
// //     try {
// //       const formDataUpload = new FormData();
// //       formDataUpload.append('file', file);
// //       formDataUpload.append('targetDomain', 'general');
      
// //       const uploadResponse = await resumeAPI.uploadAndAnalyze(formDataUpload);
// //       resumeText = uploadResponse.data.resumeText;
      
// //       fetchHistory();
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed to upload resume');
// //       setLoading(false);
// //       return;
// //     }

// //     if (!formData.jobTitle.trim()) {
// //       toast.error('Please enter the job title');
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const response = await resumeAPI.generateCoverLetter({
// //         ...formData,
// //         resumeText: resumeText
// //       });
// //       setResult(response.data);
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed to generate cover letter');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const copyToClipboard = () => {
// //     if (result?.content) {
// //       navigator.clipboard.writeText(result.content);
// //       setCopied(true);
// //       setTimeout(() => setCopied(false), 2000);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-neo-offwhite">
// //       {/* Navbar */}
// //       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <Link to="/dashboard" className="flex items-center gap-2 font-bold hover:text-neo-blue">
// //               <ArrowLeft className="w-5 h-5" />
// //               Back
// //             </Link>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <Link to="/" className="flex items-center gap-2 font-bold hover:text-neo-blue mr-4">
// //               <Home className="w-5 h-5" />
// //               Home
// //             </Link>
// //             <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
// //               <span className="font-space font-extrabold text-lg">R</span>
// //             </div>
// //             <span className="font-space font-extrabold text-xl">RESUME AI</span>
// //           </div>
// //           <div className="w-24"></div>
// //         </div>
// //       </nav>

// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         <div className="neo-card p-8 mb-8">
// //           <div className="flex items-center gap-4 mb-6">
// //             <div className="w-16 h-16 bg-neo-green border-3 border-black flex items-center justify-center">
// //               <FileText className="w-8 h-8" />
// //             </div>
// //             <div>
// //               <h1 className="font-space text-3xl font-extrabold">COVER LETTER GENERATOR</h1>
// //               <p className="text-gray-500">Generate a personalized cover letter for your job application</p>
// //             </div>
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {/* Resume Upload - Required */}
// //             <div>
// //               <label className="font-bold mb-3 block">Upload Your Resume *</label>
// //               <div className="border-3 border-dashed border-black bg-white p-6 text-center">
// //                 {file ? (
// //                   <div className="flex items-center justify-center gap-4">
// //                     <FileText className="w-8 h-8" />
// //                     <span className="font-bold">{file.name}</span>
// //                     <button onClick={() => setFile(null)} className="p-1 hover:bg-neo-red">
// //                       ×
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <>
// //                     <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
// //                     <label className="neo-button cursor-pointer inline-block">
// //                       Browse Files
// //                       <input 
// //                         type="file" 
// //                         accept=".pdf" 
// //                         onChange={handleFileChange}
// //                         className="hidden"
// //                       />
// //                     </label>
// //                     <p className="text-sm text-gray-500 mt-2">PDF only, max 5MB</p>
// //                     <p className="text-xs text-neo-red font-bold mt-1">* Resume upload is required</p>
// //                   </>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Job Title */}
// //             <div>
// //               <label className="font-bold mb-3 block">Job Title *</label>
// //               <input
// //                 type="text"
// //                 value={formData.jobTitle}
// //                 onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
// //                 placeholder="e.g., Senior Software Engineer, Product Manager..."
// //                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
// //               />
// //             </div>

// //             {/* Your Name */}
// //             <div>
// //               <label className="font-bold mb-3 block">Your Name</label>
// //               <input
// //                 type="text"
// //                 value={formData.userName}
// //                 onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
// //                 placeholder="Your full name (optional)"
// //                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
// //               />
// //             </div>

// //             {/* Company Name */}
// //             <div>
// //               <label className="font-bold mb-3 block">Company Name</label>
// //               <input
// //                 type="text"
// //                 value={formData.companyName}
// //                 onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
// //                 placeholder="Company you're applying to (optional)"
// //                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
// //               />
// //             </div>

// //             {/* Tone */}
// //             <div>
// //               <label className="font-bold mb-3 block">Tone</label>
// //               <div className="flex flex-wrap gap-3">
// //                 {tones.map((tone) => (
// //                   <button
// //                     key={tone.id}
// //                     type="button"
// //                     onClick={() => setFormData({ ...formData, tone: tone.id })}
// //                     className={`px-4 py-2 border-3 border-black font-bold transition-all ${
// //                       formData.tone === tone.id 
// //                         ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]' 
// //                         : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'
// //                     }`}
// //                   >
// //                     {tone.name}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <button
// //               type="submit"
// //               disabled={loading || !file}
// //               className={`neo-button w-full flex items-center justify-center gap-2 ${
// //                 loading || !file ? 'opacity-50 cursor-not-allowed' : ''
// //               }`}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="w-5 h-5 animate-spin" />
// //                   Generating...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Send className="w-5 h-5" />
// //                   GENERATE COVER LETTER
// //                 </>
// //               )}
// //             </button>
// //           </form>
// //         </div>

// //         {/* Results */}
// //         {result && (
// //           <div className="neo-card p-8">
// //             <div className="flex items-center justify-between mb-6">
// //               <h2 className="font-space text-2xl font-extrabold">YOUR COVER LETTER</h2>
// //               <button
// //                 onClick={copyToClipboard}
// //                 className="neo-button flex items-center gap-2"
// //               >
// //                 {copied ? (
// //                   <>
// //                     <Check className="w-5 h-5" />
// //                     Copied!
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Copy className="w-5 h-5" />
// //                     Copy
// //                   </>
// //                 )}
// //               </button>
// //             </div>

// //             {/* Tone */}
// //             <div className="mb-4">
// //               <span className="font-bold">Tone: </span>
// //               <span className="neo-badge">{result.tone}</span>
// //             </div>

// //             {/* Cover Letter Content */}
// //             <div className="bg-white border-3 border-black p-8">
// //               <pre className="whitespace-pre-wrap font-bold text-lg leading-relaxed">
// //                 {result.content}
// //               </pre>
// //             </div>

// //             {/* Personalization Points */}
// //             {result.personalization && result.personalization.length > 0 && (
// //               <div className="mt-6">
// //                 <h3 className="font-space text-xl font-extrabold mb-4">PERSONALIZATION HIGHLIGHTS</h3>
// //                 <div className="space-y-2">
// //                   {result.personalization?.map((point, index) => (
// //                     <div key={index} className="flex items-start gap-3">
// //                       <Check className="w-5 h-5 text-neo-green flex-shrink-0 mt-1" />
// //                       <span className="font-bold">{point}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };















// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft, Loader2, FileText, Send, Copy, Check,
//   Home, Upload, ChevronDown, ChevronUp, Star,
//   Mail, Linkedin, Target, Zap,
//   AlertTriangle, TrendingUp, Eye, RefreshCw, X
// } from 'lucide-react';

// const TONES = [
//   { id: 'Professional', label: 'Professional' },
//   { id: 'Bold',         label: 'Bold'         },
//   { id: 'Startup',      label: 'Startup'      },
//   { id: 'Executive',    label: 'Executive'    },
//   { id: 'Creative',     label: 'Creative'     },
// ];

// // ── Score chip — never renders a red "0" for missing data ─────────
// const ScoreChip = ({ score, size = 'md' }) => {
//   const n = Number(score);
//   if (!n) return null;                            // hides 0 and undefined
//   const bg  = n >= 80 ? '#A8FF78' : n >= 60 ? '#FFE566' : '#FF6B6B';
//   const fs  = size === 'lg' ? 36 : 24;
//   const pad = size === 'lg' ? '12px 20px' : '8px 14px';
//   return (
//     <span style={{
//       background: bg, border: '3px solid #000', boxShadow: '3px 3px 0 #000',
//       padding: pad, fontWeight: 900, fontSize: fs, color: '#000',
//       display: 'inline-block', lineHeight: 1,
//     }}>
//       {n}
//     </span>
//   );
// };

// const SectionHeader = ({ icon: Icon, title, subtitle, bg = '#FFE566' }) => (
//   <div style={{ background: bg, border: '3px solid #000', borderBottom: 'none',
//                 padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
//     {Icon && <Icon size={22} />}
//     <div>
//       <div style={{ fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</div>
//       {subtitle && <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{subtitle}</div>}
//     </div>
//   </div>
// );

// const Tag = ({ text, bg = '#F5F0E8' }) => (
//   <span style={{ background: bg, border: '2px solid #000', padding: '3px 10px',
//                  fontSize: 12, fontWeight: 700, display: 'inline-block' }}>
//     {text}
//   </span>
// );

// // ── VerdictBadge — returns null when verdict is missing/empty ─────
// const VerdictBadge = ({ verdict }) => {
//   if (!verdict) return null;
//   const map = {
//     'SEND IT':               { bg: '#A8FF78', text: '✅ SEND IT' },
//     'SEND WITH MINOR EDITS': { bg: '#FFE566', text: '✏️ SEND WITH MINOR EDITS' },
//     'REWRITE RECOMMENDED':   { bg: '#FF6B6B', text: '🔁 REWRITE RECOMMENDED' },
//   };
//   const cfg = map[verdict] || { bg: '#FFE566', text: verdict };
//   return (
//     <span style={{ background: cfg.bg, border: '3px solid #000', boxShadow: '3px 3px 0 #000',
//                    padding: '8px 18px', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
//       {cfg.text}
//     </span>
//   );
// };

// const Accordion = ({ title, icon: Icon, bg, children, defaultOpen = false }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', marginBottom: 20 }}>
//       <button onClick={() => setOpen(o => !o)}
//         style={{ width: '100%', background: bg || '#F5F0E8', border: 'none',
//                  borderBottom: open ? '3px solid #000' : 'none', padding: '14px 20px',
//                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                  cursor: 'pointer', fontWeight: 900, fontSize: 15, textTransform: 'uppercase' }}>
//         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           {Icon && <Icon size={20} />}{title}
//         </span>
//         {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>
//       {open && <div style={{ background: '#fff', padding: 20 }}>{children}</div>}
//     </div>
//   );
// };

// const CopyButton = ({ text, label = 'Copy' }) => {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//       style={{ background: copied ? '#A8FF78' : '#fff', border: '2px solid #000', padding: '6px 14px',
//                fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex',
//                alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #000' }}>
//       {copied ? <Check size={14} /> : <Copy size={14} />}
//       {copied ? 'Copied!' : label}
//     </button>
//   );
// };

// // ── tryParse — safe JSON.parse that returns null on failure ────────
// const tryParse = (str) => {
//   if (!str || typeof str !== 'string') return null;
//   try { return JSON.parse(str); } catch { return null; }
// };

// // ── normalizeResponse — handles every backend response shape ──────
// //
// //  Shape A (new nested):  data.parsed = { coverLetter: { content }, overview, ... }
// //  Shape B (flat parsed): data.parsed = { content, overview, ... }
// //  Shape C (raw string):  data.result = "<JSON string>"
// //  Shape D (direct):      data = { content, overview, ... }
// //
// // All shapes are collapsed into ONE consistent object so the JSX
// // never has to worry about which shape arrived.
// const normalizeResponse = (data) => {
//   const raw = data?.parsed
//     || tryParse(data?.result)
//     || data
//     || {};

//   // coverLetter fields — support both nested (raw.coverLetter.x) and flat (raw.x)
//   const clSrc = raw?.coverLetter || {};
//   const coverLetter = {
//     content:          clSrc.content          || raw.content          || '',
//     wordCount:        clSrc.wordCount        || raw.wordCount        || null,
//     toneUsed:         clSrc.toneUsed         || raw.toneUsed         || null,
//     jobTitleTargeted: clSrc.jobTitleTargeted || raw.jobTitleTargeted || null,
//     companyNameUsed:  clSrc.companyNameUsed  || raw.companyNameUsed  || null,
//   };

//   // overview — try raw.overview first, then data.overview
//   const overview = raw.overview || data?.overview || {};

//   // personalizationAudit — same
//   const personalizationAudit = raw.personalizationAudit || data?.personalizationAudit || {};

//   return {
//     coverLetter,
//     overview,
//     personalizationAudit,
//     alternativeOpeners:     raw.alternativeOpeners     || data?.alternativeOpeners     || [],
//     emailSubjectLines:      raw.emailSubjectLines      || data?.emailSubjectLines      || [],
//     // backend sometimes uses "linkedinMessage" (lowercase i) vs "linkedInMessage"
//     linkedInMessage:        raw.linkedInMessage        || raw.linkedinMessage          || data?.linkedInMessage || {},
//     followUpEmail:          raw.followUpEmail          || data?.followUpEmail          || {},
//     atsKeywordsIncluded:    raw.atsKeywordsIncluded    || data?.atsKeywordsIncluded    || [],
//     keyPointsUsed:          raw.keyPointsUsed          || data?.keyPointsUsed          || [],
//     strengthsHighlighted:   raw.strengthsHighlighted   || data?.strengthsHighlighted   || [],
//     weaknessesAddressed:    raw.weaknessesAddressed    || data?.weaknessesAddressed    || [],
//     redFlagsAvoided:        raw.redFlagsAvoided        || data?.redFlagsAvoided        || [],
//     improvementSuggestions: raw.improvementSuggestions || data?.improvementSuggestions || [],
//   };
// };

// // ═══════════════════════════════════════════════════════════════════
// export const CoverLetterPage = () => {
//   const [loading, setLoading]   = useState(false);
//   const [result,  setResult]    = useState(null);
//   const [file,    setFile]      = useState(null);
//   const [activeOpener, setActiveOpener] = useState(0);
//   const [formData, setFormData] = useState({
//     jobTitle: '', userName: '', companyName: '', jobDescription: '', tone: 'Professional',
//   });
//   const resultRef = useRef(null);

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');                return; }
//     setFile(f);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)                     { toast.error('Please upload your resume PDF'); return; }
//     if (!formData.jobTitle.trim()) { toast.error('Job title is required');         return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       const uploadForm = new FormData();
//       uploadForm.append('file', file);
//       uploadForm.append('targetDomain', 'general');
//       const uploadRes  = await resumeAPI.uploadAndAnalyze(uploadForm);
//       const resumeText = uploadRes.data?.resumeText || uploadRes.data?.analysis?.resumeText || '';
//       if (!resumeText) throw new Error('Could not extract text from PDF. Try a different file.');

//       const clRes = await resumeAPI.generateCoverLetter({
//         resumeText,
//         jobTitle:       formData.jobTitle,
//         userName:       formData.userName,
//         companyName:    formData.companyName,
//         jobDescription: formData.jobDescription,
//         tone:           formData.tone,
//       });

//       // ── Single normalize call handles ALL backend shapes ─────────
//       const normalized = normalizeResponse(clRes.data);

//       if (!normalized.coverLetter.content) {
//         throw new Error('Received empty cover letter from AI. Please retry.');
//       }

//       setResult(normalized);
//       toast.success('Cover letter generated!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Generation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cl         = result?.coverLetter          || {};
//   const overview   = result?.overview             || {};
//   const audit      = result?.personalizationAudit || {};
//   const openers    = result?.alternativeOpeners   || [];
//   const subjects   = result?.emailSubjectLines    || [];
//   const linkedin   = result?.linkedInMessage      || {};
//   const followUp   = result?.followUpEmail        || {};
//   const keywords   = result?.atsKeywordsIncluded  || [];
//   const keyPoints  = result?.keyPointsUsed        || [];
//   const strengths  = result?.strengthsHighlighted || [];
//   const weakAddr   = result?.weaknessesAddressed  || [];
//   const redFlags   = result?.redFlagsAvoided      || [];
//   const improvements = result?.improvementSuggestions || [];

//   // Only show the overview banner when it contains real data
//   const hasOverview = !!(
//     overview.finalVerdict
//     || overview.letterStrengthScore
//     || overview.oneLineCritique
//     || overview.callbackLikelihoodPercent
//   );

//   return (
//     <div className="min-h-screen bg-neo-offwhite">
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <Link to="/dashboard" className="flex items-center gap-2 font-bold hover:text-neo-blue">
//             <ArrowLeft className="w-5 h-5" /> Back
//           </Link>
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
//               <span className="font-space font-extrabold text-lg">R</span>
//             </div>
//             <span className="font-space font-extrabold text-xl">RESUME AI</span>
//           </div>
//           <Link to="/" className="flex items-center gap-1 font-bold hover:text-neo-blue">
//             <Home className="w-4 h-4" /><span className="hidden sm:inline">Home</span>
//           </Link>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

//         {/* ── FORM ── */}
//         <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '7px 7px 0 #000', padding: 32 }}>
//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#A8FF78', border: '3px solid #000',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <FileText size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">COVER LETTER GENERATOR</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>AI-powered · Personalized · ATS-optimized</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* PDF Upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
//                 style={{ border: '3px dashed #000', background: file ? '#A8FF78' : '#F5F0E8',
//                          padding: 32, textAlign: 'center', transition: 'background 0.2s' }}>
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={28} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ color: '#555', fontSize: 13 }}>({(file.size / 1024).toFixed(0)} KB)</span>
//                     <button type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000', padding: '2px 8px',
//                                fontWeight: 900, cursor: 'pointer' }}>
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
//                     <label style={{ cursor: 'pointer' }}>
//                       <span style={{ background: '#FFE566', border: '3px solid #000',
//                                      boxShadow: '3px 3px 0 #000', padding: '10px 24px',
//                                      fontWeight: 800, display: 'inline-block' }}>
//                         Browse or Drop PDF
//                       </span>
//                       <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888', fontWeight: 600 }}>PDF only · Max 5MB</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Job Title */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Title <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <input type="text" value={formData.jobTitle}
//                 onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
//                 placeholder="e.g. Senior Software Engineer, Data Scientist..."
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                          fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//             </div>

//             {/* Name + Company */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <div>
//                 <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Your Name</label>
//                 <input type="text" value={formData.userName}
//                   onChange={e => setFormData({ ...formData, userName: e.target.value })}
//                   placeholder="Full name (optional)"
//                   style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                            fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//               </div>
//               <div>
//                 <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Company Name</label>
//                 <input type="text" value={formData.companyName}
//                   onChange={e => setFormData({ ...formData, companyName: e.target.value })}
//                   placeholder="Target company (optional)"
//                   style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                            fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//               </div>
//             </div>

//             {/* Job Description */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Description
//                 <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8, color: '#555' }}>
//                   (Paste for a more targeted letter)
//                 </span>
//               </label>
//               <textarea value={formData.jobDescription}
//                 onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
//                 placeholder="Paste the full job description here..." rows={5}
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                          fontWeight: 600, fontSize: 14, outline: 'none', resize: 'vertical',
//                          boxSizing: 'border-box', fontFamily: 'inherit' }} />
//             </div>

//             {/* Tone */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Tone</label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                 {TONES.map(t => (
//                   <button key={t.id} type="button" onClick={() => setFormData({ ...formData, tone: t.id })}
//                     style={{
//                       background: formData.tone === t.id ? '#FFE566' : '#fff',
//                       border: '3px solid #000', fontWeight: 800, padding: '8px 18px',
//                       cursor: 'pointer', fontSize: 13, transition: 'all 0.1s',
//                       boxShadow: formData.tone === t.id ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                       transform: formData.tone === t.id ? 'translate(2px,2px)' : 'none',
//                     }}>
//                     {t.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button type="submit" disabled={loading || !file}
//               style={{
//                 width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
//                 border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #FFE566',
//                 padding: '16px', fontWeight: 900, fontSize: 16,
//                 cursor: loading || !file ? 'not-allowed' : 'pointer',
//                 textTransform: 'uppercase', letterSpacing: 1,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//               }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Generating your letter...</>
//                 : <><Send size={20} /> Generate Cover Letter</>}
//             </button>
//           </form>
//         </div>

//         {/* ═══════════════════════════════════════════════════════
//             RESULTS
//         ═══════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* Overview — only when it has real data */}
//             {hasOverview && (
//               <div style={{ background: '#000', color: '#fff', border: '3px solid #000',
//                             boxShadow: '7px 7px 0 #FFE566', padding: '24px 28px' }}>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center',
//                               justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
//                   <div>
//                     <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase',
//                                   fontWeight: 700, marginBottom: 8 }}>
//                       Letter Analysis
//                     </div>
//                     {/* Returns null when verdict is falsy — no empty colored square */}
//                     <VerdictBadge verdict={overview.finalVerdict} />
//                   </div>
//                   <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//                     {/* Returns null when score is 0 — no red "0" chip */}
//                     {!!overview.letterStrengthScore && (
//                       <div style={{ textAlign: 'center' }}>
//                         <ScoreChip score={overview.letterStrengthScore} size="lg" />
//                         <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Letter Score</div>
//                       </div>
//                     )}
//                     {!!audit.score && (
//                       <div style={{ textAlign: 'center' }}>
//                         <ScoreChip score={audit.score} size="lg" />
//                         <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Personalization</div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {overview.oneLineCritique && (
//                   <div style={{ background: '#1a1a1a', border: '2px solid #444', padding: '10px 16px',
//                                 fontStyle: 'italic', fontSize: 14, color: '#ddd', marginBottom: 12 }}>
//                     "{overview.oneLineCritique}"
//                   </div>
//                 )}
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
//                   {overview.callbackLikelihoodPercent && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>CALLBACK LIKELIHOOD</div>
//                       <div style={{ fontWeight: 900, fontSize: 18, color: '#FFE566' }}>{overview.callbackLikelihoodPercent}</div>
//                     </div>
//                   )}
//                   {cl.toneUsed && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>TONE</div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.toneUsed}</div>
//                     </div>
//                   )}
//                   {cl.wordCount && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>WORD COUNT</div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.wordCount}</div>
//                     </div>
//                   )}
//                   {cl.companyNameUsed && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>TARGETED COMPANY</div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.companyNameUsed}</div>
//                     </div>
//                   )}
//                 </div>
//                 {overview.finalVerdictReason && (
//                   <div style={{ marginTop: 12, fontSize: 13, color: '#bbb', fontWeight: 600 }}>
//                     {overview.finalVerdictReason}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Main Cover Letter */}
//             <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
//               <SectionHeader icon={FileText} title="Your Cover Letter"
//                 subtitle={cl.jobTitleTargeted ? `Targeted for: ${cl.jobTitleTargeted}` : undefined}
//                 bg="#A8FF78" />
//               <div style={{ background: '#fff', padding: 28 }}>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
//                   <CopyButton text={cl.content || ''} label="Copy Letter" />
//                 </div>
//                 <div style={{ background: '#FAFAF8', border: '2px solid #ddd', padding: '28px 32px',
//                               fontFamily: 'Georgia, serif', lineHeight: 1.9, fontSize: 15 }}>
//                   {(cl.content || '').split('\n').map((line, i) => (
//                     <p key={i} style={{ margin: line.trim() === '' ? '12px 0' : '0 0 2px 0',
//                                         minHeight: line.trim() === '' ? 8 : 'auto' }}>
//                       {line}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Alternative Openers */}
//             {openers.length > 0 && (
//               <Accordion title="3 Alternative Opening Hooks" icon={RefreshCw} bg="#74B9FF" defaultOpen>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
//                   Not happy with the opening? Pick one of these instead:
//                 </p>
//                 <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
//                   {openers.map((op, i) => (
//                     <button key={i} onClick={() => setActiveOpener(i)}
//                       style={{
//                         background: activeOpener === i ? '#FFE566' : '#F5F0E8',
//                         border: '2px solid #000',
//                         boxShadow: activeOpener === i ? '2px 2px 0 #000' : '3px 3px 0 #000',
//                         transform: activeOpener === i ? 'translate(1px,1px)' : 'none',
//                         padding: '6px 16px', fontWeight: 800, cursor: 'pointer', fontSize: 12,
//                       }}>
//                       {op.style}
//                     </button>
//                   ))}
//                 </div>
//                 {openers[activeOpener] && (
//                   <div style={{ background: '#FAFAF8', border: '2px solid #000', padding: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between',
//                                   alignItems: 'flex-start', marginBottom: 12 }}>
//                       <Tag text={openers[activeOpener].style} bg="#FFE566" />
//                       <CopyButton text={openers[activeOpener].text} />
//                     </div>
//                     <p style={{ lineHeight: 1.8, fontFamily: 'Georgia, serif', fontSize: 14, marginBottom: 12 }}>
//                       {openers[activeOpener].text}
//                     </p>
//                     {openers[activeOpener].whyItWorks && (
//                       <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '8px 12px',
//                                     fontSize: 12, fontWeight: 600, borderLeft: '4px solid #000' }}>
//                         <span style={{ fontWeight: 800 }}>Why it works: </span>{openers[activeOpener].whyItWorks}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* Email Subject Lines */}
//             {subjects.length > 0 && (
//               <Accordion title="Email Subject Lines" icon={Mail} bg="#FFE566">
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
//                   Use these when emailing the cover letter directly:
//                 </p>
//                 <div className="space-y-3">
//                   {subjects.map((s, i) => (
//                     <div key={i} style={{ border: '2px solid #000', padding: '12px 16px',
//                                           background: i === 0 ? '#FFF9E6' : '#fff',
//                                           display: 'flex', alignItems: 'flex-start',
//                                           justifyContent: 'space-between', gap: 12 }}>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
//                           {i === 0 && <Tag text="BEST" bg="#FFE566" />}
//                           <Tag text={s.style || `Option ${i + 1}`} bg="#F5F0E8" />
//                         </div>
//                         <div style={{ fontWeight: 800, fontSize: 15 }}>{s.subject}</div>
//                         {s.psychologyNote && (
//                           <div style={{ fontSize: 12, color: '#666', marginTop: 4, fontWeight: 600 }}>
//                             {s.psychologyNote}
//                           </div>
//                         )}
//                       </div>
//                       <CopyButton text={s.subject} />
//                     </div>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* LinkedIn Message */}
//             {linkedin.content && (
//               <Accordion title="LinkedIn InMail Version" icon={Linkedin} bg="#DDA0DD">
//                 <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <Tag text={`${linkedin.wordCount || '~'} words`} bg="#F5F0E8" />
//                     <Tag text="Under 160 words" bg="#A8FF78" />
//                   </div>
//                   <CopyButton text={linkedin.content} label="Copy Message" />
//                 </div>
//                 {linkedin.usageNote && (
//                   <div style={{ background: '#FFF9E6', border: '2px solid #000', padding: '8px 14px',
//                                 fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
//                     💡 {linkedin.usageNote}
//                   </div>
//                 )}
//                 <div style={{ background: '#F8F4FF', border: '2px solid #000', padding: 20,
//                               fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
//                   {(linkedin.content || '').split('\n').map((line, i) => (
//                     <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* Follow-Up Email */}
//             {followUp.content && (
//               <Accordion title={`Follow-Up Email (Send after ${followUp.sendAfterDays || 6} days)`}
//                          icon={Send} bg="#FFA07A">
//                 <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between',
//                               alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
//                   <div>
//                     <span style={{ fontWeight: 800, fontSize: 13 }}>Subject: </span>
//                     <span style={{ fontWeight: 700, fontSize: 13 }}>{followUp.subject}</span>
//                   </div>
//                   <CopyButton text={`Subject: ${followUp.subject}\n\n${followUp.content}`} label="Copy Full Email" />
//                 </div>
//                 <div style={{ background: '#FFF5EE', border: '2px solid #000', padding: 20,
//                               fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
//                   {(followUp.content || '').split('\n').map((line, i) => (
//                     <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* ATS Keywords */}
//             {keywords.length > 0 && (
//               <Accordion title="ATS Keywords Included" icon={Target} bg="#A8FF78">
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                   {keywords.map((kw, i) => <Tag key={i} text={kw} bg="#E8FFE8" />)}
//                 </div>
//               </Accordion>
//             )}

//             {/* Personalization Audit — only when score > 0 */}
//             {audit.score > 0 && (
//               <Accordion title="Personalization Audit" icon={Eye} bg="#FFE566" defaultOpen>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
//                   <ScoreChip score={audit.score} size="lg" />
//                   <div>
//                     <div style={{ fontWeight: 900, fontSize: 18 }}>{audit.level}</div>
//                     <div style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Personalization Level</div>
//                   </div>
//                 </div>
//                 {audit.whatMakesItPersonalized?.length > 0 && (
//                   <div style={{ marginBottom: 16 }}>
//                     <div style={{ fontWeight: 800, marginBottom: 8 }}>What makes it personalized:</div>
//                     {audit.whatMakesItPersonalized.map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
//                         <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {audit.whatCouldBeMorePersonalized?.length > 0 && (
//                   <div>
//                     <div style={{ fontWeight: 800, marginBottom: 8 }}>Could be even more specific:</div>
//                     {audit.whatCouldBeMorePersonalized.map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
//                         <AlertTriangle size={15} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* Hiring Manager View */}
//             {(overview.bestPartsOfThisLetter?.length > 0 || overview.hiringManagerFirstImpression || overview.diffFromGenericLetters) && (
//               <Accordion title="Hiring Manager's View" icon={Eye} bg="#74B9FF">
//                 {overview.hiringManagerFirstImpression && (
//                   <div style={{ background: '#E8F4FF', border: '2px solid #000', padding: '12px 16px',
//                                 marginBottom: 16, borderLeft: '5px solid #000' }}>
//                     <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
//                       First 6 seconds impression:
//                     </div>
//                     <div style={{ fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
//                       "{overview.hiringManagerFirstImpression}"
//                     </div>
//                   </div>
//                 )}
//                 {overview.diffFromGenericLetters && (
//                   <div style={{ background: '#E8FFE8', border: '2px solid #000', padding: '12px 16px',
//                                 marginBottom: 16, borderLeft: '5px solid #000' }}>
//                     <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
//                       Why it stands out:
//                     </div>
//                     <div style={{ fontSize: 14, lineHeight: 1.7 }}>{overview.diffFromGenericLetters}</div>
//                   </div>
//                 )}
//                 {overview.bestPartsOfThisLetter?.length > 0 && (
//                   <div>
//                     <div style={{ fontWeight: 800, marginBottom: 8 }}>Strongest elements:</div>
//                     {overview.bestPartsOfThisLetter.map((part, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                         <Star size={15} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{part}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* Strengths */}
//             {(strengths.length > 0 || keyPoints.length > 0) && (
//               <Accordion title="Strengths Woven In" icon={Zap} bg="#A8FF78">
//                 {strengths.map((s, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                     <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
//                   </div>
//                 ))}
//                 {keyPoints.length > 0 && (
//                   <>
//                     <div style={{ fontWeight: 800, marginTop: 12, marginBottom: 8 }}>Key Points Used:</div>
//                     {keyPoints.map((kp, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                         <Target size={15} style={{ color: '#1a5f1a', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{kp}</span>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </Accordion>
//             )}

//             {/* Weaknesses Addressed */}
//             {weakAddr.length > 0 && (
//               <Accordion title="How Weaknesses Were Handled" icon={AlertTriangle} bg="#FFA07A">
//                 {weakAddr.map((w, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF5EE' }}>
//                     <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>Gap: {w.weakness}</div>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Handled by: {w.howHandled}</div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* Improvement Suggestions */}
//             {improvements.length > 0 && (
//               <Accordion title="Improvement Suggestions" icon={TrendingUp} bg="#DDA0DD">
//                 {improvements.map((imp, i) => {
//                   const priColor = { High: '#FF6B6B', Medium: '#FFE566', Low: '#A8FF78' }[imp.priority] || '#F5F0E8';
//                   return (
//                     <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
//                       <Tag text={imp.priority || 'Note'} bg={priColor} />
//                       <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{imp.suggestion}</span>
//                     </div>
//                   );
//                 })}
//               </Accordion>
//             )}

//             {/* Red Flags Avoided */}
//             {redFlags.length > 0 && (
//               <Accordion title="Red Flags Avoided" icon={AlertTriangle} bg="#FF6B6B">
//                 {redFlags.map((flag, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                     <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>{flag}</span>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* Regenerate */}
//             <div style={{ textAlign: 'center', paddingBottom: 32 }}>
//               <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//                 style={{ background: '#fff', border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                          padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
//                          textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
//                 <RefreshCw size={16} /> Generate Another
//               </button>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default CoverLetterPage;





















// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import { 
//   ArrowLeft, Loader2, FileText, Send, Copy, Check, Home, Upload
// } from 'lucide-react';

// const tones = [
//   { id: 'Professional', name: 'Professional' },
//   { id: 'Casual', name: 'Casual' },
//   { id: 'Formal', name: 'Formal' },
//   { id: 'Friendly', name: 'Friendly' },
//   { id: 'Confident', name: 'Confident' },
// ];

// export const CoverLetterPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     jobTitle: '',
//     userName: '',
//     companyName: '',
//     tone: 'Professional'
//   });

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const response = await historyAPI.getHistory();
//     } catch (error) {
//       console.error('Failed to fetch history:', error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       if (selectedFile.type !== 'application/pdf') {
//         toast.error('Only PDF files are allowed');
//         return;
//       }
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         toast.error('File size must be less than 5MB');
//         return;
//       }
//       setFile(selectedFile);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       toast.error('Please upload your resume');
//       return;
//     }

//     let resumeText = '';

//     setLoading(true);
//     try {
//       const formDataUpload = new FormData();
//       formDataUpload.append('file', file);
//       formDataUpload.append('targetDomain', 'general');
      
//       const uploadResponse = await resumeAPI.uploadAndAnalyze(formDataUpload);
//       resumeText = uploadResponse.data.resumeText;
      
//       fetchHistory();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to upload resume');
//       setLoading(false);
//       return;
//     }

//     if (!formData.jobTitle.trim()) {
//       toast.error('Please enter the job title');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await resumeAPI.generateCoverLetter({
//         ...formData,
//         resumeText: resumeText
//       });
//       setResult(response.data);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to generate cover letter');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = () => {
//     if (result?.content) {
//       navigator.clipboard.writeText(result.content);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-neo-offwhite">
//       {/* Navbar */}
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Link to="/dashboard" className="flex items-center gap-2 font-bold hover:text-neo-blue">
//               <ArrowLeft className="w-5 h-5" />
//               Back
//             </Link>
//           </div>
//           <div className="flex items-center gap-2">
//             <Link to="/" className="flex items-center gap-2 font-bold hover:text-neo-blue mr-4">
//               <Home className="w-5 h-5" />
//               Home
//             </Link>
//             <div className="w-10 h-10 bg-neo-yellow border-3 border-black flex items-center justify-center">
//               <span className="font-space font-extrabold text-lg">R</span>
//             </div>
//             <span className="font-space font-extrabold text-xl">RESUME AI</span>
//           </div>
//           <div className="w-24"></div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="neo-card p-8 mb-8">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-16 h-16 bg-neo-green border-3 border-black flex items-center justify-center">
//               <FileText className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">COVER LETTER GENERATOR</h1>
//               <p className="text-gray-500">Generate a personalized cover letter for your job application</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Resume Upload - Required */}
//             <div>
//               <label className="font-bold mb-3 block">Upload Your Resume *</label>
//               <div className="border-3 border-dashed border-black bg-white p-6 text-center">
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText className="w-8 h-8" />
//                     <span className="font-bold">{file.name}</span>
//                     <button onClick={() => setFile(null)} className="p-1 hover:bg-neo-red">
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                     <label className="neo-button cursor-pointer inline-block">
//                       Browse Files
//                       <input 
//                         type="file" 
//                         accept=".pdf" 
//                         onChange={handleFileChange}
//                         className="hidden"
//                       />
//                     </label>
//                     <p className="text-sm text-gray-500 mt-2">PDF only, max 5MB</p>
//                     <p className="text-xs text-neo-red font-bold mt-1">* Resume upload is required</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Job Title */}
//             <div>
//               <label className="font-bold mb-3 block">Job Title *</label>
//               <input
//                 type="text"
//                 value={formData.jobTitle}
//                 onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
//                 placeholder="e.g., Senior Software Engineer, Product Manager..."
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             {/* Your Name */}
//             <div>
//               <label className="font-bold mb-3 block">Your Name</label>
//               <input
//                 type="text"
//                 value={formData.userName}
//                 onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
//                 placeholder="Your full name (optional)"
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             {/* Company Name */}
//             <div>
//               <label className="font-bold mb-3 block">Company Name</label>
//               <input
//                 type="text"
//                 value={formData.companyName}
//                 onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                 placeholder="Company you're applying to (optional)"
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             {/* Tone */}
//             <div>
//               <label className="font-bold mb-3 block">Tone</label>
//               <div className="flex flex-wrap gap-3">
//                 {tones.map((tone) => (
//                   <button
//                     key={tone.id}
//                     type="button"
//                     onClick={() => setFormData({ ...formData, tone: tone.id })}
//                     className={`px-4 py-2 border-3 border-black font-bold transition-all ${
//                       formData.tone === tone.id 
//                         ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]' 
//                         : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'
//                     }`}
//                   >
//                     {tone.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading || !file}
//               className={`neo-button w-full flex items-center justify-center gap-2 ${
//                 loading || !file ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   GENERATE COVER LETTER
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="neo-card p-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="font-space text-2xl font-extrabold">YOUR COVER LETTER</h2>
//               <button
//                 onClick={copyToClipboard}
//                 className="neo-button flex items-center gap-2"
//               >
//                 {copied ? (
//                   <>
//                     <Check className="w-5 h-5" />
//                     Copied!
//                   </>
//                 ) : (
//                   <>
//                     <Copy className="w-5 h-5" />
//                     Copy
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Tone */}
//             <div className="mb-4">
//               <span className="font-bold">Tone: </span>
//               <span className="neo-badge">{result.tone}</span>
//             </div>

//             {/* Cover Letter Content */}
//             <div className="bg-white border-3 border-black p-8">
//               <pre className="whitespace-pre-wrap font-bold text-lg leading-relaxed">
//                 {result.content}
//               </pre>
//             </div>

//             {/* Personalization Points */}
//             {result.personalization && result.personalization.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="font-space text-xl font-extrabold mb-4">PERSONALIZATION HIGHLIGHTS</h3>
//                 <div className="space-y-2">
//                   {result.personalization?.map((point, index) => (
//                     <div key={index} className="flex items-start gap-3">
//                       <Check className="w-5 h-5 text-neo-green flex-shrink-0 mt-1" />
//                       <span className="font-bold">{point}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };















// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar } from '../pages/Navbar';
// import { resumeAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import FeaturePageGuard from '../components/FeaturePageGuard';
// import {
//   ArrowLeft, Loader2, FileText, Send, Copy, Check,
//   Home, Upload, ChevronDown, ChevronUp, Star,
//   Mail, Linkedin, Target, Zap,
//   AlertTriangle, TrendingUp, Eye, RefreshCw, X
// } from 'lucide-react';

// const TONES = [
//   { id: 'Professional', label: 'Professional' },
//   { id: 'Bold',         label: 'Bold'         },
//   { id: 'Startup',      label: 'Startup'      },
//   { id: 'Executive',    label: 'Executive'    },
//   { id: 'Creative',     label: 'Creative'     },
// ];

// // ── Score chip — never renders a red "0" for missing data ─────────
// const ScoreChip = ({ score, size = 'md' }) => {
//   const n = Number(score);
//   if (!n) return null;                            // hides 0 and undefined
//   const bg  = n >= 80 ? '#A8FF78' : n >= 60 ? '#FFE566' : '#FF6B6B';
//   const fs  = size === 'lg' ? 36 : 24;
//   const pad = size === 'lg' ? '12px 20px' : '8px 14px';
//   return (
//     <span style={{
//       background: bg, border: '3px solid #000', boxShadow: '3px 3px 0 #000',
//       padding: pad, fontWeight: 900, fontSize: fs, color: '#000',
//       display: 'inline-block', lineHeight: 1,
//     }}>
//       {n}
//     </span>
//   );
// };

// const SectionHeader = ({ icon: Icon, title, subtitle, bg = '#FFE566' }) => (
//   <div style={{ background: bg, border: '3px solid #000', borderBottom: 'none',
//                 padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
//     {Icon && <Icon size={22} />}
//     <div>
//       <div style={{ fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</div>
//       {subtitle && <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{subtitle}</div>}
//     </div>
//   </div>
// );

// const Tag = ({ text, bg = '#F5F0E8' }) => (
//   <span style={{ background: bg, border: '2px solid #000', padding: '3px 10px',
//                  fontSize: 12, fontWeight: 700, display: 'inline-block' }}>
//     {text}
//   </span>
// );

// // ── VerdictBadge — returns null when verdict is missing/empty ─────
// const VerdictBadge = ({ verdict }) => {
//   if (!verdict) return null;
//   const map = {
//     'SEND IT':               { bg: '#A8FF78', text: '✅ SEND IT' },
//     'SEND WITH MINOR EDITS': { bg: '#FFE566', text: '✏️ SEND WITH MINOR EDITS' },
//     'REWRITE RECOMMENDED':   { bg: '#FF6B6B', text: '🔁 REWRITE RECOMMENDED' },
//   };
//   const cfg = map[verdict] || { bg: '#FFE566', text: verdict };
//   return (
//     <span style={{ background: cfg.bg, border: '3px solid #000', boxShadow: '3px 3px 0 #000',
//                    padding: '8px 18px', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
//       {cfg.text}
//     </span>
//   );
// };

// const Accordion = ({ title, icon: Icon, bg, children, defaultOpen = false }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', marginBottom: 20 }}>
//       <button onClick={() => setOpen(o => !o)}
//         style={{ width: '100%', background: bg || '#F5F0E8', border: 'none',
//                  borderBottom: open ? '3px solid #000' : 'none', padding: '14px 20px',
//                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                  cursor: 'pointer', fontWeight: 900, fontSize: 15, textTransform: 'uppercase' }}>
//         <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           {Icon && <Icon size={20} />}{title}
//         </span>
//         {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//       </button>
//       {open && <div style={{ background: '#fff', padding: 20 }}>{children}</div>}
//     </div>
//   );
// };

// const CopyButton = ({ text, label = 'Copy' }) => {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
//       style={{ background: copied ? '#A8FF78' : '#fff', border: '2px solid #000', padding: '6px 14px',
//                fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex',
//                alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #000' }}>
//       {copied ? <Check size={14} /> : <Copy size={14} />}
//       {copied ? 'Copied!' : label}
//     </button>
//   );
// };

// // ── tryParse — safe JSON.parse that returns null on failure ────────
// const tryParse = (str) => {
//   if (!str || typeof str !== 'string') return null;
//   try { return JSON.parse(str); } catch { return null; }
// };

// // ── normalizeResponse — handles every backend response shape ──────
// //
// //  Shape A (new nested):  data.parsed = { coverLetter: { content }, overview, ... }
// //  Shape B (flat parsed): data.parsed = { content, overview, ... }
// //  Shape C (raw string):  data.result = "<JSON string>"
// //  Shape D (direct):      data = { content, overview, ... }
// //
// // All shapes are collapsed into ONE consistent object so the JSX
// // never has to worry about which shape arrived.
// const normalizeResponse = (data) => {
//   const raw = data?.parsed
//     || tryParse(data?.result)
//     || data
//     || {};

//   // coverLetter fields — support both nested (raw.coverLetter.x) and flat (raw.x)
//   const clSrc = raw?.coverLetter || {};
//   const coverLetter = {
//     content:          clSrc.content          || raw.content          || '',
//     wordCount:        clSrc.wordCount        || raw.wordCount        || null,
//     toneUsed:         clSrc.toneUsed         || raw.toneUsed         || null,
//     jobTitleTargeted: clSrc.jobTitleTargeted || raw.jobTitleTargeted || null,
//     companyNameUsed:  clSrc.companyNameUsed  || raw.companyNameUsed  || null,
//   };

//   // overview — try raw.overview first, then data.overview
//   const overview = raw.overview || data?.overview || {};

//   // personalizationAudit — same
//   const personalizationAudit = raw.personalizationAudit || data?.personalizationAudit || {};

//   return {
//     coverLetter,
//     overview,
//     personalizationAudit,
//     alternativeOpeners:     raw.alternativeOpeners     || data?.alternativeOpeners     || [],
//     emailSubjectLines:      raw.emailSubjectLines      || data?.emailSubjectLines      || [],
//     // backend sometimes uses "linkedinMessage" (lowercase i) vs "linkedInMessage"
//     linkedInMessage:        raw.linkedInMessage        || raw.linkedinMessage          || data?.linkedInMessage || {},
//     followUpEmail:          raw.followUpEmail          || data?.followUpEmail          || {},
//     atsKeywordsIncluded:    raw.atsKeywordsIncluded    || data?.atsKeywordsIncluded    || [],
//     keyPointsUsed:          raw.keyPointsUsed          || data?.keyPointsUsed          || [],
//     strengthsHighlighted:   raw.strengthsHighlighted   || data?.strengthsHighlighted   || [],
//     weaknessesAddressed:    raw.weaknessesAddressed    || data?.weaknessesAddressed    || [],
//     redFlagsAvoided:        raw.redFlagsAvoided        || data?.redFlagsAvoided        || [],
//     improvementSuggestions: raw.improvementSuggestions || data?.improvementSuggestions || [],
//   };
// };

// // ═══════════════════════════════════════════════════════════════════
// export const CoverLetterPage = () => {
//   const [loading, setLoading]   = useState(false);
//   const [result,  setResult]    = useState(null);
//   const [file,    setFile]      = useState(null);
//   const [activeOpener, setActiveOpener] = useState(0);
//   const [formData, setFormData] = useState({
//     jobTitle: '', userName: '', companyName: '', jobDescription: '', tone: 'Professional',
//   });
//   const resultRef = useRef(null);

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');                return; }
//     setFile(f);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)                     { toast.error('Please upload your resume PDF'); return; }
//     if (!formData.jobTitle.trim()) { toast.error('Job title is required');         return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       const uploadForm = new FormData();
//       uploadForm.append('file', file);
//       uploadForm.append('targetDomain', 'general');
//       const uploadRes  = await resumeAPI.uploadAndAnalyze(uploadForm);
//       const resumeText = uploadRes.data?.resumeText || uploadRes.data?.analysis?.resumeText || '';
//       if (!resumeText) throw new Error('Could not extract text from PDF. Try a different file.');

//       const clRes = await resumeAPI.generateCoverLetter({
//         resumeText,
//         jobTitle:       formData.jobTitle,
//         userName:       formData.userName,
//         companyName:    formData.companyName,
//         jobDescription: formData.jobDescription,
//         tone:           formData.tone,
//       });

//       // ── Single normalize call handles ALL backend shapes ─────────
//       const normalized = normalizeResponse(clRes.data);

//       if (!normalized.coverLetter.content) {
//         throw new Error('Received empty cover letter from AI. Please retry.');
//       }

//       setResult(normalized);
//       toast.success('Cover letter generated!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Generation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cl         = result?.coverLetter          || {};
//   const overview   = result?.overview             || {};
//   const audit      = result?.personalizationAudit || {};
//   const openers    = result?.alternativeOpeners   || [];
//   const subjects   = result?.emailSubjectLines    || [];
//   const linkedin   = result?.linkedInMessage      || {};
//   const followUp   = result?.followUpEmail        || {};
//   const keywords   = result?.atsKeywordsIncluded  || [];
//   const keyPoints  = result?.keyPointsUsed        || [];
//   const strengths  = result?.strengthsHighlighted || [];
//   const weakAddr   = result?.weaknessesAddressed  || [];
//   const redFlags   = result?.redFlagsAvoided      || [];
//   const improvements = result?.improvementSuggestions || [];

//   // Only show the overview banner when it contains real data
//   const hasOverview = !!(
//     overview.finalVerdict
//     || overview.letterStrengthScore
//     || overview.oneLineCritique
//     || overview.callbackLikelihoodPercent
//   );

//   return (
//     <div className="min-h-screen bg-neo-offwhite">
//       <FeaturePageGuard feature="cover_letter" />
      
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

//         {/* ── FORM ── */}
//         <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '7px 7px 0 #000', padding: 32 }}>
//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#A8FF78', border: '3px solid #000',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <FileText size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">COVER LETTER GENERATOR</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>AI-powered · Personalized · ATS-optimized</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* PDF Upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
//                 style={{ border: '3px dashed #000', background: file ? '#A8FF78' : '#F5F0E8',
//                          padding: 32, textAlign: 'center', transition: 'background 0.2s' }}>
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={28} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ color: '#555', fontSize: 13 }}>({(file.size / 1024).toFixed(0)} KB)</span>
//                     <button type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000', padding: '2px 8px',
//                                fontWeight: 900, cursor: 'pointer' }}>
//                       <X size={14} />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <Upload size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
//                     <label style={{ cursor: 'pointer' }}>
//                       <span style={{ background: '#FFE566', border: '3px solid #000',
//                                      boxShadow: '3px 3px 0 #000', padding: '10px 24px',
//                                      fontWeight: 800, display: 'inline-block' }}>
//                         Browse or Drop PDF
//                       </span>
//                       <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888', fontWeight: 600 }}>PDF only · Max 5MB</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Job Title */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Title <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <input type="text" value={formData.jobTitle}
//                 onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
//                 placeholder="e.g. Senior Software Engineer, Data Scientist..."
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                          fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//             </div>

//             {/* Name + Company */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <div>
//                 <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Your Name</label>
//                 <input type="text" value={formData.userName}
//                   onChange={e => setFormData({ ...formData, userName: e.target.value })}
//                   placeholder="Full name (optional)"
//                   style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                            fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//               </div>
//               <div>
//                 <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Company Name</label>
//                 <input type="text" value={formData.companyName}
//                   onChange={e => setFormData({ ...formData, companyName: e.target.value })}
//                   placeholder="Target company (optional)"
//                   style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                            fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
//               </div>
//             </div>

//             {/* Job Description */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Description
//                 <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8, color: '#555' }}>
//                   (Paste for a more targeted letter)
//                 </span>
//               </label>
//               <textarea value={formData.jobDescription}
//                 onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
//                 placeholder="Paste the full job description here..." rows={5}
//                 style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
//                          fontWeight: 600, fontSize: 14, outline: 'none', resize: 'vertical',
//                          boxSizing: 'border-box', fontFamily: 'inherit' }} />
//             </div>

//             {/* Tone */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Tone</label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//                 {TONES.map(t => (
//                   <button key={t.id} type="button" onClick={() => setFormData({ ...formData, tone: t.id })}
//                     style={{
//                       background: formData.tone === t.id ? '#FFE566' : '#fff',
//                       border: '3px solid #000', fontWeight: 800, padding: '8px 18px',
//                       cursor: 'pointer', fontSize: 13, transition: 'all 0.1s',
//                       boxShadow: formData.tone === t.id ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                       transform: formData.tone === t.id ? 'translate(2px,2px)' : 'none',
//                     }}>
//                     {t.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button type="submit" disabled={loading || !file}
//               style={{
//                 width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
//                 border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #FFE566',
//                 padding: '16px', fontWeight: 900, fontSize: 16,
//                 cursor: loading || !file ? 'not-allowed' : 'pointer',
//                 textTransform: 'uppercase', letterSpacing: 1,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
//               }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Generating your letter...</>
//                 : <><Send size={20} /> Generate Cover Letter</>}
//             </button>
//           </form>
//         </div>

//         {/* ═══════════════════════════════════════════════════════
//             RESULTS
//         ═══════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* Overview — only when it has real data */}
//             {hasOverview && (
//               <div style={{ background: '#000', color: '#fff', border: '3px solid #000',
//                             boxShadow: '7px 7px 0 #FFE566', padding: '24px 28px' }}>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center',
//                               justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
//                   <div>
//                     <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase',
//                                   fontWeight: 700, marginBottom: 8 }}>
//                       Letter Analysis
//                     </div>
//                     {/* Returns null when verdict is falsy — no empty colored square */}
//                     <VerdictBadge verdict={overview.finalVerdict} />
//                   </div>
//                   <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//                     {/* Returns null when score is 0 — no red "0" chip */}
//                     {!!overview.letterStrengthScore && (
//                       <div style={{ textAlign: 'center' }}>
//                         <ScoreChip score={overview.letterStrengthScore} size="lg" />
//                         <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Letter Score</div>
//                       </div>
//                     )}
//                     {!!audit.score && (
//                       <div style={{ textAlign: 'center' }}>
//                         <ScoreChip score={audit.score} size="lg" />
//                         <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Personalization</div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 {overview.oneLineCritique && (
//                   <div style={{ background: '#1a1a1a', border: '2px solid #444', padding: '10px 16px',
//                                 fontStyle: 'italic', fontSize: 14, color: '#ddd', marginBottom: 12 }}>
//                     "{overview.oneLineCritique}"
//                   </div>
//                 )}
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
//                   {overview.callbackLikelihoodPercent && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>CALLBACK LIKELIHOOD</div>
//                       <div style={{ fontWeight: 900, fontSize: 18, color: '#FFE566' }}>{overview.callbackLikelihoodPercent}</div>
//                     </div>
//                   )}
//                   {cl.toneUsed && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>TONE</div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.toneUsed}</div>
//                     </div>
//                   )}
//                   {cl.wordCount && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>WORD COUNT</div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.wordCount}</div>
//                     </div>
//                   )}
//                   {cl.companyNameUsed && (
//                     <div>
//                       <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>TARGETED COMPANY</div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.companyNameUsed}</div>
//                     </div>
//                   )}
//                 </div>
//                 {overview.finalVerdictReason && (
//                   <div style={{ marginTop: 12, fontSize: 13, color: '#bbb', fontWeight: 600 }}>
//                     {overview.finalVerdictReason}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Main Cover Letter */}
//             <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
//               <SectionHeader icon={FileText} title="Your Cover Letter"
//                 subtitle={cl.jobTitleTargeted ? `Targeted for: ${cl.jobTitleTargeted}` : undefined}
//                 bg="#A8FF78" />
//               <div style={{ background: '#fff', padding: 28 }}>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
//                   <CopyButton text={cl.content || ''} label="Copy Letter" />
//                 </div>
//                 <div style={{ background: '#FAFAF8', border: '2px solid #ddd', padding: '28px 32px',
//                               fontFamily: 'Georgia, serif', lineHeight: 1.9, fontSize: 15 }}>
//                   {(cl.content || '').split('\n').map((line, i) => (
//                     <p key={i} style={{ margin: line.trim() === '' ? '12px 0' : '0 0 2px 0',
//                                         minHeight: line.trim() === '' ? 8 : 'auto' }}>
//                       {line}
//                     </p>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Alternative Openers */}
//             {openers.length > 0 && (
//               <Accordion title="3 Alternative Opening Hooks" icon={RefreshCw} bg="#74B9FF" defaultOpen>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
//                   Not happy with the opening? Pick one of these instead:
//                 </p>
//                 <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
//                   {openers.map((op, i) => (
//                     <button key={i} onClick={() => setActiveOpener(i)}
//                       style={{
//                         background: activeOpener === i ? '#FFE566' : '#F5F0E8',
//                         border: '2px solid #000',
//                         boxShadow: activeOpener === i ? '2px 2px 0 #000' : '3px 3px 0 #000',
//                         transform: activeOpener === i ? 'translate(1px,1px)' : 'none',
//                         padding: '6px 16px', fontWeight: 800, cursor: 'pointer', fontSize: 12,
//                       }}>
//                       {op.style}
//                     </button>
//                   ))}
//                 </div>
//                 {openers[activeOpener] && (
//                   <div style={{ background: '#FAFAF8', border: '2px solid #000', padding: 20 }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between',
//                                   alignItems: 'flex-start', marginBottom: 12 }}>
//                       <Tag text={openers[activeOpener].style} bg="#FFE566" />
//                       <CopyButton text={openers[activeOpener].text} />
//                     </div>
//                     <p style={{ lineHeight: 1.8, fontFamily: 'Georgia, serif', fontSize: 14, marginBottom: 12 }}>
//                       {openers[activeOpener].text}
//                     </p>
//                     {openers[activeOpener].whyItWorks && (
//                       <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '8px 12px',
//                                     fontSize: 12, fontWeight: 600, borderLeft: '4px solid #000' }}>
//                         <span style={{ fontWeight: 800 }}>Why it works: </span>{openers[activeOpener].whyItWorks}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* Email Subject Lines */}
//             {subjects.length > 0 && (
//               <Accordion title="Email Subject Lines" icon={Mail} bg="#FFE566">
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
//                   Use these when emailing the cover letter directly:
//                 </p>
//                 <div className="space-y-3">
//                   {subjects.map((s, i) => (
//                     <div key={i} style={{ border: '2px solid #000', padding: '12px 16px',
//                                           background: i === 0 ? '#FFF9E6' : '#fff',
//                                           display: 'flex', alignItems: 'flex-start',
//                                           justifyContent: 'space-between', gap: 12 }}>
//                       <div style={{ flex: 1 }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
//                           {i === 0 && <Tag text="BEST" bg="#FFE566" />}
//                           <Tag text={s.style || `Option ${i + 1}`} bg="#F5F0E8" />
//                         </div>
//                         <div style={{ fontWeight: 800, fontSize: 15 }}>{s.subject}</div>
//                         {s.psychologyNote && (
//                           <div style={{ fontSize: 12, color: '#666', marginTop: 4, fontWeight: 600 }}>
//                             {s.psychologyNote}
//                           </div>
//                         )}
//                       </div>
//                       <CopyButton text={s.subject} />
//                     </div>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* LinkedIn Message */}
//             {linkedin.content && (
//               <Accordion title="LinkedIn InMail Version" icon={Linkedin} bg="#DDA0DD">
//                 <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <Tag text={`${linkedin.wordCount || '~'} words`} bg="#F5F0E8" />
//                     <Tag text="Under 160 words" bg="#A8FF78" />
//                   </div>
//                   <CopyButton text={linkedin.content} label="Copy Message" />
//                 </div>
//                 {linkedin.usageNote && (
//                   <div style={{ background: '#FFF9E6', border: '2px solid #000', padding: '8px 14px',
//                                 fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
//                     💡 {linkedin.usageNote}
//                   </div>
//                 )}
//                 <div style={{ background: '#F8F4FF', border: '2px solid #000', padding: 20,
//                               fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
//                   {(linkedin.content || '').split('\n').map((line, i) => (
//                     <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* Follow-Up Email */}
//             {followUp.content && (
//               <Accordion title={`Follow-Up Email (Send after ${followUp.sendAfterDays || 6} days)`}
//                          icon={Send} bg="#FFA07A">
//                 <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between',
//                               alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
//                   <div>
//                     <span style={{ fontWeight: 800, fontSize: 13 }}>Subject: </span>
//                     <span style={{ fontWeight: 700, fontSize: 13 }}>{followUp.subject}</span>
//                   </div>
//                   <CopyButton text={`Subject: ${followUp.subject}\n\n${followUp.content}`} label="Copy Full Email" />
//                 </div>
//                 <div style={{ background: '#FFF5EE', border: '2px solid #000', padding: 20,
//                               fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
//                   {(followUp.content || '').split('\n').map((line, i) => (
//                     <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* ATS Keywords */}
//             {keywords.length > 0 && (
//               <Accordion title="ATS Keywords Included" icon={Target} bg="#A8FF78">
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                   {keywords.map((kw, i) => <Tag key={i} text={kw} bg="#E8FFE8" />)}
//                 </div>
//               </Accordion>
//             )}

//             {/* Personalization Audit — only when score > 0 */}
//             {audit.score > 0 && (
//               <Accordion title="Personalization Audit" icon={Eye} bg="#FFE566" defaultOpen>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
//                   <ScoreChip score={audit.score} size="lg" />
//                   <div>
//                     <div style={{ fontWeight: 900, fontSize: 18 }}>{audit.level}</div>
//                     <div style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Personalization Level</div>
//                   </div>
//                 </div>
//                 {audit.whatMakesItPersonalized?.length > 0 && (
//                   <div style={{ marginBottom: 16 }}>
//                     <div style={{ fontWeight: 800, marginBottom: 8 }}>What makes it personalized:</div>
//                     {audit.whatMakesItPersonalized.map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
//                         <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {audit.whatCouldBeMorePersonalized?.length > 0 && (
//                   <div>
//                     <div style={{ fontWeight: 800, marginBottom: 8 }}>Could be even more specific:</div>
//                     {audit.whatCouldBeMorePersonalized.map((item, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
//                         <AlertTriangle size={15} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* Hiring Manager View */}
//             {(overview.bestPartsOfThisLetter?.length > 0 || overview.hiringManagerFirstImpression || overview.diffFromGenericLetters) && (
//               <Accordion title="Hiring Manager's View" icon={Eye} bg="#74B9FF">
//                 {overview.hiringManagerFirstImpression && (
//                   <div style={{ background: '#E8F4FF', border: '2px solid #000', padding: '12px 16px',
//                                 marginBottom: 16, borderLeft: '5px solid #000' }}>
//                     <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
//                       First 6 seconds impression:
//                     </div>
//                     <div style={{ fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
//                       "{overview.hiringManagerFirstImpression}"
//                     </div>
//                   </div>
//                 )}
//                 {overview.diffFromGenericLetters && (
//                   <div style={{ background: '#E8FFE8', border: '2px solid #000', padding: '12px 16px',
//                                 marginBottom: 16, borderLeft: '5px solid #000' }}>
//                     <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
//                       Why it stands out:
//                     </div>
//                     <div style={{ fontSize: 14, lineHeight: 1.7 }}>{overview.diffFromGenericLetters}</div>
//                   </div>
//                 )}
//                 {overview.bestPartsOfThisLetter?.length > 0 && (
//                   <div>
//                     <div style={{ fontWeight: 800, marginBottom: 8 }}>Strongest elements:</div>
//                     {overview.bestPartsOfThisLetter.map((part, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                         <Star size={15} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{part}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </Accordion>
//             )}

//             {/* Strengths */}
//             {(strengths.length > 0 || keyPoints.length > 0) && (
//               <Accordion title="Strengths Woven In" icon={Zap} bg="#A8FF78">
//                 {strengths.map((s, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                     <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
//                   </div>
//                 ))}
//                 {keyPoints.length > 0 && (
//                   <>
//                     <div style={{ fontWeight: 800, marginTop: 12, marginBottom: 8 }}>Key Points Used:</div>
//                     {keyPoints.map((kp, i) => (
//                       <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                         <Target size={15} style={{ color: '#1a5f1a', flexShrink: 0, marginTop: 2 }} />
//                         <span style={{ fontSize: 13, fontWeight: 600 }}>{kp}</span>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </Accordion>
//             )}

//             {/* Weaknesses Addressed */}
//             {weakAddr.length > 0 && (
//               <Accordion title="How Weaknesses Were Handled" icon={AlertTriangle} bg="#FFA07A">
//                 {weakAddr.map((w, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF5EE' }}>
//                     <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>Gap: {w.weakness}</div>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Handled by: {w.howHandled}</div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* Improvement Suggestions */}
//             {improvements.length > 0 && (
//               <Accordion title="Improvement Suggestions" icon={TrendingUp} bg="#DDA0DD">
//                 {improvements.map((imp, i) => {
//                   const priColor = { High: '#FF6B6B', Medium: '#FFE566', Low: '#A8FF78' }[imp.priority] || '#F5F0E8';
//                   return (
//                     <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
//                       <Tag text={imp.priority || 'Note'} bg={priColor} />
//                       <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{imp.suggestion}</span>
//                     </div>
//                   );
//                 })}
//               </Accordion>
//             )}

//             {/* Red Flags Avoided */}
//             {redFlags.length > 0 && (
//               <Accordion title="Red Flags Avoided" icon={AlertTriangle} bg="#FF6B6B">
//                 {redFlags.map((flag, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
//                     <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
//                     <span style={{ fontSize: 13, fontWeight: 600 }}>{flag}</span>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* Regenerate */}
//             <div style={{ textAlign: 'center', paddingBottom: 32 }}>
//               <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//                 style={{ background: '#fff', border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                          padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
//                          textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
//                 <RefreshCw size={16} /> Generate Another
//               </button>
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default CoverLetterPage;





























import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import FeaturePageGuard, { LockedUploadZone, LockedActionButton } from '../components/FeaturePageGuard';
import {
  ArrowLeft, Loader2, FileText, Send, Copy, Check,
  Home, Upload, ChevronDown, ChevronUp, Star,
  Mail, Linkedin, Target, Zap,
  AlertTriangle, TrendingUp, Eye, RefreshCw, X
} from 'lucide-react';
 
const TONES = [
  { id: 'Professional', label: 'Professional' },
  { id: 'Bold',         label: 'Bold'         },
  { id: 'Startup',      label: 'Startup'      },
  { id: 'Executive',    label: 'Executive'    },
  { id: 'Creative',     label: 'Creative'     },
];
 
// ── Score chip — never renders a red "0" for missing data ─────────
const ScoreChip = ({ score, size = 'md' }) => {
  const n = Number(score);
  if (!n) return null;                            // hides 0 and undefined
  const bg  = n >= 80 ? '#A8FF78' : n >= 60 ? '#FFE566' : '#FF6B6B';
  const fs  = size === 'lg' ? 36 : 24;
  const pad = size === 'lg' ? '12px 20px' : '8px 14px';
  return (
    <span style={{
      background: bg, border: '3px solid #000', boxShadow: '3px 3px 0 #000',
      padding: pad, fontWeight: 900, fontSize: fs, color: '#000',
      display: 'inline-block', lineHeight: 1,
    }}>
      {n}
    </span>
  );
};
 
const SectionHeader = ({ icon: Icon, title, subtitle, bg = '#FFE566' }) => (
  <div style={{ background: bg, border: '3px solid #000', borderBottom: 'none',
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
    {Icon && <Icon size={22} />}
    <div>
      <div style={{ fontWeight: 900, fontSize: 16, textTransform: 'uppercase' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{subtitle}</div>}
    </div>
  </div>
);
 
const Tag = ({ text, bg = '#F5F0E8' }) => (
  <span style={{ background: bg, border: '2px solid #000', padding: '3px 10px',
                 fontSize: 12, fontWeight: 700, display: 'inline-block' }}>
    {text}
  </span>
);
 
// ── VerdictBadge — returns null when verdict is missing/empty ─────
const VerdictBadge = ({ verdict }) => {
  if (!verdict) return null;
  const map = {
    'SEND IT':               { bg: '#A8FF78', text: '✅ SEND IT' },
    'SEND WITH MINOR EDITS': { bg: '#FFE566', text: '✏️ SEND WITH MINOR EDITS' },
    'REWRITE RECOMMENDED':   { bg: '#FF6B6B', text: '🔁 REWRITE RECOMMENDED' },
  };
  const cfg = map[verdict] || { bg: '#FFE566', text: verdict };
  return (
    <span style={{ background: cfg.bg, border: '3px solid #000', boxShadow: '3px 3px 0 #000',
                   padding: '8px 18px', fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>
      {cfg.text}
    </span>
  );
};
 
const Accordion = ({ title, icon: Icon, bg, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', marginBottom: 20 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: bg || '#F5F0E8', border: 'none',
                 borderBottom: open ? '3px solid #000' : 'none', padding: '14px 20px',
                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 cursor: 'pointer', fontWeight: 900, fontSize: 15, textTransform: 'uppercase' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Icon && <Icon size={20} />}{title}
        </span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div style={{ background: '#fff', padding: 20 }}>{children}</div>}
    </div>
  );
};
 
const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ background: copied ? '#A8FF78' : '#fff', border: '2px solid #000', padding: '6px 14px',
               fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex',
               alignItems: 'center', gap: 6, boxShadow: '2px 2px 0 #000' }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};
 
// ── tryParse — safe JSON.parse that returns null on failure ────────
const tryParse = (str) => {
  if (!str || typeof str !== 'string') return null;
  try { return JSON.parse(str); } catch { return null; }
};
 
// ── normalizeResponse — handles every backend response shape ──────
//
//  Shape A (new nested):  data.parsed = { coverLetter: { content }, overview, ... }
//  Shape B (flat parsed): data.parsed = { content, overview, ... }
//  Shape C (raw string):  data.result = "<JSON string>"
//  Shape D (direct):      data = { content, overview, ... }
//
// All shapes are collapsed into ONE consistent object so the JSX
// never has to worry about which shape arrived.
const normalizeResponse = (data) => {
  const raw = data?.parsed
    || tryParse(data?.result)
    || data
    || {};
 
  // coverLetter fields — support both nested (raw.coverLetter.x) and flat (raw.x)
  const clSrc = raw?.coverLetter || {};
  const coverLetter = {
    content:          clSrc.content          || raw.content          || '',
    wordCount:        clSrc.wordCount        || raw.wordCount        || null,
    toneUsed:         clSrc.toneUsed         || raw.toneUsed         || null,
    jobTitleTargeted: clSrc.jobTitleTargeted || raw.jobTitleTargeted || null,
    companyNameUsed:  clSrc.companyNameUsed  || raw.companyNameUsed  || null,
  };
 
  // overview — try raw.overview first, then data.overview
  const overview = raw.overview || data?.overview || {};
 
  // personalizationAudit — same
  const personalizationAudit = raw.personalizationAudit || data?.personalizationAudit || {};
 
  return {
    coverLetter,
    overview,
    personalizationAudit,
    alternativeOpeners:     raw.alternativeOpeners     || data?.alternativeOpeners     || [],
    emailSubjectLines:      raw.emailSubjectLines      || data?.emailSubjectLines      || [],
    // backend sometimes uses "linkedinMessage" (lowercase i) vs "linkedInMessage"
    linkedInMessage:        raw.linkedInMessage        || raw.linkedinMessage          || data?.linkedInMessage || {},
    followUpEmail:          raw.followUpEmail          || data?.followUpEmail          || {},
    atsKeywordsIncluded:    raw.atsKeywordsIncluded    || data?.atsKeywordsIncluded    || [],
    keyPointsUsed:          raw.keyPointsUsed          || data?.keyPointsUsed          || [],
    strengthsHighlighted:   raw.strengthsHighlighted   || data?.strengthsHighlighted   || [],
    weaknessesAddressed:    raw.weaknessesAddressed    || data?.weaknessesAddressed    || [],
    redFlagsAvoided:        raw.redFlagsAvoided        || data?.redFlagsAvoided        || [],
    improvementSuggestions: raw.improvementSuggestions || data?.improvementSuggestions || [],
  };
};
 
// ═══════════════════════════════════════════════════════════════════
export const CoverLetterPage = () => {
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);
  const [file,    setFile]      = useState(null);
  const [activeOpener, setActiveOpener] = useState(0);
  const [formData, setFormData] = useState({
    jobTitle: '', userName: '', companyName: '', jobDescription: '', tone: 'Professional',
  });
  const resultRef = useRef(null);
 
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('Only PDF files allowed'); return; }
    if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');                return; }
    setFile(f);
  };
 
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)                     { toast.error('Please upload your resume PDF'); return; }
    if (!formData.jobTitle.trim()) { toast.error('Job title is required');         return; }
 
    setLoading(true);
    setResult(null);
 
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      uploadForm.append('targetDomain', 'general');
      const uploadRes  = await resumeAPI.uploadAndAnalyze(uploadForm);
      const resumeText = uploadRes.data?.resumeText || uploadRes.data?.analysis?.resumeText || '';
      if (!resumeText) throw new Error('Could not extract text from PDF. Try a different file.');
 
      const clRes = await resumeAPI.generateCoverLetter({
        resumeText,
        jobTitle:       formData.jobTitle,
        userName:       formData.userName,
        companyName:    formData.companyName,
        jobDescription: formData.jobDescription,
        tone:           formData.tone,
      });
 
      // ── Single normalize call handles ALL backend shapes ─────────
      const normalized = normalizeResponse(clRes.data);
 
      if (!normalized.coverLetter.content) {
        throw new Error('Received empty cover letter from AI. Please retry.');
      }
 
      setResult(normalized);
      toast.success('Cover letter generated!');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
 
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };
 
  const cl         = result?.coverLetter          || {};
  const overview   = result?.overview             || {};
  const audit      = result?.personalizationAudit || {};
  const openers    = result?.alternativeOpeners   || [];
  const subjects   = result?.emailSubjectLines    || [];
  const linkedin   = result?.linkedInMessage      || {};
  const followUp   = result?.followUpEmail        || {};
  const keywords   = result?.atsKeywordsIncluded  || [];
  const keyPoints  = result?.keyPointsUsed        || [];
  const strengths  = result?.strengthsHighlighted || [];
  const weakAddr   = result?.weaknessesAddressed  || [];
  const redFlags   = result?.redFlagsAvoided      || [];
  const improvements = result?.improvementSuggestions || [];
 
  // Only show the overview banner when it contains real data
  const hasOverview = !!(
    overview.finalVerdict
    || overview.letterStrengthScore
    || overview.oneLineCritique
    || overview.callbackLikelihoodPercent
  );
 
  return (
    <div className="min-h-screen bg-neo-offwhite">
      <FeaturePageGuard action="cover_letter" />
      
      <Navbar />
 
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
 
        {/* ── FORM ── */}
        <div style={{ background: '#fff', border: '3px solid #000', boxShadow: '7px 7px 0 #000', padding: 32 }}>
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: 64, height: 64, background: '#A8FF78', border: '3px solid #000',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={28} />
            </div>
            <div>
              <h1 className="font-space text-3xl font-extrabold">COVER LETTER GENERATOR</h1>
              <p style={{ color: '#666', fontWeight: 600 }}>AI-powered · Personalized · ATS-optimized</p>
            </div>
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PDF Upload */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <LockedUploadZone action="cover_letter">
                <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                  style={{ border: '3px dashed #000', background: file ? '#A8FF78' : '#F5F0E8',
                           padding: 32, textAlign: 'center', transition: 'background 0.2s' }}>
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileText size={28} />
                      <span style={{ fontWeight: 800 }}>{file.name}</span>
                      <span style={{ color: '#555', fontSize: 13 }}>({(file.size / 1024).toFixed(0)} KB)</span>
                      <button type="button" onClick={() => setFile(null)}
                        style={{ background: '#FF6B6B', border: '2px solid #000', padding: '2px 8px',
                                 fontWeight: 900, cursor: 'pointer' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }} />
                      <label style={{ cursor: 'pointer' }}>
                        <span style={{ background: '#FFE566', border: '3px solid #000',
                                       boxShadow: '3px 3px 0 #000', padding: '10px 24px',
                                       fontWeight: 800, display: 'inline-block' }}>
                          Browse or Drop PDF
                        </span>
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                      </label>
                      <p style={{ marginTop: 10, fontSize: 12, color: '#888', fontWeight: 600 }}>PDF only · Max 5MB</p>
                    </>
                  )}
                </div>
              </LockedUploadZone>
            </div>
 
            {/* Job Title */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Job Title <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <input type="text" value={formData.jobTitle}
                onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Senior Software Engineer, Data Scientist..."
                style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
                         fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
            </div>
 
            {/* Name + Company */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Your Name</label>
                <input type="text" value={formData.userName}
                  onChange={e => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="Full name (optional)"
                  style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
                           fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Company Name</label>
                <input type="text" value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Target company (optional)"
                  style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
                           fontWeight: 700, fontSize: 15, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
 
            {/* Job Description */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Job Description
                <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8, color: '#555' }}>
                  (Paste for a more targeted letter)
                </span>
              </label>
              <textarea value={formData.jobDescription}
                onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
                placeholder="Paste the full job description here..." rows={5}
                style={{ width: '100%', border: '3px solid #000', padding: '12px 16px',
                         fontWeight: 600, fontSize: 14, outline: 'none', resize: 'vertical',
                         boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
 
            {/* Tone */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>Tone</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {TONES.map(t => (
                  <button key={t.id} type="button" onClick={() => setFormData({ ...formData, tone: t.id })}
                    style={{
                      background: formData.tone === t.id ? '#FFE566' : '#fff',
                      border: '3px solid #000', fontWeight: 800, padding: '8px 18px',
                      cursor: 'pointer', fontSize: 13, transition: 'all 0.1s',
                      boxShadow: formData.tone === t.id ? '2px 2px 0 #000' : '4px 4px 0 #000',
                      transform: formData.tone === t.id ? 'translate(2px,2px)' : 'none',
                    }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
 
            <LockedActionButton
              action="cover_letter"
              onClick={handleSubmit}
              disabled={loading || !file}
              style={{
                width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
                border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #FFE566',
                padding: '16px', fontWeight: 900, fontSize: 16,
                cursor: loading || !file ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Generating your letter...</>
                : <><Send size={20} /> Generate Cover Letter</>}
            </LockedActionButton>
          </form>
        </div>
 
        {/* ═══════════════════════════════════════════════════════
            RESULTS
        ═══════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="space-y-6">
 
            {/* Overview — only when it has real data */}
            {hasOverview && (
              <div style={{ background: '#000', color: '#fff', border: '3px solid #000',
                            boxShadow: '7px 7px 0 #FFE566', padding: '24px 28px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                              justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase',
                                  fontWeight: 700, marginBottom: 8 }}>
                      Letter Analysis
                    </div>
                    {/* Returns null when verdict is falsy — no empty colored square */}
                    <VerdictBadge verdict={overview.finalVerdict} />
                  </div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    {/* Returns null when score is 0 — no red "0" chip */}
                    {!!overview.letterStrengthScore && (
                      <div style={{ textAlign: 'center' }}>
                        <ScoreChip score={overview.letterStrengthScore} size="lg" />
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Letter Score</div>
                      </div>
                    )}
                    {!!audit.score && (
                      <div style={{ textAlign: 'center' }}>
                        <ScoreChip score={audit.score} size="lg" />
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, fontWeight: 700 }}>Personalization</div>
                      </div>
                    )}
                  </div>
                </div>
                {overview.oneLineCritique && (
                  <div style={{ background: '#1a1a1a', border: '2px solid #444', padding: '10px 16px',
                                fontStyle: 'italic', fontSize: 14, color: '#ddd', marginBottom: 12 }}>
                    "{overview.oneLineCritique}"
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                  {overview.callbackLikelihoodPercent && (
                    <div>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>CALLBACK LIKELIHOOD</div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: '#FFE566' }}>{overview.callbackLikelihoodPercent}</div>
                    </div>
                  )}
                  {cl.toneUsed && (
                    <div>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>TONE</div>
                      <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.toneUsed}</div>
                    </div>
                  )}
                  {cl.wordCount && (
                    <div>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>WORD COUNT</div>
                      <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.wordCount}</div>
                    </div>
                  )}
                  {cl.companyNameUsed && (
                    <div>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 700 }}>TARGETED COMPANY</div>
                      <div style={{ fontWeight: 900, fontSize: 18 }}>{cl.companyNameUsed}</div>
                    </div>
                  )}
                </div>
                {overview.finalVerdictReason && (
                  <div style={{ marginTop: 12, fontSize: 13, color: '#bbb', fontWeight: 600 }}>
                    {overview.finalVerdictReason}
                  </div>
                )}
              </div>
            )}
 
            {/* Main Cover Letter */}
            <div style={{ border: '3px solid #000', boxShadow: '7px 7px 0 #000' }}>
              <SectionHeader icon={FileText} title="Your Cover Letter"
                subtitle={cl.jobTitleTargeted ? `Targeted for: ${cl.jobTitleTargeted}` : undefined}
                bg="#A8FF78" />
              <div style={{ background: '#fff', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <CopyButton text={cl.content || ''} label="Copy Letter" />
                </div>
                <div style={{ background: '#FAFAF8', border: '2px solid #ddd', padding: '28px 32px',
                              fontFamily: 'Georgia, serif', lineHeight: 1.9, fontSize: 15 }}>
                  {(cl.content || '').split('\n').map((line, i) => (
                    <p key={i} style={{ margin: line.trim() === '' ? '12px 0' : '0 0 2px 0',
                                        minHeight: line.trim() === '' ? 8 : 'auto' }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Alternative Openers */}
            {openers.length > 0 && (
              <Accordion title="3 Alternative Opening Hooks" icon={RefreshCw} bg="#74B9FF" defaultOpen>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
                  Not happy with the opening? Pick one of these instead:
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  {openers.map((op, i) => (
                    <button key={i} onClick={() => setActiveOpener(i)}
                      style={{
                        background: activeOpener === i ? '#FFE566' : '#F5F0E8',
                        border: '2px solid #000',
                        boxShadow: activeOpener === i ? '2px 2px 0 #000' : '3px 3px 0 #000',
                        transform: activeOpener === i ? 'translate(1px,1px)' : 'none',
                        padding: '6px 16px', fontWeight: 800, cursor: 'pointer', fontSize: 12,
                      }}>
                      {op.style}
                    </button>
                  ))}
                </div>
                {openers[activeOpener] && (
                  <div style={{ background: '#FAFAF8', border: '2px solid #000', padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                                  alignItems: 'flex-start', marginBottom: 12 }}>
                      <Tag text={openers[activeOpener].style} bg="#FFE566" />
                      <CopyButton text={openers[activeOpener].text} />
                    </div>
                    <p style={{ lineHeight: 1.8, fontFamily: 'Georgia, serif', fontSize: 14, marginBottom: 12 }}>
                      {openers[activeOpener].text}
                    </p>
                    {openers[activeOpener].whyItWorks && (
                      <div style={{ background: '#E8F5E9', border: '1px solid #000', padding: '8px 12px',
                                    fontSize: 12, fontWeight: 600, borderLeft: '4px solid #000' }}>
                        <span style={{ fontWeight: 800 }}>Why it works: </span>{openers[activeOpener].whyItWorks}
                      </div>
                    )}
                  </div>
                )}
              </Accordion>
            )}
 
            {/* Email Subject Lines */}
            {subjects.length > 0 && (
              <Accordion title="Email Subject Lines" icon={Mail} bg="#FFE566">
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 16 }}>
                  Use these when emailing the cover letter directly:
                </p>
                <div className="space-y-3">
                  {subjects.map((s, i) => (
                    <div key={i} style={{ border: '2px solid #000', padding: '12px 16px',
                                          background: i === 0 ? '#FFF9E6' : '#fff',
                                          display: 'flex', alignItems: 'flex-start',
                                          justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          {i === 0 && <Tag text="BEST" bg="#FFE566" />}
                          <Tag text={s.style || `Option ${i + 1}`} bg="#F5F0E8" />
                        </div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>{s.subject}</div>
                        {s.psychologyNote && (
                          <div style={{ fontSize: 12, color: '#666', marginTop: 4, fontWeight: 600 }}>
                            {s.psychologyNote}
                          </div>
                        )}
                      </div>
                      <CopyButton text={s.subject} />
                    </div>
                  ))}
                </div>
              </Accordion>
            )}
 
            {/* LinkedIn Message */}
            {linkedin.content && (
              <Accordion title="LinkedIn InMail Version" icon={Linkedin} bg="#DDA0DD">
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Tag text={`${linkedin.wordCount || '~'} words`} bg="#F5F0E8" />
                    <Tag text="Under 160 words" bg="#A8FF78" />
                  </div>
                  <CopyButton text={linkedin.content} label="Copy Message" />
                </div>
                {linkedin.usageNote && (
                  <div style={{ background: '#FFF9E6', border: '2px solid #000', padding: '8px 14px',
                                fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                    💡 {linkedin.usageNote}
                  </div>
                )}
                <div style={{ background: '#F8F4FF', border: '2px solid #000', padding: 20,
                              fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
                  {(linkedin.content || '').split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
                  ))}
                </div>
              </Accordion>
            )}
 
            {/* Follow-Up Email */}
            {followUp.content && (
              <Accordion title={`Follow-Up Email (Send after ${followUp.sendAfterDays || 6} days)`}
                         icon={Send} bg="#FFA07A">
                <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>Subject: </span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{followUp.subject}</span>
                  </div>
                  <CopyButton text={`Subject: ${followUp.subject}\n\n${followUp.content}`} label="Copy Full Email" />
                </div>
                <div style={{ background: '#FFF5EE', border: '2px solid #000', padding: 20,
                              fontFamily: 'Georgia, serif', lineHeight: 1.8, fontSize: 14 }}>
                  {(followUp.content || '').split('\n').map((line, i) => (
                    <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
                  ))}
                </div>
              </Accordion>
            )}
 
            {/* ATS Keywords */}
            {keywords.length > 0 && (
              <Accordion title="ATS Keywords Included" icon={Target} bg="#A8FF78">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {keywords.map((kw, i) => <Tag key={i} text={kw} bg="#E8FFE8" />)}
                </div>
              </Accordion>
            )}
 
            {/* Personalization Audit — only when score > 0 */}
            {audit.score > 0 && (
              <Accordion title="Personalization Audit" icon={Eye} bg="#FFE566" defaultOpen>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                  <ScoreChip score={audit.score} size="lg" />
                  <div>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>{audit.level}</div>
                    <div style={{ fontSize: 13, color: '#555', fontWeight: 600 }}>Personalization Level</div>
                  </div>
                </div>
                {audit.whatMakesItPersonalized?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>What makes it personalized:</div>
                    {audit.whatMakesItPersonalized.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                        <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                {audit.whatCouldBeMorePersonalized?.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Could be even more specific:</div>
                    {audit.whatCouldBeMorePersonalized.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                        <AlertTriangle size={15} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Accordion>
            )}
 
            {/* Hiring Manager View */}
            {(overview.bestPartsOfThisLetter?.length > 0 || overview.hiringManagerFirstImpression || overview.diffFromGenericLetters) && (
              <Accordion title="Hiring Manager's View" icon={Eye} bg="#74B9FF">
                {overview.hiringManagerFirstImpression && (
                  <div style={{ background: '#E8F4FF', border: '2px solid #000', padding: '12px 16px',
                                marginBottom: 16, borderLeft: '5px solid #000' }}>
                    <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
                      First 6 seconds impression:
                    </div>
                    <div style={{ fontStyle: 'italic', fontSize: 14, lineHeight: 1.7 }}>
                      "{overview.hiringManagerFirstImpression}"
                    </div>
                  </div>
                )}
                {overview.diffFromGenericLetters && (
                  <div style={{ background: '#E8FFE8', border: '2px solid #000', padding: '12px 16px',
                                marginBottom: 16, borderLeft: '5px solid #000' }}>
                    <div style={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
                      Why it stands out:
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.7 }}>{overview.diffFromGenericLetters}</div>
                  </div>
                )}
                {overview.bestPartsOfThisLetter?.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Strongest elements:</div>
                    {overview.bestPartsOfThisLetter.map((part, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <Star size={15} style={{ color: '#B45309', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{part}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Accordion>
            )}
 
            {/* Strengths */}
            {(strengths.length > 0 || keyPoints.length > 0) && (
              <Accordion title="Strengths Woven In" icon={Zap} bg="#A8FF78">
                {strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
                  </div>
                ))}
                {keyPoints.length > 0 && (
                  <>
                    <div style={{ fontWeight: 800, marginTop: 12, marginBottom: 8 }}>Key Points Used:</div>
                    {keyPoints.map((kp, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <Target size={15} style={{ color: '#1a5f1a', flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{kp}</span>
                      </div>
                    ))}
                  </>
                )}
              </Accordion>
            )}
 
            {/* Weaknesses Addressed */}
            {weakAddr.length > 0 && (
              <Accordion title="How Weaknesses Were Handled" icon={AlertTriangle} bg="#FFA07A">
                {weakAddr.map((w, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 14, marginBottom: 10, background: '#FFF5EE' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>Gap: {w.weakness}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>Handled by: {w.howHandled}</div>
                  </div>
                ))}
              </Accordion>
            )}
 
            {/* Improvement Suggestions */}
            {improvements.length > 0 && (
              <Accordion title="Improvement Suggestions" icon={TrendingUp} bg="#DDA0DD">
                {improvements.map((imp, i) => {
                  const priColor = { High: '#FF6B6B', Medium: '#FFE566', Low: '#A8FF78' }[imp.priority] || '#F5F0E8';
                  return (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                      <Tag text={imp.priority || 'Note'} bg={priColor} />
                      <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{imp.suggestion}</span>
                    </div>
                  );
                })}
              </Accordion>
            )}
 
            {/* Red Flags Avoided */}
            {redFlags.length > 0 && (
              <Accordion title="Red Flags Avoided" icon={AlertTriangle} bg="#FF6B6B">
                {redFlags.map((flag, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                    <Check size={15} style={{ color: '#2d7a2d', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{flag}</span>
                  </div>
                ))}
              </Accordion>
            )}
 
            {/* Regenerate */}
            <div style={{ textAlign: 'center', paddingBottom: 32 }}>
              <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ background: '#fff', border: '3px solid #000', boxShadow: '5px 5px 0 #000',
                         padding: '12px 32px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
                         textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <RefreshCw size={16} /> Generate Another
              </button>
            </div>
 
          </div>
        )}
      </div>
    </div>
  );
};
 
 
export default CoverLetterPage;