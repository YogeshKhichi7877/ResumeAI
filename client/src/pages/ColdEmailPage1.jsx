// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import { 
//   ArrowLeft, Loader2, Send, Copy, Check, Mail, MessageCircle, Upload, FileText, Home
// } from 'lucide-react';

// export const ColdEmailPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [copied, setCopied] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [selectedResume, setSelectedResume] = useState(null);
//   const [showUpload, setShowUpload] = useState(false);
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     targetCompany: '',
//     targetRole: ''
//   });
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const response = await historyAPI.getHistory();
//       setHistory(response.data);
//       if (response.data.length > 0) {
//         setSelectedResume(response.data[0]);
//       }
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

//     let resumeText = '';

//     if (file) {
//       setLoading(true);
//       try {
//         const formDataUpload = new FormData();
//         formDataUpload.append('file', file);
//         formDataUpload.append('targetDomain', 'general');
        
//         const uploadResponse = await resumeAPI.uploadAndAnalyze(formDataUpload);
//         resumeText = uploadResponse.data.resumeText;
        
//         fetchHistory();
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to upload resume');
//         setLoading(false);
//         return;
//       }
//     } else if (!selectedResume) {
//       toast.error('Please select an uploaded resume or upload a new one');
//       return;
//     } else {
//       resumeText = selectedResume.resumeText;
//     }

//     if (!formData.targetCompany.trim()) {
//       toast.error('Please enter the target company name');
//       setLoading(false);
//       return;
//     }

//     if (!formData.targetRole.trim()) {
//       toast.error('Please enter the target role');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await resumeAPI.chatWithAssistant({
//         message: `Generate 3 variants of cold outreach messages for a job application at ${formData.targetCompany} for the role of ${formData.targetRole}. 

// Please generate:
// 1. One formal cold email
// 2. One LinkedIn DM  
// 3. One referral request message

// Make them personalized and professional.`,
//         resumeContext: resumeText,
//         targetDomain: formData.targetRole,
//         conversationHistory: []
//       });
      
//       setResult({
//         email: response.data.response,
//         linkedin: response.data.response,
//         referral: response.data.response
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to generate messages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = (type) => {
//     const messages = {
//       email: `Subject: Application for ${formData.targetRole} Position at ${formData.targetCompany}

// Dear Hiring Manager,

// I am writing to express my strong interest in the ${formData.targetRole} position at ${formData.targetCompany}. With my background and skills, I believe I would be a valuable addition to your team.

// I would welcome the opportunity to discuss how my skills and experience align with your needs.

// Best regards,
// [Your Name]`,
//       linkedin: `Hi [Hiring Manager's Name],

// I came across the ${formData.targetRole} opening at ${formData.targetCompany} and was excited to reach out. With my experience, I believe I could be a great fit for your team.

// Would you be open to a quick chat?

// Thanks!
// [Your Name]`,
//       referral: `Hi [Connection's Name],

// I hope you're doing well! I noticed you work at ${formData.targetCompany} and I'm very interested in the ${formData.targetRole} role there.

// I was wondering if you might be open to a brief conversation about your experience at the company? I'd love to learn more and potentially ask for a referral.

// Would you have 15-20 minutes this week?

// Thank you!
// [Your Name]`
//     };
    
//     navigator.clipboard.writeText(messages[type]);
//     setCopied(type);
//     setTimeout(() => setCopied(null), 2000);
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
//             <div className="w-16 h-16 bg-neo-orange border-3 border-black flex items-center justify-center">
//               <Mail className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">COLD OUTREACH GENERATOR</h1>
//               <p className="text-gray-500">Generate professional cold emails, LinkedIn DMs, and referral messages</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Resume Selection */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="font-bold">Select Your Resume *</label>
//                 <button
//                   type="button"
//                   onClick={() => setShowUpload(!showUpload)}
//                   className="text-neo-blue font-bold hover:underline flex items-center gap-1"
//                 >
//                   <Upload className="w-4 h-4" />
//                   {showUpload ? 'Select from uploaded' : 'Upload new'}
//                 </button>
//               </div>
              
//               {showUpload ? (
//                 <div className="border-3 border-dashed border-black bg-white p-6 text-center">
//                   {file ? (
//                     <div className="flex items-center justify-center gap-4">
//                       <FileText className="w-8 h-8" />
//                       <span className="font-bold">{file.name}</span>
//                       <button onClick={() => setFile(null)} className="p-1 hover:bg-neo-red">
//                         ×
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                       <label className="neo-button cursor-pointer inline-block">
//                         Browse Files
//                         <input 
//                           type="file" 
//                           accept=".pdf" 
//                           onChange={handleFileChange}
//                           className="hidden"
//                           ref={fileInputRef}
//                         />
//                       </label>
//                       <p className="text-sm text-gray-500 mt-2">PDF only, max 5MB</p>
//                     </>
//                   )}
//                 </div>
//               ) : (
//                 <div className="grid md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
//                   {history.map((item) => (
//                     <button
//                       key={item._id}
//                       type="button"
//                       onClick={() => setSelectedResume(item)}
//                       className={`p-3 border-3 border-black text-left font-bold transition-all ${
//                         selectedResume?._id === item._id 
//                           ? 'bg-neo-yellow shadow-neo-sm' 
//                           : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <FileText className="w-5 h-5" />
//                         <span className="truncate">{item.fileName}</span>
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         Score: {item.score} • {new Date(item.createdAt).toLocaleDateString()}
//                       </div>
//                     </button>
//                   ))}
//                   {history.length === 0 && (
//                     <p className="text-gray-500 col-span-2 text-center py-4">
//                       No uploaded resumes. Please upload a resume first.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Target Company */}
//             <div>
//               <label className="font-bold mb-3 block">Target Company *</label>
//               <input
//                 type="text"
//                 value={formData.targetCompany}
//                 onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
//                 placeholder="e.g., Google, Meta, Startup Name..."
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             {/* Target Role */}
//             <div>
//               <label className="font-bold mb-3 block">Target Role *</label>
//               <input
//                 type="text"
//                 value={formData.targetRole}
//                 onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
//                 placeholder="e.g., Software Engineer, Product Manager..."
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading || (!file && !selectedResume)}
//               className={`neo-button w-full flex items-center justify-center gap-2 ${
//                 loading || (!file && !selectedResume) ? 'opacity-50 cursor-not-allowed' : ''
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
//                   GENERATE OUTREACH MESSAGES
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="neo-card p-8">
//             <h2 className="font-space text-2xl font-extrabold mb-6">YOUR OUTREACH MESSAGES</h2>
            
//             <div className="space-y-6">
//               {/* Formal Email */}
//               <div className="border-3 border-black p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-space text-xl font-extrabold flex items-center gap-2">
//                     <Mail className="w-6 h-6" />
//                     FORMAL EMAIL
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard('email')}
//                     className="neo-button flex items-center gap-2"
//                   >
//                     {copied === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied === 'email' ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="bg-white p-4 border-2 border-black">
//                   <p className="whitespace-pre-wrap">
// {`Subject: Application for ${formData.targetRole} Position at ${formData.targetCompany}

// Dear Hiring Manager,

// I am writing to express my strong interest in the ${formData.targetRole} position at ${formData.targetCompany}. With my background in [your key skills], I believe I would be a valuable addition to your team.

// [Add personalized paragraph about your relevant experience]

// I would welcome the opportunity to discuss how my skills and experience align with your needs.

// Best regards,
// [Your Name]`}
//                   </p>
//                 </div>
//               </div>

//               {/* LinkedIn DM */}
//               <div className="border-3 border-black p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-space text-xl font-extrabold flex items-center gap-2">
//                     <MessageCircle className="w-6 h-6" />
//                     LINKEDIN DM
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard('linkedin')}
//                     className="neo-button flex items-center gap-2"
//                   >
//                     {copied === 'linkedin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied === 'linkedin' ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="bg-white p-4 border-2 border-black">
//                   <p className="whitespace-pre-wrap">
// {`Hi [Hiring Manager's Name],

// I came across the ${formData.targetRole} opening at ${formData.targetCompany} and was excited to reach out. With my experience in [key skill], I believe I could be a great fit for your team.

// Would you be open to a quick chat? I'm happy to share more about my background.

// Thanks!
// [Your Name]`}
//                   </p>
//                 </div>
//               </div>

//               {/* Referral Request */}
//               <div className="border-3 border-black p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-space text-xl font-extrabold flex items-center gap-2">
//                     <MessageCircle className="w-6 h-6" />
//                     REFERRAL REQUEST
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard('referral')}
//                     className="neo-button flex items-center gap-2"
//                   >
//                     {copied === 'referral' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied === 'referral' ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="bg-white p-4 border-2 border-black">
//                   <p className="whitespace-pre-wrap">
// {`Hi [Connection's Name],

// I hope you're doing well! I noticed you work at ${formData.targetCompany} and I'm very interested in the ${formData.targetRole} role there.

// I was wondering if you might be open to a brief conversation about your experience at the company? I'd love to learn more about the team culture and potentially ask for a referral if you think I'd be a good fit.

// Would you have 15-20 minutes for a quick call this week?

// Thank you so much!
// [Your Name]`}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

























// import { useState, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft, Loader2, Send, Copy, Check, Mail, MessageCircle,
//   Upload, FileText, Home, ChevronDown, ChevronUp, X,
//   Linkedin, Twitter, Users, AtSign, Zap, Brain,
//   AlertTriangle, Star, TrendingUp, Eye, RefreshCw,
//   BarChart2, Shield, Clock, Target
// } from 'lucide-react';

// // ─── Platform definitions ─────────────────────────────────────────
// const PLATFORMS = [
//   {
//     id: 'LinkedIn',
//     label: 'LinkedIn DM',
//     icon: Linkedin,
//     bg: '#0077B5',
//     textColor: '#fff',
//     desc: '≤150 words',
//     subjectLine: false,
//   },
//   {
//     id: 'Email',
//     label: 'Cold Email',
//     icon: Mail,
//     bg: '#FFE566',
//     textColor: '#000',
//     desc: '≤220 words + subject',
//     subjectLine: true,
//   },
//   {
//     id: 'ColdEmail',
//     label: 'Structured Email',
//     icon: AtSign,
//     bg: '#A8FF78',
//     textColor: '#000',
//     desc: '≤280 words + subject',
//     subjectLine: true,
//   },
//   {
//     id: 'Twitter',
//     label: 'Twitter/X DM',
//     icon: Twitter,
//     bg: '#000',
//     textColor: '#fff',
//     desc: '≤60 words',
//     subjectLine: false,
//   },
//   {
//     id: 'Referral',
//     label: 'Referral Ask',
//     icon: Users,
//     bg: '#DDA0DD',
//     textColor: '#000',
//     desc: '≤180 words',
//     subjectLine: false,
//   },
//   {
//     id: 'InMail',
//     label: 'LinkedIn InMail',
//     icon: Linkedin,
//     bg: '#74B9FF',
//     textColor: '#000',
//     desc: '≤200 words + subject',
//     subjectLine: true,
//   },
// ];

// // ─── Reusable primitives ─────────────────────────────────────────

// const ScoreChip = ({ score, label }) => {
//   const s  = Number(score) || 0;
//   const bg = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div style={{
//         background: bg, border: '3px solid #000',
//         boxShadow: '3px 3px 0 #000', padding: '10px 16px',
//         fontWeight: 900, fontSize: 26, color: '#000',
//         display: 'inline-block', lineHeight: 1,
//       }}>
//         {s}
//       </div>
//       {label && (
//         <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4,
//                       textTransform: 'uppercase', color: '#555' }}>
//           {label}
//         </div>
//       )}
//     </div>
//   );
// };

// const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
//   <span style={{
//     background: bg, border: '2px solid #000',
//     padding: small ? '2px 8px' : '4px 12px',
//     fontSize: small ? 11 : 12, fontWeight: 700,
//     display: 'inline-block', lineHeight: 1.4,
//   }}>
//     {text}
//   </span>
// );

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

// const Accordion = ({ title, icon: Icon, bg = '#F5F0E8',
//                      defaultOpen = false, badge, children }) => {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                   marginBottom: 16 }}>
//       <button
//         onClick={() => setOpen(o => !o)}
//         style={{
//           width: '100%', background: bg,
//           border: 'none', borderBottom: open ? '3px solid #000' : 'none',
//           padding: '12px 18px',
//           display: 'flex', alignItems: 'center',
//           justifyContent: 'space-between',
//           cursor: 'pointer', fontWeight: 900,
//           fontSize: 13, textTransform: 'uppercase',
//         }}
//       >
//         <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           {Icon && <Icon size={16} />}
//           {title}
//           {badge !== undefined && (
//             <span style={{
//               background: '#000', color: '#FFE566',
//               padding: '1px 7px', fontSize: 11, fontWeight: 900,
//             }}>
//               {badge}
//             </span>
//           )}
//         </span>
//         {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//       </button>
//       {open && (
//         <div style={{ background: '#fff', padding: 18 }}>
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// // Message bubble — renders message content cleanly
// const MessageBubble = ({ content, platform }) => (
//   <div style={{
//     background: '#FAFAF8', border: '2px solid #ddd',
//     padding: '20px 24px',
//     fontFamily: platform === 'Twitter' ? 'monospace' : 'Georgia, serif',
//     lineHeight: 1.85, fontSize: 14,
//   }}>
//     {(content || '').split('\n').map((line, i) => (
//       <p key={i} style={{
//         margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
//         minHeight: line.trim() === '' ? 8 : 'auto',
//       }}>
//         {line}
//       </p>
//     ))}
//   </div>
// );

