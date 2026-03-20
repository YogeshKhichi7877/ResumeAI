// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar } from '../pages/Navbar';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   Loader2, FileText, Target, Brain, ChevronDown,
//   Play, CheckCircle, XCircle, Clock, Crown,
//   RotateCcw, Mic, Upload, ChevronUp, Trophy,
//   Star, AlertTriangle, Zap, BookOpen, Filter,
//   Copy, Check, RefreshCw
// } from 'lucide-react';

// const DIFFICULTY_COLORS = {
//   Hard:   { bg: 'bg-neo-red',    text: 'text-black', label: 'Hard'   },
//   Medium: { bg: 'bg-neo-yellow', text: 'text-black', label: 'Medium' },
//   Easy:   { bg: 'bg-neo-green',  text: 'text-black', label: 'Easy'   },
//   High:   { bg: 'bg-neo-red',    text: 'text-black', label: 'High'   },
// };

// const IMPORTANCE_ICON = {
//   High:   <AlertTriangle className="w-4 h-4 text-red-500" />,
//   Medium: <Star className="w-4 h-4 text-yellow-500" />,
//   Low:    <BookOpen className="w-4 h-4 text-blue-500" />,
// };

// const TABS = ['All', 'Hard', 'Medium', 'Easy'];

// // ── Countdown Timer ──────────────────────────────────────────────────
// const Timer = ({ seconds, onDone }) => {
//   const [remaining, setRemaining] = useState(seconds);
//   const [running, setRunning] = useState(false);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     if (running && remaining > 0) {
//       intervalRef.current = setInterval(() => {
//         setRemaining(r => {
//           if (r <= 1) {
//             clearInterval(intervalRef.current);
//             setRunning(false);
//             onDone?.();
//             return 0;
//           }
//           return r - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [running]);

//   const reset = () => {
//     clearInterval(intervalRef.current);
//     setRunning(false);
//     setRemaining(seconds);
//   };

//   const pct = (remaining / seconds) * 100;
//   const color = pct > 50 ? '#A8FF78' : pct > 20 ? '#FFE566' : '#FF6B6B';
//   const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
//   const ss = String(remaining % 60).padStart(2, '0');

//   return (
//     <div className="flex items-center gap-3">
//       {/* Progress ring */}
//       <svg width="48" height="48" className="flex-shrink-0">
//         <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
//         <circle
//           cx="24" cy="24" r="20" fill="none"
//           stroke={color} strokeWidth="4"
//           strokeDasharray={`${2 * Math.PI * 20}`}
//           strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
//           strokeLinecap="round"
//           transform="rotate(-90 24 24)"
//           style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
//         />
//         <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="900" fill="#000">
//           {mm}:{ss}
//         </text>
//       </svg>

//       <div className="flex gap-2">
//         <button
//           onClick={() => setRunning(v => !v)}
//           className={`border-3 border-black px-3 py-1.5 font-bold text-xs flex items-center gap-1.5 transition-colors
//             ${running ? 'bg-neo-red hover:bg-red-400' : 'bg-neo-green hover:bg-green-400'}`}
//         >
//           {running ? 'Pause' : (remaining < seconds ? 'Resume' : 'Start')}
//         </button>
//         <button
//           onClick={reset}
//           className="border-3 border-black px-3 py-1.5 font-bold text-xs bg-neo-offwhite hover:bg-neo-yellow transition-colors flex items-center gap-1"
//         >
//           <RotateCcw className="w-3 h-3" />
//         </button>
//       </div>
//     </div>
//   );
// };

// // ── Single Question Card ─────────────────────────────────────────────
// const QuestionCard = ({ q, index, expanded, onToggle }) => {
//   const [userAnswer, setUserAnswer] = useState('');
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [copied, setCopied] = useState(false);
//   const diff = q.difficulty || q.importance || 'Medium';
//   const diffStyle = DIFFICULTY_COLORS[diff] || DIFFICULTY_COLORS.Medium;

//   const copyQuestion = () => {
//     navigator.clipboard.writeText(q.question);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   return (
//     <div className="border-3 border-black shadow-[4px_4px_0_#000] bg-white">
//       {/* Header row */}
//       <div
//         className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-neo-offwhite transition-colors"
//         onClick={onToggle}
//       >
//         <div className="flex items-start gap-3 flex-1 min-w-0">
//           <span className="font-space font-extrabold text-lg text-gray-300 flex-shrink-0 leading-tight">
//             {String(index + 1).padStart(2, '0')}
//           </span>
//           <div className="flex-1 min-w-0">
//             <p className="font-bold text-sm leading-snug">{q.question}</p>
//             {q.reason && (
//               <p className="text-xs text-gray-500 mt-1 font-medium">
//                 <span className="font-bold">Why asked:</span> {q.reason}
//               </p>
//             )}
//           </div>
//         </div>
//         <div className="flex items-center gap-2 flex-shrink-0">
//           {IMPORTANCE_ICON[q.importance] || IMPORTANCE_ICON.Medium}
//           <span className={`px-2 py-0.5 border-2 border-black text-xs font-extrabold ${diffStyle.bg} ${diffStyle.text}`}>
//             {diffStyle.label}
//           </span>
//           {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//         </div>
//       </div>

//       {/* Expanded body */}
//       {expanded && (
//         <div className="border-t-3 border-black px-5 py-4 bg-white space-y-4">
//           {/* Answer box */}
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <label className="font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
//                 <Mic className="w-3.5 h-3.5" /> Your Answer (Practice)
//               </label>
//               <Timer seconds={120} onDone={() => toast(`⏱ Time's up for this question!`)} />
//             </div>
//             <textarea
//               value={userAnswer}
//               onChange={e => setUserAnswer(e.target.value)}
//               placeholder="Type your answer here to practice. Use the timer to simulate real interview conditions..."
//               rows={4}
//               className="w-full border-3 border-black p-3 text-sm font-medium resize-none focus:outline-none focus:bg-neo-yellow/10 transition-colors"
//             />
//             {userAnswer.trim() && (
//               <div className="mt-1 text-right text-xs text-gray-400 font-medium">
//                 {userAnswer.trim().split(/\s+/).length} words
//               </div>
//             )}
//           </div>