// // Verdict badge
// const VerdictBadge = ({ verdict }) => {
//   const map = {
//     'SEND AS-IS':               { bg: '#A8FF78', icon: '✅' },
//     'SEND WITH MINOR TWEAKS':   { bg: '#FFE566', icon: '✏️' },
//     'PERSONALIZE MORE':         { bg: '#FFA07A', icon: '🎯' },
//     'REWRITE RECOMMENDED':      { bg: '#FF6B6B', icon: '🔁' },
//   };
//   const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
//   return (
//     <span style={{
//       background: cfg.bg, border: '3px solid #000',
//       boxShadow: '3px 3px 0 #000', padding: '8px 16px',
//       fontWeight: 900, fontSize: 13, textTransform: 'uppercase',
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//     }}>
//       {cfg.icon} {verdict}
//     </span>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════
// export const ColdEmailPage = () => {
//   const [loading,         setLoading]         = useState(false);
//   const [result,          setResult]          = useState(null);
//   const [file,            setFile]            = useState(null);
//   const [history,         setHistory]         = useState([]);
//   const [selectedResume,  setSelectedResume]  = useState(null);
//   const [showUpload,      setShowUpload]       = useState(false);
//   const [activeAltVersion, setActiveAltVersion] = useState(0);
//   const [activeFollowUp,   setActiveFollowUp]   = useState(0);
//   const resultRef = useRef(null);

//   const [formData, setFormData] = useState({
//     recipientName:  '',
//     targetCompany:  '',
//     targetRole:     '',
//     jobDescription: '',
//     platform:       'LinkedIn',
//   });

//   // ── Fetch history on mount ───────────────────────────────────────
//   useState(() => {
//     const fetch = async () => {
//       try {
//         const res = await historyAPI.getHistory();
//         const list = Array.isArray(res.data) ? res.data : [];
//         setHistory(list);
//         if (list.length > 0) setSelectedResume(list[0]);
//       } catch { /* silent */ }
//     };
//     fetch();
//   }, []);

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
//     if (!file && !selectedResume) {
//       toast.error('Select a resume or upload a new one'); return;
//     }
//     if (!formData.recipientName.trim()) {
//       toast.error('Recipient name is required'); return;
//     }
//     if (!formData.targetCompany.trim()) {
//       toast.error('Target company is required'); return;
//     }
//     // Target role is optional now

//     setLoading(true);
//     setResult(null);

//     try {
//       let resumeAnalysis = null;

//       // Step 1 — if new file, upload and get analysis
//       if (file) {
//         const fd = new FormData();
//         fd.append('file', file);
//         fd.append('targetDomain', 'general'); // Use general domain for outreach
//         const uploadRes  = await resumeAPI.uploadAndAnalyze(fd);
//         resumeAnalysis   = uploadRes.data?.analysis || uploadRes.data;
//         // refresh history
//         try {
//           const h = await historyAPI.getHistory();
//           setHistory(Array.isArray(h.data) ? h.data : []);
//         } catch { /* silent */ }
//       } else {
//         // Use selected resume's analysis data
//         resumeAnalysis = selectedResume;
//       }

//       // Step 2 — build job description string from form fields
//       const jobDescStr = formData.jobDescription
//         || (formData.targetRole 
//           ? `Position: ${formData.targetRole} at ${formData.targetCompany}`
//           : `Company: ${formData.targetCompany}`);

//       // Step 3 — call generateOutreach
//       const response = await resumeAPI.generateOutreach({
//         resumeAnalysis,
//         jobDescription: jobDescStr,
//         recipientName:  formData.recipientName,
//         platform:       formData.platform,
//       });

//       // Backend returns { result (JSON string), parsed (object), modelUsed } or transformed result
//       // Transformed result has flat structure: { primaryMessage: { content }, subjectLine, etc. }
//       const data = response.data;
      
//       // Try to get parsed - handle both nested and flat formats
//       let parsed = data?.parsed || (data?.result ? JSON.parse(data.result) : null);
      
//       // Determine the outreach content - handle multiple response formats
//       let outreachContent = '';
//       let finalResult = null;
      
//       if (parsed?.primaryMessage?.content) {
//         // Nested format: { primaryMessage: { content: "..." } }
//         outreachContent = parsed.primaryMessage.content;
//         finalResult = parsed;
//       } else if (parsed?.content) {
//         // Flat format from parsed result: { content: "..." }
//         outreachContent = parsed.content;
//         // Wrap in expected structure while preserving other fields
//         finalResult = {
//           primaryMessage: {
//             content: parsed.content,
//             wordCount: parsed.wordCount
//           },
//           subjectLine: parsed.subjectLine,
//           alternativeVersions: parsed.alternativeVersions || [],
//           followUpSequence: parsed.followUpSequence || [],
//           connectionNoteVersion: parsed.connectionNoteVersion || {},
//           personalizationElements: parsed.personalizationElements || [],
//           redFlags: parsed.redFlags || [],
//           candidateValueProps: parsed.candidateValueProps || [],
//           recipientPsychology: parsed.recipientPsychology || {},
//           abTestSuggestions: parsed.abTestSuggestions || [],
//           platformBestPractices: parsed.platformBestPractices || []
//         };
//       } else if (data?.primaryMessage?.content) {
//         // Direct nested in response data
//         outreachContent = data.primaryMessage.content;
//         finalResult = data;
//       } else if (data?.content) {
//         // Direct flat in response data
//         outreachContent = data.content;
//         finalResult = {
//           primaryMessage: {
//             content: data.content,
//             wordCount: data.wordCount
//           },
//           subjectLine: data.subjectLine,
//           alternativeVersions: data.alternativeVersions || [],
//           followUpSequence: data.followUpSequence || []
//         };
//       }
      
//       if (!outreachContent) {
//         throw new Error('Empty outreach message received. Please retry.');
//       }

//       setResult(finalResult);
//       toast.success('Outreach package generated!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Generation failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Shortcuts ────────────────────────────────────────────────────
//   const pm       = result?.primaryMessage        || {};
//   const sl       = result?.subjectLine;
//   const alts     = result?.alternativeVersions   || [];
//   const sequence = result?.followUpSequence      || [];
//   const connNote = result?.connectionNoteVersion || {};
//   const perElems = result?.personalizationElements || [];
//   const redFlags = result?.redFlags              || [];
//   const valueProps = result?.candidateValueProps || [];
//   const psychology = result?.recipientPsychology || {};
//   const abTests  = result?.abTestSuggestions     || [];
//   const practices = result?.platformBestPractices || [];
//   const doNotSend = result?.doNotSendIf          || [];
//   const ov        = result?.overview             || {};

//   const activePlatform = PLATFORMS.find(p => p.id === formData.platform)
//     || PLATFORMS[0];

//   // ══════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-neo-offwhite">