//           {/* Hint / Model Answer toggle */}
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setShowAnswer(v => !v)}
//               className={`text-xs font-bold border-2 border-black px-3 py-1.5 flex items-center gap-1.5 transition-colors
//                 ${showAnswer ? 'bg-neo-yellow' : 'bg-neo-offwhite hover:bg-neo-yellow'}`}
//             >
//               <Brain className="w-3.5 h-3.5" />
//               {showAnswer ? 'Hide Guidance' : 'Show Answer Guidance'}
//             </button>
//             <button
//               onClick={copyQuestion}
//               className="text-xs font-bold border-2 border-black px-3 py-1.5 bg-neo-offwhite hover:bg-neo-yellow transition-colors flex items-center gap-1.5"
//             >
//               {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
//               {copied ? 'Copied!' : 'Copy Q'}
//             </button>
//           </div>

//           {showAnswer && (
//             <div className="bg-neo-yellow/20 border-3 border-black p-4">
//               <p className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
//                 <Star className="w-3.5 h-3.5" /> How to Answer This Well
//               </p>
//               <p className="text-sm font-medium text-gray-700">
//                 {q.guidance || q.reason
//                   ? `This question tests: ${q.reason || 'your domain expertise and experience'}. 
//                      Use the STAR method (Situation, Task, Action, Result). 
//                      Reference specific projects or metrics from your resume to make your answer concrete and memorable.`
//                   : 'Use the STAR method (Situation, Task, Action, Result) and reference specific examples from your resume with measurable outcomes.'}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Main Page ────────────────────────────────────────────────────────
// export const MockInterviewPage = () => {
//   const [history, setHistory] = useState([]);
//   const [loadingHistory, setLoadingHistory] = useState(true);
//   const [selectedAnalysis, setSelectedAnalysis] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const [questions, setQuestions] = useState([]);
//   const [generating, setGenerating] = useState(false);
//   const [activeTab, setActiveTab] = useState('All');
//   const [expandedIndex, setExpandedIndex] = useState(null);

//   const [sessionStarted, setSessionStarted] = useState(false);
//   const [completed, setCompleted] = useState(new Set());

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const res = await historyAPI.getHistory();
//       setHistory(res.data || []);
//     } catch {
//       toast.error('Failed to load resumes');
//     } finally {
//       setLoadingHistory(false);
//     }
//   };

//   const selectResume = (item) => {
//     setSelectedAnalysis(item);
//     setShowDropdown(false);
//     setQuestions([]);
//     setCompleted(new Set());
//     setSessionStarted(false);
//     setExpandedIndex(null);
//     setActiveTab('All');
//   };

//   const generateQuestions = async () => {
//     if (!selectedAnalysis) {
//       toast.error('Please select a resume first');
//       return;
//     }
//     setGenerating(true);
//     setQuestions([]);
//     setCompleted(new Set());
//     setSessionStarted(false);
//     setExpandedIndex(null);

//     try {
//       // Fetch full analysis to get resumeText
//       const analysisRes = await resumeAPI.getAnalysis(
//         selectedAnalysis.analysisId?._id || selectedAnalysis.analysisId
//       );
//       const { resumeText, interview_questions, targetDomain } = analysisRes.data;

//       // If analysis already has questions, use them first; otherwise generate fresh ones
//       if (interview_questions?.length > 0) {
//         // Normalize shape — add difficulty field if missing
//         const normalized = interview_questions.map(q => ({
//           ...q,
//           difficulty: q.difficulty || q.importance || 'Medium',
//         }));
//         setQuestions(normalized);
//         toast.success(`Loaded ${normalized.length} interview questions from your analysis!`);
//       } else {
//         // Generate fresh interview questions
//         const res = await resumeAPI.generateInterviewQuestions({
//           resumeText,
//           targetDomain: selectedAnalysis.targetDomain,
//         });
//         const qs = res.data?.questions || [];
//         const normalized = qs.map(q => ({
//           ...q,
//           difficulty: q.difficulty || q.importance || 'Medium',
//         }));
//         setQuestions(normalized);
//         toast.success(`Generated ${normalized.length} interview questions!`);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to generate questions. Please try again.');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const markDone = (i) => {
//     setCompleted(prev => {
//       const next = new Set(prev);
//       next.has(i) ? next.delete(i) : next.add(i);
//       return next;
//     });
//   };

//   const filteredQuestions = questions.filter(q => {
//     if (activeTab === 'All') return true;
//     const diff = q.difficulty || q.importance || 'Medium';
//     return diff === activeTab;
//   });

//   const counts = {
//     All:    questions.length,
//     Hard:   questions.filter(q => (q.difficulty || q.importance) === 'Hard').length,
//     Medium: questions.filter(q => (q.difficulty || q.importance) === 'Medium').length,
//     Easy:   questions.filter(q => (q.difficulty || q.importance) === 'Easy').length,
//   };

//   const progress = questions.length > 0 ? Math.round((completed.size / questions.length) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-neo-offwhite">
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

//         {/* ── Header ──────────────────────────────────────────────── */}
//         <div className="flex items-center justify-between flex-wrap gap-4">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-neo-yellow border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
//               <Brain className="w-7 h-7" />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold uppercase tracking-tight">
//                 Mock Interview
//               </h1>
//               <p className="text-gray-500 font-medium text-sm">
//                 AI-generated questions tailored to your actual resume
//               </p>
//             </div>
//           </div>
//           <div className="hidden md:flex items-center gap-2 bg-black text-neo-yellow border-3 border-black px-3 py-2 shadow-[3px_3px_0_#FFE566]">
//             <Crown className="w-4 h-4" />
//             <span className="font-bold text-xs uppercase tracking-widest">Basic Plan Feature</span>
//           </div>
//         </div>

//         {/* ── Resume Selector ──────────────────────────────────────── */}
//         <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-5">
//           <div className="flex items-center gap-3 mb-3">
//             <FileText className="w-5 h-5" />
//             <h2 className="font-space font-extrabold uppercase text-sm tracking-wide">
//               Select Resume
//             </h2>
//           </div>

//           {loadingHistory ? (
//             <div className="flex items-center gap-2 text-gray-500">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               <span className="font-medium text-sm">Loading your resumes...</span>
//             </div>
//           ) : history.length === 0 ? (
//             <div className="border-3 border-dashed border-black p-6 text-center">
//               <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
//               <p className="font-bold mb-1">No resumes analysed yet</p>
//               <Link to="/dashboard" className="neo-button-yellow text-sm px-5 py-2 inline-flex items-center gap-2">
//                 <Target className="w-4 h-4" /> Go to Dashboard
//               </Link>
//             </div>
//           ) : (
//             <div className="flex gap-3 flex-wrap items-start">
//               <div className="relative flex-1 min-w-60">
//                 <button
//                   onClick={() => setShowDropdown(v => !v)}
//                   className="w-full flex items-center justify-between border-3 border-black bg-neo-offwhite px-4 py-3 font-bold hover:bg-neo-yellow transition-colors"
//                 >
//                   <span className="flex items-center gap-2 text-sm">
//                     <FileText className="w-4 h-4 flex-shrink-0" />
//                     {selectedAnalysis
//                       ? `${selectedAnalysis.fileName} (${selectedAnalysis.score}/100)`
//                       : 'Choose a resume...'}
//                   </span>
//                   <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
//                 </button>

//                 {showDropdown && (
//                   <div className="absolute top-full left-0 right-0 z-30 bg-white border-3 border-black shadow-[5px_5px_0_#000] max-h-56 overflow-y-auto">
//                     {history.map((item) => (
//                       <button
//                         key={item._id}
//                         onClick={() => selectResume(item)}
//                         className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-black/10 last:border-b-0 hover:bg-neo-yellow transition-colors"
//                       >
//                         <div>
//                           <div className="font-bold text-sm">{item.fileName}</div>
//                           <div className="text-xs text-gray-500">
//                             {item.targetDomain?.replace('-', ' ')} &bull; {new Date(item.createdAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                         <div className={`px-2 py-1 border-2 border-black text-xs font-extrabold
//                           ${item.score >= 80 ? 'bg-neo-green' : item.score >= 60 ? 'bg-neo-yellow' : 'bg-neo-red'}`}>
//                           {item.score}
//                         </div>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button
//                 onClick={generateQuestions}
//                 disabled={!selectedAnalysis || generating}
//                 className={`neo-button flex items-center gap-2 text-sm px-5 py-3 whitespace-nowrap
//                   ${(!selectedAnalysis || generating) ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 {generating
//                   ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
//                   : questions.length > 0
//                     ? <><RefreshCw className="w-4 h-4" /> Regenerate</>
//                     : <><Play className="w-4 h-4" /> Generate Questions</>
//                 }
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Progress bar (shown after questions load) ────────────── */}
//         {questions.length > 0 && (
//           <div className="bg-white border-3 border-black shadow-[4px_4px_0_#000] px-5 py-4">
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-3">
//                 <Trophy className="w-5 h-5 text-neo-yellow" />
//                 <span className="font-space font-extrabold uppercase text-sm tracking-wide">Session Progress</span>
//               </div>
//               <span className="font-extrabold text-sm">
//                 {completed.size} / {questions.length} done
//               </span>
//             </div>

//             {/* Progress bar */}
//             <div className="w-full h-4 border-3 border-black bg-neo-offwhite">
//               <div
//                 className="h-full bg-neo-green transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <div className="flex justify-between text-xs text-gray-400 font-bold mt-1">
//               <span>0%</span>
//               <span className="font-extrabold text-black">{progress}% complete</span>
//               <span>100%</span>
//             </div>

//             {/* Stats row */}
//             <div className="grid grid-cols-3 gap-3 mt-4">
//               {['Hard', 'Medium', 'Easy'].map(diff => (
//                 <div key={diff} className={`border-3 border-black p-3 text-center ${DIFFICULTY_COLORS[diff].bg}`}>
//                   <div className="font-space font-extrabold text-2xl">{counts[diff]}</div>
//                   <div className="font-bold text-xs uppercase">{diff}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── Questions List ───────────────────────────────────────── */}
//         {questions.length > 0 && (
//           <div>
//             {/* Filter tabs */}
//             <div className="flex items-center gap-0 mb-4 border-3 border-black overflow-hidden w-fit">
//               {TABS.map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`px-4 py-2 font-bold text-sm uppercase tracking-wide border-r-3 border-black last:border-r-0 transition-colors
//                     ${activeTab === tab ? 'bg-neo-yellow' : 'bg-white hover:bg-neo-offwhite'}`}
//                 >
//                   {tab}
//                   <span className={`ml-1.5 text-xs font-extrabold px-1.5 py-0.5 border border-black
//                     ${activeTab === tab ? 'bg-black text-neo-yellow' : 'bg-neo-offwhite'}`}>
//                     {counts[tab]}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             {/* Questions */}
//             <div className="space-y-3">
//               {filteredQuestions.length === 0 ? (
//                 <div className="border-3 border-black bg-white p-8 text-center">
//                   <Filter className="w-10 h-10 mx-auto mb-3 text-gray-300" />
//                   <p className="font-bold text-gray-500">No {activeTab} questions found</p>
//                 </div>
//               ) : (
//                 filteredQuestions.map((q, i) => {
//                   const realIndex = questions.indexOf(q);
//                   return (
//                     <div key={realIndex} className="flex gap-3">
//                       {/* Mark done checkbox */}
//                       <button
//                         onClick={() => markDone(realIndex)}
//                         className={`flex-shrink-0 w-8 h-8 border-3 border-black mt-3 flex items-center justify-center transition-colors
//                           ${completed.has(realIndex) ? 'bg-neo-green' : 'bg-white hover:bg-neo-offwhite'}`}
//                         title={completed.has(realIndex) ? 'Mark undone' : 'Mark as done'}
//                       >
//                         {completed.has(realIndex)
//                           ? <CheckCircle className="w-4 h-4" />
//                           : <XCircle className="w-4 h-4 text-gray-300" />
//                         }
//                       </button>