//       {/* ── NAVBAR ── */}
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4
//                         flex items-center justify-between">
//           <Link to="/dashboard"
//             className="flex items-center gap-2 font-bold hover:text-neo-blue">
//             <ArrowLeft size={18} /> Back
//           </Link>
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 bg-neo-yellow border-3 border-black
//                             flex items-center justify-center">
//               <span className="font-space font-extrabold text-lg">R</span>
//             </div>
//             <span className="font-space font-extrabold text-xl">RESUME AI</span>
//           </div>
//           <Link to="/"
//             className="flex items-center gap-1 font-bold hover:text-neo-blue">
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
//             <div style={{ width: 64, height: 64, background: '#FFA07A',
//                           border: '3px solid #000',
//                           display: 'flex', alignItems: 'center',
//                           justifyContent: 'center' }}>
//               <Mail size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">
//                 OUTREACH GENERATOR
//               </h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>
//                 AI-powered · Platform-specific · 3-touch follow-up included
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* ── PLATFORM SELECTOR ── */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Platform <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div style={{ display: 'grid',
//                             gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))',
//                             gap: 10 }}>
//                 {PLATFORMS.map(p => {
//                   const Icon = p.icon;
//                   const sel  = formData.platform === p.id;
//                   return (
//                     <button key={p.id} type="button"
//                       onClick={() => setFormData({ ...formData, platform: p.id })}
//                       style={{
//                         background: sel ? p.bg : '#fff',
//                         color:      sel ? p.textColor : '#000',
//                         border:     '3px solid #000',
//                         boxShadow:  sel ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                         transform:  sel ? 'translate(2px,2px)' : 'none',
//                         padding:    '10px 12px',
//                         cursor:     'pointer',
//                         textAlign:  'left',
//                         transition: 'all 0.1s',
//                       }}
//                     >
//                       <div style={{ display: 'flex', alignItems: 'center',
//                                     gap: 6, marginBottom: 2 }}>
//                         <Icon size={14} />
//                         <span style={{ fontWeight: 900, fontSize: 12 }}>
//                           {p.label}
//                         </span>
//                       </div>
//                       <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 600 }}>
//                         {p.desc}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* ── RESUME SOURCE ── */}
//             <div>
//               <div style={{ display: 'flex', alignItems: 'center',
//                             justifyContent: 'space-between', marginBottom: 10 }}>
//                 <label style={{ fontWeight: 800 }}>
//                   Resume <span style={{ color: '#FF6B6B' }}>*</span>
//                 </label>
//                 <button type="button"
//                   onClick={() => setShowUpload(v => !v)}
//                   style={{ background: 'none', border: 'none', cursor: 'pointer',
//                            fontWeight: 700, fontSize: 13, color: '#0077B5',
//                            display: 'flex', alignItems: 'center', gap: 4 }}>
//                   <Upload size={13} />
//                   {showUpload ? 'Use saved resume' : 'Upload new'}
//                 </button>
//               </div>

//               {showUpload ? (
//                 /* Upload zone */
//                 <div
//                   onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
//                   onDragOver={e => e.preventDefault()}
//                   style={{
//                     border: '3px dashed #000',
//                     background: file ? '#A8FF78' : '#F5F0E8',
//                     padding: 24, textAlign: 'center',
//                   }}
//                 >
//                   {file ? (
//                     <div className="flex items-center justify-center gap-4">
//                       <FileText size={22} />
//                       <span style={{ fontWeight: 800 }}>{file.name}</span>
//                       <button type="button" onClick={() => setFile(null)}
//                         style={{ background: '#FF6B6B', border: '2px solid #000',
//                                  padding: '2px 7px', cursor: 'pointer', fontWeight: 900 }}>
//                         <X size={13} />
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload size={32} style={{ margin: '0 auto 10px',
//                                                   display: 'block', opacity: 0.4 }} />
//                       <label style={{ cursor: 'pointer' }}>
//                         <span style={{
//                           background: '#FFE566', border: '3px solid #000',
//                           boxShadow: '3px 3px 0 #000', padding: '8px 20px',
//                           fontWeight: 800, display: 'inline-block', fontSize: 13,
//                         }}>
//                           Browse or Drop PDF
//                         </span>
//                         <input type="file" accept=".pdf" className="hidden"
//                                onChange={e => handleFile(e.target.files[0])} />
//                       </label>
//                       <p style={{ marginTop: 8, fontSize: 11, color: '#888',
//                                   fontWeight: 600 }}>
//                         PDF only · Max 5MB
//                       </p>
//                     </>
//                   )}
//                 </div>
//               ) : (
//                 /* Saved resumes grid */
//                 <div style={{ maxHeight: 180, overflowY: 'auto',
//                               display: 'grid',
//                               gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
//                               gap: 8 }}>
//                   {history.length === 0 ? (
//                     <div style={{ gridColumn: '1/-1', textAlign: 'center',
//                                   padding: 20, color: '#888', fontWeight: 600,
//                                   fontSize: 13 }}>
//                       No saved resumes. Upload one above.
//                     </div>
//                   ) : history.map(item => (
//                     <button key={item._id} type="button"
//                       onClick={() => setSelectedResume(item)}
//                       style={{
//                         background: selectedResume?._id === item._id
//                           ? '#FFE566' : '#fff',
//                         border: '2px solid #000', padding: '10px 12px',
//                         cursor: 'pointer', textAlign: 'left',
//                         boxShadow: selectedResume?._id === item._id
//                           ? '2px 2px 0 #000' : '3px 3px 0 #000',
//                         transform: selectedResume?._id === item._id
//                           ? 'translate(1px,1px)' : 'none',
//                       }}>
//                       <div style={{ display: 'flex', alignItems: 'center',
//                                     gap: 6, fontWeight: 800, fontSize: 12 }}>
//                         <FileText size={13} />
//                         <span style={{ overflow: 'hidden', textOverflow: 'ellipsis',
//                                        whiteSpace: 'nowrap' }}>
//                           {item.fileName || 'Resume'}
//                         </span>
//                       </div>
//                       <div style={{ fontSize: 10, color: '#666', marginTop: 3 }}>
//                         Score: {item.score} ·{' '}
//                         {item.createdAt
//                           ? new Date(item.createdAt).toLocaleDateString() : ''}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ── RECIPIENT NAME ── */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Recipient Name <span style={{ color: '#FF6B6B' }}>*</span>
//                 <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8,
//                                color: '#555' }}>
//                   (Makes the message personalized)
//                 </span>
//               </label>
//               <input type="text"
//                 value={formData.recipientName}
//                 onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
//                 placeholder="e.g. Sarah Chen, John Smith, Hiring Manager..."
//                 style={{ width: '100%', border: '3px solid #000',
//                          padding: '12px 16px', fontWeight: 700, fontSize: 15,
//                          outline: 'none', boxSizing: 'border-box' }} />
//             </div>

//             {/* ── COMPANY + ROLE ── */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
//                           gap: 16 }}>
//               <div>
//                 <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                   Target Company <span style={{ color: '#FF6B6B' }}>*</span>
//                 </label>
//                 <input type="text"
//                   value={formData.targetCompany}
//                   onChange={e => setFormData({ ...formData, targetCompany: e.target.value })}
//                   placeholder="e.g. Google, Zepto, Razorpay..."
//                   style={{ width: '100%', border: '3px solid #000',
//                            padding: '12px 16px', fontWeight: 700, fontSize: 15,
//                            outline: 'none', boxSizing: 'border-box' }} />
//               </div>
//               <div>
//                 <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                   Target Role <span style={{ color: '#FF6B6B' }}>*</span>
//                 </label>
//                 <input type="text"
//                   value={formData.targetRole}
//                   onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
//                   placeholder="e.g. Senior SWE, Product Manager..."
//                   style={{ width: '100%', border: '3px solid #000',
//                            padding: '12px 16px', fontWeight: 700, fontSize: 15,
//                            outline: 'none', boxSizing: 'border-box' }} />
//               </div>
//             </div>

//             {/* ── JOB DESCRIPTION ── */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
//                 Job Description / Context
//                 <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8,
//                                color: '#555' }}>
//                   (Paste for a more targeted message)
//                 </span>
//               </label>
//               <textarea
//                 value={formData.jobDescription}
//                 onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
//                 placeholder="Paste the job description or any context about this role..."
//                 rows={4}
//                 style={{ width: '100%', border: '3px solid #000',
//                          padding: '12px 16px', fontWeight: 600, fontSize: 14,
//                          outline: 'none', resize: 'vertical',
//                          boxSizing: 'border-box', fontFamily: 'inherit' }} />
//             </div>

//             {/* ── SUBMIT ── */}
//             <button type="submit"
//               disabled={loading || (!file && !selectedResume)}
//               style={{
//                 width: '100%',
//                 background: loading || (!file && !selectedResume) ? '#ccc' : '#000',
//                 color: '#fff', border: '3px solid #000',
//                 boxShadow: loading || (!file && !selectedResume)
//                   ? 'none' : `5px 5px 0 ${activePlatform.bg}`,
//                 padding: 16, fontWeight: 900, fontSize: 16,
//                 cursor: loading || (!file && !selectedResume)
//                   ? 'not-allowed' : 'pointer',
//                 textTransform: 'uppercase', letterSpacing: 1,
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 10,
//               }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Generating package...</>
//                 : <><Send size={20} /> Generate {formData.platform} Outreach</>}
//             </button>

//           </form>
//         </div>

//         {/* ════════════════════════════════════════════════════════
//             RESULTS
//         ════════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-4">

//             {/* ── OVERVIEW BANNER ── */}
//             <div style={{ background: '#000', color: '#fff',
//                           border: '3px solid #000',
//                           boxShadow: `7px 7px 0 ${activePlatform.bg}`,
//                           padding: '22px 26px' }}>

//               <div style={{ display: 'flex', flexWrap: 'wrap',
//                             alignItems: 'flex-start',
//                             justifyContent: 'space-between',
//                             gap: 16, marginBottom: 18 }}>
//                 <div>
//                   <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
//                                 textTransform: 'uppercase', marginBottom: 8 }}>
//                     {formData.platform} Outreach Verdict
//                   </div>
//                   <VerdictBadge verdict={ov.finalVerdict || 'SEND WITH MINOR TWEAKS'} />
//                   {ov.finalVerdictReason && (
//                     <div style={{ marginTop: 8, fontSize: 12, color: '#bbb',
//                                   fontWeight: 600, maxWidth: 380 }}>
//                       {ov.finalVerdictReason}
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
//                   <ScoreChip score={ov.messageStrengthScore}   label="Strength" />
//                   <ScoreChip score={ov.personalizationScore}   label="Personalization" />
//                   <ScoreChip score={ov.credibilityScore}       label="Credibility" />
//                   <ScoreChip score={ov.concisenessScore}       label="Conciseness" />
//                 </div>
//               </div>

//               {/* Stats row */}
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20,
//                             marginBottom: 16 }}>
//                 {ov.estimatedReplyRate && (
//                   <div>
//                     <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
//                                   textTransform: 'uppercase' }}>
//                       Est. Reply Rate
//                     </div>
//                     <div style={{ fontWeight: 900, fontSize: 22,
//                                   color: '#FFE566' }}>
//                       {ov.estimatedReplyRate}
//                     </div>
//                   </div>
//                 )}
//                 {ov.ctaStrength && (
//                   <div>
//                     <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
//                                   textTransform: 'uppercase' }}>
//                       CTA Strength
//                     </div>
//                     <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>
//                       {ov.ctaStrength}
//                     </div>
//                   </div>
//                 )}
//                 {pm.sendingTip && (
//                   <div>
//                     <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
//                                   textTransform: 'uppercase' }}>
//                       Best Send Time
//                     </div>
//                     <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>
//                       {pm.sendingTip}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* First impression */}
//               {ov.recipientFirstImpression && (
//                 <div style={{ background: '#1a1a1a', border: '2px solid #444',
//                               padding: '10px 14px', fontSize: 13,
//                               fontStyle: 'italic', color: '#ddd' }}>
//                   <span style={{ fontStyle: 'normal', fontWeight: 800,
//                                  color: '#FFE566', marginRight: 6 }}>
//                     Recipient's first 3 seconds:
//                   </span>
//                   "{ov.recipientFirstImpression}"
//                 </div>
//               )}
//             </div>

//             {/* ── PRIMARY MESSAGE ── */}
//             <div style={{ border: '3px solid #000',
//                           boxShadow: '7px 7px 0 #000' }}>
//               <div style={{
//                 background: activePlatform.bg,
//                 color: activePlatform.textColor,
//                 borderBottom: '3px solid #000',
//                 padding: '14px 20px',
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
//               }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                   {(() => { const Icon = activePlatform.icon; return <Icon size={18} />; })()}
//                   <span style={{ fontWeight: 900, fontSize: 15,
//                                  textTransform: 'uppercase' }}>
//                     {activePlatform.label} Message
//                   </span>
//                   <div style={{ display: 'flex', gap: 6 }}>
//                     {pm.wordCount && (
//                       <Tag text={`${pm.wordCount} words`}
//                            bg={pm.wordLimitMet ? '#A8FF78' : '#FF6B6B'} small />
//                     )}
//                     {pm.hookStyle && <Tag text={pm.hookStyle} bg="#fff" small />}
//                     {pm.tone && <Tag text={pm.tone} bg="#F5F0E8" small />}
//                   </div>
//                 </div>
//                 <CopyButton text={pm.content || ''} label="Copy Message" />
//               </div>
//               <div style={{ background: '#fff', padding: 20 }}>
//                 {/* Subject line for email platforms */}
//                 {sl?.primary && (
//                   <div style={{ background: '#FFF9E6', border: '2px solid #000',
//                                 padding: '10px 14px', marginBottom: 14,
//                                 display: 'flex', alignItems: 'center',
//                                 justifyContent: 'space-between', gap: 8 }}>
//                     <div>
//                       <span style={{ fontWeight: 800, fontSize: 12,
//                                      textTransform: 'uppercase', marginRight: 8 }}>
//                         Subject:
//                       </span>
//                       <span style={{ fontWeight: 700, fontSize: 14 }}>
//                         {sl.primary}
//                       </span>
//                       {sl.subjectLinePsychology && (
//                         <div style={{ fontSize: 11, color: '#666',
//                                       fontWeight: 600, marginTop: 3 }}>
//                           {sl.subjectLinePsychology}
//                         </div>
//                       )}
//                     </div>
//                     <CopyButton text={sl.primary} label="Copy Subject" />
//                   </div>
//                 )}

//                 {/* Hook highlight */}
//                 {pm.hookLine && (
//                   <div style={{
//                     background: '#E8F5E9', border: '2px solid #000',
//                     padding: '8px 14px', marginBottom: 14,
//                     borderLeft: '5px solid #000', fontSize: 12, fontWeight: 600,
//                   }}>
//                     <span style={{ fontWeight: 800 }}>Opening hook: </span>
//                     {pm.hookLine}
//                   </div>
//                 )}

//                 <MessageBubble content={pm.content} platform={formData.platform} />

//                 {/* CTA info */}
//                 {pm.ctaUsed && (
//                   <div style={{ marginTop: 12, display: 'flex', gap: 8,
//                                 alignItems: 'center' }}>
//                     <Tag text="CTA" bg="#FFE566" small />
//                     <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>
//                       {pm.ctaUsed}
//                     </span>
//                     {pm.ctaType && <Tag text={pm.ctaType} bg="#F5F0E8" small />}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* ── SUBJECT LINE ALTERNATIVES (email platforms) ── */}
//             {sl?.alternatives?.length > 0 && (
//               <Accordion title="Alternative Subject Lines"
//                          icon={Mail} bg="#FFE566"
//                          badge={sl.alternatives.length + 1}>
//                 <div className="space-y-2">
//                   {[{ subject: sl.primary, style: 'Primary (Best)' },
//                     ...sl.alternatives].map((s, i) => (
//                     <div key={i} style={{
//                       border: '2px solid #000', padding: '10px 14px',
//                       background: i === 0 ? '#FFF9E6' : '#fff',
//                       display: 'flex', alignItems: 'center',
//                       justifyContent: 'space-between', gap: 10,
//                     }}>
//                       <div>
//                         {i === 0 && <Tag text="BEST" bg="#FFE566" small />}
//                         {s.style && (
//                           <Tag text={s.style} bg="#F5F0E8"
//                                small style={{ marginLeft: i === 0 ? 6 : 0 }} />
//                         )}
//                         <div style={{ fontWeight: 800, fontSize: 14,
//                                       marginTop: 4 }}>
//                           {s.subject}
//                         </div>
//                       </div>
//                       <CopyButton text={s.subject} />
//                     </div>
//                   ))}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── ALTERNATIVE VERSIONS ── */}
//             {alts.length > 0 && (
//               <Accordion title="3 Alternative Styles"
//                          icon={RefreshCw} bg="#74B9FF"
//                          defaultOpen badge={alts.length}>
//                 {/* Tab buttons */}
//                 <div style={{ display: 'flex', gap: 8, marginBottom: 16,
//                               flexWrap: 'wrap' }}>
//                   {alts.map((a, i) => (
//                     <button key={i} type="button"
//                       onClick={() => setActiveAltVersion(i)}
//                       style={{
//                         background: activeAltVersion === i ? '#FFE566' : '#F5F0E8',
//                         border: '2px solid #000', padding: '6px 14px',
//                         fontWeight: 800, fontSize: 12, cursor: 'pointer',
//                         boxShadow: activeAltVersion === i
//                           ? '2px 2px 0 #000' : '3px 3px 0 #000',
//                         transform: activeAltVersion === i
//                           ? 'translate(1px,1px)' : 'none',
//                       }}>
//                       {a.style}
//                     </button>
//                   ))}
//                 </div>

//                 {alts[activeAltVersion] && (() => {
//                   const alt = alts[activeAltVersion];
//                   return (
//                     <div style={{ border: '2px solid #000', padding: 16 }}>
//                       <div style={{ display: 'flex', gap: 8, marginBottom: 10,
//                                     flexWrap: 'wrap', alignItems: 'center' }}>
//                         <Tag text={`${alt.wordCount || '?'} words`} bg="#F5F0E8" small />
//                         {alt.bestFor && (
//                           <span style={{ fontSize: 12, fontWeight: 600,
//                                          color: '#555' }}>
//                             Best for: {alt.bestFor}
//                           </span>
//                         )}
//                         <CopyButton text={alt.content} />
//                       </div>
//                       {alt.hookLine && (
//                         <div style={{
//                           background: '#E8F5E9', border: '1px solid #000',
//                           padding: '6px 10px', marginBottom: 10,
//                           fontSize: 12, fontWeight: 600,
//                           borderLeft: '4px solid #000',
//                         }}>
//                           Hook: {alt.hookLine}
//                         </div>
//                       )}
//                       <MessageBubble content={alt.content}
//                                      platform={formData.platform} />
//                     </div>
//                   );
//                 })()}
//               </Accordion>
//             )}

//             {/* ── 3-TOUCH FOLLOW-UP SEQUENCE ── */}
//             {sequence.length > 0 && (
//               <Accordion title="3-Touch Follow-Up Sequence"
//                          icon={Clock} bg="#A8FF78"
//                          defaultOpen badge={sequence.length}>
//                 <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
//                             marginBottom: 16 }}>
//                   Send these in order. Each one adds NEW value — no "just checking in":
//                 </p>

//                 {/* Timeline dots */}
//                 <div style={{ display: 'flex', gap: 0, marginBottom: 20,
//                               alignItems: 'stretch' }}>
//                   {sequence.map((touch, i) => (
//                     <div key={i} style={{ flex: 1, display: 'flex',
//                                           flexDirection: 'column',
//                                           alignItems: 'center', gap: 4 }}>
//                       <button type="button"
//                         onClick={() => setActiveFollowUp(i)}
//                         style={{
//                           width: 36, height: 36,
//                           background: activeFollowUp === i ? '#000' : '#F5F0E8',
//                           color:      activeFollowUp === i ? '#FFE566' : '#000',
//                           border: '2px solid #000', fontWeight: 900,
//                           fontSize: 14, cursor: 'pointer',
//                           borderRadius: 0,
//                         }}>
//                         {touch.touchNumber}
//                       </button>
//                       <div style={{ fontSize: 10, fontWeight: 700,
//                                     textAlign: 'center', color: '#555' }}>
//                         Day {touch.sendOnDay}
//                       </div>
//                       {i < sequence.length - 1 && (
//                         <div style={{ position: 'absolute',
//                                       /* spacer line — omit for simplicity */ }} />
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {sequence[activeFollowUp] && (() => {
//                   const touch = sequence[activeFollowUp];
//                   return (
//                     <div style={{ border: '2px solid #000', padding: 16 }}>
//                       <div style={{ display: 'flex', gap: 8, marginBottom: 12,
//                                     flexWrap: 'wrap', alignItems: 'center' }}>
//                         <Tag text={`Touch ${touch.touchNumber}`} bg="#FFE566" small />
//                         <Tag text={touch.label} bg="#F5F0E8" small />
//                         <Tag text={`Day ${touch.sendOnDay}`} bg="#E8F4FF" small />
//                         {touch.wordCount && (
//                           <Tag text={`${touch.wordCount} words`} bg="#F5F0E8" small />
//                         )}
//                         <CopyButton text={touch.content} />
//                       </div>

//                       {touch.newValueAdded && (
//                         <div style={{
//                           background: '#E8F5E9', border: '1px solid #000',
//                           padding: '6px 10px', marginBottom: 10,
//                           fontSize: 12, fontWeight: 600,
//                           borderLeft: '4px solid #000',
//                         }}>
//                           New value added: {touch.newValueAdded}
//                         </div>
//                       )}

//                       <MessageBubble content={touch.content}
//                                      platform={formData.platform} />

//                       {touch.purpose && (
//                         <div style={{ marginTop: 10, fontSize: 12,
//                                       color: '#666', fontWeight: 600 }}>
//                           Purpose: {touch.purpose}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })()}
//               </Accordion>
//             )}

//             {/* ── CONNECTION NOTE ── */}
//             {connNote.content && (
//               <Accordion title="LinkedIn Connection Note (≤300 chars)"
//                          icon={Linkedin} bg="#0077B5"
//                          defaultOpen>
//                 <div style={{ marginBottom: 10, display: 'flex',
//                               justifyContent: 'space-between',
//                               alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
//                   <div style={{ display: 'flex', gap: 8 }}>
//                     <Tag text={`${connNote.charCount || 0} chars`}
//                          bg={connNote.isUnder300Chars ? '#A8FF78' : '#FF6B6B'}
//                          small />
//                     {connNote.isUnder300Chars
//                       ? <Tag text="✓ Under limit" bg="#A8FF78" small />
//                       : <Tag text="⚠ Over 300 chars" bg="#FF6B6B" small />}
//                   </div>
//                   <CopyButton text={connNote.content} label="Copy Note" />
//                 </div>

//                 {connNote.tip && (
//                   <div style={{ background: '#E8F4FF', border: '2px solid #000',
//                                 padding: '8px 12px', marginBottom: 12,
//                                 fontSize: 12, fontWeight: 700 }}>
//                     💡 {connNote.tip}
//                   </div>
//                 )}

//                 <div style={{ background: '#F8F4FF', border: '2px solid #000',
//                               padding: 16, fontFamily: 'Georgia, serif',
//                               lineHeight: 1.7, fontSize: 14 }}>
//                   {connNote.content}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── RECIPIENT PSYCHOLOGY ── */}
//             {psychology.likelyMindset && (
//               <Accordion title="Recipient Psychology Analysis"
//                          icon={Brain} bg="#DDA0DD">
//                 <div style={{ display: 'grid',
//                               gridTemplateColumns: '1fr 1fr', gap: 12,
//                               marginBottom: 14 }}>
//                   <div style={{ border: '2px solid #000', padding: 12,
//                                 background: '#F8F4FF' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11,
//                                   textTransform: 'uppercase', marginBottom: 6 }}>
//                       Their mindset
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
//                       {psychology.likelyMindset}
//                     </p>
//                   </div>
//                   <div style={{ border: '2px solid #000', padding: 12,
//                                 background: '#FFF0F0' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11,
//                                   textTransform: 'uppercase', marginBottom: 6,
//                                   color: '#c00' }}>
//                       Main objection
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
//                       {psychology.mainObjection}
//                     </p>
//                   </div>
//                 </div>

//                 {psychology.howMessageAddressesObjection && (
//                   <div style={{ border: '2px solid #000', padding: 12,
//                                 background: '#F0FFF0', marginBottom: 12,
//                                 borderLeft: '5px solid #000' }}>
//                     <div style={{ fontWeight: 800, fontSize: 11,
//                                   textTransform: 'uppercase', marginBottom: 6 }}>
//                       How this message handles it
//                     </div>
//                     <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
//                       {psychology.howMessageAddressesObjection}
//                     </p>
//                   </div>
//                 )}

//                 <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
//                   {psychology.estimatedReplyRate && (
//                     <div>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase' }}>
//                         Est. Reply Rate
//                       </div>
//                       <div style={{ fontWeight: 900, fontSize: 22,
//                                     color: '#7B2D8B' }}>
//                         {psychology.estimatedReplyRate}
//                       </div>
//                     </div>
//                   )}
//                   {psychology.replyRateBenchmark && (
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 4 }}>
//                         Benchmark
//                       </div>
//                       <div style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>
//                         {psychology.replyRateBenchmark}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── PERSONALIZATION ELEMENTS ── */}
//             {perElems.length > 0 && (
//               <Accordion title="Personalization Elements"
//                          icon={Target} bg="#A8FF78"
//                          badge={perElems.length}>
//                 {perElems.map((el, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 10,
//                                         marginBottom: 10,
//                                         alignItems: 'flex-start' }}>
//                     <Tag text={el.source} bg="#E8F4FF" small />
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontWeight: 700, fontSize: 13 }}>
//                         {el.element}
//                       </div>
//                       {el.impact && (
//                         <div style={{ fontSize: 11, color: '#555',
//                                       fontWeight: 600, marginTop: 2 }}>
//                           {el.impact}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── WHAT MAKES IT WORK / COULD BE STRONGER ── */}
//             {(ov.whatMakesItWork?.length > 0
//               || ov.whatCouldBeStronger?.length > 0) && (
//               <Accordion title="Message Strengths & Gaps"
//                          icon={BarChart2} bg="#74B9FF">
//                 <div style={{ display: 'grid',
//                               gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//                   {ov.whatMakesItWork?.length > 0 && (
//                     <div style={{ border: '2px solid #000', padding: 14,
//                                   background: '#F0FFF0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12,
//                                     textTransform: 'uppercase', marginBottom: 8 }}>
//                         What works
//                       </div>
//                       {ov.whatMakesItWork.map((w, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6,
//                                               marginBottom: 6, fontSize: 12,
//                                               fontWeight: 600 }}>
//                           <Check size={13} style={{ color: '#2a7a2a',
//                                                      flexShrink: 0, marginTop: 2 }} />
//                           {w}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   {ov.whatCouldBeStronger?.length > 0 && (
//                     <div style={{ border: '2px solid #000', padding: 14,
//                                   background: '#FFF8E1' }}>
//                       <div style={{ fontWeight: 800, fontSize: 12,
//                                     textTransform: 'uppercase', marginBottom: 8 }}>
//                         Could be stronger
//                       </div>
//                       {ov.whatCouldBeStronger.map((w, i) => (
//                         <div key={i} style={{ display: 'flex', gap: 6,
//                                               marginBottom: 6, fontSize: 12,
//                                               fontWeight: 600 }}>
//                           <AlertTriangle size={13}
//                             style={{ color: '#B45309', flexShrink: 0,
//                                      marginTop: 2 }} />
//                           {w}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* HM + Recruiter versions */}
//                 <div style={{ display: 'grid',
//                               gridTemplateColumns: '1fr 1fr',
//                               gap: 12, marginTop: 12 }}>
//                   {ov.hiringManagerVersion && (
//                     <div style={{ border: '2px solid #000', padding: 12,
//                                   background: '#F8F4FF' }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 6 }}>
//                         If recipient = Hiring Manager
//                       </div>
//                       <p style={{ fontSize: 12, fontWeight: 600,
//                                   color: '#555', lineHeight: 1.6 }}>
//                         {ov.hiringManagerVersion}
//                       </p>
//                     </div>
//                   )}
//                   {ov.recruiterVersion && (
//                     <div style={{ border: '2px solid #000', padding: 12,
//                                   background: '#FFF5EE' }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 6 }}>
//                         If recipient = Recruiter
//                       </div>
//                       <p style={{ fontSize: 12, fontWeight: 600,
//                                   color: '#555', lineHeight: 1.6 }}>
//                         {ov.recruiterVersion}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </Accordion>
//             )}

//             {/* ── CANDIDATE VALUE PROPS ── */}
//             {valueProps.length > 0 && (
//               <Accordion title="Value Props Used"
//                          icon={Zap} bg="#FFE566"
//                          badge={valueProps.length}>
//                 {valueProps.map((v, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 10,
//                                         marginBottom: 10,
//                                         alignItems: 'flex-start' }}>
//                     <Star size={15} style={{ color: '#B45309',
//                                              flexShrink: 0, marginTop: 2 }} />
//                     <div>
//                       <div style={{ fontWeight: 700, fontSize: 13 }}>
//                         {v.prop}
//                       </div>
//                       {v.relevance && (
//                         <div style={{ fontSize: 11, color: '#555',
//                                       fontWeight: 600, marginTop: 2 }}>
//                           {v.relevance}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── A/B TEST SUGGESTIONS ── */}
//             {abTests.length > 0 && (
//               <Accordion title="A/B Test Ideas"
//                          icon={TrendingUp} bg="#FFA07A"
//                          badge={abTests.length}>
//                 {abTests.map((ab, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 14,
//                                         marginBottom: 10,
//                                         background: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
//                     <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
//                       <Tag text={`Test: ${ab.element}`} bg="#FFE566" small />
//                     </div>
//                     <div style={{ display: 'grid',
//                                   gridTemplateColumns: '1fr 1fr', gap: 10,
//                                   marginBottom: 8 }}>
//                       <div style={{ background: '#E8F4FF',
//                                     border: '1px solid #ddd', padding: 8 }}>
//                         <div style={{ fontWeight: 800, fontSize: 10,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           Version A (current)
//                         </div>
//                         <p style={{ fontSize: 12, fontWeight: 600 }}>
//                           {ab.versionA}
//                         </p>
//                       </div>
//                       <div style={{ background: '#E8FFE8',
//                                     border: '1px solid #ddd', padding: 8 }}>
//                         <div style={{ fontWeight: 800, fontSize: 10,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           Version B (test)
//                         </div>
//                         <p style={{ fontSize: 12, fontWeight: 600 }}>
//                           {ab.versionB}
//                         </p>
//                       </div>
//                     </div>
//                     {ab.hypothesis && (
//                       <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                         Hypothesis: {ab.hypothesis}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── RED FLAGS ── */}
//             {redFlags.length > 0 && (
//               <Accordion title="Red Flags to Watch"
//                          icon={Shield} bg="#FF6B6B"
//                          badge={redFlags.length}>
//                 {redFlags.map((rf, i) => (
//                   <div key={i} style={{ border: '2px solid #000', padding: 12,
//                                         marginBottom: 8, background: '#FFF0F0' }}>
//                     <div style={{ display: 'flex', gap: 8,
//                                   alignItems: 'center', marginBottom: 6 }}>
//                       <Tag text={rf.severity} bg={
//                         rf.severity === 'Avoid' ? '#FF6B6B'
//                         : rf.severity === 'Moderate' ? '#FFE566' : '#F5F0E8'
//                       } small />
//                       <span style={{ fontWeight: 700, fontSize: 13 }}>
//                         {rf.flag}
//                       </span>
//                     </div>
//                     {rf.suggestion && (
//                       <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                         Fix: {rf.suggestion}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── PLATFORM BEST PRACTICES ── */}
//             {practices.length > 0 && (
//               <Accordion title={`${formData.platform} Best Practices`}
//                          icon={Eye} bg="#F5F0E8">
//                 {practices.map((tip, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 8,
//                                         marginBottom: 8, fontSize: 13,
//                                         fontWeight: 600 }}>
//                     <Check size={14} style={{ color: '#2a7a2a',
//                                                flexShrink: 0, marginTop: 2 }} />
//                     {tip}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── DO NOT SEND IF ── */}
//             {doNotSend.length > 0 && (
//               <Accordion title="Do Not Send If..." icon={AlertTriangle}
//                          bg="#FFA07A">
//                 {doNotSend.map((cond, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 8,
//                                         marginBottom: 8, fontSize: 13,
//                                         fontWeight: 600 }}>
//                     <X size={14} style={{ color: '#c00', flexShrink: 0,
//                                           marginTop: 2 }} />
//                     {cond}
//                   </div>
//                 ))}
//               </Accordion>
//             )}

//             {/* ── TOP TIP ── */}
//             {ov.topTip && (
//               <div style={{ background: '#FFE566', border: '3px solid #000',
//                             boxShadow: '4px 4px 0 #000',
//                             padding: '16px 20px' }}>
//                 <div style={{ fontWeight: 900, fontSize: 13,
//                               textTransform: 'uppercase', marginBottom: 6 }}>
//                   ⭐ Top Tip to Increase Reply Rate
//                 </div>
//                 <p style={{ fontSize: 14, fontWeight: 700 }}>
//                   {ov.topTip}
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
//                   boxShadow: '5px 5px 0 #000', padding: '12px 28px',
//                   fontWeight: 800, cursor: 'pointer', fontSize: 14,
//                   textTransform: 'uppercase',
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                 }}>
//                 <RefreshCw size={15} /> Generate Another Message
//               </button>
//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ColdEmailPage;
















// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import { 
//   ArrowLeft, Loader2, Send, Copy, Check, Mail, MessageCircle, Upload, FileText, Home
// } from 'lucide-react';

// export const ColdEmailPage = () => {
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [copied, setCopied] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [selectedResume, setSelectedResume] = useState(null);
//   const [showUpload, setShowUpload] = useState(false);
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     targetCompany: '',
//     targetRole: ''
//   });
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const response = await historyAPI.getHistory();
//       setHistory(response.data);
//       if (response.data.length > 0) {
//         setSelectedResume(response.data[0]);
//       }
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

//     let resumeText = '';

//     if (file) {
//       setLoading(true);
//       try {
//         const formDataUpload = new FormData();
//         formDataUpload.append('file', file);
//         formDataUpload.append('targetDomain', 'general');
        
//         const uploadResponse = await resumeAPI.uploadAndAnalyze(formDataUpload);
//         resumeText = uploadResponse.data.resumeText;
        
//         fetchHistory();
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to upload resume');
//         setLoading(false);
//         return;
//       }
//     } else if (!selectedResume) {
//       toast.error('Please select an uploaded resume or upload a new one');
//       return;
//     } else {
//       resumeText = selectedResume.resumeText;
//     }

//     if (!formData.targetCompany.trim()) {
//       toast.error('Please enter the target company name');
//       setLoading(false);
//       return;
//     }

//     if (!formData.targetRole.trim()) {
//       toast.error('Please enter the target role');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await resumeAPI.chatWithAssistant({
//         message: `Generate 3 variants of cold outreach messages for a job application at ${formData.targetCompany} for the role of ${formData.targetRole}. 

// Please generate:
// 1. One formal cold email
// 2. One LinkedIn DM  
// 3. One referral request message

// Make them personalized and professional.`,
//         resumeContext: resumeText,
//         targetDomain: formData.targetRole,
//         conversationHistory: []
//       });
      
//       setResult({
//         email: response.data.response,
//         linkedin: response.data.response,
//         referral: response.data.response
//       });
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to generate messages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyToClipboard = (type) => {
//     const messages = {
//       email: `Subject: Application for ${formData.targetRole} Position at ${formData.targetCompany}

// Dear Hiring Manager,

// I am writing to express my strong interest in the ${formData.targetRole} position at ${formData.targetCompany}. With my background and skills, I believe I would be a valuable addition to your team.

// I would welcome the opportunity to discuss how my skills and experience align with your needs.

// Best regards,
// [Your Name]`,
//       linkedin: `Hi [Hiring Manager's Name],

// I came across the ${formData.targetRole} opening at ${formData.targetCompany} and was excited to reach out. With my experience, I believe I could be a great fit for your team.

// Would you be open to a quick chat?

// Thanks!
// [Your Name]`,
//       referral: `Hi [Connection's Name],

// I hope you're doing well! I noticed you work at ${formData.targetCompany} and I'm very interested in the ${formData.targetRole} role there.

// I was wondering if you might be open to a brief conversation about your experience at the company? I'd love to learn more and potentially ask for a referral.

// Would you have 15-20 minutes this week?

// Thank you!
// [Your Name]`
//     };
    
//     navigator.clipboard.writeText(messages[type]);
//     setCopied(type);
//     setTimeout(() => setCopied(null), 2000);
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
//             <div className="w-16 h-16 bg-neo-orange border-3 border-black flex items-center justify-center">
//               <Mail className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">COLD OUTREACH GENERATOR</h1>
//               <p className="text-gray-500">Generate professional cold emails, LinkedIn DMs, and referral messages</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Resume Selection */}
//             <div>
//               <div className="flex items-center justify-between mb-3">
//                 <label className="font-bold">Select Your Resume *</label>
//                 <button
//                   type="button"
//                   onClick={() => setShowUpload(!showUpload)}
//                   className="text-neo-blue font-bold hover:underline flex items-center gap-1"
//                 >
//                   <Upload className="w-4 h-4" />
//                   {showUpload ? 'Select from uploaded' : 'Upload new'}
//                 </button>
//               </div>
              
//               {showUpload ? (
//                 <div className="border-3 border-dashed border-black bg-white p-6 text-center">
//                   {file ? (
//                     <div className="flex items-center justify-center gap-4">
//                       <FileText className="w-8 h-8" />
//                       <span className="font-bold">{file.name}</span>
//                       <button onClick={() => setFile(null)} className="p-1 hover:bg-neo-red">
//                         ×
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//                       <label className="neo-button cursor-pointer inline-block">
//                         Browse Files
//                         <input 
//                           type="file" 
//                           accept=".pdf" 
//                           onChange={handleFileChange}
//                           className="hidden"
//                           ref={fileInputRef}
//                         />
//                       </label>
//                       <p className="text-sm text-gray-500 mt-2">PDF only, max 5MB</p>
//                     </>
//                   )}
//                 </div>
//               ) : (
//                 <div className="grid md:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
//                   {history.map((item) => (
//                     <button
//                       key={item._id}
//                       type="button"
//                       onClick={() => setSelectedResume(item)}
//                       className={`p-3 border-3 border-black text-left font-bold transition-all ${
//                         selectedResume?._id === item._id 
//                           ? 'bg-neo-yellow shadow-neo-sm' 
//                           : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         <FileText className="w-5 h-5" />
//                         <span className="truncate">{item.fileName}</span>
//                       </div>
//                       <div className="text-xs text-gray-500 mt-1">
//                         Score: {item.score} • {new Date(item.createdAt).toLocaleDateString()}
//                       </div>
//                     </button>
//                   ))}
//                   {history.length === 0 && (
//                     <p className="text-gray-500 col-span-2 text-center py-4">
//                       No uploaded resumes. Please upload a resume first.
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Target Company */}
//             <div>
//               <label className="font-bold mb-3 block">Target Company *</label>
//               <input
//                 type="text"
//                 value={formData.targetCompany}
//                 onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
//                 placeholder="e.g., Google, Meta, Startup Name..."
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             {/* Target Role */}
//             <div>
//               <label className="font-bold mb-3 block">Target Role *</label>
//               <input
//                 type="text"
//                 value={formData.targetRole}
//                 onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
//                 placeholder="e.g., Software Engineer, Product Manager..."
//                 className="w-full border-3 border-black p-3 font-bold focus:outline-none focus:shadow-neo"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading || (!file && !selectedResume)}
//               className={`neo-button w-full flex items-center justify-center gap-2 ${
//                 loading || (!file && !selectedResume) ? 'opacity-50 cursor-not-allowed' : ''
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
//                   GENERATE OUTREACH MESSAGES
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="neo-card p-8">
//             <h2 className="font-space text-2xl font-extrabold mb-6">YOUR OUTREACH MESSAGES</h2>
            
//             <div className="space-y-6">
//               {/* Formal Email */}
//               <div className="border-3 border-black p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-space text-xl font-extrabold flex items-center gap-2">
//                     <Mail className="w-6 h-6" />
//                     FORMAL EMAIL
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard('email')}
//                     className="neo-button flex items-center gap-2"
//                   >
//                     {copied === 'email' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied === 'email' ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="bg-white p-4 border-2 border-black">
//                   <p className="whitespace-pre-wrap">
// {`Subject: Application for ${formData.targetRole} Position at ${formData.targetCompany}