//                       <div className={`flex-1 transition-opacity ${completed.has(realIndex) ? 'opacity-50' : ''}`}>
//                         <QuestionCard
//                           q={q}
//                           index={realIndex}
//                           expanded={expandedIndex === realIndex}
//                           onToggle={() => setExpandedIndex(expandedIndex === realIndex ? null : realIndex)}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//             </div>

//             {/* Completion banner */}
//             {progress === 100 && (
//               <div className="mt-6 bg-neo-green border-3 border-black shadow-[5px_5px_0_#000] p-6 text-center">
//                 <Trophy className="w-12 h-12 mx-auto mb-3" />
//                 <h3 className="font-space text-2xl font-extrabold mb-2">SESSION COMPLETE! 🎉</h3>
//                 <p className="font-medium mb-4">You've practised all {questions.length} interview questions. You're ready!</p>
//                 <div className="flex flex-wrap justify-center gap-3">
//                   <button
//                     onClick={() => { setCompleted(new Set()); setExpandedIndex(null); }}
//                     className="neo-button text-sm px-5 py-2 flex items-center gap-2"
//                   >
//                     <RotateCcw className="w-4 h-4" /> Practice Again
//                   </button>
//                   <button
//                     onClick={generateQuestions}
//                     className="neo-button-yellow text-sm px-5 py-2 flex items-center gap-2"
//                   >
//                     <RefreshCw className="w-4 h-4" /> New Questions
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── Empty state ──────────────────────────────────────────── */}
//         {!generating && questions.length === 0 && selectedAnalysis && (
//           <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-12 text-center">
//             <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
//             <h3 className="font-space font-extrabold text-xl mb-2">Ready to Practice?</h3>
//             <p className="text-gray-500 font-medium mb-6 max-w-md mx-auto">
//               Click "Generate Questions" and I'll create tailored interview questions based on every claim in your resume.
//             </p>
//             <button
//               onClick={generateQuestions}
//               className="neo-button-yellow flex items-center gap-2 mx-auto text-sm px-6 py-3"
//             >
//               <Play className="w-4 h-4" /> Generate My Interview Questions
//             </button>
//           </div>
//         )}

//         {generating && (
//           <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-12 text-center">
//             <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-neo-blue" />
//             <h3 className="font-space font-extrabold text-xl mb-2">Generating Questions...</h3>
//             <p className="text-gray-500 font-medium">
//               AI is reading your resume and crafting challenging questions based on your specific experience and skills.
//             </p>
//           </div>
//         )}

//         {/* ── Tips Card ────────────────────────────────────────────── */}
//         {questions.length > 0 && (
//           <div className="bg-white border-3 border-black shadow-[4px_4px_0_#000] p-5">
//             <div className="flex items-center gap-2 mb-4">
//               <Zap className="w-5 h-5 text-neo-yellow" />
//               <h3 className="font-space font-extrabold uppercase text-sm tracking-wide">Interview Tips</h3>
//             </div>
//             <div className="grid md:grid-cols-3 gap-4">
//               {[
//                 { icon: '⏱', title: 'Use the Timer', desc: 'Each question has a 2-min timer — real interviews are time-pressured.' },
//                 { icon: '⭐', title: 'STAR Method', desc: 'Situation, Task, Action, Result. Always anchor to specific examples.' },
//                 { icon: '✅', title: 'Track Progress', desc: 'Mark questions done as you go to track your practice session.' },
//               ].map((tip, i) => (
//                 <div key={i} className="border-2 border-black p-4 bg-neo-offwhite">
//                   <div className="text-2xl mb-2">{tip.icon}</div>
//                   <div className="font-bold text-sm mb-1">{tip.title}</div>
//                   <div className="text-xs text-gray-500 font-medium">{tip.desc}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── Upgrade CTA ──────────────────────────────────────────── */}
//         <div className="bg-black text-white border-3 border-black shadow-[5px_5px_0_#FFE566] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <Crown className="w-8 h-8 text-neo-yellow flex-shrink-0" />
//             <div>
//               <p className="font-space font-extrabold text-lg">Unlock Mock Interview with the Basic Plan</p>
//               <p className="text-gray-400 text-sm">Get unlimited question sets, AI answer feedback, and progress tracking.</p>
//             </div>
//           </div>
//           <Link
//             to="/"
//             className="neo-button-yellow whitespace-nowrap flex-shrink-0 text-sm px-5 py-2"
//           >
//             View Plans →
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }



