// Dear Hiring Manager,

// I am writing to express my strong interest in the ${formData.targetRole} position at ${formData.targetCompany}. With my background in [your key skills], I believe I would be a valuable addition to your team.

// [Add personalized paragraph about your relevant experience]

// I would welcome the opportunity to discuss how my skills and experience align with your needs.

// Best regards,
// [Your Name]`}
//                   </p>
//                 </div>
//               </div>

//               {/* LinkedIn DM */}
//               <div className="border-3 border-black p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-space text-xl font-extrabold flex items-center gap-2">
//                     <MessageCircle className="w-6 h-6" />
//                     LINKEDIN DM
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard('linkedin')}
//                     className="neo-button flex items-center gap-2"
//                   >
//                     {copied === 'linkedin' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied === 'linkedin' ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="bg-white p-4 border-2 border-black">
//                   <p className="whitespace-pre-wrap">
// {`Hi [Hiring Manager's Name],

// I came across the ${formData.targetRole} opening at ${formData.targetCompany} and was excited to reach out. With my experience in [key skill], I believe I could be a great fit for your team.

// Would you be open to a quick chat? I'm happy to share more about my background.

// Thanks!
// [Your Name]`}
//                   </p>
//                 </div>
//               </div>

//               {/* Referral Request */}
//               <div className="border-3 border-black p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-space text-xl font-extrabold flex items-center gap-2">
//                     <MessageCircle className="w-6 h-6" />
//                     REFERRAL REQUEST
//                   </h3>
//                   <button
//                     onClick={() => copyToClipboard('referral')}
//                     className="neo-button flex items-center gap-2"
//                   >
//                     {copied === 'referral' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied === 'referral' ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <div className="bg-white p-4 border-2 border-black">
//                   <p className="whitespace-pre-wrap">
// {`Hi [Connection's Name],

// I hope you're doing well! I noticed you work at ${formData.targetCompany} and I'm very interested in the ${formData.targetRole} role there.

// I was wondering if you might be open to a brief conversation about your experience at the company? I'd love to learn more about the team culture and potentially ask for a referral if you think I'd be a good fit.

// Would you have 15-20 minutes for a quick call this week?

// Thank you so much!
// [Your Name]`}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

























import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { resumeAPI, historyAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Loader2, Send, Copy, Check, Mail, MessageCircle,
  Upload, FileText, Home, ChevronDown, ChevronUp, X,
  Linkedin, Twitter, Users, AtSign, Zap, Brain,
  AlertTriangle, Star, TrendingUp, Eye, RefreshCw,
  BarChart2, Shield, Clock, Target
} from 'lucide-react';
import FeaturePageGuard, { LockedUploadZone, LockedActionButton } from '../components/FeaturePageGuard';

// ─── Platform definitions ─────────────────────────────────────────
const PLATFORMS = [
  {
    id: 'LinkedIn',
    label: 'LinkedIn DM',
    icon: Linkedin,
    bg: '#0077B5',
    textColor: '#fff',
    desc: '≤150 words',
    subjectLine: false,
  },
  {
    id: 'Email',
    label: 'Cold Email',
    icon: Mail,
    bg: '#FFE566',
    textColor: '#000',
    desc: '≤220 words + subject',
    subjectLine: true,
  },
  {
    id: 'ColdEmail',
    label: 'Structured Email',
    icon: AtSign,
    bg: '#A8FF78',
    textColor: '#000',
    desc: '≤280 words + subject',
    subjectLine: true,
  },
  {
    id: 'Twitter',
    label: 'Twitter/X DM',
    icon: Twitter,
    bg: '#000',
    textColor: '#fff',
    desc: '≤60 words',
    subjectLine: false,
  },
  {
    id: 'Referral',
    label: 'Referral Ask',
    icon: Users,
    bg: '#DDA0DD',
    textColor: '#000',
    desc: '≤180 words',
    subjectLine: false,
  },
  {
    id: 'InMail',
    label: 'LinkedIn InMail',
    icon: Linkedin,
    bg: '#74B9FF',
    textColor: '#000',
    desc: '≤200 words + subject',
    subjectLine: true,
  },
];