import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { resumeAPI, historyAPI } from '../services/api';
import toast from 'react-hot-toast';
import FeaturePageGuard, { LockedActionButton } from '../components/FeaturePageGuard';
import {
  Loader2, FileText, Brain, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Crown, RotateCcw, Mic,
  Upload, Trophy, Star, AlertTriangle, Zap,
  BookOpen, Copy, Check, RefreshCw, Target, Lock,
  Clock, Filter, Play
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────
//  Helpers & constants
// ─────────────────────────────────────────────────────────────────────
const DIFF_META = {
  Hard:   { bg: 'bg-neo-red',    icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  High:   { bg: 'bg-neo-red',    icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  Medium: { bg: 'bg-neo-yellow', icon: <Star className="w-3.5 h-3.5" /> },
  Easy:   { bg: 'bg-neo-green',  icon: <BookOpen className="w-3.5 h-3.5" /> },
  Low:    { bg: 'bg-neo-green',  icon: <BookOpen className="w-3.5 h-3.5" /> },
};

// importance (High/Medium/Low) → display difficulty label
const importanceToDifficulty = (imp) => {
  if (!imp) return 'Medium';
  if (imp === 'High')   return 'Hard';
  if (imp === 'Low')    return 'Easy';
  return 'Medium';
};

const getDiff = (q) => {
  // Use explicit difficulty if present, else derive from importance
  if (q.difficulty && ['Hard','Medium','Easy'].includes(q.difficulty)) return q.difficulty;
  return importanceToDifficulty(q.importance);
};

const TABS = ['All', 'Hard', 'Medium', 'Easy'];

const STAR_TIPS = [
  { letter: 'S', label: 'Situation',  color: 'bg-neo-blue text-white',   tip: 'Set the scene. Briefly describe the context, project, or challenge.' },
  { letter: 'T', label: 'Task',       color: 'bg-neo-purple text-white',  tip: 'What was your specific responsibility or goal in that situation?' },
  { letter: 'A', label: 'Action',     color: 'bg-neo-yellow text-black',  tip: 'Walk through the exact steps you took. Use "I did…" not "We did…".' },
  { letter: 'R', label: 'Result',     color: 'bg-neo-green text-black',   tip: 'Quantify the outcome. Numbers, %, time saved, revenue impact — anything measurable.' },
];

// ─────────────────────────────────────────────────────────────────────
//  Countdown Timer component
// ─────────────────────────────────────────────────────────────────────
const Timer = ({ seconds = 120 }) => {
  const [rem, setRem]       = useState(seconds);
  const [running, setRun]   = useState(false);
  const itvRef              = useRef(null);

  useEffect(() => {
    if (running && rem > 0) {
      itvRef.current = setInterval(() => {
        setRem(r => {
          if (r <= 1) { clearInterval(itvRef.current); setRun(false); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(itvRef.current);
  }, [running]);

  const reset = () => { clearInterval(itvRef.current); setRun(false); setRem(seconds); };
  const pct   = (rem / seconds) * 100;
  const col   = pct > 50 ? '#A8FF78' : pct > 20 ? '#FFE566' : '#FF6B6B';
  const mm    = String(Math.floor(rem / 60)).padStart(2, '0');
  const ss    = String(rem % 60).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <svg width="44" height="44" className="flex-shrink-0">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle cx="22" cy="22" r="18" fill="none" stroke={col} strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 18}`}
          strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
          strokeLinecap="round" transform="rotate(-90 22 22)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
        <text x="22" y="27" textAnchor="middle" fontSize="10" fontWeight="900" fill="#000">
          {mm}:{ss}
        </text>
      </svg>
      <div className="flex gap-1.5">
        <button onClick={() => setRun(v => !v)}
          className={`border-2 border-black px-2.5 py-1 font-bold text-xs transition-colors
            ${running ? 'bg-neo-red' : 'bg-neo-green'}`}>
          {running ? 'Pause' : rem < seconds ? 'Resume' : 'Start'}
        </button>
        <button onClick={reset} className="border-2 border-black p-1 bg-neo-offwhite hover:bg-neo-yellow transition-colors">
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
//  Single Question Card
// ─────────────────────────────────────────────────────────────────────
const QuestionCard = ({ q, globalIndex, expanded, onToggle, done, onMarkDone }) => {
  const [answer, setAnswer]         = useState('');
  const [showGuidance, setGuidance] = useState(false);
  const [copied, setCopied]         = useState(false);

  const diff     = getDiff(q);
  const diffMeta = DIFF_META[diff] || DIFF_META.Medium;
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  const copy = () => {
    navigator.clipboard.writeText(q.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`border-3 border-black shadow-[4px_4px_0_#000] bg-white
      transition-opacity ${done ? 'opacity-40' : ''}`}>

      {/* ── Header row ── */}
      <div className="flex items-start gap-3 px-4 py-4">
        {/* Done toggle */}
        <button onClick={onMarkDone}
          title={done ? 'Mark undone' : 'Mark done'}
          className={`flex-shrink-0 w-7 h-7 border-3 border-black mt-0.5 flex items-center justify-center transition-colors
            ${done ? 'bg-neo-green' : 'bg-white hover:bg-neo-offwhite'}`}>
          {done
            ? <CheckCircle className="w-4 h-4" />
            : <XCircle className="w-4 h-4 text-gray-300" />}
        </button>

        {/* Number + question text */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
          <div className="flex items-start gap-2">
            <span className="font-space font-extrabold text-sm text-gray-300 flex-shrink-0 mt-0.5">
              {String(globalIndex + 1).padStart(2, '0')}
            </span>
            <p className="font-bold text-sm leading-snug">{q.question}</p>
          </div>
          {q.reason && (
            <p className="text-xs text-gray-400 font-medium mt-1 ml-6">
              <span className="font-bold text-gray-500">Why asked:</span> {q.reason}
            </p>
          )}
        </div>

        {/* Difficulty badge + expand toggle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`flex items-center gap-1 px-2 py-0.5 border-2 border-black text-xs font-extrabold ${diffMeta.bg}`}>
            {diffMeta.icon} {diff}
          </span>
          <button onClick={onToggle}
            className="border-2 border-black p-1 bg-neo-offwhite hover:bg-neo-yellow transition-colors">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className="border-t-3 border-black px-4 py-4 space-y-4">

          {/* Timer + copy row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">2-min answer timer</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer seconds={120} />
              <button onClick={copy}
                className="border-2 border-black px-2.5 py-1.5 text-xs font-bold bg-neo-offwhite hover:bg-neo-yellow transition-colors flex items-center gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Q'}
              </button>
            </div>
          </div>

          {/* Practice answer textarea */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mb-2">
              <Mic className="w-3.5 h-3.5" /> Your Practice Answer
            </label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here. Try to use the STAR method — Situation, Task, Action, Result..."
              rows={4}
              className="w-full border-3 border-black p-3 text-sm font-medium resize-none focus:outline-none focus:bg-neo-yellow/10 transition-colors"
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400 font-medium">
                Aim for 150–250 words in a real interview
              </span>
              <span className={`text-xs font-bold ${wordCount > 0 ? (wordCount < 50 ? 'text-neo-red' : wordCount <= 250 ? 'text-neo-green' : 'text-neo-yellow') : 'text-gray-300'}`}>
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Answer guidance toggle */}
          <button onClick={() => setGuidance(v => !v)}
            className={`w-full text-left text-xs font-bold border-2 border-black px-4 py-2.5 flex items-center justify-between transition-colors
              ${showGuidance ? 'bg-neo-yellow' : 'bg-neo-offwhite hover:bg-neo-yellow'}`}>
            <span className="flex items-center gap-2"><Brain className="w-3.5 h-3.5" /> Show Answer Guidance</span>
            {showGuidance ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showGuidance && (
            <div className="border-3 border-black p-4 bg-neo-yellow/20 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide">Use the STAR Method:</p>
              <div className="grid grid-cols-2 gap-2">
                {STAR_TIPS.map(({ letter, label, color, tip }) => (
                  <div key={letter} className={`border-2 border-black p-3 ${color}`}>
                    <div className="font-space font-extrabold text-lg leading-none">{letter}</div>
                    <div className="font-bold text-xs uppercase mt-0.5">{label}</div>
                    <div className="text-xs mt-1 opacity-80 font-medium">{tip}</div>
                  </div>
                ))}
              </div>
              {q.reason && (
                <div className="border-2 border-black p-3 bg-white">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" /> What the interviewer is testing
                  </p>
                  <p className="text-sm font-medium text-gray-700">{q.reason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
//  Resume Selector dropdown
// ─────────────────────────────────────────────────────────────────────
const ResumeSelector = ({ history, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between border-3 border-black bg-neo-offwhite px-4 py-3 font-bold hover:bg-neo-yellow transition-colors text-sm">
        <span className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {selected
              ? `${selected.fileName} — ${selected.targetDomain?.replace('-', ' ')} (Score: ${selected.score})`
              : 'Choose an analysed resume…'}
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-30 bg-white border-3 border-black shadow-[5px_5px_0_#000] max-h-60 overflow-y-auto">
          {history.map(item => (
            <button key={item._id} onClick={() => { onSelect(item); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-black/10 last:border-b-0 hover:bg-neo-yellow transition-colors">
              <div>
                <div className="font-bold text-sm">{item.fileName}</div>
                <div className="text-xs text-gray-500">
                  {item.targetDomain?.replace('-', ' ')} &bull; {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className={`px-2 py-1 border-2 border-black text-xs font-extrabold flex-shrink-0 ml-3
                ${item.score >= 80 ? 'bg-neo-green' : item.score >= 60 ? 'bg-neo-yellow' : 'bg-neo-red'}`}>
                {item.score}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────────────────────────────
export const MockInterviewPage = () => {
  // ── Data state ────────────────────────────────────────────────────
  const [history, setHistory]           = useState([]);
  const [loadingHistory, setLoadHist]   = useState(true);
  const [selected, setSelected]         = useState(null);   // history item
  const [loadingAnalysis, setLoadAna]   = useState(false);
  const [analysis, setAnalysis]         = useState(null);   // full analysis doc

  // ── Questions state ───────────────────────────────────────────────
  const [questions, setQuestions]       = useState([]);     // always from analysis.interview_questions
  const [activeTab, setActiveTab]       = useState('All');
  const [expandedIdx, setExpandedIdx]   = useState(null);
  const [completed, setCompleted]       = useState(new Set());

  // ── Dedicated generator (paid section) ────────────────────────────
  const [genLoading, setGenLoading]     = useState(false);
  const [genRole, setGenRole]           = useState('');
  const [genFocus, setGenFocus]         = useState('mixed');
  const [genQuestions, setGenQuestions] = useState([]);
  const [genExpanded, setGenExpanded]   = useState(null);
  const [genCompleted, setGenCompleted] = useState(new Set());
  const [showGenerator, setShowGen]     = useState(false);

  // ── Load history on mount ─────────────────────────────────────────
  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await historyAPI.getHistory();
      setHistory(res.data || []);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoadHist(false);
    }
  };

  // ── When user picks a resume: fetch its full analysis ─────────────
  const handleSelect = async (item) => {
    setSelected(item);
    setAnalysis(null);
    setQuestions([]);
    setCompleted(new Set());
    setExpandedIdx(null);
    setActiveTab('All');
    setGenQuestions([]);
    setGenCompleted(new Set());

    setLoadAna(true);
    try {
      const res = await resumeAPI.getAnalysis(
        item.analysisId?._id || item.analysisId
      );
      const data = res.data;
      setAnalysis(data);

      // Pull interview_questions that were generated during resume upload — NO extra API call
      const qs = (data.interview_questions || []).map(q => ({
        ...q,
        // derive a displayable difficulty from importance field
        difficulty: (() => {
          if (q.importance === 'High')   return 'Hard';
          if (q.importance === 'Low')    return 'Easy';
          return 'Medium';
        })(),
      }));
      setQuestions(qs);

      if (qs.length === 0) {
        toast('No questions found in this analysis. Re-analyse your resume to generate questions.', { icon: 'ℹ️' });
      } else {
        toast.success(`${qs.length} interview questions loaded!`);
      }
    } catch (err) {
      toast.error('Failed to load analysis data');
      console.error(err);
    } finally {
      setLoadAna(false);
    }
  };

  // ── Dedicated generator — calls /resume/interview-questions ───────
  const runDedicatedGenerator = async () => {
    if (!analysis?.resumeText) {
      toast.error('Please select and load a resume first');
      return;
    }
    const role = genRole.trim() || selected?.targetDomain || 'general';
    setGenLoading(true);
    setGenQuestions([]);
    setGenCompleted(new Set());
    setGenExpanded(null);

    try {
      const res = await resumeAPI.generateInterviewQuestions({
        resumeText: analysis.resumeText,
        targetDomain: role,
        focusArea: genFocus,
      });
      const raw = res.data?.questions || [];
      const normalized = raw.map(q => ({
        ...q,
        difficulty: (() => {
          if (q.importance === 'High') return 'Hard';
          if (q.importance === 'Low')  return 'Easy';
          return 'Medium';
        })(),
      }));
      setGenQuestions(normalized);
      toast.success(`Generated ${normalized.length} fresh questions!`);
    } catch (err) {
      toast.error('Failed to generate questions. Please try again.');
      console.error(err);
    } finally {
      setGenLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const markDone = (idx, isGen = false) => {
    const setter = isGen ? setGenCompleted : setCompleted;
    setter(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const filteredQuestions = (qs, tab) =>
    tab === 'All' ? qs : qs.filter(q => getDiff(q) === tab);

  const counts = (qs) => ({
    All:    qs.length,
    Hard:   qs.filter(q => getDiff(q) === 'Hard').length,
    Medium: qs.filter(q => getDiff(q) === 'Medium').length,
    Easy:   qs.filter(q => getDiff(q) === 'Easy').length,
  });

  const progress = (qs, done) =>
    qs.length > 0 ? Math.round((done.size / qs.length) * 100) : 0;

  const visible   = filteredQuestions(questions, activeTab);
  const qCounts   = counts(questions);
  const pct       = progress(questions, completed);

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neo-offwhite">
       <FeaturePageGuard action="interview_questions" />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-neo-yellow border-3 border-black shadow-[4px_4px_0_#000] flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="font-space text-3xl font-extrabold uppercase tracking-tight">Mock Interview</h1>
              <p className="text-gray-500 font-medium text-sm">
                Questions generated from your actual resume — no guessing needed
              </p>
            </div>
          </div>
        </div>

        {/* ── Step 1: Resume selector ──────────────────────────────── */}
        <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-neo-yellow border-3 border-black flex items-center justify-center font-space font-extrabold text-sm">1</div>
            <h2 className="font-space font-extrabold uppercase text-sm tracking-wide">Select a Resume</h2>
          </div>

          {loadingHistory ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Loading your resumes…</span>
            </div>
          ) : history.length === 0 ? (
            <div className="border-3 border-dashed border-black p-8 text-center">
              <Upload className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-bold mb-1">No analysed resumes yet</p>
              <p className="text-sm text-gray-500 mb-4">Upload and analyse a resume first — questions are generated automatically.</p>
              <Link to="/dashboard" className="neo-button-yellow inline-flex items-center gap-2 text-sm px-5 py-2">
                <Target className="w-4 h-4" /> Go to Dashboard
              </Link>
            </div>
          ) : (
            <ResumeSelector history={history} selected={selected} onSelect={handleSelect} />
          )}

          {loadingAnalysis && (
            <div className="mt-3 flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Loading interview questions…</span>
            </div>
          )}
        </div>

        {/* ── Step 2: Questions from analysis (free) ───────────────── */}
        {questions.length > 0 && (
          <div className="space-y-4">

            {/* Section heading */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-neo-yellow border-3 border-black flex items-center justify-center font-space font-extrabold text-sm">2</div>
                <div>
                  <h2 className="font-space font-extrabold uppercase text-sm tracking-wide">
                    Your Interview Questions
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Generated during resume analysis · {questions.length} questions total
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold border-2 border-black px-3 py-1 bg-neo-green">
                FREE — Included with every analysis
              </span>
            </div>

            {/* Progress bar */}
            <div className="bg-white border-3 border-black shadow-[4px_4px_0_#000] px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-neo-yellow" />
                  <span className="font-space font-extrabold uppercase text-xs tracking-wide">Session Progress</span>
                </div>
                <span className="font-extrabold text-sm">{completed.size} / {questions.length} done</span>
              </div>
              <div className="w-full h-4 border-3 border-black bg-neo-offwhite mb-3">
                <div className="h-full bg-neo-green transition-all duration-300" style={{ width: `${pct}%` }} />
              </div>
              {/* Difficulty counts */}
              <div className="grid grid-cols-3 gap-2">
                {['Hard','Medium','Easy'].map(d => (
                  <div key={d} className={`border-3 border-black p-3 text-center ${DIFF_META[d].bg}`}>
                    <div className="font-space font-extrabold text-2xl leading-none">{qCounts[d]}</div>
                    <div className="font-bold text-xs uppercase mt-0.5">{d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex border-3 border-black overflow-hidden w-fit shadow-[3px_3px_0_#000]">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-bold text-xs uppercase tracking-wide border-r-3 border-black last:border-r-0 transition-colors
                    ${activeTab === tab ? 'bg-neo-yellow' : 'bg-white hover:bg-neo-offwhite'}`}>
                  {tab}
                  <span className={`ml-1.5 text-xs font-extrabold px-1.5 py-0.5 border border-black
                    ${activeTab === tab ? 'bg-black text-neo-yellow' : 'bg-neo-offwhite'}`}>
                    {qCounts[tab]}
                  </span>
                </button>
              ))}
            </div>

            {/* Question cards */}
            <div className="space-y-3">
              {visible.length === 0 ? (
                <div className="border-3 border-black bg-white p-8 text-center">
                  <Filter className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="font-bold text-gray-400">No {activeTab} questions in this analysis</p>
                </div>
              ) : (
                visible.map((q) => {
                  const gi = questions.indexOf(q); // global index
                  return (
                    <QuestionCard
                      key={gi}
                      q={q}
                      globalIndex={gi}
                      expanded={expandedIdx === gi}
                      onToggle={() => setExpandedIdx(expandedIdx === gi ? null : gi)}
                      done={completed.has(gi)}
                      onMarkDone={() => markDone(gi)}
                    />
                  );
                })
              )}
            </div>

            {/* Completion banner */}
            {pct === 100 && (
              <div className="bg-neo-green border-3 border-black shadow-[5px_5px_0_#000] p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3" />
                <h3 className="font-space text-2xl font-extrabold mb-2">SESSION COMPLETE! 🎉</h3>
                <p className="font-medium mb-4">
                  You've practised all {questions.length} questions. You're ready to interview!
                </p>
                <button
                  onClick={() => { setCompleted(new Set()); setExpandedIdx(null); }}
                  className="neo-button text-sm px-5 py-2 inline-flex items-center gap-2 mr-3">
                  <RotateCcw className="w-4 h-4" /> Practice Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty state — resume selected but no questions in analysis */}
        {!loadingAnalysis && selected && analysis && questions.length === 0 && (
          <div className="bg-white border-3 border-black shadow-[5px_5px_0_#000] p-10 text-center">
            <Brain className="w-14 h-14 mx-auto mb-4 text-gray-200" />
            <h3 className="font-space font-extrabold text-xl mb-2">No Questions in This Analysis</h3>
            <p className="text-gray-500 font-medium mb-6 max-w-md mx-auto">
              This analysis was saved before the interview questions feature was added.
              Re-analyse your resume to get a fresh set of tailored questions.
            </p>
            <Link to="/dashboard" className="neo-button-yellow inline-flex items-center gap-2 text-sm px-5 py-2">
              <RefreshCw className="w-4 h-4" /> Re-analyse Resume
            </Link>
          </div>
        )}

        {/* ── Step 3: Dedicated Generator ──────────────────────────── */}
        {selected && analysis && (
          <div className="border-3 border-black shadow-[5px_5px_0_#000] overflow-hidden">

            {/* Header — toggle accordion */}
            <button
              onClick={() => setShowGen(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 bg-black text-white hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-neo-yellow text-black border-2 border-white flex items-center justify-center font-space font-extrabold text-sm">3</div>
                <div className="text-left">
                  <div className="font-space font-extrabold uppercase tracking-wide flex items-center gap-2">
                    Dedicated Question Generator
                    <span className="text-[10px] font-extrabold bg-neo-yellow text-black px-2 py-0.5 border border-white">
                      PREMIUM
                    </span>
                  </div>
                  <div className="text-gray-400 text-xs font-medium mt-0.5">
                    Generate a fresh, targeted set for any role or focus area
                  </div>
                </div>
              </div>
              {showGenerator ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>

            {showGenerator && (
              <div className="bg-white p-5 space-y-5">

                {/* Config form */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wide mb-2">
                      Target Role / Domain
                    </label>
                    <input
                      type="text"
                      value={genRole}
                      onChange={e => setGenRole(e.target.value)}
                      placeholder={`e.g. ${selected?.targetDomain?.replace('-',' ') || 'Software Engineer'}`}
                      className="w-full border-3 border-black px-4 py-3 text-sm font-bold focus:outline-none focus:bg-neo-yellow/10 transition-colors"
                    />
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      Leave blank to use the domain from your analysis
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-xs uppercase tracking-wide mb-2">
                      Question Focus
                    </label>
                    <select
                      value={genFocus}
                      onChange={e => setGenFocus(e.target.value)}
                      className="w-full border-3 border-black px-4 py-3 text-sm font-bold focus:outline-none bg-white cursor-pointer"
                    >
                      <option value="mixed">Mixed (Technical + Behavioural)</option>
                      <option value="technical">Technical Only</option>
                      <option value="behavioural">Behavioural Only</option>
                      <option value="situational">Situational / Case-study</option>
                    </select>
                  </div>
                </div>

                <LockedActionButton
                  action="interview_questions"
                  onClick={runDedicatedGenerator}
                  disabled={genLoading}
                  className={`neo-button w-full flex items-center justify-center gap-2 text-sm py-3
                    ${genLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {genLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Questions…</>
                    : genQuestions.length > 0
                      ? <><RefreshCw className="w-4 h-4" /> Regenerate Questions</>
                      : <><Play className="w-4 h-4" /> Generate Fresh Questions</>
                  }
                </LockedActionButton>

                {/* Generated questions */}
                {genLoading && (
                  <div className="border-3 border-black p-8 text-center bg-neo-offwhite">
                    <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin text-neo-blue" />
                    <p className="font-bold">Generating targeted questions…</p>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                      AI is reading your resume and crafting questions based on your actual experience
                    </p>
                  </div>
                )}

                {!genLoading && genQuestions.length > 0 && (
                  <div className="space-y-3">
                    {/* Mini progress */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wide">
                        {genQuestions.length} questions generated
                      </span>
                      <span className="text-xs font-bold text-gray-500">
                        {genCompleted.size} / {genQuestions.length} practised
                      </span>
                    </div>
                    <div className="w-full h-3 border-2 border-black bg-neo-offwhite">
                      <div
                        className="h-full bg-neo-blue transition-all duration-300"
                        style={{ width: `${progress(genQuestions, genCompleted)}%` }}
                      />
                    </div>

                    {genQuestions.map((q, i) => (
                      <QuestionCard
                        key={i}
                        q={q}
                        globalIndex={i}
                        expanded={genExpanded === i}
                        onToggle={() => setGenExpanded(genExpanded === i ? null : i)}
                        done={genCompleted.has(i)}
                        onMarkDone={() => markDone(i, true)}
                      />
                    ))}

                    {progress(genQuestions, genCompleted) === 100 && (
                      <div className="bg-neo-blue text-white border-3 border-black p-5 text-center">
                        <Trophy className="w-10 h-10 mx-auto mb-2" />
                        <p className="font-space font-extrabold text-lg">All done! Great practice session.</p>
                        <button
                          onClick={() => { setGenCompleted(new Set()); setGenExpanded(null); }}
                          className="mt-3 border-3 border-white px-4 py-2 font-bold text-sm hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> Practice Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Interview Tips ────────────────────────────────────────── */}
        {questions.length > 0 && (
          <div className="bg-white border-3 border-black shadow-[4px_4px_0_#000] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-neo-yellow" />
              <h3 className="font-space font-extrabold uppercase text-sm tracking-wide">Interview Tips</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: '⏱', title: 'Use the Timer', desc: '2 minutes per answer simulates real interview pressure. Start the timer before you begin.' },
                { icon: '⭐', title: 'STAR Method', desc: 'Every behavioural answer needs Situation → Task → Action → Result. Vague answers get rejected.' },
                { icon: '📊', title: 'Use Numbers', desc: 'Quantify everything. "Improved performance by 40%" beats "improved performance" every time.' },
              ].map((t, i) => (
                <div key={i} className="border-2 border-black p-4 bg-neo-offwhite">
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="font-bold text-sm mb-1">{t.title}</div>
                  <div className="text-xs text-gray-500 font-medium leading-relaxed">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};