// ─── Reusable primitives ─────────────────────────────────────────

const ScoreChip = ({ score, label }) => {
  const s  = Number(score) || 0;
  const bg = s >= 80 ? '#A8FF78' : s >= 60 ? '#FFE566' : '#FF6B6B';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        background: bg, border: '3px solid #000',
        boxShadow: '3px 3px 0 #000', padding: '10px 16px',
        fontWeight: 900, fontSize: 26, color: '#000',
        display: 'inline-block', lineHeight: 1,
      }}>
        {s}
      </div>
      {label && (
        <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4,
                      textTransform: 'uppercase', color: '#555' }}>
          {label}
        </div>
      )}
    </div>
  );
};

const Tag = ({ text, bg = '#F5F0E8', small = false }) => (
  <span style={{
    background: bg, border: '2px solid #000',
    padding: small ? '2px 8px' : '4px 12px',
    fontSize: small ? 11 : 12, fontWeight: 700,
    display: 'inline-block', lineHeight: 1.4,
  }}>
    {text}
  </span>
);

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        background: copied ? '#A8FF78' : '#fff',
        border: '2px solid #000', padding: '6px 14px',
        fontWeight: 700, fontSize: 12, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        boxShadow: '2px 2px 0 #000',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  );
};

const Accordion = ({ title, icon: Icon, bg = '#F5F0E8',
                     defaultOpen = false, badge, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
                  marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: bg,
          border: 'none', borderBottom: open ? '3px solid #000' : 'none',
          padding: '12px 18px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer', fontWeight: 900,
          fontSize: 13, textTransform: 'uppercase',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={16} />}
          {title}
          {badge !== undefined && (
            <span style={{
              background: '#000', color: '#FFE566',
              padding: '1px 7px', fontSize: 11, fontWeight: 900,
            }}>
              {badge}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div style={{ background: '#fff', padding: 18 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Message bubble — renders message content cleanly
const MessageBubble = ({ content, platform }) => (
  <div style={{
    background: '#FAFAF8', border: '2px solid #ddd',
    padding: '20px 24px',
    fontFamily: platform === 'Twitter' ? 'monospace' : 'Georgia, serif',
    lineHeight: 1.85, fontSize: 14,
  }}>
    {(content || '').split('\n').map((line, i) => (
      <p key={i} style={{
        margin: line.trim() === '' ? '10px 0' : '0 0 3px 0',
        minHeight: line.trim() === '' ? 8 : 'auto',
      }}>
        {line}
      </p>
    ))}
  </div>
);

// Verdict badge
const VerdictBadge = ({ verdict }) => {
  const map = {
    'SEND AS-IS':               { bg: '#A8FF78', icon: '✅' },
    'SEND WITH MINOR TWEAKS':   { bg: '#FFE566', icon: '✏️' },
    'PERSONALIZE MORE':         { bg: '#FFA07A', icon: '🎯' },
    'REWRITE RECOMMENDED':      { bg: '#FF6B6B', icon: '🔁' },
  };
  const cfg = map[verdict] || { bg: '#FFE566', icon: '📋' };
  return (
    <span style={{
      background: cfg.bg, border: '3px solid #000',
      boxShadow: '3px 3px 0 #000', padding: '8px 16px',
      fontWeight: 900, fontSize: 13, textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {cfg.icon} {verdict}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export const ColdEmailPage = () => {
  const [loading,         setLoading]         = useState(false);
  const [result,          setResult]          = useState(null);
  const [file,            setFile]            = useState(null);
  const [history,         setHistory]         = useState([]);
  const [selectedResume,  setSelectedResume]  = useState(null);
  const [showUpload,      setShowUpload]       = useState(false);
  const [activeAltVersion, setActiveAltVersion] = useState(0);
  const [activeFollowUp,   setActiveFollowUp]   = useState(0);
  const resultRef = useRef(null);

  const [formData, setFormData] = useState({
    recipientName:  '',
    targetCompany:  '',
    targetRole:     '',
    jobDescription: '',
    platform:       'LinkedIn',
  });

  // ── Fetch history on mount ───────────────────────────────────────
  useState(() => {
    const fetch = async () => {
      try {
        const res = await historyAPI.getHistory();
        const list = Array.isArray(res.data) ? res.data : [];
        setHistory(list);
        if (list.length > 0) setSelectedResume(list[0]);
      } catch { /* silent */ }
    };
    fetch();
  }, []);

  // ── File handling ────────────────────────────────────────────────
  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('PDF only'); return; }
    if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');  return; }
    setFile(f);
  };

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !selectedResume) {
      toast.error('Select a resume or upload a new one'); return;
    }
    if (!formData.recipientName.trim()) {
      toast.error('Recipient name is required'); return;
    }
    if (!formData.targetCompany.trim()) {
      toast.error('Target company is required'); return;
    }
    // Target role is optional now

    setLoading(true);
    setResult(null);

    try {
      let resumeAnalysis = null;

      // Step 1 — if new file, upload and get analysis
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('targetDomain', 'general'); // Use general domain for outreach
        const uploadRes  = await resumeAPI.uploadAndAnalyze(fd);
        resumeAnalysis   = uploadRes.data?.analysis || uploadRes.data;
        // refresh history
        try {
          const h = await historyAPI.getHistory();
          setHistory(Array.isArray(h.data) ? h.data : []);
        } catch { /* silent */ }
      } else {
        // Use selected resume's analysis data
        resumeAnalysis = selectedResume;
      }

      // Step 2 — build job description string from form fields
      const jobDescStr = formData.jobDescription
        || (formData.targetRole 
          ? `Position: ${formData.targetRole} at ${formData.targetCompany}`
          : `Company: ${formData.targetCompany}`);

      // Step 3 — call generateOutreach
      const response = await resumeAPI.generateOutreach({
        resumeAnalysis,
        jobDescription: jobDescStr,
        recipientName:  formData.recipientName,
        platform:       formData.platform,
      });

      // Backend returns { result (JSON string), parsed (object), modelUsed } or transformed result
      // Transformed result has flat structure: { primaryMessage: { content }, subjectLine, etc. }
      const data = response.data;
      
      // Try to get parsed - handle both nested and flat formats
      let parsed = data?.parsed || (data?.result ? JSON.parse(data.result) : null);
      
      // Determine the outreach content - handle multiple response formats
      let outreachContent = '';
      let finalResult = null;
      
      if (parsed?.primaryMessage?.content) {
        // Nested format: { primaryMessage: { content: "..." } }
        outreachContent = parsed.primaryMessage.content;
        finalResult = parsed;
      } else if (parsed?.content) {
        // Flat format from parsed result: { content: "..." }
        outreachContent = parsed.content;
        // Wrap in expected structure while preserving other fields
        finalResult = {
          primaryMessage: {
            content: parsed.content,
            wordCount: parsed.wordCount
          },
          subjectLine: parsed.subjectLine,
          alternativeVersions: parsed.alternativeVersions || [],
          followUpSequence: parsed.followUpSequence || [],
          connectionNoteVersion: parsed.connectionNoteVersion || {},
          personalizationElements: parsed.personalizationElements || [],
          redFlags: parsed.redFlags || [],
          candidateValueProps: parsed.candidateValueProps || [],
          recipientPsychology: parsed.recipientPsychology || {},
          abTestSuggestions: parsed.abTestSuggestions || [],
          platformBestPractices: parsed.platformBestPractices || []
        };
      } else if (data?.primaryMessage?.content) {
        // Direct nested in response data
        outreachContent = data.primaryMessage.content;
        finalResult = data;
      } else if (data?.content) {
        // Direct flat in response data
        outreachContent = data.content;
        finalResult = {
          primaryMessage: {
            content: data.content,
            wordCount: data.wordCount
          },
          subjectLine: data.subjectLine,
          alternativeVersions: data.alternativeVersions || [],
          followUpSequence: data.followUpSequence || []
        };
      }
      
      if (!outreachContent) {
        throw new Error('Empty outreach message received. Please retry.');
      }

      setResult(finalResult);
      toast.success('Outreach package generated!');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Shortcuts ────────────────────────────────────────────────────
  const pm       = result?.primaryMessage        || {};
  const sl       = result?.subjectLine;
  const alts     = result?.alternativeVersions   || [];
  const sequence = result?.followUpSequence      || [];
  const connNote = result?.connectionNoteVersion || {};
  const perElems = result?.personalizationElements || [];
  const redFlags = result?.redFlags              || [];
  const valueProps = result?.candidateValueProps || [];
  const psychology = result?.recipientPsychology || {};
  const abTests  = result?.abTestSuggestions     || [];
  const practices = result?.platformBestPractices || [];
  const doNotSend = result?.doNotSendIf          || [];
  const ov        = result?.overview             || {};

  const activePlatform = PLATFORMS.find(p => p.id === formData.platform)
    || PLATFORMS[0];

  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-neo-offwhite">
       <FeaturePageGuard action="mail_gen" /> 

      {/* ── NAVBAR ── */}
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── FORM CARD ── */}
        <div style={{ background: '#fff', border: '3px solid #000',
                      boxShadow: '7px 7px 0 #000', padding: 32 }}>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: 64, height: 64, background: '#FFA07A',
                          border: '3px solid #000',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
              <Mail size={28} />
            </div>
            <div>
              <h1 className="font-space text-3xl font-extrabold">
                OUTREACH GENERATOR
              </h1>
              <p style={{ color: '#666', fontWeight: 600 }}>
                AI-powered · Platform-specific · 3-touch follow-up included
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* ── PLATFORM SELECTOR ── */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
                Platform <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <div style={{ display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))',
                            gap: 10 }}>
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  const sel  = formData.platform === p.id;
                  return (
                    <button key={p.id} type="button"
                      onClick={() => setFormData({ ...formData, platform: p.id })}
                      style={{
                        background: sel ? p.bg : '#fff',
                        color:      sel ? p.textColor : '#000',
                        border:     '3px solid #000',
                        boxShadow:  sel ? '2px 2px 0 #000' : '4px 4px 0 #000',
                        transform:  sel ? 'translate(2px,2px)' : 'none',
                        padding:    '10px 12px',
                        cursor:     'pointer',
                        textAlign:  'left',
                        transition: 'all 0.1s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center',
                                    gap: 6, marginBottom: 2 }}>
                        <Icon size={14} />
                        <span style={{ fontWeight: 900, fontSize: 12 }}>
                          {p.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 600 }}>
                        {p.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── RESUME SOURCE ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontWeight: 800 }}>
                  Resume <span style={{ color: '#FF6B6B' }}>*</span>
                </label>
                <button type="button"
                  onClick={() => setShowUpload(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer',
                           fontWeight: 700, fontSize: 13, color: '#0077B5',
                           display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Upload size={13} />
                  {showUpload ? 'Use saved resume' : 'Upload new'}
                </button>
              </div>

              {showUpload ? (
                /* Upload zone */
                <LockedUploadZone feature="mail_gen" isLocked={false}>
                <div
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    border: '3px dashed #000',
                    background: file ? '#A8FF78' : '#F5F0E8',
                    padding: 24, textAlign: 'center',
                  }}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileText size={22} />
                      <span style={{ fontWeight: 800 }}>{file.name}</span>
                      <button type="button" onClick={() => setFile(null)}
                        style={{ background: '#FF6B6B', border: '2px solid #000',
                                 padding: '2px 7px', cursor: 'pointer', fontWeight: 900 }}>
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} style={{ margin: '0 auto 10px',
                                                  display: 'block', opacity: 0.4 }} />
                      <label style={{ cursor: 'pointer' }}>
                        <span style={{
                          background: '#FFE566', border: '3px solid #000',
                          boxShadow: '3px 3px 0 #000', padding: '8px 20px',
                          fontWeight: 800, display: 'inline-block', fontSize: 13,
                        }}>
                          Browse or Drop PDF
                        </span>
                        <input type="file" accept=".pdf" className="hidden"
                               onChange={e => handleFile(e.target.files[0])} />
                      </label>
                      <p style={{ marginTop: 8, fontSize: 11, color: '#888',
                                  fontWeight: 600 }}>
                        PDF only · Max 5MB
                      </p>
                    </>
                  )}
                </div>
                </LockedUploadZone>
              ) : (
                /* Saved resumes grid */
                <div style={{ maxHeight: 180, overflowY: 'auto',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
                              gap: 8 }}>
                  {history.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center',
                                  padding: 20, color: '#888', fontWeight: 600,
                                  fontSize: 13 }}>
                      No saved resumes. Upload one above.
                    </div>
                  ) : history.map(item => (
                    <button key={item._id} type="button"
                      onClick={() => setSelectedResume(item)}
                      style={{
                        background: selectedResume?._id === item._id
                          ? '#FFE566' : '#fff',
                        border: '2px solid #000', padding: '10px 12px',
                        cursor: 'pointer', textAlign: 'left',
                        boxShadow: selectedResume?._id === item._id
                          ? '2px 2px 0 #000' : '3px 3px 0 #000',
                        transform: selectedResume?._id === item._id
                          ? 'translate(1px,1px)' : 'none',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center',
                                    gap: 6, fontWeight: 800, fontSize: 12 }}>
                        <FileText size={13} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis',
                                       whiteSpace: 'nowrap' }}>
                          {item.fileName || 'Resume'}
                        </span>
                      </div>
                      <div style={{ fontSize: 10, color: '#666', marginTop: 3 }}>
                        Score: {item.score} ·{' '}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString() : ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RECIPIENT NAME ── */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Recipient Name <span style={{ color: '#FF6B6B' }}>*</span>
                <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8,
                               color: '#555' }}>
                  (Makes the message personalized)
                </span>
              </label>
              <input type="text"
                value={formData.recipientName}
                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                placeholder="e.g. Sarah Chen, John Smith, Hiring Manager..."
                style={{ width: '100%', border: '3px solid #000',
                         padding: '12px 16px', fontWeight: 700, fontSize: 15,
                         outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* ── COMPANY + ROLE ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                          gap: 16 }}>
              <div>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                  Target Company <span style={{ color: '#FF6B6B' }}>*</span>
                </label>
                <input type="text"
                  value={formData.targetCompany}
                  onChange={e => setFormData({ ...formData, targetCompany: e.target.value })}
                  placeholder="e.g. Google, Zepto, Razorpay..."
                  style={{ width: '100%', border: '3px solid #000',
                           padding: '12px 16px', fontWeight: 700, fontSize: 15,
                           outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                  Target Role <span style={{ color: '#FF6B6B' }}>*</span>
                </label>
                <input type="text"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g. Senior SWE, Product Manager..."
                  style={{ width: '100%', border: '3px solid #000',
                           padding: '12px 16px', fontWeight: 700, fontSize: 15,
                           outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* ── JOB DESCRIPTION ── */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 8 }}>
                Job Description / Context
                <span style={{ fontWeight: 500, fontSize: 12, marginLeft: 8,
                               color: '#555' }}>
                  (Paste for a more targeted message)
                </span>
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
                placeholder="Paste the job description or any context about this role..."
                rows={4}
                style={{ width: '100%', border: '3px solid #000',
                         padding: '12px 16px', fontWeight: 600, fontSize: 14,
                         outline: 'none', resize: 'vertical',
                         boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>

            {/* ── SUBMIT ── */}
              <LockedActionButton
              action="mail_gen"
              onClick={handleSubmit}
              disabled={loading || (!file && !selectedResume)}
              style={{
                width: '100%',
                background: loading || (!file && !selectedResume) ? '#ccc' : '#000',
                color: '#fff', border: '3px solid #000',
                boxShadow: loading || (!file && !selectedResume)
                  ? 'none' : `5px 5px 0 ${activePlatform.bg}`,
                padding: 16, fontWeight: 900, fontSize: 16,
                cursor: loading || (!file && !selectedResume) ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Generating package...</>
                : <><Send size={20} /> Generate {formData.platform} Outreach</>}
            </LockedActionButton>

          </form>
        </div>

        {/* ════════════════════════════════════════════════════════
            RESULTS
        ════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="space-y-4">

            {/* ── OVERVIEW BANNER ── */}
            <div style={{ background: '#000', color: '#fff',
                          border: '3px solid #000',
                          boxShadow: `7px 7px 0 ${activePlatform.bg}`,
                          padding: '22px 26px' }}>

              <div style={{ display: 'flex', flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 16, marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
                                textTransform: 'uppercase', marginBottom: 8 }}>
                    {formData.platform} Outreach Verdict
                  </div>
                  <VerdictBadge verdict={ov.finalVerdict || 'SEND WITH MINOR TWEAKS'} />
                  {ov.finalVerdictReason && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#bbb',
                                  fontWeight: 600, maxWidth: 380 }}>
                      {ov.finalVerdictReason}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <ScoreChip score={ov.messageStrengthScore}   label="Strength" />
                  <ScoreChip score={ov.personalizationScore}   label="Personalization" />
                  <ScoreChip score={ov.credibilityScore}       label="Credibility" />
                  <ScoreChip score={ov.concisenessScore}       label="Conciseness" />
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20,
                            marginBottom: 16 }}>
                {ov.estimatedReplyRate && (
                  <div>
                    <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
                                  textTransform: 'uppercase' }}>
                      Est. Reply Rate
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 22,
                                  color: '#FFE566' }}>
                      {ov.estimatedReplyRate}
                    </div>
                  </div>
                )}
                {ov.ctaStrength && (
                  <div>
                    <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
                                  textTransform: 'uppercase' }}>
                      CTA Strength
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>
                      {ov.ctaStrength}
                    </div>
                  </div>
                )}
                {pm.sendingTip && (
                  <div>
                    <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
                                  textTransform: 'uppercase' }}>
                      Best Send Time
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13, marginTop: 2 }}>
                      {pm.sendingTip}
                    </div>
                  </div>
                )}
              </div>

              {/* First impression */}
              {ov.recipientFirstImpression && (
                <div style={{ background: '#1a1a1a', border: '2px solid #444',
                              padding: '10px 14px', fontSize: 13,
                              fontStyle: 'italic', color: '#ddd' }}>
                  <span style={{ fontStyle: 'normal', fontWeight: 800,
                                 color: '#FFE566', marginRight: 6 }}>
                    Recipient's first 3 seconds:
                  </span>
                  "{ov.recipientFirstImpression}"
                </div>
              )}
            </div>

            {/* ── PRIMARY MESSAGE ── */}
            <div style={{ border: '3px solid #000',
                          boxShadow: '7px 7px 0 #000' }}>
              <div style={{
                background: activePlatform.bg,
                color: activePlatform.textColor,
                borderBottom: '3px solid #000',
                padding: '14px 20px',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {(() => { const Icon = activePlatform.icon; return <Icon size={18} />; })()}
                  <span style={{ fontWeight: 900, fontSize: 15,
                                 textTransform: 'uppercase' }}>
                    {activePlatform.label} Message
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {pm.wordCount && (
                      <Tag text={`${pm.wordCount} words`}
                           bg={pm.wordLimitMet ? '#A8FF78' : '#FF6B6B'} small />
                    )}
                    {pm.hookStyle && <Tag text={pm.hookStyle} bg="#fff" small />}
                    {pm.tone && <Tag text={pm.tone} bg="#F5F0E8" small />}
                  </div>
                </div>
                <CopyButton text={pm.content || ''} label="Copy Message" />
              </div>
              <div style={{ background: '#fff', padding: 20 }}>
                {/* Subject line for email platforms */}
                {sl?.primary && (
                  <div style={{ background: '#FFF9E6', border: '2px solid #000',
                                padding: '10px 14px', marginBottom: 14,
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: 12,
                                     textTransform: 'uppercase', marginRight: 8 }}>
                        Subject:
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>
                        {sl.primary}
                      </span>
                      {sl.subjectLinePsychology && (
                        <div style={{ fontSize: 11, color: '#666',
                                      fontWeight: 600, marginTop: 3 }}>
                          {sl.subjectLinePsychology}
                        </div>
                      )}
                    </div>
                    <CopyButton text={sl.primary} label="Copy Subject" />
                  </div>
                )}

                {/* Hook highlight */}
                {pm.hookLine && (
                  <div style={{
                    background: '#E8F5E9', border: '2px solid #000',
                    padding: '8px 14px', marginBottom: 14,
                    borderLeft: '5px solid #000', fontSize: 12, fontWeight: 600,
                  }}>
                    <span style={{ fontWeight: 800 }}>Opening hook: </span>
                    {pm.hookLine}
                  </div>
                )}

                <MessageBubble content={pm.content} platform={formData.platform} />

                {/* CTA info */}
                {pm.ctaUsed && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8,
                                alignItems: 'center' }}>
                    <Tag text="CTA" bg="#FFE566" small />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>
                      {pm.ctaUsed}
                    </span>
                    {pm.ctaType && <Tag text={pm.ctaType} bg="#F5F0E8" small />}
                  </div>
                )}
              </div>
            </div>

            {/* ── SUBJECT LINE ALTERNATIVES (email platforms) ── */}
            {sl?.alternatives?.length > 0 && (
              <Accordion title="Alternative Subject Lines"
                         icon={Mail} bg="#FFE566"
                         badge={sl.alternatives.length + 1}>
                <div className="space-y-2">
                  {[{ subject: sl.primary, style: 'Primary (Best)' },
                    ...sl.alternatives].map((s, i) => (
                    <div key={i} style={{
                      border: '2px solid #000', padding: '10px 14px',
                      background: i === 0 ? '#FFF9E6' : '#fff',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 10,
                    }}>
                      <div>
                        {i === 0 && <Tag text="BEST" bg="#FFE566" small />}
                        {s.style && (
                          <Tag text={s.style} bg="#F5F0E8"
                               small style={{ marginLeft: i === 0 ? 6 : 0 }} />
                        )}
                        <div style={{ fontWeight: 800, fontSize: 14,
                                      marginTop: 4 }}>
                          {s.subject}
                        </div>
                      </div>
                      <CopyButton text={s.subject} />
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {/* ── ALTERNATIVE VERSIONS ── */}
            {alts.length > 0 && (
              <Accordion title="3 Alternative Styles"
                         icon={RefreshCw} bg="#74B9FF"
                         defaultOpen badge={alts.length}>
                {/* Tab buttons */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16,
                              flexWrap: 'wrap' }}>
                  {alts.map((a, i) => (
                    <button key={i} type="button"
                      onClick={() => setActiveAltVersion(i)}
                      style={{
                        background: activeAltVersion === i ? '#FFE566' : '#F5F0E8',
                        border: '2px solid #000', padding: '6px 14px',
                        fontWeight: 800, fontSize: 12, cursor: 'pointer',
                        boxShadow: activeAltVersion === i
                          ? '2px 2px 0 #000' : '3px 3px 0 #000',
                        transform: activeAltVersion === i
                          ? 'translate(1px,1px)' : 'none',
                      }}>
                      {a.style}
                    </button>
                  ))}
                </div>

                {alts[activeAltVersion] && (() => {
                  const alt = alts[activeAltVersion];
                  return (
                    <div style={{ border: '2px solid #000', padding: 16 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10,
                                    flexWrap: 'wrap', alignItems: 'center' }}>
                        <Tag text={`${alt.wordCount || '?'} words`} bg="#F5F0E8" small />
                        {alt.bestFor && (
                          <span style={{ fontSize: 12, fontWeight: 600,
                                         color: '#555' }}>
                            Best for: {alt.bestFor}
                          </span>
                        )}
                        <CopyButton text={alt.content} />
                      </div>
                      {alt.hookLine && (
                        <div style={{
                          background: '#E8F5E9', border: '1px solid #000',
                          padding: '6px 10px', marginBottom: 10,
                          fontSize: 12, fontWeight: 600,
                          borderLeft: '4px solid #000',
                        }}>
                          Hook: {alt.hookLine}
                        </div>
                      )}
                      <MessageBubble content={alt.content}
                                     platform={formData.platform} />
                    </div>
                  );
                })()}
              </Accordion>
            )}

            {/* ── 3-TOUCH FOLLOW-UP SEQUENCE ── */}
            {sequence.length > 0 && (
              <Accordion title="3-Touch Follow-Up Sequence"
                         icon={Clock} bg="#A8FF78"
                         defaultOpen badge={sequence.length}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#555',
                            marginBottom: 16 }}>
                  Send these in order. Each one adds NEW value — no "just checking in":
                </p>

                {/* Timeline dots */}
                <div style={{ display: 'flex', gap: 0, marginBottom: 20,
                              alignItems: 'stretch' }}>
                  {sequence.map((touch, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center', gap: 4 }}>
                      <button type="button"
                        onClick={() => setActiveFollowUp(i)}
                        style={{
                          width: 36, height: 36,
                          background: activeFollowUp === i ? '#000' : '#F5F0E8',
                          color:      activeFollowUp === i ? '#FFE566' : '#000',
                          border: '2px solid #000', fontWeight: 900,
                          fontSize: 14, cursor: 'pointer',
                          borderRadius: 0,
                        }}>
                        {touch.touchNumber}
                      </button>
                      <div style={{ fontSize: 10, fontWeight: 700,
                                    textAlign: 'center', color: '#555' }}>
                        Day {touch.sendOnDay}
                      </div>
                      {i < sequence.length - 1 && (
                        <div style={{ position: 'absolute',
                                      /* spacer line — omit for simplicity */ }} />
                      )}
                    </div>
                  ))}
                </div>

                {sequence[activeFollowUp] && (() => {
                  const touch = sequence[activeFollowUp];
                  return (
                    <div style={{ border: '2px solid #000', padding: 16 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 12,
                                    flexWrap: 'wrap', alignItems: 'center' }}>
                        <Tag text={`Touch ${touch.touchNumber}`} bg="#FFE566" small />
                        <Tag text={touch.label} bg="#F5F0E8" small />
                        <Tag text={`Day ${touch.sendOnDay}`} bg="#E8F4FF" small />
                        {touch.wordCount && (
                          <Tag text={`${touch.wordCount} words`} bg="#F5F0E8" small />
                        )}
                        <CopyButton text={touch.content} />
                      </div>

                      {touch.newValueAdded && (
                        <div style={{
                          background: '#E8F5E9', border: '1px solid #000',
                          padding: '6px 10px', marginBottom: 10,
                          fontSize: 12, fontWeight: 600,
                          borderLeft: '4px solid #000',
                        }}>
                          New value added: {touch.newValueAdded}
                        </div>
                      )}

                      <MessageBubble content={touch.content}
                                     platform={formData.platform} />

                      {touch.purpose && (
                        <div style={{ marginTop: 10, fontSize: 12,
                                      color: '#666', fontWeight: 600 }}>
                          Purpose: {touch.purpose}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </Accordion>
            )}

            {/* ── CONNECTION NOTE ── */}
            {connNote.content && (
              <Accordion title="LinkedIn Connection Note (≤300 chars)"
                         icon={Linkedin} bg="#0077B5"
                         defaultOpen>
                <div style={{ marginBottom: 10, display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Tag text={`${connNote.charCount || 0} chars`}
                         bg={connNote.isUnder300Chars ? '#A8FF78' : '#FF6B6B'}
                         small />
                    {connNote.isUnder300Chars
                      ? <Tag text="✓ Under limit" bg="#A8FF78" small />
                      : <Tag text="⚠ Over 300 chars" bg="#FF6B6B" small />}
                  </div>
                  <CopyButton text={connNote.content} label="Copy Note" />
                </div>

                {connNote.tip && (
                  <div style={{ background: '#E8F4FF', border: '2px solid #000',
                                padding: '8px 12px', marginBottom: 12,
                                fontSize: 12, fontWeight: 700 }}>
                    💡 {connNote.tip}
                  </div>
                )}

                <div style={{ background: '#F8F4FF', border: '2px solid #000',
                              padding: 16, fontFamily: 'Georgia, serif',
                              lineHeight: 1.7, fontSize: 14 }}>
                  {connNote.content}
                </div>
              </Accordion>
            )}

            {/* ── RECIPIENT PSYCHOLOGY ── */}
            {psychology.likelyMindset && (
              <Accordion title="Recipient Psychology Analysis"
                         icon={Brain} bg="#DDA0DD">
                <div style={{ display: 'grid',
                              gridTemplateColumns: '1fr 1fr', gap: 12,
                              marginBottom: 14 }}>
                  <div style={{ border: '2px solid #000', padding: 12,
                                background: '#F8F4FF' }}>
                    <div style={{ fontWeight: 800, fontSize: 11,
                                  textTransform: 'uppercase', marginBottom: 6 }}>
                      Their mindset
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                      {psychology.likelyMindset}
                    </p>
                  </div>
                  <div style={{ border: '2px solid #000', padding: 12,
                                background: '#FFF0F0' }}>
                    <div style={{ fontWeight: 800, fontSize: 11,
                                  textTransform: 'uppercase', marginBottom: 6,
                                  color: '#c00' }}>
                      Main objection
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                      {psychology.mainObjection}
                    </p>
                  </div>
                </div>

                {psychology.howMessageAddressesObjection && (
                  <div style={{ border: '2px solid #000', padding: 12,
                                background: '#F0FFF0', marginBottom: 12,
                                borderLeft: '5px solid #000' }}>
                    <div style={{ fontWeight: 800, fontSize: 11,
                                  textTransform: 'uppercase', marginBottom: 6 }}>
                      How this message handles it
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                      {psychology.howMessageAddressesObjection}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {psychology.estimatedReplyRate && (
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 11,
                                    textTransform: 'uppercase' }}>
                        Est. Reply Rate
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 22,
                                    color: '#7B2D8B' }}>
                        {psychology.estimatedReplyRate}
                      </div>
                    </div>
                  )}
                  {psychology.replyRateBenchmark && (
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 11,
                                    textTransform: 'uppercase', marginBottom: 4 }}>
                        Benchmark
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#555' }}>
                        {psychology.replyRateBenchmark}
                      </div>
                    </div>
                  )}
                </div>
              </Accordion>
            )}

            {/* ── PERSONALIZATION ELEMENTS ── */}
            {perElems.length > 0 && (
              <Accordion title="Personalization Elements"
                         icon={Target} bg="#A8FF78"
                         badge={perElems.length}>
                {perElems.map((el, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10,
                                        marginBottom: 10,
                                        alignItems: 'flex-start' }}>
                    <Tag text={el.source} bg="#E8F4FF" small />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {el.element}
                      </div>
                      {el.impact && (
                        <div style={{ fontSize: 11, color: '#555',
                                      fontWeight: 600, marginTop: 2 }}>
                          {el.impact}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── WHAT MAKES IT WORK / COULD BE STRONGER ── */}
            {(ov.whatMakesItWork?.length > 0
              || ov.whatCouldBeStronger?.length > 0) && (
              <Accordion title="Message Strengths & Gaps"
                         icon={BarChart2} bg="#74B9FF">
                <div style={{ display: 'grid',
                              gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {ov.whatMakesItWork?.length > 0 && (
                    <div style={{ border: '2px solid #000', padding: 14,
                                  background: '#F0FFF0' }}>
                      <div style={{ fontWeight: 800, fontSize: 12,
                                    textTransform: 'uppercase', marginBottom: 8 }}>
                        What works
                      </div>
                      {ov.whatMakesItWork.map((w, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6,
                                              marginBottom: 6, fontSize: 12,
                                              fontWeight: 600 }}>
                          <Check size={13} style={{ color: '#2a7a2a',
                                                     flexShrink: 0, marginTop: 2 }} />
                          {w}
                        </div>
                      ))}
                    </div>
                  )}
                  {ov.whatCouldBeStronger?.length > 0 && (
                    <div style={{ border: '2px solid #000', padding: 14,
                                  background: '#FFF8E1' }}>
                      <div style={{ fontWeight: 800, fontSize: 12,
                                    textTransform: 'uppercase', marginBottom: 8 }}>
                        Could be stronger
                      </div>
                      {ov.whatCouldBeStronger.map((w, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6,
                                              marginBottom: 6, fontSize: 12,
                                              fontWeight: 600 }}>
                          <AlertTriangle size={13}
                            style={{ color: '#B45309', flexShrink: 0,
                                     marginTop: 2 }} />
                          {w}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* HM + Recruiter versions */}
                <div style={{ display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: 12, marginTop: 12 }}>
                  {ov.hiringManagerVersion && (
                    <div style={{ border: '2px solid #000', padding: 12,
                                  background: '#F8F4FF' }}>
                      <div style={{ fontWeight: 800, fontSize: 11,
                                    textTransform: 'uppercase', marginBottom: 6 }}>
                        If recipient = Hiring Manager
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600,
                                  color: '#555', lineHeight: 1.6 }}>
                        {ov.hiringManagerVersion}
                      </p>
                    </div>
                  )}
                  {ov.recruiterVersion && (
                    <div style={{ border: '2px solid #000', padding: 12,
                                  background: '#FFF5EE' }}>
                      <div style={{ fontWeight: 800, fontSize: 11,
                                    textTransform: 'uppercase', marginBottom: 6 }}>
                        If recipient = Recruiter
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600,
                                  color: '#555', lineHeight: 1.6 }}>
                        {ov.recruiterVersion}
                      </p>
                    </div>
                  )}
                </div>
              </Accordion>
            )}

            {/* ── CANDIDATE VALUE PROPS ── */}
            {valueProps.length > 0 && (
              <Accordion title="Value Props Used"
                         icon={Zap} bg="#FFE566"
                         badge={valueProps.length}>
                {valueProps.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10,
                                        marginBottom: 10,
                                        alignItems: 'flex-start' }}>
                    <Star size={15} style={{ color: '#B45309',
                                             flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>
                        {v.prop}
                      </div>
                      {v.relevance && (
                        <div style={{ fontSize: 11, color: '#555',
                                      fontWeight: 600, marginTop: 2 }}>
                          {v.relevance}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── A/B TEST SUGGESTIONS ── */}
            {abTests.length > 0 && (
              <Accordion title="A/B Test Ideas"
                         icon={TrendingUp} bg="#FFA07A"
                         badge={abTests.length}>
                {abTests.map((ab, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 14,
                                        marginBottom: 10,
                                        background: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <Tag text={`Test: ${ab.element}`} bg="#FFE566" small />
                    </div>
                    <div style={{ display: 'grid',
                                  gridTemplateColumns: '1fr 1fr', gap: 10,
                                  marginBottom: 8 }}>
                      <div style={{ background: '#E8F4FF',
                                    border: '1px solid #ddd', padding: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: 10,
                                      textTransform: 'uppercase', marginBottom: 4 }}>
                          Version A (current)
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600 }}>
                          {ab.versionA}
                        </p>
                      </div>
                      <div style={{ background: '#E8FFE8',
                                    border: '1px solid #ddd', padding: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: 10,
                                      textTransform: 'uppercase', marginBottom: 4 }}>
                          Version B (test)
                        </div>
                        <p style={{ fontSize: 12, fontWeight: 600 }}>
                          {ab.versionB}
                        </p>
                      </div>
                    </div>
                    {ab.hypothesis && (
                      <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
                        Hypothesis: {ab.hypothesis}
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── RED FLAGS ── */}
            {redFlags.length > 0 && (
              <Accordion title="Red Flags to Watch"
                         icon={Shield} bg="#FF6B6B"
                         badge={redFlags.length}>
                {redFlags.map((rf, i) => (
                  <div key={i} style={{ border: '2px solid #000', padding: 12,
                                        marginBottom: 8, background: '#FFF0F0' }}>
                    <div style={{ display: 'flex', gap: 8,
                                  alignItems: 'center', marginBottom: 6 }}>
                      <Tag text={rf.severity} bg={
                        rf.severity === 'Avoid' ? '#FF6B6B'
                        : rf.severity === 'Moderate' ? '#FFE566' : '#F5F0E8'
                      } small />
                      <span style={{ fontWeight: 700, fontSize: 13 }}>
                        {rf.flag}
                      </span>
                    </div>
                    {rf.suggestion && (
                      <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
                        Fix: {rf.suggestion}
                      </div>
                    )}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── PLATFORM BEST PRACTICES ── */}
            {practices.length > 0 && (
              <Accordion title={`${formData.platform} Best Practices`}
                         icon={Eye} bg="#F5F0E8">
                {practices.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8,
                                        marginBottom: 8, fontSize: 13,
                                        fontWeight: 600 }}>
                    <Check size={14} style={{ color: '#2a7a2a',
                                               flexShrink: 0, marginTop: 2 }} />
                    {tip}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── DO NOT SEND IF ── */}
            {doNotSend.length > 0 && (
              <Accordion title="Do Not Send If..." icon={AlertTriangle}
                         bg="#FFA07A">
                {doNotSend.map((cond, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8,
                                        marginBottom: 8, fontSize: 13,
                                        fontWeight: 600 }}>
                    <X size={14} style={{ color: '#c00', flexShrink: 0,
                                          marginTop: 2 }} />
                    {cond}
                  </div>
                ))}
              </Accordion>
            )}

            {/* ── TOP TIP ── */}
            {ov.topTip && (
              <div style={{ background: '#FFE566', border: '3px solid #000',
                            boxShadow: '4px 4px 0 #000',
                            padding: '16px 20px' }}>
                <div style={{ fontWeight: 900, fontSize: 13,
                              textTransform: 'uppercase', marginBottom: 6 }}>
                  ⭐ Top Tip to Increase Reply Rate
                </div>
                <p style={{ fontSize: 14, fontWeight: 700 }}>
                  {ov.topTip}
                </p>
              </div>
            )}

            {/* ── REGENERATE ── */}
            <div style={{ textAlign: 'center', paddingBottom: 32 }}>
              <button
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: '#fff', border: '3px solid #000',
                  boxShadow: '5px 5px 0 #000', padding: '12px 28px',
                  fontWeight: 800, cursor: 'pointer', fontSize: 14,
                  textTransform: 'uppercase',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                <RefreshCw size={15} /> Generate Another Message
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ColdEmailPage;