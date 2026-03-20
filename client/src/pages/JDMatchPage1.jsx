// // import { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { resumeAPI, historyAPI } from '../services/api';
// // import toast from 'react-hot-toast';
// // import { 
// //   ArrowLeft, Loader2, Target, CheckCircle, 
// //   XCircle, FileText, Send, Home, Upload,
// //   BarChart3, AlertTriangle, Zap, Brain,
// //   BookOpen, Award, TrendingUp, AlertCircle,
// //   ChevronDown, ChevronUp, Briefcase, Code,
// //   Clock, Layers, Star, Filter
// // } from 'lucide-react';

// // const domains = [
// //   { id: 'software-engineer', name: 'Software Engineer', icon: '💻' },
// //   { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
// //   { id: 'marketing', name: 'Marketing', icon: '📢' },
// //   { id: 'product-manager', name: 'Product Manager', icon: '📦' },
// //   { id: 'design', name: 'Design', icon: '🎨' },
// //   { id: 'sales', name: 'Sales', icon: '💰' },
// //   { id: 'other', name: 'Other', icon: '✏️' },
// // ];

// // export const JDMatchPage = () => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [history, setHistory] = useState([]);
// //   const [file, setFile] = useState(null);
// //   const [formData, setFormData] = useState({
// //     jobDescription: '',
// //     targetDomain: 'software-engineer'
// //   });

// //   useEffect(() => {
// //     fetchHistory();
// //   }, []);

// //   const fetchHistory = async () => {
// //     try {
// //       const response = await historyAPI.getHistory();
// //       setHistory(response.data);
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

// //     // Upload and analyze new resume
// //     setLoading(true);
// //     try {
// //       const formDataUpload = new FormData();
// //       formDataUpload.append('file', file);
// //       formDataUpload.append('targetDomain', formData.targetDomain);
      
// //       const uploadResponse = await resumeAPI.uploadAndAnalyze(formDataUpload);
// //       resumeText = uploadResponse.data.resumeText;
      
// //       // Refresh history
// //       fetchHistory();
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed to upload and analyze resume');
// //       setLoading(false);
// //       return;
// //     }

// //     if (!formData.jobDescription.trim()) {
// //       toast.error('Please paste the job description');
// //       setLoading(false);
// //       return;
// //     }

// //     try {
// //       const response = await resumeAPI.matchWithJD({
// //         resumeText: resumeText,
// //         jobDescription: formData.jobDescription,
// //         targetDomain: formData.targetDomain
// //       });
// //       setResult(response.data);
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || 'Failed to match resume with JD');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getMatchColor = (percentage) => {
// //     if (percentage >= 80) return 'text-neo-green';
// //     if (percentage >= 60) return 'text-neo-yellow';
// //     return 'text-neo-red';
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
// //             <div className="w-16 h-16 bg-neo-blue border-3 border-black flex items-center justify-center">
// //               <Target className="w-8 h-8" />
// //             </div>
// //             <div>
// //               <h1 className="font-space text-3xl font-extrabold">JD MATCH</h1>
// //               <p className="text-gray-500">Check how well your resume matches a job description</p>
// //             </div>
// //           </div>

// //           <form onSubmit={handleSubmit} className="space-y-6">
// //             {/* Target Domain */}
// //             <div>
// //               <label className="font-bold mb-3 block">Target Domain</label>
// //               <div className="flex flex-wrap gap-3">
// //                 {domains.map((domain) => (
// //                   <button
// //                     key={domain.id}
// //                     type="button"
// //                     onClick={() => setFormData({ ...formData, targetDomain: domain.id })}
// //                     className={`px-4 py-2 border-3 border-black font-bold transition-all ${
// //                       formData.targetDomain === domain.id 
// //                         ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]' 
// //                         : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'
// //                     }`}
// //                   >
// //                     {domain.icon} {domain.name}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

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

// //             {/* Job Description */}
// //             <div>
// //               <label className="font-bold mb-3 block">Job Description</label>
// //               <textarea
// //                 value={formData.jobDescription}
// //                 onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
// //                 placeholder="Paste the job description here..."
// //                 rows={10}
// //                 className="w-full border-3 border-black p-4 font-bold focus:outline-none focus:shadow-neo resize-none"
// //               />
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
// //                   Analyzing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Send className="w-5 h-5" />
// //                   MATCH RESUME WITH JD
// //                 </>
// //               )}
// //             </button>
// //           </form>
// //         </div>

// //         {/* Results */}
// //         {result && (
// //           <div className="neo-card p-8">
// //             <h2 className="font-space text-2xl font-extrabold mb-6">MATCH RESULTS</h2>

// //             {/* Score Cards */}
// //             <div className="grid grid-cols-2 gap-6 mb-8">
// //               <div className="border-3 border-black p-6 text-center">
// //                 <div className={`text-6xl font-space font-extrabold ${getMatchColor(result.match_percentage)}`}>
// //                   {result.match_percentage}%
// //                 </div>
// //                 <div className="font-bold mt-2">Match Percentage</div>
// //               </div>
// //               <div className="border-3 border-black p-6 text-center">
// //                 <div className={`text-6xl font-space font-extrabold ${getMatchColor(result.role_fit_score)}`}>
// //                   {result.role_fit_score}%
// //                 </div>
// //                 <div className="font-bold mt-2">Role Fit Score</div>
// //               </div>
// //             </div>

// //             {/* Matched Keywords */}
// //             <div className="mb-6">
// //               <h3 className="font-space text-xl font-extrabold mb-4 flex items-center gap-2">
// //                 <CheckCircle className="w-6 h-6 text-neo-green" />
// //                 MATCHED KEYWORDS
// //               </h3>
// //               <div className="flex flex-wrap gap-3">
// //                 {result.matched_keywords?.map((keyword, index) => (
// //                   <span key={index} className="neo-badge">{keyword}</span>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Missing Keywords */}
// //             <div className="mb-6">
// //               <h3 className="font-space text-xl font-extrabold mb-4 flex items-center gap-2">
// //                 <XCircle className="w-6 h-6 text-neo-red" />
// //                 MISSING KEYWORDS
// //               </h3>
// //               <div className="flex flex-wrap gap-3">
// //                 {result.missing_keywords?.map((keyword, index) => (
// //                   <span key={index} className="neo-badge-red">{keyword}</span>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Skill Gaps */}
// //             <div className="mb-6">
// //               <h3 className="font-space text-xl font-extrabold mb-4">SKILL GAPS</h3>
// //               <div className="space-y-3">
// //                 {result.skill_gaps?.map((gap, index) => (
// //                   <div key={index} className="flex items-start gap-3 border-3 border-black p-4">
// //                     <XCircle className="w-5 h-5 text-neo-red flex-shrink-0 mt-1" />
// //                     <span className="font-bold">{gap}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Recommendations */}
// //             <div>
// //               <h3 className="font-space text-xl font-extrabold mb-4">RECOMMENDATIONS</h3>
// //               <div className="space-y-3">
// //                 {result.recommendations?.map((rec, index) => (
// //                   <div key={index} className="flex items-start gap-3 border-3 border-black p-4 bg-neo-green/20">
// //                     <CheckCircle className="w-5 h-5 text-neo-green flex-shrink-0 mt-1" />
// //                     <span className="font-bold">{rec}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //         )}
// //           {result.detailed?.jdAnalysis && (
// //             <div className="mt-8 border-t-3 border-black pt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <Brain className="w-7 h-7 text-neo-blue" />
// //                 EXECUTIVE SUMMARY
// //               </h3>
// //               <div className="border-3 border-black p-6 bg-gradient-to-r from-neo-blue/10 to-neo-yellow/10">
// //                 <p className="text-lg font-bold">{result.reasoning}</p>
// //                 <div className="mt-4 flex items-center gap-3">
// //                   <span className="font-bold">Should Apply:</span>
// //                   <span className={`neo-badge ${result.should_apply ? 'bg-neo-green text-white' : 'bg-neo-red text-white'}`}>
// //                     {result.should_apply ? 'YES - Apply!' : 'NO - Not Recommended'}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Score Breakdown */}
// //           {result.detailed?.scoreBreakdown && (
// //             <div className="mt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <BarChart3 className="w-7 h-7 text-neo-blue" />
// //                 SCORE BREAKDOWN
// //               </h3>
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
// //                 <div className="border-3 border-black p-4 text-center">
// //                   <div className="text-3xl font-space font-extrabold text-neo-blue">
// //                     {result.detailed.scoreBreakdown.technicalSkillsScore || 0}/40
// //                   </div>
// //                   <div className="text-sm font-bold mt-1">Technical Skills</div>
// //                 </div>
// //                 <div className="border-3 border-black p-4 text-center">
// //                   <div className="text-3xl font-space font-extrabold text-neo-green">
// //                     {result.detailed.scoreBreakdown.experienceLevelScore || 0}/25
// //                   </div>
// //                   <div className="text-sm font-bold mt-1">Experience</div>
// //                 </div>
// //                 <div className="border-3 border-black p-4 text-center">
// //                   <div className="text-3xl font-space font-extrabold text-neo-yellow">
// //                     {result.detailed.scoreBreakdown.keywordDensityScore || 0}/20
// //                   </div>
// //                   <div className="text-sm font-bold mt-1">Keywords</div>
// //                 </div>
// //                 <div className="border-3 border-black p-4 text-center">
// //                   <div className="text-3xl font-space font-extrabold text-neo-purple">
// //                     {result.detailed.scoreBreakdown.domainKnowledgeScore || 0}/15
// //                   </div>
// //                   <div className="text-sm font-bold mt-1">Domain Knowledge</div>
// //                 </div>
// //               </div>
// //               {result.detailed.scoreBreakdown.breakdown_explanation && (
// //                 <p className="text-gray-600 font-bold border-3 border-black p-3">
// //                   💡 {result.detailed.scoreBreakdown.breakdown_explanation}
// //                 </p>
// //               )}
// //             </div>
// //           )}

// //           {/* JD Analysis */}
// //           {result.detailed?.jdAnalysis && (
// //             <div className="mt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <Briefcase className="w-7 h-7 text-neo-blue" />
// //                 JOB DESCRIPTION ANALYSIS
// //               </h3>
// //               <div className="grid md:grid-cols-2 gap-6">
// //                 {/* Seniority & Tech Stack */}
// //                 <div className="border-3 border-black p-5">
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <TrendingUp className="w-5 h-5" />
// //                     Seniority Level
// //                   </h4>
// //                   <span className="neo-badge text-lg">{result.detailed.jdAnalysis.seniorityLevel || 'Not specified'}</span>
                  
// //                   <h4 className="font-bold text-lg mt-4 mb-3 flex items-center gap-2">
// //                     <Code className="w-5 h-5" />
// //                     Primary Tech Stack
// //                   </h4>
// //                   <div className="flex flex-wrap gap-2">
// //                     {result.detailed.jdAnalysis.primaryTechStack?.map((tech, i) => (
// //                       <span key={i} className="neo-badge">{tech}</span>
// //                     )) || <span className="text-gray-500">Not specified</span>}
// //                   </div>
                  
// //                   <h4 className="font-bold text-lg mt-4 mb-3 flex items-center gap-2">
// //                     <Layers className="w-5 h-5" />
// //                     Secondary Tech Stack
// //                   </h4>
// //                   <div className="flex flex-wrap gap-2">
// //                     {result.detailed.jdAnalysis.secondaryTechStack?.map((tech, i) => (
// //                       <span key={i} className="neo-badge-yellow">{tech}</span>
// //                     )) || <span className="text-gray-500">None</span>}
// //                   </div>
// //                 </div>

// //                 {/* Requirements */}
// //                 <div className="border-3 border-black p-5">
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <Star className="w-5 h-5 text-neo-red" />
// //                     Must-Have Requirements
// //                   </h4>
// //                   <ul className="space-y-2 mb-4">
// //                     {result.detailed.jdAnalysis.mustHaveRequirements?.map((req, i) => (
// //                       <li key={i} className="flex items-start gap-2">
// //                         <XCircle className="w-4 h-4 text-neo-red mt-1 flex-shrink-0" />
// //                         <span className="font-bold">{req}</span>
// //                       </li>
// //                     )) || <span className="text-gray-500">None specified</span>}
// //                   </ul>
                  
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <Filter className="w-5 h-5 text-neo-yellow" />
// //                     Nice-to-Have Requirements
// //                   </h4>
// //                   <ul className="space-y-2 mb-4">
// //                     {result.detailed.jdAnalysis.niceToHaveRequirements?.map((req, i) => (
// //                       <li key={i} className="flex items-start gap-2">
// //                         <CheckCircle className="w-4 h-4 text-neo-yellow mt-1 flex-shrink-0" />
// //                         <span>{req}</span>
// //                       </li>
// //                     )) || <span className="text-gray-500">None specified</span>}
// //                   </ul>

// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <Clock className="w-5 h-5 text-neo-purple" />
// //                     Experience Required
// //                   </h4>
// //                   <span className="bg-neo-purple text-black">{result.detailed.jdAnalysis.estimatedYearsRequired || 'Not specified'}</span>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Skill Gap Analysis */}
// //           {result.detailed?.skillGapAnalysis && (
// //             <div className="mt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <Zap className="w-7 h-7 text-neo-yellow" />
// //                 SKILL GAP ANALYSIS
// //               </h3>
              
// //               {/* Perfect Matches */}
// //               {result.detailed.skillGapAnalysis.perfectMatches?.length > 0 && (
// //                 <div className="mb-6">
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <CheckCircle className="w-5 h-5 text-neo-green" />
// //                     Perfect Matches ✅
// //                   </h4>
// //                   <div className="space-y-2">
// //                     {result.detailed.skillGapAnalysis.perfectMatches.map((match, i) => (
// //                       <div key={i} className="border-3 border-black p-3 bg-neo-green/10 flex justify-between items-center">
// //                         <div>
// //                           <span className="font-bold text-lg">{match.skill}</span>
// //                           <p className="text-sm text-gray-600">{match.resumeEvidence}</p>
// //                         </div>
// //                         <span className="neo-badge-green">{match.confidenceLevel}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Partial Matches */}
// //               {result.detailed.skillGapAnalysis.partialMatches?.length > 0 && (
// //                 <div className="mb-6">
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <AlertCircle className="w-5 h-5 text-neo-yellow" />
// //                     Partial Matches ⚠️
// //                   </h4>
// //                   <div className="space-y-2">
// //                     {result.detailed.skillGapAnalysis.partialMatches.map((match, i) => (
// //                       <div key={i} className="border-3 border-black p-3 bg-neo-yellow/10">
// //                         <div className="flex justify-between items-start">
// //                           <span className="font-bold text-lg">{match.skill}</span>
// //                           <span className={`neo-badge ${
// //                             match.severity === 'Major' ? 'bg-neo-red text-white' : 
// //                             match.severity === 'Moderate' ? 'bg-neo-yellow text-black' : 'bg-gray-300'
// //                           }`}>{match.severity}</span>
// //                         </div>
// //                         <p className="text-sm mt-1"><strong>JD Needs:</strong> {match.jdRequirement}</p>
// //                         <p className="text-sm"><strong>Resume Has:</strong> {match.resumeEvidence}</p>
// //                         <p className="text-sm text-neo-red"><strong>Gap:</strong> {match.gap}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Critical Missing */}
// //               {result.detailed.skillGapAnalysis.criticalMissing?.length > 0 && (
// //                 <div className="mb-6">
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <XCircle className="w-5 h-5 text-neo-red" />
// //                     Critical Missing Skills 🚨
// //                   </h4>
// //                   <div className="space-y-2">
// //                     {result.detailed.skillGapAnalysis.criticalMissing.map((skill, i) => (
// //                       <div key={i} className="border-3 border-neo-red p-4 bg-neo-red/10">
// //                         <div className="flex justify-between items-start mb-2">
// //                           <span className="font-bold text-lg text-neo-red">{skill.skill}</span>
// //                           <span className={`neo-badge ${
// //                             skill.priority === 'P0 (dealbreaker)' ? 'bg-neo-red text-white' : 
// //                             skill.priority === 'P1 (important)' ? 'bg-neo-yellow text-black' : 'bg-gray-300'
// //                           }`}>{skill.priority}</span>
// //                         </div>
// //                         <p className="text-sm"><strong>Why it matters:</strong> {skill.whyItMatters}</p>
// //                         <p className="text-sm text-neo-green mt-1"><strong>How to fix:</strong> {skill.howToFix}</p>
// //                         <p className="text-sm text-gray-500 mt-1"><Clock className="w-4 h-4 inline" /> {skill.timeToLearn}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Bonus Skills */}
// //               {result.detailed.skillGapAnalysis.bonusSkills?.length > 0 && (
// //                 <div className="mb-6">
// //                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
// //                     <Award className="w-5 h-5 text-neo-purple" />
// //                     Bonus Skills 🌟 (You have these, JD doesn't require)
// //                   </h4>
// //                   <div className="flex flex-wrap gap-2">
// //                     {result.detailed.skillGapAnalysis.bonusSkills.map((skill, i) => (
// //                       <div key={i} className="border-3 border-neo-purple p-2 bg-neo-purple/20">
// //                         <span className="font-bold">{skill.skill}</span>
// //                         <p className="text-xs text-gray-600">{skill.relevance}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Keyword Audit */}
// //           {result.detailed?.keywordAudit && (
// //             <div className="mt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <BookOpen className="w-7 h-7 text-neo-blue" />
// //                 KEYWORD AUDIT
// //               </h3>
              
// //               <div className="grid grid-cols-3 gap-4 mb-6">
// //                 <div className="border-3 border-black p-4 text-center bg-neo-green/20">
// //                   <div className="text-3xl font-space font-extrabold text-neo-green">
// //                     {result.detailed.keywordAudit.matchedCount || 0}
// //                   </div>
// //                   <div className="font-bold">Matched</div>
// //                 </div>
// //                 <div className="border-3 border-black p-4 text-center bg-neo-red/20">
// //                   <div className="text-3xl font-space font-extrabold text-neo-red">
// //                     {result.detailed.keywordAudit.missingCount || 0}
// //                   </div>
// //                   <div className="font-bold">Missing</div>
// //                 </div>
// //                 <div className="border-3 border-black p-4 text-center bg-neo-blue/20">
// //                   <div className="text-3xl font-space font-extrabold text-neo-blue">
// //                     {result.detailed.keywordAudit.atsPredictedPassRate || 0}%
// //                   </div>
// //                   <div className="font-bold">ATS Pass Rate</div>
// //                 </div>
// //               </div>

// //               <div className="border-3 border-black p-4">
// //                 <h4 className="font-bold text-lg mb-3">Keyword Details</h4>
// //                 <div className="space-y-2 max-h-96 overflow-y-auto">
// //                   {result.detailed.keywordAudit.keywordDetails?.map((kw, i) => (
// //                     <div key={i} className={`flex items-center justify-between p-2 border-b ${
// //                       kw.status === 'FOUND' ? 'bg-neo-green/10' : 
// //                       kw.status === 'MISSING' ? 'bg-neo-red/10' : 'bg-neo-yellow/10'
// //                     }`}>
// //                       <span className="font-bold">{kw.keyword}</span>
// //                       <div className="flex items-center gap-3">
// //                         <span className={`text-xs ${
// //                           kw.importance === 'Critical' ? 'text-neo-red font-bold' :
// //                           kw.importance === 'Important' ? 'text-neo-yellow font-bold' : 'text-gray-500'
// //                         }`}>{kw.importance}</span>
// //                         <span className={`neo-badge ${
// //                           kw.status === 'FOUND' ? 'bg-neo-green text-white' :
// //                           kw.status === 'MISSING' ? 'bg-neo-red text-white' : 'bg-neo-yellow text-black'
// //                         }`}>{kw.status}</span>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Experience Analysis */}
// //           {result.detailed?.experienceAnalysis && (
// //             <div className="mt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <TrendingUp className="w-7 h-7 text-neo-blue" />
// //                 EXPERIENCE ANALYSIS
// //               </h3>
// //               <div className="border-3 border-black p-5">
// //                 <div className="grid md:grid-cols-2 gap-4 mb-4">
// //                   <div className="p-3 bg-neo-blue/10">
// //                     <span className="font-bold">Required:</span> {result.detailed.experienceAnalysis.requiredYears}
// //                   </div>
// //                   <div className="p-3 bg-neo-green/10">
// //                     <span className="font-bold">Your Experience:</span> {result.detailed.experienceAnalysis.estimatedResumeYears}
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-3 mb-4">
// //                   <span className="font-bold">Alignment:</span>
// //                   <span className={`neo-badge ${
// //                     result.detailed.experienceAnalysis.alignmentStatus === 'Well-matched' ? 'bg-neo-green text-white' :
// //                     result.detailed.experienceAnalysis.alignmentStatus === 'Under-qualified' ? 'bg-neo-red text-white' : 'bg-neo-yellow text-black'
// //                   }`}>{result.detailed.experienceAnalysis.alignmentStatus}</span>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <p><strong>Seniority Gap:</strong> {result.detailed.experienceAnalysis.seniorityGap}</p>
// //                   <p><strong>Project Complexity:</strong> {result.detailed.experienceAnalysis.projectComplexityMatch}</p>
// //                   <p><strong>Domain Relevance:</strong> {result.detailed.experienceAnalysis.domainRelevance}</p>
// //                   <p><strong>Leadership Required Met:</strong> {result.detailed.experienceAnalysis.leadershipRequiredMet ? '✅ Yes' : '❌ No'}</p>
// //                   <p className="mt-2 text-gray-600">{result.detailed.experienceAnalysis.details}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* Red Flags */}
// //           {result.detailed?.redFlags?.length > 0 && (
// //             <div className="mt-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <AlertTriangle className="w-7 h-7 text-neo-red" />
// //                 RED FLAGS ⚠️
// //               </h3>
// //               <div className="space-y-3">
// //                 {result.detailed.redFlags.map((flag, i) => (
// //                   <div key={i} className={`border-3 p-4 ${
// //                     flag.severity === 'Dealbreaker' ? 'border-neo-red bg-neo-red/20' :
// //                     flag.severity === 'Major' ? 'border-orange-500 bg-orange-100' : 'border-neo-yellow bg-neo-yellow/20'
// //                   }`}>
// //                     <div className="flex justify-between items-start mb-2">
// //                       <span className="font-bold text-lg">{flag.flag}</span>
// //                       <span className={`neo-badge ${
// //                         flag.severity === 'Dealbreaker' ? 'bg-neo-red text-white' :
// //                         flag.severity === 'Major' ? 'bg-orange-500 text-white' : 'bg-neo-yellow text-black'
// //                       }`}>{flag.severity}</span>
// //                     </div>
// //                     <p className="text-sm text-gray-600">{flag.impact}</p>
// //                     {flag.fix && (
// //                       <p className="text-sm text-neo-green mt-1">💡 Fix: {flag.fix}</p>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Resume Improvements */}
// //           {result.detailed?.resumeImprovementsForThisJD?.length > 0 && (
// //             <div className="mt-8 mb-8">
// //               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
// //                 <FileText className="w-7 h-7 text-neo-green" />
// //                 RESUME IMPROVEMENTS FOR THIS JD ✍️
// //               </h3>
// //               <div className="space-y-4">
// //                 {result.detailed.resumeImprovementsForThisJD.map((improvement, i) => (
// //                   <div key={i} className="border-3 border-black p-5">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <span className="neo-badge">{improvement.section}</span>
// //                       <span className={`neo-badge ${
// //                         improvement.priority === 'High' ? 'bg-neo-red text-white' :
// //                         improvement.priority === 'Medium' ? 'bg-neo-yellow text-black' : 'bg-gray-300'
// //                       }`}>{improvement.priority} Priority</span>
// //                     </div>
// //                     <p className="font-bold mb-2">Issue: {improvement.issue}</p>
// //                     {improvement.currentState && (
// //                       <p className="text-sm text-gray-500 mb-2">📍 Current: {improvement.currentState}</p>
// //                     )}
// //                     <div className="bg-neo-green/20 p-3 border-2 border-neo-green">
// //                       <p className="font-bold text-neo-green">✅ Recommended: {improvement.recommendedChange}</p>
// //                     </div>
// //                     <p className="text-sm text-gray-600 mt-2">💡 {improvement.reasoning}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //     </div>
// //   );
// // };















// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft, Loader2, Target, CheckCircle,
//   XCircle, FileText, Send, Home, Upload,
//   BarChart3, AlertTriangle, Zap, Brain,
//   BookOpen, Award, TrendingUp, AlertCircle,
//   Briefcase, Code, Clock, Layers, Star,
//   Filter, X, RefreshCw
// } from 'lucide-react';

// // ─── Domain options ───────────────────────────────────────────────
// const DOMAINS = [
//   { id: 'software-engineer', name: 'Software Engineer', emoji: '💻' },
//   { id: 'data-scientist',    name: 'Data Scientist',    emoji: '📊' },
//   { id: 'marketing',         name: 'Marketing',         emoji: '📢' },
//   { id: 'product-manager',   name: 'Product Manager',   emoji: '📦' },
//   { id: 'design',            name: 'Design',            emoji: '🎨' },
//   { id: 'sales',             name: 'Sales',             emoji: '💰' },
//   { id: 'other',             name: 'Other',             emoji: '✏️' },
// ];

// // ─── Reusable primitives ─────────────────────────────────────────

// const ScoreChip = ({ value, label, max = 100, large = false }) => {
//   const n   = Number(value) || 0;
//   const pct = max === 100 ? n : Math.round((n / max) * 100);
//   const bg  = pct >= 80 ? '#A8FF78' : pct >= 60 ? '#FFE566' : '#FF6B6B';
//   const fs  = large ? 52 : 28;
//   const pad = large ? '16px 24px' : '10px 14px';
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div style={{
//         background: bg, border: '3px solid #000',
//         boxShadow: '4px 4px 0 #000', padding: pad,
//         fontWeight: 900, fontSize: fs, color: '#000',
//         display: 'inline-block', lineHeight: 1,
//       }}>
//         {value}{max !== 100 ? `/${max}` : ''}
//       </div>
//       {label && (
//         <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6,
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
//     padding: small ? '2px 8px' : '5px 12px',
//     fontSize: small ? 11 : 12, fontWeight: 700,
//     display: 'inline-block', lineHeight: 1.4,
//   }}>
//     {text}
//   </span>
// );

// const SectionTitle = ({ icon: Icon, title, color = '#74B9FF' }) => (
//   <div style={{
//     background: color, border: '3px solid #000',
//     borderBottom: 'none', padding: '12px 20px',
//     display: 'flex', alignItems: 'center', gap: 10,
//     fontWeight: 900, fontSize: 16, textTransform: 'uppercase',
//   }}>
//     {Icon && <Icon size={20} />}
//     {title}
//   </div>
// );

// const Card = ({ children, bg = '#fff', color = '#000' }) => (
//   <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                 marginBottom: 24, background: bg, color }}>
//     {children}
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════
// export const JDMatchPage = () => {
//   const [loading, setLoading]   = useState(false);
//   const [result,  setResult]    = useState(null);  // full parsed object
//   const [file,    setFile]      = useState(null);
//   const [formData, setFormData] = useState({
//     jobDescription: '',
//     targetDomain:   'software-engineer',
//   });
//   const resultRef = useRef(null);

//   // file validation
//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('PDF only');  return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');   return; }
//     setFile(f);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)                           { toast.error('Upload your resume PDF'); return; }
//     if (!formData.jobDescription.trim()) { toast.error('Paste the job description'); return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       // Step 1 — upload + analyse to extract resumeText
//       const fd = new FormData();
//       fd.append('file', file);
//       fd.append('targetDomain', formData.targetDomain);
//       const uploadRes  = await resumeAPI.uploadAndAnalyze(fd);
//       const resumeText = uploadRes.data?.resumeText
//         || uploadRes.data?.analysis?.resumeText
//         || '';

//       if (!resumeText) throw new Error('Could not extract text from PDF. Try a different file.');

//       // Step 2 — JD match
//       const matchRes = await resumeAPI.matchWithJD({
//         resumeText,
//         jobDescription: formData.jobDescription,
//         targetDomain:   formData.targetDomain,
//       });

//       // Backend returns { result (JSON string), parsed (object), modelUsed }
//       // OR the old groqService format: { match_percentage, role_fit_score, ... }
//       const data   = matchRes.data;
//       const parsed = data?.parsed
//         || (data?.result ? (() => {
//           try { return JSON.parse(data.result); } catch { return null; }
//         })() : null)
//         || data;  // fallback: data itself might be the flat object

//       if (!parsed) throw new Error('Empty response from server. Please retry.');

//       setResult(parsed);
//       toast.success('JD match complete!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Match failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Helper: read from both new (parsed) and legacy (flat) structures ──
//   // New backend: parsed.matchScore, parsed.scoreBreakdown, parsed.jdAnalysis, etc.
//   // Legacy backend: result.match_percentage, result.role_fit_score, etc.
//   const get = {
//     matchScore:     () => result?.matchScore        ?? result?.match_percentage ?? 0,
//     roleFit:        () => result?.rolefit           ?? result?.role_fit_score   ?? 0,
//     shouldApply:    () => result?.shouldApply       ?? result?.should_apply     ?? false,
//     confidence:     () => result?.applicationConfidence ?? null,
//     hiringProb:     () => result?.hiringProbability ?? null,
//     matchedSkills:  () => result?.matchedSkills     || result?.matched_keywords  || [],
//     missingSkills:  () => result?.missingSkills     || result?.missing_keywords  || [],
//     suggestions:    () => result?.suggestions       || result?.recommendations   || [],
//     skillGaps:      () => result?.skillGapAnalysis  || null,
//     // flat skill_gaps array from legacy
//     skillGapsFlat:  () => result?.skill_gaps        || [],
//     scoreBreakdown: () => result?.scoreBreakdown    || null,
//     jdAnalysis:     () => result?.jdAnalysis        || null,
//     keywordAudit:   () => result?.keywordAudit      || null,
//     expAnalysis:    () => result?.experienceAnalysis || null,
//     redFlags:       () => result?.redFlags          || [],
//     improvements:   () => result?.resumeImprovementsForThisJD || [],
//     tailored:       () => result?.tailoredResumeChanges || null,
//     overview:       () => result?.overview          || null,
//     summary:        () => result?.overview?.oneLineSummary
//                           || result?.overview?.recruiterPerspective
//                           || result?.reasoning || '',
//   };

//   // ── Score color util ──
//   const scoreColor = (n) => {
//     const v = Number(n) || 0;
//     return v >= 80 ? '#A8FF78' : v >= 60 ? '#FFE566' : '#FF6B6B';
//   };

//   // ══════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-neo-offwhite">

//       {/* ── NAVBAR ── */}
//       <nav className="bg-white border-b-3 border-black sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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

//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#74B9FF',
//                           border: '3px solid #000',
//                           display: 'flex', alignItems: 'center',
//                           justifyContent: 'center' }}>
//               <Target size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">JD MATCH</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>
//                 Deep ATS analysis · Skill gap detection · Recruiter perspective
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Domain selector */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Target Domain
//               </label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                 {DOMAINS.map(d => (
//                   <button key={d.id} type="button"
//                     onClick={() => setFormData({ ...formData, targetDomain: d.id })}
//                     style={{
//                       background: formData.targetDomain === d.id ? '#FFE566' : '#fff',
//                       border: '3px solid #000', padding: '8px 16px',
//                       fontWeight: 800, cursor: 'pointer', fontSize: 13,
//                       boxShadow: formData.targetDomain === d.id
//                         ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                       transform: formData.targetDomain === d.id
//                         ? 'translate(2px,2px)' : 'none',
//                       transition: 'all 0.1s',
//                     }}>
//                     {d.emoji} {d.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* PDF upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div
//                 onDrop={handleDrop} onDragOver={e => e.preventDefault()}
//                 style={{
//                   border: '3px dashed #000',
//                   background: file ? '#A8FF78' : '#F5F0E8',
//                   padding: 28, textAlign: 'center', transition: 'background 0.2s',
//                 }}>
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={26} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ fontSize: 12, color: '#555' }}>
//                       ({(file.size / 1024).toFixed(0)} KB)
//                     </span>
//                     <button type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000',
//                                padding: '2px 8px', cursor: 'pointer', fontWeight: 900 }}>
//                       <X size={13} />
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
//                              onChange={handleFileChange} />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888',
//                                 fontWeight: 600 }}>
//                       PDF only · Max 5MB
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* JD textarea */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Job Description <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <textarea
//                 value={formData.jobDescription}
//                 onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
//                 placeholder="Paste the full job description here..."
//                 rows={10}
//                 style={{ width: '100%', border: '3px solid #000',
//                          padding: '12px 16px', fontWeight: 600, fontSize: 14,
//                          outline: 'none', resize: 'vertical',
//                          boxSizing: 'border-box', fontFamily: 'inherit' }} />
//             </div>

//             {/* Submit */}
//             <button type="submit" disabled={loading || !file}
//               style={{
//                 width: '100%',
//                 background: loading || !file ? '#ccc' : '#000',
//                 color: '#fff', border: '3px solid #000',
//                 boxShadow: loading || !file ? 'none' : '5px 5px 0 #74B9FF',
//                 padding: 16, fontWeight: 900, fontSize: 16,
//                 cursor: loading || !file ? 'not-allowed' : 'pointer',
//                 textTransform: 'uppercase', letterSpacing: 1,
//                 display: 'flex', alignItems: 'center',
//                 justifyContent: 'center', gap: 10,
//               }}>
//               {loading
//                 ? <><Loader2 size={20} className="animate-spin" /> Analysing match...</>
//                 : <><Send size={20} /> Match Resume With JD</>}
//             </button>
//           </form>
//         </div>

//         {/* ════════════════════════════════════════════════════════
//             ALL RESULTS — single guard block, no null crash
//         ════════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* ── TOP SCORES ── */}
//             <div style={{ background: '#000', color: '#fff',
//                           border: '3px solid #000',
//                           boxShadow: '7px 7px 0 #74B9FF',
//                           padding: '24px 28px' }}>

//               {/* Verdict */}
//               {get.overview() && (
//                 <div style={{ marginBottom: 20 }}>
//                   <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
//                                 textTransform: 'uppercase', marginBottom: 8 }}>
//                     Verdict
//                   </div>
//                   <span style={{
//                     background: scoreColor(get.matchScore()),
//                     border: '3px solid #fff',
//                     padding: '8px 18px', fontWeight: 900, fontSize: 14,
//                     textTransform: 'uppercase', color: '#000',
//                     display: 'inline-block',
//                   }}>
//                     {get.overview()?.verdict || (get.matchScore() >= 75
//                       ? 'GOOD MATCH' : get.matchScore() >= 55
//                       ? 'PARTIAL MATCH' : 'WEAK MATCH')}
//                   </span>
//                 </div>
//               )}

//               {/* Score chips */}
//               <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap',
//                             alignItems: 'flex-end', marginBottom: 20 }}>
//                 <ScoreChip value={get.matchScore()} label="Match Score" large />
//                 {get.roleFit() > 0 && (
//                   <ScoreChip value={get.roleFit()} label="Role Fit" large />
//                 )}
//                 {get.confidence() && (
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{
//                       background: '#1a1a1a', border: '2px solid #444',
//                       padding: '14px 18px', fontWeight: 900,
//                       fontSize: 16, color: '#FFE566',
//                     }}>
//                       {get.confidence()}
//                     </div>
//                     <div style={{ fontSize: 10, color: '#aaa', marginTop: 4,
//                                   fontWeight: 700, textTransform: 'uppercase' }}>
//                       Confidence
//                     </div>
//                   </div>
//                 )}
//                 {get.hiringProb() && (
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{
//                       background: '#1a1a1a', border: '2px solid #444',
//                       padding: '14px 18px', fontWeight: 900,
//                       fontSize: 16, color: '#A8FF78',
//                     }}>
//                       {get.hiringProb()}
//                     </div>
//                     <div style={{ fontSize: 10, color: '#aaa', marginTop: 4,
//                                   fontWeight: 700, textTransform: 'uppercase' }}>
//                       Hiring Probability
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Should apply */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12,
//                             marginBottom: 16 }}>
//                 <span style={{ fontWeight: 700, color: '#aaa', fontSize: 13 }}>
//                   Should Apply:
//                 </span>
//                 <span style={{
//                   background: get.shouldApply() ? '#A8FF78' : '#FF6B6B',
//                   border: '2px solid #fff', padding: '4px 14px',
//                   fontWeight: 900, fontSize: 14, color: '#000',
//                 }}>
//                   {get.shouldApply() ? '✅ YES — Apply!' : '❌ NOT RECOMMENDED'}
//                 </span>
//               </div>

//               {/* One-line summary */}
//               {get.summary() && (
//                 <div style={{ background: '#1a1a1a', border: '2px solid #444',
//                               padding: '10px 14px', fontSize: 13,
//                               fontStyle: 'italic', color: '#ddd' }}>
//                   "{get.summary()}"
//                 </div>
//               )}
//             </div>

//             {/* ── SCORE BREAKDOWN (new backend) ── */}
//             {get.scoreBreakdown() && (
//               <Card>
//                 <SectionTitle icon={BarChart3} title="Score Breakdown" color="#74B9FF" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))',
//                                 gap: 12, marginBottom: 14 }}>
//                     {[
//                       { label: 'Technical',  value: get.scoreBreakdown().technicalSkillsScore,  max: 40 },
//                       { label: 'Experience', value: get.scoreBreakdown().experienceLevelScore,  max: 25 },
//                       { label: 'Keywords',   value: get.scoreBreakdown().keywordDensityScore,   max: 20 },
//                       { label: 'Domain',     value: get.scoreBreakdown().domainKnowledgeScore,  max: 15 },
//                     ].map(item => (
//                       <ScoreChip key={item.label} value={item.value || 0}
//                                  label={item.label} max={item.max} />
//                     ))}
//                   </div>
//                   {get.scoreBreakdown().breakdown_explanation && (
//                     <div style={{ background: '#FFF9E6', border: '2px solid #000',
//                                   padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
//                       💡 {get.scoreBreakdown().breakdown_explanation}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── MATCHED + MISSING KEYWORDS ── */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               {get.matchedSkills().length > 0 && (
//                 <Card bg="#F0FFF0">
//                   <SectionTitle icon={CheckCircle} title="Matched Keywords" color="#A8FF78" />
//                   <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {get.matchedSkills().map((kw, i) => (
//                       <Tag key={i} text={kw} bg="#A8FF78" />
//                     ))}
//                   </div>
//                 </Card>
//               )}
//               {get.missingSkills().length > 0 && (
//                 <Card bg="#FFF0F0">
//                   <SectionTitle icon={XCircle} title="Missing Keywords" color="#FF6B6B" />
//                   <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {get.missingSkills().map((kw, i) => (
//                       <Tag key={i} text={kw} bg="#FF6B6B" />
//                     ))}
//                   </div>
//                 </Card>
//               )}
//             </div>

//             {/* ── JD ANALYSIS ── */}
//             {get.jdAnalysis() && (
//               <Card>
//                 <SectionTitle icon={Briefcase} title="Job Description Analysis" color="#FFE566" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                     {/* Left col */}
//                     <div>
//                       <div style={{ fontWeight: 800, marginBottom: 8,
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <TrendingUp size={15} /> Seniority Level
//                       </div>
//                       <Tag text={get.jdAnalysis().seniorityLevel || 'Not specified'}
//                            bg="#FFE566" />

//                       <div style={{ fontWeight: 800, margin: '16px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Clock size={15} /> Experience Required
//                       </div>
//                       <Tag text={get.jdAnalysis().estimatedYearsRequired || 'Not specified'}
//                            bg="#E8F4FF" />

//                       <div style={{ fontWeight: 800, margin: '16px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Code size={15} /> Primary Tech Stack
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {(get.jdAnalysis().primaryTechStack || []).map((t, i) => (
//                           <Tag key={i} text={t} bg="#74B9FF" small />
//                         ))}
//                       </div>

//                       <div style={{ fontWeight: 800, margin: '16px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Layers size={15} /> Secondary Stack
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {(get.jdAnalysis().secondaryTechStack || []).map((t, i) => (
//                           <Tag key={i} text={t} bg="#F5F0E8" small />
//                         ))}
//                       </div>
//                     </div>

//                     {/* Right col */}
//                     <div>
//                       <div style={{ fontWeight: 800, marginBottom: 8,
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Star size={15} color="#c00" /> Must-Have Requirements
//                       </div>
//                       <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//                         {(get.jdAnalysis().mustHaveRequirements || []).map((r, i) => (
//                           <li key={i} style={{ display: 'flex', gap: 6,
//                                                marginBottom: 6, fontSize: 13,
//                                                fontWeight: 600, alignItems: 'flex-start' }}>
//                             <XCircle size={13} style={{ color: '#c00', flexShrink: 0,
//                                                          marginTop: 2 }} />
//                             {r}
//                           </li>
//                         ))}
//                       </ul>

//                       <div style={{ fontWeight: 800, margin: '14px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Filter size={15} color="#B45309" /> Nice-to-Have
//                       </div>
//                       <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//                         {(get.jdAnalysis().niceToHaveRequirements || []).map((r, i) => (
//                           <li key={i} style={{ display: 'flex', gap: 6,
//                                                marginBottom: 6, fontSize: 13,
//                                                fontWeight: 600, alignItems: 'flex-start' }}>
//                             <CheckCircle size={13} style={{ color: '#B45309',
//                                                              flexShrink: 0, marginTop: 2 }} />
//                             {r}
//                           </li>
//                         ))}
//                       </ul>

//                       {get.jdAnalysis().hiddenRequirements?.length > 0 && (
//                         <>
//                           <div style={{ fontWeight: 800, margin: '14px 0 8px',
//                                         fontSize: 12, textTransform: 'uppercase' }}>
//                             Hidden Requirements
//                           </div>
//                           {get.jdAnalysis().hiddenRequirements.map((r, i) => (
//                             <div key={i} style={{ fontSize: 12, fontWeight: 600,
//                                                   color: '#555', marginBottom: 4 }}>
//                               → {r}
//                             </div>
//                           ))}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* ── SKILL GAP ANALYSIS (new backend object) ── */}
//             {get.skillGaps() && (
//               <Card>
//                 <SectionTitle icon={Zap} title="Skill Gap Analysis" color="#FFE566" />
//                 <div style={{ padding: 20 }}>

//                   {/* Perfect matches */}
//                   {get.skillGaps().perfectMatches?.length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6 }}>
//                         <CheckCircle size={16} style={{ color: '#2a7a2a' }} />
//                         Perfect Matches ({get.skillGaps().perfectMatches.length})
//                       </div>
//                       {get.skillGaps().perfectMatches.map((m, i) => (
//                         <div key={i} style={{
//                           border: '2px solid #000', padding: '10px 14px',
//                           marginBottom: 8, background: '#F0FFF0',
//                           display: 'flex', justifyContent: 'space-between',
//                           alignItems: 'flex-start', gap: 12,
//                         }}>
//                           <div>
//                             <div style={{ fontWeight: 800 }}>{m.skill}</div>
//                             {m.resumeEvidence && (
//                               <div style={{ fontSize: 12, color: '#555',
//                                             fontWeight: 600, marginTop: 3 }}>
//                                 {m.resumeEvidence}
//                               </div>
//                             )}
//                           </div>
//                           {m.confidenceLevel && (
//                             <Tag text={m.confidenceLevel} bg="#A8FF78" small />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Partial matches */}
//                   {get.skillGaps().partialMatches?.length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6 }}>
//                         <AlertCircle size={16} style={{ color: '#B45309' }} />
//                         Partial Matches ({get.skillGaps().partialMatches.length})
//                       </div>
//                       {get.skillGaps().partialMatches.map((m, i) => (
//                         <div key={i} style={{
//                           border: '2px solid #000', padding: '12px 14px',
//                           marginBottom: 8, background: '#FFF9E6',
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between',
//                                         marginBottom: 6 }}>
//                             <span style={{ fontWeight: 800 }}>{m.skill}</span>
//                             {m.severity && (
//                               <Tag text={m.severity}
//                                    bg={m.severity === 'Major' ? '#FF6B6B'
//                                      : m.severity === 'Moderate' ? '#FFE566' : '#F5F0E8'}
//                                    small />
//                             )}
//                           </div>
//                           {m.jdRequirement && (
//                             <div style={{ fontSize: 12, fontWeight: 600 }}>
//                               JD needs: {m.jdRequirement}
//                             </div>
//                           )}
//                           {m.resumeEvidence && (
//                             <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                               Resume has: {m.resumeEvidence}
//                             </div>
//                           )}
//                           {m.gap && (
//                             <div style={{ fontSize: 12, color: '#c00',
//                                           fontWeight: 700, marginTop: 4 }}>
//                               Gap: {m.gap}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Critical missing */}
//                   {get.skillGaps().criticalMissing?.length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6, color: '#c00' }}>
//                         <XCircle size={16} />
//                         Critical Missing ({get.skillGaps().criticalMissing.length})
//                       </div>
//                       {get.skillGaps().criticalMissing.map((s, i) => (
//                         <div key={i} style={{
//                           border: '3px solid #FF6B6B', padding: '12px 14px',
//                           marginBottom: 8, background: '#FFF0F0',
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between',
//                                         marginBottom: 8 }}>
//                             <span style={{ fontWeight: 800, color: '#c00' }}>
//                               {s.skill}
//                             </span>
//                             {s.priority && (
//                               <Tag text={s.priority}
//                                    bg={s.priority?.includes('P0') ? '#FF6B6B'
//                                      : s.priority?.includes('P1') ? '#FFE566' : '#F5F0E8'}
//                                    small />
//                             )}
//                           </div>
//                           {s.whyItMatters && (
//                             <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                               Why: {s.whyItMatters}
//                             </div>
//                           )}
//                           {s.howToFix && (
//                             <div style={{ fontSize: 12, fontWeight: 700,
//                                           color: '#2a7a2a', marginBottom: 4 }}>
//                               Fix: {s.howToFix}
//                             </div>
//                           )}
//                           {s.timeToLearn && (
//                             <div style={{ fontSize: 12, color: '#666',
//                                           display: 'flex', alignItems: 'center', gap: 4 }}>
//                               <Clock size={12} /> {s.timeToLearn}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Bonus skills */}
//                   {get.skillGaps().bonusSkills?.length > 0 && (
//                     <div>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6 }}>
//                         <Award size={16} style={{ color: '#7B2D8B' }} />
//                         Bonus Skills (you have these, JD doesn't require)
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                         {get.skillGaps().bonusSkills.map((s, i) => (
//                           <div key={i} style={{ border: '2px solid #000',
//                                                 padding: '8px 12px',
//                                                 background: '#F8F4FF' }}>
//                             <div style={{ fontWeight: 800, fontSize: 13 }}>{s.skill}</div>
//                             {s.relevance && (
//                               <div style={{ fontSize: 11, color: '#555',
//                                             fontWeight: 600, marginTop: 2 }}>
//                                 {s.relevance}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── SKILL GAPS (legacy flat array) ── */}
//             {!get.skillGaps() && get.skillGapsFlat().length > 0 && (
//               <Card>
//                 <SectionTitle icon={Zap} title="Skill Gaps" color="#FFE566" />
//                 <div style={{ padding: 20 }}>
//                   {get.skillGapsFlat().map((gap, i) => (
//                     <div key={i} style={{ display: 'flex', gap: 8,
//                                           marginBottom: 8, alignItems: 'flex-start' }}>
//                       <XCircle size={15} style={{ color: '#c00', flexShrink: 0,
//                                                    marginTop: 2 }} />
//                       <span style={{ fontWeight: 600, fontSize: 13 }}>{gap}</span>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── KEYWORD AUDIT ── */}
//             {get.keywordAudit() && (
//               <Card>
//                 <SectionTitle icon={BookOpen} title="Keyword Audit" color="#A8FF78" />
//                 <div style={{ padding: 20 }}>
//                   {/* Stats */}
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: 'repeat(3,1fr)',
//                                 gap: 12, marginBottom: 16 }}>
//                     {[
//                       { label: 'Matched', val: get.keywordAudit().matchedCount, bg: '#A8FF78' },
//                       { label: 'Missing', val: get.keywordAudit().missingCount,  bg: '#FF6B6B' },
//                       { label: 'ATS Pass %', val: `${get.keywordAudit().atsPredictedPassRate || 0}%`,
//                         bg: '#74B9FF' },
//                     ].map(s => (
//                       <div key={s.label} style={{
//                         border: '2px solid #000', padding: '12px 16px',
//                         textAlign: 'center', background: s.bg,
//                       }}>
//                         <div style={{ fontWeight: 900, fontSize: 28 }}>{s.val}</div>
//                         <div style={{ fontWeight: 700, fontSize: 11,
//                                       textTransform: 'uppercase', marginTop: 2 }}>
//                           {s.label}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Keyword table */}
//                   {get.keywordAudit().keywordDetails?.length > 0 && (
//                     <div style={{ border: '2px solid #000', maxHeight: 360,
//                                   overflowY: 'auto' }}>
//                       {get.keywordAudit().keywordDetails.map((kw, i) => (
//                         <div key={i} style={{
//                           display: 'flex', alignItems: 'center',
//                           justifyContent: 'space-between', padding: '8px 12px',
//                           borderBottom: '1px solid #ddd',
//                           background: kw.status === 'FOUND'   ? '#F0FFF0'
//                                     : kw.status === 'MISSING' ? '#FFF0F0' : '#FFF9E6',
//                         }}>
//                           <span style={{ fontWeight: 700, fontSize: 13 }}>
//                             {kw.keyword}
//                           </span>
//                           <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                             {kw.importance && (
//                               <span style={{
//                                 fontSize: 11, fontWeight: 700,
//                                 color: kw.importance === 'Critical' ? '#c00'
//                                      : kw.importance === 'Important' ? '#B45309' : '#666',
//                               }}>
//                                 {kw.importance}
//                               </span>
//                             )}
//                             <Tag text={kw.status}
//                                  bg={kw.status === 'FOUND'   ? '#A8FF78'
//                                    : kw.status === 'MISSING' ? '#FF6B6B' : '#FFE566'}
//                                  small />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── EXPERIENCE ANALYSIS ── */}
//             {get.expAnalysis() && (
//               <Card>
//                 <SectionTitle icon={TrendingUp} title="Experience Analysis" color="#74B9FF" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: '1fr 1fr', gap: 12,
//                                 marginBottom: 14 }}>
//                     <div style={{ border: '2px solid #000', padding: 12,
//                                   background: '#E8F4FF' }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 4 }}>
//                         Required
//                       </div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>
//                         {get.expAnalysis().requiredYears || 'N/A'}
//                       </div>
//                     </div>
//                     <div style={{ border: '2px solid #000', padding: 12,
//                                   background: '#F0FFF0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 4 }}>
//                         Your Experience
//                       </div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>
//                         {get.expAnalysis().estimatedResumeYears || 'N/A'}
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', gap: 10, marginBottom: 14,
//                                 flexWrap: 'wrap' }}>
//                     {get.expAnalysis().alignmentStatus && (
//                       <Tag text={get.expAnalysis().alignmentStatus}
//                            bg={get.expAnalysis().alignmentStatus === 'Well-matched' ? '#A8FF78'
//                              : get.expAnalysis().alignmentStatus === 'Under-qualified' ? '#FF6B6B' : '#FFE566'} />
//                     )}
//                     {get.expAnalysis().domainRelevance && (
//                       <Tag text={get.expAnalysis().domainRelevance} bg="#E8F4FF" />
//                     )}
//                     {get.expAnalysis().projectComplexityMatch && (
//                       <Tag text={`Project complexity: ${get.expAnalysis().projectComplexityMatch}`}
//                            bg="#F5F0E8" small />
//                     )}
//                   </div>

//                   {get.expAnalysis().seniorityGap && (
//                     <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
//                       <span style={{ fontWeight: 800 }}>Seniority: </span>
//                       {get.expAnalysis().seniorityGap}
//                     </div>
//                   )}
//                   <div style={{ display: 'flex', gap: 8, alignItems: 'center',
//                                 marginBottom: 10 }}>
//                     <span style={{ fontWeight: 800, fontSize: 13 }}>Leadership required:</span>
//                     <span style={{ fontWeight: 700, fontSize: 13 }}>
//                       {get.expAnalysis().leadershipRequiredMet ? '✅ Met' : '❌ Not met'}
//                     </span>
//                   </div>
//                   {get.expAnalysis().details && (
//                     <div style={{ background: '#F5F0E8', border: '2px solid #000',
//                                   padding: '10px 14px', fontSize: 13,
//                                   fontWeight: 600, lineHeight: 1.7 }}>
//                       {get.expAnalysis().details}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── RED FLAGS ── */}
//             {get.redFlags().length > 0 && (
//               <Card>
//                 <SectionTitle icon={AlertTriangle} title="Red Flags ⚠️" color="#FF6B6B" />
//                 <div style={{ padding: 20 }}>
//                   {get.redFlags().map((flag, i) => (
//                     <div key={i} style={{
//                       border: `3px solid ${
//                         flag.severity === 'Dealbreaker' ? '#FF6B6B'
//                         : flag.severity === 'Major' ? '#FFA07A' : '#FFE566'
//                       }`,
//                       padding: '12px 14px', marginBottom: 10,
//                       background: flag.severity === 'Dealbreaker' ? '#FFF0F0'
//                                 : flag.severity === 'Major' ? '#FFF5EE' : '#FFF9E6',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between',
//                                     marginBottom: 6 }}>
//                         <span style={{ fontWeight: 800, fontSize: 14 }}>{flag.flag}</span>
//                         <Tag text={flag.severity}
//                              bg={flag.severity === 'Dealbreaker' ? '#FF6B6B'
//                                : flag.severity === 'Major' ? '#FFA07A' : '#FFE566'}
//                              small />
//                       </div>
//                       {flag.impact && (
//                         <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                           {flag.impact}
//                         </div>
//                       )}
//                       {flag.fix && (
//                         <div style={{ fontSize: 12, fontWeight: 700, color: '#2a7a2a',
//                                       marginTop: 6 }}>
//                           💡 Fix: {flag.fix}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── RESUME IMPROVEMENTS FOR THIS JD ── */}
//             {get.improvements().length > 0 && (
//               <Card>
//                 <SectionTitle icon={FileText} title="Resume Improvements for This JD"
//                               color="#A8FF78" />
//                 <div style={{ padding: 20 }}>
//                   {get.improvements().map((imp, i) => (
//                     <div key={i} style={{ border: '3px solid #000', padding: 16,
//                                           marginBottom: 14 }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between',
//                                     marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
//                         <Tag text={imp.section} bg="#E8F4FF" />
//                         <Tag text={`${imp.priority} Priority`}
//                              bg={imp.priority === 'High' ? '#FF6B6B'
//                                : imp.priority === 'Medium' ? '#FFE566' : '#F5F0E8'} small />
//                       </div>
//                       <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>
//                         Issue: {imp.issue}
//                       </div>
//                       {imp.currentState && (
//                         <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
//                           📍 Current: {imp.currentState}
//                         </div>
//                       )}
//                       <div style={{ background: '#F0FFF0', border: '2px solid #000',
//                                     padding: '10px 12px', marginBottom: 8 }}>
//                         <div style={{ fontWeight: 800, fontSize: 12,
//                                       textTransform: 'uppercase',
//                                       marginBottom: 4, color: '#2a7a2a' }}>
//                           Recommended Change
//                         </div>
//                         <p style={{ fontSize: 13, fontWeight: 700 }}>
//                           {imp.recommendedChange}
//                         </p>
//                       </div>
//                       {imp.reasoning && (
//                         <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                           💡 {imp.reasoning}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── TAILORED RESUME CHANGES ── */}
//             {get.tailored() && (
//               <Card>
//                 <SectionTitle icon={Zap} title="Quick Resume Tailoring Tips"
//                               color="#DDA0DD" />
//                 <div style={{ padding: 20 }}>
//                   {get.tailored().summaryRewrite && (
//                     <div style={{ marginBottom: 14 }}>
//                       <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                         Rewrite your summary as:
//                       </div>
//                       <div style={{ background: '#FFF9E6', border: '2px solid #000',
//                                     padding: '10px 14px', fontSize: 13, fontWeight: 600,
//                                     fontStyle: 'italic' }}>
//                         {get.tailored().summaryRewrite}
//                       </div>
//                     </div>
//                   )}
//                   {get.tailored().skillsToAdd?.length > 0 && (
//                     <div style={{ marginBottom: 14 }}>
//                       <div style={{ fontWeight: 800, marginBottom: 8 }}>
//                         Add to your Skills section:
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {get.tailored().skillsToAdd.map((s, i) => (
//                           <Tag key={i} text={s} bg="#A8FF78" small />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {get.tailored().skillsToHighlight?.length > 0 && (
//                     <div>
//                       <div style={{ fontWeight: 800, marginBottom: 8 }}>
//                         Move these to the top of your skills:
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {get.tailored().skillsToHighlight.map((s, i) => (
//                           <Tag key={i} text={s} bg="#FFE566" small />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── SUGGESTIONS / RECOMMENDATIONS ── */}
//             {get.suggestions().length > 0 && (
//               <Card>
//                 <SectionTitle icon={CheckCircle} title="Recommendations" color="#A8FF78" />
//                 <div style={{ padding: 20 }}>
//                   {get.suggestions().map((rec, i) => (
//                     <div key={i} style={{ display: 'flex', gap: 10,
//                                           marginBottom: 10, alignItems: 'flex-start' }}>
//                       <div style={{
//                         background: '#000', color: '#FFE566',
//                         fontWeight: 900, fontSize: 13,
//                         minWidth: 26, height: 26,
//                         display: 'flex', alignItems: 'center',
//                         justifyContent: 'center', flexShrink: 0,
//                       }}>
//                         {i + 1}
//                       </div>
//                       <span style={{ fontSize: 13, fontWeight: 600,
//                                      lineHeight: 1.6 }}>
//                         {rec}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── OVERVIEW ── */}
//             {get.overview() && (
//               <Card bg="#FFF9E6">
//                 <SectionTitle icon={Brain} title="Recruiter's Perspective" color="#FFE566" />
//                 <div style={{ padding: 20 }}>
//                   {get.overview().recruiterPerspective && (
//                     <div style={{ background: '#fff', border: '2px solid #000',
//                                   padding: '14px 18px', marginBottom: 14,
//                                   borderLeft: '5px solid #000',
//                                   fontStyle: 'italic', fontSize: 14,
//                                   fontWeight: 600, lineHeight: 1.7 }}>
//                       "{get.overview().recruiterPerspective}"
//                     </div>
//                   )}
//                   <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//                     {get.overview().atsRiskLevel && (
//                       <div style={{ border: '2px solid #000', padding: '8px 14px' }}>
//                         <div style={{ fontWeight: 800, fontSize: 11,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           ATS Risk
//                         </div>
//                         <Tag text={get.overview().atsRiskLevel}
//                              bg={get.overview().atsRiskLevel === 'Low' ? '#A8FF78'
//                                : get.overview().atsRiskLevel === 'Critical' ? '#FF6B6B'
//                                : '#FFE566'} small />
//                       </div>
//                     )}
//                     {get.overview().timeToBeReady && (
//                       <div style={{ border: '2px solid #000', padding: '8px 14px' }}>
//                         <div style={{ fontWeight: 800, fontSize: 11,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           Time To Be Ready
//                         </div>
//                         <div style={{ fontWeight: 700, fontSize: 13 }}>
//                           {get.overview().timeToBeReady}
//                         </div>
//                       </div>
//                     )}
//                     {get.overview().topPriorityFix && (
//                       <div style={{ flex: 1, border: '2px solid #000',
//                                     padding: '8px 14px',
//                                     background: '#FFE566', minWidth: 200 }}>
//                         <div style={{ fontWeight: 800, fontSize: 11,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           Top Priority Fix
//                         </div>
//                         <div style={{ fontWeight: 700, fontSize: 13 }}>
//                           {get.overview().topPriorityFix}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   {get.overview().atsRiskExplanation && (
//                     <div style={{ marginTop: 12, fontSize: 12, color: '#555',
//                                   fontWeight: 600 }}>
//                       ATS risk: {get.overview().atsRiskExplanation}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── RE-ANALYSE ── */}
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
//                 <RefreshCw size={15} /> Analyse Another JD
//               </button>
//             </div>

//           </div>
//           // ← ALL results are inside this single {result && (...)} block
//         )}

//       </div>
//     </div>
//   );
// };

// export default JDMatchPage;




















// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import { 
//   ArrowLeft, Loader2, Target, CheckCircle, 
//   XCircle, FileText, Send, Home, Upload,
//   BarChart3, AlertTriangle, Zap, Brain,
//   BookOpen, Award, TrendingUp, AlertCircle,
//   ChevronDown, ChevronUp, Briefcase, Code,
//   Clock, Layers, Star, Filter
// } from 'lucide-react';

// const domains = [
//   { id: 'software-engineer', name: 'Software Engineer', icon: '💻' },
//   { id: 'data-scientist', name: 'Data Scientist', icon: '📊' },
//   { id: 'marketing', name: 'Marketing', icon: '📢' },
//   { id: 'product-manager', name: 'Product Manager', icon: '📦' },
//   { id: 'design', name: 'Design', icon: '🎨' },
//   { id: 'sales', name: 'Sales', icon: '💰' },
//   { id: 'other', name: 'Other', icon: '✏️' },
// ];

// export const JDMatchPage = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     jobDescription: '',
//     targetDomain: 'software-engineer'
//   });

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       const response = await historyAPI.getHistory();
//       setHistory(response.data);
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

//     // Upload and analyze new resume
//     setLoading(true);
//     try {
//       const formDataUpload = new FormData();
//       formDataUpload.append('file', file);
//       formDataUpload.append('targetDomain', formData.targetDomain);
      
//       const uploadResponse = await resumeAPI.uploadAndAnalyze(formDataUpload);
//       resumeText = uploadResponse.data.resumeText;
      
//       // Refresh history
//       fetchHistory();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to upload and analyze resume');
//       setLoading(false);
//       return;
//     }

//     if (!formData.jobDescription.trim()) {
//       toast.error('Please paste the job description');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await resumeAPI.matchWithJD({
//         resumeText: resumeText,
//         jobDescription: formData.jobDescription,
//         targetDomain: formData.targetDomain
//       });
//       setResult(response.data);
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to match resume with JD');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getMatchColor = (percentage) => {
//     if (percentage >= 80) return 'text-neo-green';
//     if (percentage >= 60) return 'text-neo-yellow';
//     return 'text-neo-red';
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
//             <div className="w-16 h-16 bg-neo-blue border-3 border-black flex items-center justify-center">
//               <Target className="w-8 h-8" />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">JD MATCH</h1>
//               <p className="text-gray-500">Check how well your resume matches a job description</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Target Domain */}
//             <div>
//               <label className="font-bold mb-3 block">Target Domain</label>
//               <div className="flex flex-wrap gap-3">
//                 {domains.map((domain) => (
//                   <button
//                     key={domain.id}
//                     type="button"
//                     onClick={() => setFormData({ ...formData, targetDomain: domain.id })}
//                     className={`px-4 py-2 border-3 border-black font-bold transition-all ${
//                       formData.targetDomain === domain.id 
//                         ? 'bg-neo-yellow shadow-neo-sm translate-x-[2px] translate-y-[2px]' 
//                         : 'bg-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px]'
//                     }`}
//                   >
//                     {domain.icon} {domain.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

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

//             {/* Job Description */}
//             <div>
//               <label className="font-bold mb-3 block">Job Description</label>
//               <textarea
//                 value={formData.jobDescription}
//                 onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
//                 placeholder="Paste the job description here..."
//                 rows={10}
//                 className="w-full border-3 border-black p-4 font-bold focus:outline-none focus:shadow-neo resize-none"
//               />
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
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <Send className="w-5 h-5" />
//                   MATCH RESUME WITH JD
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="neo-card p-8">
//             <h2 className="font-space text-2xl font-extrabold mb-6">MATCH RESULTS</h2>

//             {/* Score Cards */}
//             <div className="grid grid-cols-2 gap-6 mb-8">
//               <div className="border-3 border-black p-6 text-center">
//                 <div className={`text-6xl font-space font-extrabold ${getMatchColor(result.match_percentage)}`}>
//                   {result.match_percentage}%
//                 </div>
//                 <div className="font-bold mt-2">Match Percentage</div>
//               </div>
//               <div className="border-3 border-black p-6 text-center">
//                 <div className={`text-6xl font-space font-extrabold ${getMatchColor(result.role_fit_score)}`}>
//                   {result.role_fit_score}%
//                 </div>
//                 <div className="font-bold mt-2">Role Fit Score</div>
//               </div>
//             </div>

//             {/* Matched Keywords */}
//             <div className="mb-6">
//               <h3 className="font-space text-xl font-extrabold mb-4 flex items-center gap-2">
//                 <CheckCircle className="w-6 h-6 text-neo-green" />
//                 MATCHED KEYWORDS
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {result.matched_keywords?.map((keyword, index) => (
//                   <span key={index} className="neo-badge">{keyword}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Missing Keywords */}
//             <div className="mb-6">
//               <h3 className="font-space text-xl font-extrabold mb-4 flex items-center gap-2">
//                 <XCircle className="w-6 h-6 text-neo-red" />
//                 MISSING KEYWORDS
//               </h3>
//               <div className="flex flex-wrap gap-3">
//                 {result.missing_keywords?.map((keyword, index) => (
//                   <span key={index} className="neo-badge-red">{keyword}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Skill Gaps */}
//             <div className="mb-6">
//               <h3 className="font-space text-xl font-extrabold mb-4">SKILL GAPS</h3>
//               <div className="space-y-3">
//                 {result.skill_gaps?.map((gap, index) => (
//                   <div key={index} className="flex items-start gap-3 border-3 border-black p-4">
//                     <XCircle className="w-5 h-5 text-neo-red flex-shrink-0 mt-1" />
//                     <span className="font-bold">{gap}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recommendations */}
//             <div>
//               <h3 className="font-space text-xl font-extrabold mb-4">RECOMMENDATIONS</h3>
//               <div className="space-y-3">
//                 {result.recommendations?.map((rec, index) => (
//                   <div key={index} className="flex items-start gap-3 border-3 border-black p-4 bg-neo-green/20">
//                     <CheckCircle className="w-5 h-5 text-neo-green flex-shrink-0 mt-1" />
//                     <span className="font-bold">{rec}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//         )}
//           {result.detailed?.jdAnalysis && (
//             <div className="mt-8 border-t-3 border-black pt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <Brain className="w-7 h-7 text-neo-blue" />
//                 EXECUTIVE SUMMARY
//               </h3>
//               <div className="border-3 border-black p-6 bg-gradient-to-r from-neo-blue/10 to-neo-yellow/10">
//                 <p className="text-lg font-bold">{result.reasoning}</p>
//                 <div className="mt-4 flex items-center gap-3">
//                   <span className="font-bold">Should Apply:</span>
//                   <span className={`neo-badge ${result.should_apply ? 'bg-neo-green text-white' : 'bg-neo-red text-white'}`}>
//                     {result.should_apply ? 'YES - Apply!' : 'NO - Not Recommended'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Score Breakdown */}
//           {result.detailed?.scoreBreakdown && (
//             <div className="mt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <BarChart3 className="w-7 h-7 text-neo-blue" />
//                 SCORE BREAKDOWN
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                 <div className="border-3 border-black p-4 text-center">
//                   <div className="text-3xl font-space font-extrabold text-neo-blue">
//                     {result.detailed.scoreBreakdown.technicalSkillsScore || 0}/40
//                   </div>
//                   <div className="text-sm font-bold mt-1">Technical Skills</div>
//                 </div>
//                 <div className="border-3 border-black p-4 text-center">
//                   <div className="text-3xl font-space font-extrabold text-neo-green">
//                     {result.detailed.scoreBreakdown.experienceLevelScore || 0}/25
//                   </div>
//                   <div className="text-sm font-bold mt-1">Experience</div>
//                 </div>
//                 <div className="border-3 border-black p-4 text-center">
//                   <div className="text-3xl font-space font-extrabold text-neo-yellow">
//                     {result.detailed.scoreBreakdown.keywordDensityScore || 0}/20
//                   </div>
//                   <div className="text-sm font-bold mt-1">Keywords</div>
//                 </div>
//                 <div className="border-3 border-black p-4 text-center">
//                   <div className="text-3xl font-space font-extrabold text-neo-purple">
//                     {result.detailed.scoreBreakdown.domainKnowledgeScore || 0}/15
//                   </div>
//                   <div className="text-sm font-bold mt-1">Domain Knowledge</div>
//                 </div>
//               </div>
//               {result.detailed.scoreBreakdown.breakdown_explanation && (
//                 <p className="text-gray-600 font-bold border-3 border-black p-3">
//                   💡 {result.detailed.scoreBreakdown.breakdown_explanation}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* JD Analysis */}
//           {result.detailed?.jdAnalysis && (
//             <div className="mt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <Briefcase className="w-7 h-7 text-neo-blue" />
//                 JOB DESCRIPTION ANALYSIS
//               </h3>
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Seniority & Tech Stack */}
//                 <div className="border-3 border-black p-5">
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <TrendingUp className="w-5 h-5" />
//                     Seniority Level
//                   </h4>
//                   <span className="neo-badge text-lg">{result.detailed.jdAnalysis.seniorityLevel || 'Not specified'}</span>
                  
//                   <h4 className="font-bold text-lg mt-4 mb-3 flex items-center gap-2">
//                     <Code className="w-5 h-5" />
//                     Primary Tech Stack
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {result.detailed.jdAnalysis.primaryTechStack?.map((tech, i) => (
//                       <span key={i} className="neo-badge">{tech}</span>
//                     )) || <span className="text-gray-500">Not specified</span>}
//                   </div>
                  
//                   <h4 className="font-bold text-lg mt-4 mb-3 flex items-center gap-2">
//                     <Layers className="w-5 h-5" />
//                     Secondary Tech Stack
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {result.detailed.jdAnalysis.secondaryTechStack?.map((tech, i) => (
//                       <span key={i} className="neo-badge-yellow">{tech}</span>
//                     )) || <span className="text-gray-500">None</span>}
//                   </div>
//                 </div>

//                 {/* Requirements */}
//                 <div className="border-3 border-black p-5">
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <Star className="w-5 h-5 text-neo-red" />
//                     Must-Have Requirements
//                   </h4>
//                   <ul className="space-y-2 mb-4">
//                     {result.detailed.jdAnalysis.mustHaveRequirements?.map((req, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <XCircle className="w-4 h-4 text-neo-red mt-1 flex-shrink-0" />
//                         <span className="font-bold">{req}</span>
//                       </li>
//                     )) || <span className="text-gray-500">None specified</span>}
//                   </ul>
                  
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <Filter className="w-5 h-5 text-neo-yellow" />
//                     Nice-to-Have Requirements
//                   </h4>
//                   <ul className="space-y-2 mb-4">
//                     {result.detailed.jdAnalysis.niceToHaveRequirements?.map((req, i) => (
//                       <li key={i} className="flex items-start gap-2">
//                         <CheckCircle className="w-4 h-4 text-neo-yellow mt-1 flex-shrink-0" />
//                         <span>{req}</span>
//                       </li>
//                     )) || <span className="text-gray-500">None specified</span>}
//                   </ul>

//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <Clock className="w-5 h-5 text-neo-purple" />
//                     Experience Required
//                   </h4>
//                   <span className="bg-neo-purple text-black">{result.detailed.jdAnalysis.estimatedYearsRequired || 'Not specified'}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Skill Gap Analysis */}
//           {result.detailed?.skillGapAnalysis && (
//             <div className="mt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <Zap className="w-7 h-7 text-neo-yellow" />
//                 SKILL GAP ANALYSIS
//               </h3>
              
//               {/* Perfect Matches */}
//               {result.detailed.skillGapAnalysis.perfectMatches?.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <CheckCircle className="w-5 h-5 text-neo-green" />
//                     Perfect Matches ✅
//                   </h4>
//                   <div className="space-y-2">
//                     {result.detailed.skillGapAnalysis.perfectMatches.map((match, i) => (
//                       <div key={i} className="border-3 border-black p-3 bg-neo-green/10 flex justify-between items-center">
//                         <div>
//                           <span className="font-bold text-lg">{match.skill}</span>
//                           <p className="text-sm text-gray-600">{match.resumeEvidence}</p>
//                         </div>
//                         <span className="neo-badge-green">{match.confidenceLevel}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Partial Matches */}
//               {result.detailed.skillGapAnalysis.partialMatches?.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <AlertCircle className="w-5 h-5 text-neo-yellow" />
//                     Partial Matches ⚠️
//                   </h4>
//                   <div className="space-y-2">
//                     {result.detailed.skillGapAnalysis.partialMatches.map((match, i) => (
//                       <div key={i} className="border-3 border-black p-3 bg-neo-yellow/10">
//                         <div className="flex justify-between items-start">
//                           <span className="font-bold text-lg">{match.skill}</span>
//                           <span className={`neo-badge ${
//                             match.severity === 'Major' ? 'bg-neo-red text-white' : 
//                             match.severity === 'Moderate' ? 'bg-neo-yellow text-black' : 'bg-gray-300'
//                           }`}>{match.severity}</span>
//                         </div>
//                         <p className="text-sm mt-1"><strong>JD Needs:</strong> {match.jdRequirement}</p>
//                         <p className="text-sm"><strong>Resume Has:</strong> {match.resumeEvidence}</p>
//                         <p className="text-sm text-neo-red"><strong>Gap:</strong> {match.gap}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Critical Missing */}
//               {result.detailed.skillGapAnalysis.criticalMissing?.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <XCircle className="w-5 h-5 text-neo-red" />
//                     Critical Missing Skills 🚨
//                   </h4>
//                   <div className="space-y-2">
//                     {result.detailed.skillGapAnalysis.criticalMissing.map((skill, i) => (
//                       <div key={i} className="border-3 border-neo-red p-4 bg-neo-red/10">
//                         <div className="flex justify-between items-start mb-2">
//                           <span className="font-bold text-lg text-neo-red">{skill.skill}</span>
//                           <span className={`neo-badge ${
//                             skill.priority === 'P0 (dealbreaker)' ? 'bg-neo-red text-white' : 
//                             skill.priority === 'P1 (important)' ? 'bg-neo-yellow text-black' : 'bg-gray-300'
//                           }`}>{skill.priority}</span>
//                         </div>
//                         <p className="text-sm"><strong>Why it matters:</strong> {skill.whyItMatters}</p>
//                         <p className="text-sm text-neo-green mt-1"><strong>How to fix:</strong> {skill.howToFix}</p>
//                         <p className="text-sm text-gray-500 mt-1"><Clock className="w-4 h-4 inline" /> {skill.timeToLearn}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Bonus Skills */}
//               {result.detailed.skillGapAnalysis.bonusSkills?.length > 0 && (
//                 <div className="mb-6">
//                   <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
//                     <Award className="w-5 h-5 text-neo-purple" />
//                     Bonus Skills 🌟 (You have these, JD doesn't require)
//                   </h4>
//                   <div className="flex flex-wrap gap-2">
//                     {result.detailed.skillGapAnalysis.bonusSkills.map((skill, i) => (
//                       <div key={i} className="border-3 border-neo-purple p-2 bg-neo-purple/20">
//                         <span className="font-bold">{skill.skill}</span>
//                         <p className="text-xs text-gray-600">{skill.relevance}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Keyword Audit */}
//           {result.detailed?.keywordAudit && (
//             <div className="mt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <BookOpen className="w-7 h-7 text-neo-blue" />
//                 KEYWORD AUDIT
//               </h3>
              
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <div className="border-3 border-black p-4 text-center bg-neo-green/20">
//                   <div className="text-3xl font-space font-extrabold text-neo-green">
//                     {result.detailed.keywordAudit.matchedCount || 0}
//                   </div>
//                   <div className="font-bold">Matched</div>
//                 </div>
//                 <div className="border-3 border-black p-4 text-center bg-neo-red/20">
//                   <div className="text-3xl font-space font-extrabold text-neo-red">
//                     {result.detailed.keywordAudit.missingCount || 0}
//                   </div>
//                   <div className="font-bold">Missing</div>
//                 </div>
//                 <div className="border-3 border-black p-4 text-center bg-neo-blue/20">
//                   <div className="text-3xl font-space font-extrabold text-neo-blue">
//                     {result.detailed.keywordAudit.atsPredictedPassRate || 0}%
//                   </div>
//                   <div className="font-bold">ATS Pass Rate</div>
//                 </div>
//               </div>

//               <div className="border-3 border-black p-4">
//                 <h4 className="font-bold text-lg mb-3">Keyword Details</h4>
//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {result.detailed.keywordAudit.keywordDetails?.map((kw, i) => (
//                     <div key={i} className={`flex items-center justify-between p-2 border-b ${
//                       kw.status === 'FOUND' ? 'bg-neo-green/10' : 
//                       kw.status === 'MISSING' ? 'bg-neo-red/10' : 'bg-neo-yellow/10'
//                     }`}>
//                       <span className="font-bold">{kw.keyword}</span>
//                       <div className="flex items-center gap-3">
//                         <span className={`text-xs ${
//                           kw.importance === 'Critical' ? 'text-neo-red font-bold' :
//                           kw.importance === 'Important' ? 'text-neo-yellow font-bold' : 'text-gray-500'
//                         }`}>{kw.importance}</span>
//                         <span className={`neo-badge ${
//                           kw.status === 'FOUND' ? 'bg-neo-green text-white' :
//                           kw.status === 'MISSING' ? 'bg-neo-red text-white' : 'bg-neo-yellow text-black'
//                         }`}>{kw.status}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Experience Analysis */}
//           {result.detailed?.experienceAnalysis && (
//             <div className="mt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <TrendingUp className="w-7 h-7 text-neo-blue" />
//                 EXPERIENCE ANALYSIS
//               </h3>
//               <div className="border-3 border-black p-5">
//                 <div className="grid md:grid-cols-2 gap-4 mb-4">
//                   <div className="p-3 bg-neo-blue/10">
//                     <span className="font-bold">Required:</span> {result.detailed.experienceAnalysis.requiredYears}
//                   </div>
//                   <div className="p-3 bg-neo-green/10">
//                     <span className="font-bold">Your Experience:</span> {result.detailed.experienceAnalysis.estimatedResumeYears}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <span className="font-bold">Alignment:</span>
//                   <span className={`neo-badge ${
//                     result.detailed.experienceAnalysis.alignmentStatus === 'Well-matched' ? 'bg-neo-green text-white' :
//                     result.detailed.experienceAnalysis.alignmentStatus === 'Under-qualified' ? 'bg-neo-red text-white' : 'bg-neo-yellow text-black'
//                   }`}>{result.detailed.experienceAnalysis.alignmentStatus}</span>
//                 </div>
//                 <div className="space-y-2">
//                   <p><strong>Seniority Gap:</strong> {result.detailed.experienceAnalysis.seniorityGap}</p>
//                   <p><strong>Project Complexity:</strong> {result.detailed.experienceAnalysis.projectComplexityMatch}</p>
//                   <p><strong>Domain Relevance:</strong> {result.detailed.experienceAnalysis.domainRelevance}</p>
//                   <p><strong>Leadership Required Met:</strong> {result.detailed.experienceAnalysis.leadershipRequiredMet ? '✅ Yes' : '❌ No'}</p>
//                   <p className="mt-2 text-gray-600">{result.detailed.experienceAnalysis.details}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Red Flags */}
//           {result.detailed?.redFlags?.length > 0 && (
//             <div className="mt-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <AlertTriangle className="w-7 h-7 text-neo-red" />
//                 RED FLAGS ⚠️
//               </h3>
//               <div className="space-y-3">
//                 {result.detailed.redFlags.map((flag, i) => (
//                   <div key={i} className={`border-3 p-4 ${
//                     flag.severity === 'Dealbreaker' ? 'border-neo-red bg-neo-red/20' :
//                     flag.severity === 'Major' ? 'border-orange-500 bg-orange-100' : 'border-neo-yellow bg-neo-yellow/20'
//                   }`}>
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="font-bold text-lg">{flag.flag}</span>
//                       <span className={`neo-badge ${
//                         flag.severity === 'Dealbreaker' ? 'bg-neo-red text-white' :
//                         flag.severity === 'Major' ? 'bg-orange-500 text-white' : 'bg-neo-yellow text-black'
//                       }`}>{flag.severity}</span>
//                     </div>
//                     <p className="text-sm text-gray-600">{flag.impact}</p>
//                     {flag.fix && (
//                       <p className="text-sm text-neo-green mt-1">💡 Fix: {flag.fix}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Resume Improvements */}
//           {result.detailed?.resumeImprovementsForThisJD?.length > 0 && (
//             <div className="mt-8 mb-8">
//               <h3 className="font-space text-2xl font-extrabold mb-4 flex items-center gap-2">
//                 <FileText className="w-7 h-7 text-neo-green" />
//                 RESUME IMPROVEMENTS FOR THIS JD ✍️
//               </h3>
//               <div className="space-y-4">
//                 {result.detailed.resumeImprovementsForThisJD.map((improvement, i) => (
//                   <div key={i} className="border-3 border-black p-5">
//                     <div className="flex justify-between items-start mb-3">
//                       <span className="neo-badge">{improvement.section}</span>
//                       <span className={`neo-badge ${
//                         improvement.priority === 'High' ? 'bg-neo-red text-white' :
//                         improvement.priority === 'Medium' ? 'bg-neo-yellow text-black' : 'bg-gray-300'
//                       }`}>{improvement.priority} Priority</span>
//                     </div>
//                     <p className="font-bold mb-2">Issue: {improvement.issue}</p>
//                     {improvement.currentState && (
//                       <p className="text-sm text-gray-500 mb-2">📍 Current: {improvement.currentState}</p>
//                     )}
//                     <div className="bg-neo-green/20 p-3 border-2 border-neo-green">
//                       <p className="font-bold text-neo-green">✅ Recommended: {improvement.recommendedChange}</p>
//                     </div>
//                     <p className="text-sm text-gray-600 mt-2">💡 {improvement.reasoning}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//     </div>
//   );
// };















// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { Navbar } from '../pages/Navbar';
// import { resumeAPI, historyAPI } from '../services/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft, Loader2, Target, CheckCircle,
//   XCircle, FileText, Send, Home, Upload,
//   BarChart3, AlertTriangle, Zap, Brain,
//   BookOpen, Award, TrendingUp, AlertCircle,
//   Briefcase, Code, Clock, Layers, Star,
//   Filter, X, RefreshCw
// } from 'lucide-react';
// import FeaturePageGuard from '../components/FeaturePageGuard';

// // ─── Domain options ───────────────────────────────────────────────
// const DOMAINS = [
//   { id: 'software-engineer', name: 'Software Engineer', emoji: '💻' },
//   { id: 'data-scientist',    name: 'Data Scientist',    emoji: '📊' },
//   { id: 'marketing',         name: 'Marketing',         emoji: '📢' },
//   { id: 'product-manager',   name: 'Product Manager',   emoji: '📦' },
//   { id: 'design',            name: 'Design',            emoji: '🎨' },
//   { id: 'sales',             name: 'Sales',             emoji: '💰' },
//   { id: 'other',             name: 'Other',             emoji: '✏️' },
// ];

// // ─── Reusable primitives ─────────────────────────────────────────

// const ScoreChip = ({ value, label, max = 100, large = false }) => {
//   const n   = Number(value) || 0;
//   const pct = max === 100 ? n : Math.round((n / max) * 100);
//   const bg  = pct >= 80 ? '#A8FF78' : pct >= 60 ? '#FFE566' : '#FF6B6B';
//   const fs  = large ? 52 : 28;
//   const pad = large ? '16px 24px' : '10px 14px';
//   return (
//     <div style={{ textAlign: 'center' }}>
//       <div style={{
//         background: bg, border: '3px solid #000',
//         boxShadow: '4px 4px 0 #000', padding: pad,
//         fontWeight: 900, fontSize: fs, color: '#000',
//         display: 'inline-block', lineHeight: 1,
//       }}>
//         {value}{max !== 100 ? `/${max}` : ''}
//       </div>
//       {label && (
//         <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6,
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
//     padding: small ? '2px 8px' : '5px 12px',
//     fontSize: small ? 11 : 12, fontWeight: 700,
//     display: 'inline-block', lineHeight: 1.4,
//   }}>
//     {text}
//   </span>
// );

// const SectionTitle = ({ icon: Icon, title, color = '#74B9FF' }) => (
//   <div style={{
//     background: color, border: '3px solid #000',
//     borderBottom: 'none', padding: '12px 20px',
//     display: 'flex', alignItems: 'center', gap: 10,
//     fontWeight: 900, fontSize: 16, textTransform: 'uppercase',
//   }}>
//     {Icon && <Icon size={20} />}
//     {title}
//   </div>
// );

// const Card = ({ children, bg = '#fff', color = '#000' }) => (
//   <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
//                 marginBottom: 24, background: bg, color }}>
//     {children}
//   </div>
// );

// // ═══════════════════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════════════════
// export const JDMatchPage = () => {
//   const [loading, setLoading]   = useState(false);
//   const [result,  setResult]    = useState(null);  // full parsed object
//   const [file,    setFile]      = useState(null);
//   const [formData, setFormData] = useState({
//     jobDescription: '',
//     targetDomain:   'software-engineer',
//   });
//   const resultRef = useRef(null);

//   // file validation
//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     if (f.type !== 'application/pdf') { toast.error('PDF only');  return; }
//     if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');   return; }
//     setFile(f);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)                           { toast.error('Upload your resume PDF'); return; }
//     if (!formData.jobDescription.trim()) { toast.error('Paste the job description'); return; }

//     setLoading(true);
//     setResult(null);

//     try {
//       // Step 1 — upload + analyse to extract resumeText
//       const fd = new FormData();
//       fd.append('file', file);
//       fd.append('targetDomain', formData.targetDomain);
//       const uploadRes  = await resumeAPI.uploadAndAnalyze(fd);
//       const resumeText = uploadRes.data?.resumeText
//         || uploadRes.data?.analysis?.resumeText
//         || '';

//       if (!resumeText) throw new Error('Could not extract text from PDF. Try a different file.');

//       // Step 2 — JD match
//       const matchRes = await resumeAPI.matchWithJD({
//         resumeText,
//         jobDescription: formData.jobDescription,
//         targetDomain:   formData.targetDomain,
//       });

//       // Backend returns { result (JSON string), parsed (object), modelUsed }
//       // OR the old groqService format: { match_percentage, role_fit_score, ... }
//       const data   = matchRes.data;
//       const parsed = data?.parsed
//         || (data?.result ? (() => {
//           try { return JSON.parse(data.result); } catch { return null; }
//         })() : null)
//         || data;  // fallback: data itself might be the flat object

//       if (!parsed) throw new Error('Empty response from server. Please retry.');

//       setResult(parsed);
//       toast.success('JD match complete!');
//       setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

//     } catch (err) {
//       console.error(err);
//       toast.error(err?.response?.data?.message || err.message || 'Match failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Helper: read from both new (parsed) and legacy (flat) structures ──
//   // New backend: parsed.matchScore, parsed.scoreBreakdown, parsed.jdAnalysis, etc.
//   // Legacy backend: result.match_percentage, result.role_fit_score, etc.
//   const get = {
//     matchScore:     () => result?.matchScore        ?? result?.match_percentage ?? 0,
//     roleFit:        () => result?.rolefit           ?? result?.role_fit_score   ?? 0,
//     shouldApply:    () => result?.shouldApply       ?? result?.should_apply     ?? false,
//     confidence:     () => result?.applicationConfidence ?? null,
//     hiringProb:     () => result?.hiringProbability ?? null,
//     matchedSkills:  () => result?.matchedSkills     || result?.matched_keywords  || [],
//     missingSkills:  () => result?.missingSkills     || result?.missing_keywords  || [],
//     suggestions:    () => result?.suggestions       || result?.recommendations   || [],
//     skillGaps:      () => result?.skillGapAnalysis  || null,
//     // flat skill_gaps array from legacy
//     skillGapsFlat:  () => result?.skill_gaps        || [],
//     scoreBreakdown: () => result?.scoreBreakdown    || null,
//     jdAnalysis:     () => result?.jdAnalysis        || null,
//     keywordAudit:   () => result?.keywordAudit      || null,
//     expAnalysis:    () => result?.experienceAnalysis || null,
//     redFlags:       () => result?.redFlags          || [],
//     improvements:   () => result?.resumeImprovementsForThisJD || [],
//     tailored:       () => result?.tailoredResumeChanges || null,
//     overview:       () => result?.overview          || null,
//     summary:        () => result?.overview?.oneLineSummary
//                           || result?.overview?.recruiterPerspective
//                           || result?.reasoning || '',
//   };

//   // ── Score color util ──
//   const scoreColor = (n) => {
//     const v = Number(n) || 0;
//     return v >= 80 ? '#A8FF78' : v >= 60 ? '#FFE566' : '#FF6B6B';
//   };

//   // ══════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-neo-offwhite">
//  <FeaturePageGuard action="jd_match" /> 
//       {/* ── NAVBAR ── */}
//       <Navbar />

//       <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

//         {/* ── FORM CARD ── */}
//         <div style={{ background: '#fff', border: '3px solid #000',
//                       boxShadow: '7px 7px 0 #000', padding: 32 }}>

//           <div className="flex items-center gap-4 mb-8">
//             <div style={{ width: 64, height: 64, background: '#74B9FF',
//                           border: '3px solid #000',
//                           display: 'flex', alignItems: 'center',
//                           justifyContent: 'center' }}>
//               <Target size={28} />
//             </div>
//             <div>
//               <h1 className="font-space text-3xl font-extrabold">JD MATCH</h1>
//               <p style={{ color: '#666', fontWeight: 600 }}>
//                 Deep ATS analysis · Skill gap detection · Recruiter perspective
//               </p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">

//             {/* Domain selector */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Target Domain
//               </label>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                 {DOMAINS.map(d => (
//                   <button key={d.id} type="button"
//                     onClick={() => setFormData({ ...formData, targetDomain: d.id })}
//                     style={{
//                       background: formData.targetDomain === d.id ? '#FFE566' : '#fff',
//                       border: '3px solid #000', padding: '8px 16px',
//                       fontWeight: 800, cursor: 'pointer', fontSize: 13,
//                       boxShadow: formData.targetDomain === d.id
//                         ? '2px 2px 0 #000' : '4px 4px 0 #000',
//                       transform: formData.targetDomain === d.id
//                         ? 'translate(2px,2px)' : 'none',
//                       transition: 'all 0.1s',
//                     }}>
//                     {d.emoji} {d.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* PDF upload */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <div
//                 onDrop={handleDrop} onDragOver={e => e.preventDefault()}
//                 style={{
//                   border: '3px dashed #000',
//                   background: file ? '#A8FF78' : '#F5F0E8',
//                   padding: 28, textAlign: 'center', transition: 'background 0.2s',
//                 }}>
//                 {file ? (
//                   <div className="flex items-center justify-center gap-4">
//                     <FileText size={26} />
//                     <span style={{ fontWeight: 800 }}>{file.name}</span>
//                     <span style={{ fontSize: 12, color: '#555' }}>
//                       ({(file.size / 1024).toFixed(0)} KB)
//                     </span>
//                     <button type="button" onClick={() => setFile(null)}
//                       style={{ background: '#FF6B6B', border: '2px solid #000',
//                                padding: '2px 8px', cursor: 'pointer', fontWeight: 900 }}>
//                       <X size={13} />
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
//                              onChange={handleFileChange} />
//                     </label>
//                     <p style={{ marginTop: 10, fontSize: 12, color: '#888',
//                                 fontWeight: 600 }}>
//                       PDF only · Max 5MB
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* JD textarea */}
//             <div>
//               <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
//                 Job Description <span style={{ color: '#FF6B6B' }}>*</span>
//               </label>
//               <textarea
//                 value={formData.jobDescription}
//                 onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
//                 placeholder="Paste the full job description here..."
//                 rows={10}
//                 style={{ width: '100%', border: '3px solid #000',
//                          padding: '12px 16px', fontWeight: 600, fontSize: 14,
//                          outline: 'none', resize: 'vertical',
//                          boxSizing: 'border-box', fontFamily: 'inherit' }} />
//             </div>

//             {/* Submit */}

//              <div>
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
//           </form>
//         </div>

//         {/* ════════════════════════════════════════════════════════
//             ALL RESULTS — single guard block, no null crash
//         ════════════════════════════════════════════════════════ */}
//         {result && (
//           <div ref={resultRef} className="space-y-6">

//             {/* ── TOP SCORES ── */}
//             <div style={{ background: '#000', color: '#fff',
//                           border: '3px solid #000',
//                           boxShadow: '7px 7px 0 #74B9FF',
//                           padding: '24px 28px' }}>

//               {/* Verdict */}
//               {get.overview() && (
//                 <div style={{ marginBottom: 20 }}>
//                   <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
//                                 textTransform: 'uppercase', marginBottom: 8 }}>
//                     Verdict
//                   </div>
//                   <span style={{
//                     background: scoreColor(get.matchScore()),
//                     border: '3px solid #fff',
//                     padding: '8px 18px', fontWeight: 900, fontSize: 14,
//                     textTransform: 'uppercase', color: '#000',
//                     display: 'inline-block',
//                   }}>
//                     {get.overview()?.verdict || (get.matchScore() >= 75
//                       ? 'GOOD MATCH' : get.matchScore() >= 55
//                       ? 'PARTIAL MATCH' : 'WEAK MATCH')}
//                   </span>
//                 </div>
//               )}

//               {/* Score chips */}
//               <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap',
//                             alignItems: 'flex-end', marginBottom: 20 }}>
//                 <ScoreChip value={get.matchScore()} label="Match Score" large />
//                 {get.roleFit() > 0 && (
//                   <ScoreChip value={get.roleFit()} label="Role Fit" large />
//                 )}
//                 {get.confidence() && (
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{
//                       background: '#1a1a1a', border: '2px solid #444',
//                       padding: '14px 18px', fontWeight: 900,
//                       fontSize: 16, color: '#FFE566',
//                     }}>
//                       {get.confidence()}
//                     </div>
//                     <div style={{ fontSize: 10, color: '#aaa', marginTop: 4,
//                                   fontWeight: 700, textTransform: 'uppercase' }}>
//                       Confidence
//                     </div>
//                   </div>
//                 )}
//                 {get.hiringProb() && (
//                   <div style={{ textAlign: 'center' }}>
//                     <div style={{
//                       background: '#1a1a1a', border: '2px solid #444',
//                       padding: '14px 18px', fontWeight: 900,
//                       fontSize: 16, color: '#A8FF78',
//                     }}>
//                       {get.hiringProb()}
//                     </div>
//                     <div style={{ fontSize: 10, color: '#aaa', marginTop: 4,
//                                   fontWeight: 700, textTransform: 'uppercase' }}>
//                       Hiring Probability
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Should apply */}
//               <div style={{ display: 'flex', alignItems: 'center', gap: 12,
//                             marginBottom: 16 }}>
//                 <span style={{ fontWeight: 700, color: '#aaa', fontSize: 13 }}>
//                   Should Apply:
//                 </span>
//                 <span style={{
//                   background: get.shouldApply() ? '#A8FF78' : '#FF6B6B',
//                   border: '2px solid #fff', padding: '4px 14px',
//                   fontWeight: 900, fontSize: 14, color: '#000',
//                 }}>
//                   {get.shouldApply() ? '✅ YES — Apply!' : '❌ NOT RECOMMENDED'}
//                 </span>
//               </div>

//               {/* One-line summary */}
//               {get.summary() && (
//                 <div style={{ background: '#1a1a1a', border: '2px solid #444',
//                               padding: '10px 14px', fontSize: 13,
//                               fontStyle: 'italic', color: '#ddd' }}>
//                   "{get.summary()}"
//                 </div>
//               )}
//             </div>

//             {/* ── SCORE BREAKDOWN (new backend) ── */}
//             {get.scoreBreakdown() && (
//               <Card>
//                 <SectionTitle icon={BarChart3} title="Score Breakdown" color="#74B9FF" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))',
//                                 gap: 12, marginBottom: 14 }}>
//                     {[
//                       { label: 'Technical',  value: get.scoreBreakdown().technicalSkillsScore,  max: 40 },
//                       { label: 'Experience', value: get.scoreBreakdown().experienceLevelScore,  max: 25 },
//                       { label: 'Keywords',   value: get.scoreBreakdown().keywordDensityScore,   max: 20 },
//                       { label: 'Domain',     value: get.scoreBreakdown().domainKnowledgeScore,  max: 15 },
//                     ].map(item => (
//                       <ScoreChip key={item.label} value={item.value || 0}
//                                  label={item.label} max={item.max} />
//                     ))}
//                   </div>
//                   {get.scoreBreakdown().breakdown_explanation && (
//                     <div style={{ background: '#FFF9E6', border: '2px solid #000',
//                                   padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
//                       💡 {get.scoreBreakdown().breakdown_explanation}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── MATCHED + MISSING KEYWORDS ── */}
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               {get.matchedSkills().length > 0 && (
//                 <Card bg="#F0FFF0">
//                   <SectionTitle icon={CheckCircle} title="Matched Keywords" color="#A8FF78" />
//                   <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {get.matchedSkills().map((kw, i) => (
//                       <Tag key={i} text={kw} bg="#A8FF78" />
//                     ))}
//                   </div>
//                 </Card>
//               )}
//               {get.missingSkills().length > 0 && (
//                 <Card bg="#FFF0F0">
//                   <SectionTitle icon={XCircle} title="Missing Keywords" color="#FF6B6B" />
//                   <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                     {get.missingSkills().map((kw, i) => (
//                       <Tag key={i} text={kw} bg="#FF6B6B" />
//                     ))}
//                   </div>
//                 </Card>
//               )}
//             </div>

//             {/* ── JD ANALYSIS ── */}
//             {get.jdAnalysis() && (
//               <Card>
//                 <SectionTitle icon={Briefcase} title="Job Description Analysis" color="#FFE566" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                     {/* Left col */}
//                     <div>
//                       <div style={{ fontWeight: 800, marginBottom: 8,
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <TrendingUp size={15} /> Seniority Level
//                       </div>
//                       <Tag text={get.jdAnalysis().seniorityLevel || 'Not specified'}
//                            bg="#FFE566" />

//                       <div style={{ fontWeight: 800, margin: '16px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Clock size={15} /> Experience Required
//                       </div>
//                       <Tag text={get.jdAnalysis().estimatedYearsRequired || 'Not specified'}
//                            bg="#E8F4FF" />

//                       <div style={{ fontWeight: 800, margin: '16px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Code size={15} /> Primary Tech Stack
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {(get.jdAnalysis().primaryTechStack || []).map((t, i) => (
//                           <Tag key={i} text={t} bg="#74B9FF" small />
//                         ))}
//                       </div>

//                       <div style={{ fontWeight: 800, margin: '16px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Layers size={15} /> Secondary Stack
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {(get.jdAnalysis().secondaryTechStack || []).map((t, i) => (
//                           <Tag key={i} text={t} bg="#F5F0E8" small />
//                         ))}
//                       </div>
//                     </div>

//                     {/* Right col */}
//                     <div>
//                       <div style={{ fontWeight: 800, marginBottom: 8,
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Star size={15} color="#c00" /> Must-Have Requirements
//                       </div>
//                       <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//                         {(get.jdAnalysis().mustHaveRequirements || []).map((r, i) => (
//                           <li key={i} style={{ display: 'flex', gap: 6,
//                                                marginBottom: 6, fontSize: 13,
//                                                fontWeight: 600, alignItems: 'flex-start' }}>
//                             <XCircle size={13} style={{ color: '#c00', flexShrink: 0,
//                                                          marginTop: 2 }} />
//                             {r}
//                           </li>
//                         ))}
//                       </ul>

//                       <div style={{ fontWeight: 800, margin: '14px 0 8px',
//                                     display: 'flex', alignItems: 'center', gap: 6 }}>
//                         <Filter size={15} color="#B45309" /> Nice-to-Have
//                       </div>
//                       <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//                         {(get.jdAnalysis().niceToHaveRequirements || []).map((r, i) => (
//                           <li key={i} style={{ display: 'flex', gap: 6,
//                                                marginBottom: 6, fontSize: 13,
//                                                fontWeight: 600, alignItems: 'flex-start' }}>
//                             <CheckCircle size={13} style={{ color: '#B45309',
//                                                              flexShrink: 0, marginTop: 2 }} />
//                             {r}
//                           </li>
//                         ))}
//                       </ul>

//                       {get.jdAnalysis().hiddenRequirements?.length > 0 && (
//                         <>
//                           <div style={{ fontWeight: 800, margin: '14px 0 8px',
//                                         fontSize: 12, textTransform: 'uppercase' }}>
//                             Hidden Requirements
//                           </div>
//                           {get.jdAnalysis().hiddenRequirements.map((r, i) => (
//                             <div key={i} style={{ fontSize: 12, fontWeight: 600,
//                                                   color: '#555', marginBottom: 4 }}>
//                               → {r}
//                             </div>
//                           ))}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {/* ── SKILL GAP ANALYSIS (new backend object) ── */}
//             {get.skillGaps() && (
//               <Card>
//                 <SectionTitle icon={Zap} title="Skill Gap Analysis" color="#FFE566" />
//                 <div style={{ padding: 20 }}>

//                   {/* Perfect matches */}
//                   {get.skillGaps().perfectMatches?.length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6 }}>
//                         <CheckCircle size={16} style={{ color: '#2a7a2a' }} />
//                         Perfect Matches ({get.skillGaps().perfectMatches.length})
//                       </div>
//                       {get.skillGaps().perfectMatches.map((m, i) => (
//                         <div key={i} style={{
//                           border: '2px solid #000', padding: '10px 14px',
//                           marginBottom: 8, background: '#F0FFF0',
//                           display: 'flex', justifyContent: 'space-between',
//                           alignItems: 'flex-start', gap: 12,
//                         }}>
//                           <div>
//                             <div style={{ fontWeight: 800 }}>{m.skill}</div>
//                             {m.resumeEvidence && (
//                               <div style={{ fontSize: 12, color: '#555',
//                                             fontWeight: 600, marginTop: 3 }}>
//                                 {m.resumeEvidence}
//                               </div>
//                             )}
//                           </div>
//                           {m.confidenceLevel && (
//                             <Tag text={m.confidenceLevel} bg="#A8FF78" small />
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Partial matches */}
//                   {get.skillGaps().partialMatches?.length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6 }}>
//                         <AlertCircle size={16} style={{ color: '#B45309' }} />
//                         Partial Matches ({get.skillGaps().partialMatches.length})
//                       </div>
//                       {get.skillGaps().partialMatches.map((m, i) => (
//                         <div key={i} style={{
//                           border: '2px solid #000', padding: '12px 14px',
//                           marginBottom: 8, background: '#FFF9E6',
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between',
//                                         marginBottom: 6 }}>
//                             <span style={{ fontWeight: 800 }}>{m.skill}</span>
//                             {m.severity && (
//                               <Tag text={m.severity}
//                                    bg={m.severity === 'Major' ? '#FF6B6B'
//                                      : m.severity === 'Moderate' ? '#FFE566' : '#F5F0E8'}
//                                    small />
//                             )}
//                           </div>
//                           {m.jdRequirement && (
//                             <div style={{ fontSize: 12, fontWeight: 600 }}>
//                               JD needs: {m.jdRequirement}
//                             </div>
//                           )}
//                           {m.resumeEvidence && (
//                             <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                               Resume has: {m.resumeEvidence}
//                             </div>
//                           )}
//                           {m.gap && (
//                             <div style={{ fontSize: 12, color: '#c00',
//                                           fontWeight: 700, marginTop: 4 }}>
//                               Gap: {m.gap}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Critical missing */}
//                   {get.skillGaps().criticalMissing?.length > 0 && (
//                     <div style={{ marginBottom: 20 }}>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6, color: '#c00' }}>
//                         <XCircle size={16} />
//                         Critical Missing ({get.skillGaps().criticalMissing.length})
//                       </div>
//                       {get.skillGaps().criticalMissing.map((s, i) => (
//                         <div key={i} style={{
//                           border: '3px solid #FF6B6B', padding: '12px 14px',
//                           marginBottom: 8, background: '#FFF0F0',
//                         }}>
//                           <div style={{ display: 'flex', justifyContent: 'space-between',
//                                         marginBottom: 8 }}>
//                             <span style={{ fontWeight: 800, color: '#c00' }}>
//                               {s.skill}
//                             </span>
//                             {s.priority && (
//                               <Tag text={s.priority}
//                                    bg={s.priority?.includes('P0') ? '#FF6B6B'
//                                      : s.priority?.includes('P1') ? '#FFE566' : '#F5F0E8'}
//                                    small />
//                             )}
//                           </div>
//                           {s.whyItMatters && (
//                             <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
//                               Why: {s.whyItMatters}
//                             </div>
//                           )}
//                           {s.howToFix && (
//                             <div style={{ fontSize: 12, fontWeight: 700,
//                                           color: '#2a7a2a', marginBottom: 4 }}>
//                               Fix: {s.howToFix}
//                             </div>
//                           )}
//                           {s.timeToLearn && (
//                             <div style={{ fontSize: 12, color: '#666',
//                                           display: 'flex', alignItems: 'center', gap: 4 }}>
//                               <Clock size={12} /> {s.timeToLearn}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Bonus skills */}
//                   {get.skillGaps().bonusSkills?.length > 0 && (
//                     <div>
//                       <div style={{ fontWeight: 800, fontSize: 14,
//                                     marginBottom: 10, display: 'flex',
//                                     alignItems: 'center', gap: 6 }}>
//                         <Award size={16} style={{ color: '#7B2D8B' }} />
//                         Bonus Skills (you have these, JD doesn't require)
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                         {get.skillGaps().bonusSkills.map((s, i) => (
//                           <div key={i} style={{ border: '2px solid #000',
//                                                 padding: '8px 12px',
//                                                 background: '#F8F4FF' }}>
//                             <div style={{ fontWeight: 800, fontSize: 13 }}>{s.skill}</div>
//                             {s.relevance && (
//                               <div style={{ fontSize: 11, color: '#555',
//                                             fontWeight: 600, marginTop: 2 }}>
//                                 {s.relevance}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── SKILL GAPS (legacy flat array) ── */}
//             {!get.skillGaps() && get.skillGapsFlat().length > 0 && (
//               <Card>
//                 <SectionTitle icon={Zap} title="Skill Gaps" color="#FFE566" />
//                 <div style={{ padding: 20 }}>
//                   {get.skillGapsFlat().map((gap, i) => (
//                     <div key={i} style={{ display: 'flex', gap: 8,
//                                           marginBottom: 8, alignItems: 'flex-start' }}>
//                       <XCircle size={15} style={{ color: '#c00', flexShrink: 0,
//                                                    marginTop: 2 }} />
//                       <span style={{ fontWeight: 600, fontSize: 13 }}>{gap}</span>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── KEYWORD AUDIT ── */}
//             {get.keywordAudit() && (
//               <Card>
//                 <SectionTitle icon={BookOpen} title="Keyword Audit" color="#A8FF78" />
//                 <div style={{ padding: 20 }}>
//                   {/* Stats */}
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: 'repeat(3,1fr)',
//                                 gap: 12, marginBottom: 16 }}>
//                     {[
//                       { label: 'Matched', val: get.keywordAudit().matchedCount, bg: '#A8FF78' },
//                       { label: 'Missing', val: get.keywordAudit().missingCount,  bg: '#FF6B6B' },
//                       { label: 'ATS Pass %', val: `${get.keywordAudit().atsPredictedPassRate || 0}%`,
//                         bg: '#74B9FF' },
//                     ].map(s => (
//                       <div key={s.label} style={{
//                         border: '2px solid #000', padding: '12px 16px',
//                         textAlign: 'center', background: s.bg,
//                       }}>
//                         <div style={{ fontWeight: 900, fontSize: 28 }}>{s.val}</div>
//                         <div style={{ fontWeight: 700, fontSize: 11,
//                                       textTransform: 'uppercase', marginTop: 2 }}>
//                           {s.label}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Keyword table */}
//                   {get.keywordAudit().keywordDetails?.length > 0 && (
//                     <div style={{ border: '2px solid #000', maxHeight: 360,
//                                   overflowY: 'auto' }}>
//                       {get.keywordAudit().keywordDetails.map((kw, i) => (
//                         <div key={i} style={{
//                           display: 'flex', alignItems: 'center',
//                           justifyContent: 'space-between', padding: '8px 12px',
//                           borderBottom: '1px solid #ddd',
//                           background: kw.status === 'FOUND'   ? '#F0FFF0'
//                                     : kw.status === 'MISSING' ? '#FFF0F0' : '#FFF9E6',
//                         }}>
//                           <span style={{ fontWeight: 700, fontSize: 13 }}>
//                             {kw.keyword}
//                           </span>
//                           <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//                             {kw.importance && (
//                               <span style={{
//                                 fontSize: 11, fontWeight: 700,
//                                 color: kw.importance === 'Critical' ? '#c00'
//                                      : kw.importance === 'Important' ? '#B45309' : '#666',
//                               }}>
//                                 {kw.importance}
//                               </span>
//                             )}
//                             <Tag text={kw.status}
//                                  bg={kw.status === 'FOUND'   ? '#A8FF78'
//                                    : kw.status === 'MISSING' ? '#FF6B6B' : '#FFE566'}
//                                  small />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── EXPERIENCE ANALYSIS ── */}
//             {get.expAnalysis() && (
//               <Card>
//                 <SectionTitle icon={TrendingUp} title="Experience Analysis" color="#74B9FF" />
//                 <div style={{ padding: 20 }}>
//                   <div style={{ display: 'grid',
//                                 gridTemplateColumns: '1fr 1fr', gap: 12,
//                                 marginBottom: 14 }}>
//                     <div style={{ border: '2px solid #000', padding: 12,
//                                   background: '#E8F4FF' }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 4 }}>
//                         Required
//                       </div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>
//                         {get.expAnalysis().requiredYears || 'N/A'}
//                       </div>
//                     </div>
//                     <div style={{ border: '2px solid #000', padding: 12,
//                                   background: '#F0FFF0' }}>
//                       <div style={{ fontWeight: 800, fontSize: 11,
//                                     textTransform: 'uppercase', marginBottom: 4 }}>
//                         Your Experience
//                       </div>
//                       <div style={{ fontWeight: 900, fontSize: 18 }}>
//                         {get.expAnalysis().estimatedResumeYears || 'N/A'}
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: 'flex', gap: 10, marginBottom: 14,
//                                 flexWrap: 'wrap' }}>
//                     {get.expAnalysis().alignmentStatus && (
//                       <Tag text={get.expAnalysis().alignmentStatus}
//                            bg={get.expAnalysis().alignmentStatus === 'Well-matched' ? '#A8FF78'
//                              : get.expAnalysis().alignmentStatus === 'Under-qualified' ? '#FF6B6B' : '#FFE566'} />
//                     )}
//                     {get.expAnalysis().domainRelevance && (
//                       <Tag text={get.expAnalysis().domainRelevance} bg="#E8F4FF" />
//                     )}
//                     {get.expAnalysis().projectComplexityMatch && (
//                       <Tag text={`Project complexity: ${get.expAnalysis().projectComplexityMatch}`}
//                            bg="#F5F0E8" small />
//                     )}
//                   </div>

//                   {get.expAnalysis().seniorityGap && (
//                     <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
//                       <span style={{ fontWeight: 800 }}>Seniority: </span>
//                       {get.expAnalysis().seniorityGap}
//                     </div>
//                   )}
//                   <div style={{ display: 'flex', gap: 8, alignItems: 'center',
//                                 marginBottom: 10 }}>
//                     <span style={{ fontWeight: 800, fontSize: 13 }}>Leadership required:</span>
//                     <span style={{ fontWeight: 700, fontSize: 13 }}>
//                       {get.expAnalysis().leadershipRequiredMet ? '✅ Met' : '❌ Not met'}
//                     </span>
//                   </div>
//                   {get.expAnalysis().details && (
//                     <div style={{ background: '#F5F0E8', border: '2px solid #000',
//                                   padding: '10px 14px', fontSize: 13,
//                                   fontWeight: 600, lineHeight: 1.7 }}>
//                       {get.expAnalysis().details}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── RED FLAGS ── */}
//             {get.redFlags().length > 0 && (
//               <Card>
//                 <SectionTitle icon={AlertTriangle} title="Red Flags ⚠️" color="#FF6B6B" />
//                 <div style={{ padding: 20 }}>
//                   {get.redFlags().map((flag, i) => (
//                     <div key={i} style={{
//                       border: `3px solid ${
//                         flag.severity === 'Dealbreaker' ? '#FF6B6B'
//                         : flag.severity === 'Major' ? '#FFA07A' : '#FFE566'
//                       }`,
//                       padding: '12px 14px', marginBottom: 10,
//                       background: flag.severity === 'Dealbreaker' ? '#FFF0F0'
//                                 : flag.severity === 'Major' ? '#FFF5EE' : '#FFF9E6',
//                     }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between',
//                                     marginBottom: 6 }}>
//                         <span style={{ fontWeight: 800, fontSize: 14 }}>{flag.flag}</span>
//                         <Tag text={flag.severity}
//                              bg={flag.severity === 'Dealbreaker' ? '#FF6B6B'
//                                : flag.severity === 'Major' ? '#FFA07A' : '#FFE566'}
//                              small />
//                       </div>
//                       {flag.impact && (
//                         <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                           {flag.impact}
//                         </div>
//                       )}
//                       {flag.fix && (
//                         <div style={{ fontSize: 12, fontWeight: 700, color: '#2a7a2a',
//                                       marginTop: 6 }}>
//                           💡 Fix: {flag.fix}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── RESUME IMPROVEMENTS FOR THIS JD ── */}
//             {get.improvements().length > 0 && (
//               <Card>
//                 <SectionTitle icon={FileText} title="Resume Improvements for This JD"
//                               color="#A8FF78" />
//                 <div style={{ padding: 20 }}>
//                   {get.improvements().map((imp, i) => (
//                     <div key={i} style={{ border: '3px solid #000', padding: 16,
//                                           marginBottom: 14 }}>
//                       <div style={{ display: 'flex', justifyContent: 'space-between',
//                                     marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
//                         <Tag text={imp.section} bg="#E8F4FF" />
//                         <Tag text={`${imp.priority} Priority`}
//                              bg={imp.priority === 'High' ? '#FF6B6B'
//                                : imp.priority === 'Medium' ? '#FFE566' : '#F5F0E8'} small />
//                       </div>
//                       <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>
//                         Issue: {imp.issue}
//                       </div>
//                       {imp.currentState && (
//                         <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
//                           📍 Current: {imp.currentState}
//                         </div>
//                       )}
//                       <div style={{ background: '#F0FFF0', border: '2px solid #000',
//                                     padding: '10px 12px', marginBottom: 8 }}>
//                         <div style={{ fontWeight: 800, fontSize: 12,
//                                       textTransform: 'uppercase',
//                                       marginBottom: 4, color: '#2a7a2a' }}>
//                           Recommended Change
//                         </div>
//                         <p style={{ fontSize: 13, fontWeight: 700 }}>
//                           {imp.recommendedChange}
//                         </p>
//                       </div>
//                       {imp.reasoning && (
//                         <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
//                           💡 {imp.reasoning}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── TAILORED RESUME CHANGES ── */}
//             {get.tailored() && (
//               <Card>
//                 <SectionTitle icon={Zap} title="Quick Resume Tailoring Tips"
//                               color="#DDA0DD" />
//                 <div style={{ padding: 20 }}>
//                   {get.tailored().summaryRewrite && (
//                     <div style={{ marginBottom: 14 }}>
//                       <div style={{ fontWeight: 800, marginBottom: 6 }}>
//                         Rewrite your summary as:
//                       </div>
//                       <div style={{ background: '#FFF9E6', border: '2px solid #000',
//                                     padding: '10px 14px', fontSize: 13, fontWeight: 600,
//                                     fontStyle: 'italic' }}>
//                         {get.tailored().summaryRewrite}
//                       </div>
//                     </div>
//                   )}
//                   {get.tailored().skillsToAdd?.length > 0 && (
//                     <div style={{ marginBottom: 14 }}>
//                       <div style={{ fontWeight: 800, marginBottom: 8 }}>
//                         Add to your Skills section:
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {get.tailored().skillsToAdd.map((s, i) => (
//                           <Tag key={i} text={s} bg="#A8FF78" small />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                   {get.tailored().skillsToHighlight?.length > 0 && (
//                     <div>
//                       <div style={{ fontWeight: 800, marginBottom: 8 }}>
//                         Move these to the top of your skills:
//                       </div>
//                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//                         {get.tailored().skillsToHighlight.map((s, i) => (
//                           <Tag key={i} text={s} bg="#FFE566" small />
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── SUGGESTIONS / RECOMMENDATIONS ── */}
//             {get.suggestions().length > 0 && (
//               <Card>
//                 <SectionTitle icon={CheckCircle} title="Recommendations" color="#A8FF78" />
//                 <div style={{ padding: 20 }}>
//                   {get.suggestions().map((rec, i) => (
//                     <div key={i} style={{ display: 'flex', gap: 10,
//                                           marginBottom: 10, alignItems: 'flex-start' }}>
//                       <div style={{
//                         background: '#000', color: '#FFE566',
//                         fontWeight: 900, fontSize: 13,
//                         minWidth: 26, height: 26,
//                         display: 'flex', alignItems: 'center',
//                         justifyContent: 'center', flexShrink: 0,
//                       }}>
//                         {i + 1}
//                       </div>
//                       <span style={{ fontSize: 13, fontWeight: 600,
//                                      lineHeight: 1.6 }}>
//                         {rec}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             {/* ── OVERVIEW ── */}
//             {get.overview() && (
//               <Card bg="#FFF9E6">
//                 <SectionTitle icon={Brain} title="Recruiter's Perspective" color="#FFE566" />
//                 <div style={{ padding: 20 }}>
//                   {get.overview().recruiterPerspective && (
//                     <div style={{ background: '#fff', border: '2px solid #000',
//                                   padding: '14px 18px', marginBottom: 14,
//                                   borderLeft: '5px solid #000',
//                                   fontStyle: 'italic', fontSize: 14,
//                                   fontWeight: 600, lineHeight: 1.7 }}>
//                       "{get.overview().recruiterPerspective}"
//                     </div>
//                   )}
//                   <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//                     {get.overview().atsRiskLevel && (
//                       <div style={{ border: '2px solid #000', padding: '8px 14px' }}>
//                         <div style={{ fontWeight: 800, fontSize: 11,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           ATS Risk
//                         </div>
//                         <Tag text={get.overview().atsRiskLevel}
//                              bg={get.overview().atsRiskLevel === 'Low' ? '#A8FF78'
//                                : get.overview().atsRiskLevel === 'Critical' ? '#FF6B6B'
//                                : '#FFE566'} small />
//                       </div>
//                     )}
//                     {get.overview().timeToBeReady && (
//                       <div style={{ border: '2px solid #000', padding: '8px 14px' }}>
//                         <div style={{ fontWeight: 800, fontSize: 11,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           Time To Be Ready
//                         </div>
//                         <div style={{ fontWeight: 700, fontSize: 13 }}>
//                           {get.overview().timeToBeReady}
//                         </div>
//                       </div>
//                     )}
//                     {get.overview().topPriorityFix && (
//                       <div style={{ flex: 1, border: '2px solid #000',
//                                     padding: '8px 14px',
//                                     background: '#FFE566', minWidth: 200 }}>
//                         <div style={{ fontWeight: 800, fontSize: 11,
//                                       textTransform: 'uppercase', marginBottom: 4 }}>
//                           Top Priority Fix
//                         </div>
//                         <div style={{ fontWeight: 700, fontSize: 13 }}>
//                           {get.overview().topPriorityFix}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   {get.overview().atsRiskExplanation && (
//                     <div style={{ marginTop: 12, fontSize: 12, color: '#555',
//                                   fontWeight: 600 }}>
//                       ATS risk: {get.overview().atsRiskExplanation}
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             )}

//             {/* ── RE-ANALYSE ── */}
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
//                 <RefreshCw size={15} /> Analyse Another JD
//               </button>
//             </div>

//           </div>
//           // ← ALL results are inside this single {result && (...)} block
//         )}

//       </div>
//     </div>
//   );
// };

// export default JDMatchPage;






























 
 
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../pages/Navbar';
import { resumeAPI, historyAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Loader2, Target, CheckCircle,
  XCircle, FileText, Send, Home, Upload,
  BarChart3, AlertTriangle, Zap, Brain,
  BookOpen, Award, TrendingUp, AlertCircle,
  Briefcase, Code, Clock, Layers, Star,
  Filter, X, RefreshCw
} from 'lucide-react';
import FeaturePageGuard, { LockedUploadZone, LockedActionButton } from '../components/FeaturePageGuard';
const DOMAINS = [
  { id: 'software-engineer', name: 'Software Engineer', emoji: '💻' },
  { id: 'data-scientist',    name: 'Data Scientist',    emoji: '📊' },
  { id: 'marketing',         name: 'Marketing',         emoji: '📢' },
  { id: 'product-manager',   name: 'Product Manager',   emoji: '📦' },
  { id: 'design',            name: 'Design',            emoji: '🎨' },
  { id: 'sales',             name: 'Sales',             emoji: '💰' },
  { id: 'other',             name: 'Other',             emoji: '✏️' },
];
 
// ─── Reusable primitives ─────────────────────────────────────────
 
const ScoreChip = ({ value, label, max = 100, large = false }) => {
  const n   = Number(value) || 0;
  const pct = max === 100 ? n : Math.round((n / max) * 100);
  const bg  = pct >= 80 ? '#A8FF78' : pct >= 60 ? '#FFE566' : '#FF6B6B';
  const fs  = large ? 52 : 28;
  const pad = large ? '16px 24px' : '10px 14px';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        background: bg, border: '3px solid #000',
        boxShadow: '4px 4px 0 #000', padding: pad,
        fontWeight: 900, fontSize: fs, color: '#000',
        display: 'inline-block', lineHeight: 1,
      }}>
        {value}{max !== 100 ? `/${max}` : ''}
      </div>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6,
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
    padding: small ? '2px 8px' : '5px 12px',
    fontSize: small ? 11 : 12, fontWeight: 700,
    display: 'inline-block', lineHeight: 1.4,
  }}>
    {text}
  </span>
);
 
const SectionTitle = ({ icon: Icon, title, color = '#74B9FF' }) => (
  <div style={{
    background: color, border: '3px solid #000',
    borderBottom: 'none', padding: '12px 20px',
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 900, fontSize: 16, textTransform: 'uppercase',
  }}>
    {Icon && <Icon size={20} />}
    {title}
  </div>
);
 
const Card = ({ children, bg = '#fff', color = '#000' }) => (
  <div style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000',
                marginBottom: 24, background: bg, color }}>
    {children}
  </div>
);
 
// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export const JDMatchPage = () => {
  const [loading, setLoading]   = useState(false);
  const [result,  setResult]    = useState(null);  // full parsed object
  const [file,    setFile]      = useState(null);
  const [formData, setFormData] = useState({
    jobDescription: '',
    targetDomain:   'software-engineer',
  });
  const resultRef = useRef(null);
 
  // file validation
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast.error('PDF only');  return; }
    if (f.size > 5 * 1024 * 1024)    { toast.error('Max 5MB');   return; }
    setFile(f);
  };
 
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)                           { toast.error('Upload your resume PDF'); return; }
    if (!formData.jobDescription.trim()) { toast.error('Paste the job description'); return; }
 
    setLoading(true);
    setResult(null);
 
    try {
      // Step 1 — upload + analyse to extract resumeText
      const fd = new FormData();
      fd.append('file', file);
      fd.append('targetDomain', formData.targetDomain);
      const uploadRes  = await resumeAPI.uploadAndAnalyze(fd);
      const resumeText = uploadRes.data?.resumeText
        || uploadRes.data?.analysis?.resumeText
        || '';
 
      if (!resumeText) throw new Error('Could not extract text from PDF. Try a different file.');
 
      // Step 2 — JD match
      const matchRes = await resumeAPI.matchWithJD({
        resumeText,
        jobDescription: formData.jobDescription,
        targetDomain:   formData.targetDomain,
      });
 
      // Backend returns { result (JSON string), parsed (object), modelUsed }
      // OR the old groqService format: { match_percentage, role_fit_score, ... }
      const data   = matchRes.data;
      const parsed = data?.parsed
        || (data?.result ? (() => {
          try { return JSON.parse(data.result); } catch { return null; }
        })() : null)
        || data;  // fallback: data itself might be the flat object
 
      if (!parsed) throw new Error('Empty response from server. Please retry.');
 
      setResult(parsed);
      toast.success('JD match complete!');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
 
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || err.message || 'Match failed');
    } finally {
      setLoading(false);
    }
  };
 
  // ── Helper: read from both new (parsed) and legacy (flat) structures ──
  // New backend: parsed.matchScore, parsed.scoreBreakdown, parsed.jdAnalysis, etc.
  // Legacy backend: result.match_percentage, result.role_fit_score, etc.
  const get = {
    matchScore:     () => result?.matchScore        ?? result?.match_percentage ?? 0,
    roleFit:        () => result?.rolefit           ?? result?.role_fit_score   ?? 0,
    shouldApply:    () => result?.shouldApply       ?? result?.should_apply     ?? false,
    confidence:     () => result?.applicationConfidence ?? null,
    hiringProb:     () => result?.hiringProbability ?? null,
    matchedSkills:  () => result?.matchedSkills     || result?.matched_keywords  || [],
    missingSkills:  () => result?.missingSkills     || result?.missing_keywords  || [],
    suggestions:    () => result?.suggestions       || result?.recommendations   || [],
    skillGaps:      () => result?.skillGapAnalysis  || null,
    // flat skill_gaps array from legacy
    skillGapsFlat:  () => result?.skill_gaps        || [],
    scoreBreakdown: () => result?.scoreBreakdown    || null,
    jdAnalysis:     () => result?.jdAnalysis        || null,
    keywordAudit:   () => result?.keywordAudit      || null,
    expAnalysis:    () => result?.experienceAnalysis || null,
    redFlags:       () => result?.redFlags          || [],
    improvements:   () => result?.resumeImprovementsForThisJD || [],
    tailored:       () => result?.tailoredResumeChanges || null,
    overview:       () => result?.overview          || null,
    summary:        () => result?.overview?.oneLineSummary
                          || result?.overview?.recruiterPerspective
                          || result?.reasoning || '',
  };
 
  // ── Score color util ──
  const scoreColor = (n) => {
    const v = Number(n) || 0;
    return v >= 80 ? '#A8FF78' : v >= 60 ? '#FFE566' : '#FF6B6B';
  };
 
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-neo-offwhite">
 <FeaturePageGuard action="jd_match" /> 
      {/* ── NAVBAR ── */}
      <Navbar />
 
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
 
        {/* ── FORM CARD ── */}
        <div style={{ background: '#fff', border: '3px solid #000',
                      boxShadow: '7px 7px 0 #000', padding: 32 }}>
 
          <div className="flex items-center gap-4 mb-8">
            <div style={{ width: 64, height: 64, background: '#74B9FF',
                          border: '3px solid #000',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center' }}>
              <Target size={28} />
            </div>
            <div>
              <h1 className="font-space text-3xl font-extrabold">JD MATCH</h1>
              <p style={{ color: '#666', fontWeight: 600 }}>
                Deep ATS analysis · Skill gap detection · Recruiter perspective
              </p>
            </div>
          </div>
 
          <form onSubmit={handleSubmit} className="space-y-6">
 
            {/* Domain selector */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
                Target Domain
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {DOMAINS.map(d => (
                  <button key={d.id} type="button"
                    onClick={() => setFormData({ ...formData, targetDomain: d.id })}
                    style={{
                      background: formData.targetDomain === d.id ? '#FFE566' : '#fff',
                      border: '3px solid #000', padding: '8px 16px',
                      fontWeight: 800, cursor: 'pointer', fontSize: 13,
                      boxShadow: formData.targetDomain === d.id
                        ? '2px 2px 0 #000' : '4px 4px 0 #000',
                      transform: formData.targetDomain === d.id
                        ? 'translate(2px,2px)' : 'none',
                      transition: 'all 0.1s',
                    }}>
                    {d.emoji} {d.name}
                  </button>
                ))}
              </div>
            </div>
 
            {/* PDF upload */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
                Resume PDF <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <LockedUploadZone action="jd_match">
                <div
                  onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                  style={{
                    border: '3px dashed #000',
                    background: file ? '#A8FF78' : '#F5F0E8',
                    padding: 28, textAlign: 'center', transition: 'background 0.2s',
                  }}>
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <FileText size={26} />
                      <span style={{ fontWeight: 800 }}>{file.name}</span>
                      <span style={{ fontSize: 12, color: '#555' }}>
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                      <button type="button" onClick={() => setFile(null)}
                        style={{ background: '#FF6B6B', border: '2px solid #000',
                                 padding: '2px 8px', cursor: 'pointer', fontWeight: 900 }}>
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={36} style={{ margin: '0 auto 12px',
                                                 display: 'block', opacity: 0.4 }} />
                      <label style={{ cursor: 'pointer' }}>
                        <span style={{
                          background: '#FFE566', border: '3px solid #000',
                          boxShadow: '3px 3px 0 #000', padding: '10px 24px',
                          fontWeight: 800, display: 'inline-block',
                        }}>
                          Browse or Drop PDF
                        </span>
                        <input type="file" accept=".pdf" className="hidden"
                               onChange={handleFileChange} />
                      </label>
                      <p style={{ marginTop: 10, fontSize: 12, color: '#888',
                                  fontWeight: 600 }}>
                        PDF only · Max 5MB
                      </p>
                    </>
                  )}
                </div>
              </LockedUploadZone>
            </div>
 
            {/* JD textarea */}
            <div>
              <label style={{ fontWeight: 800, display: 'block', marginBottom: 10 }}>
                Job Description <span style={{ color: '#FF6B6B' }}>*</span>
              </label>
              <textarea
                value={formData.jobDescription}
                onChange={e => setFormData({ ...formData, jobDescription: e.target.value })}
                placeholder="Paste the full job description here..."
                rows={10}
                style={{ width: '100%', border: '3px solid #000',
                         padding: '12px 16px', fontWeight: 600, fontSize: 14,
                         outline: 'none', resize: 'vertical',
                         boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
 
            {/* Submit */}
            <LockedActionButton
              action="jd_match"
              onClick={handleSubmit}
              disabled={loading || !file}
              style={{
                width: '100%', background: loading || !file ? '#ccc' : '#000', color: '#fff',
                border: '3px solid #000', boxShadow: loading || !file ? 'none' : '5px 5px 0 #74B9FF',
                padding: 16, fontWeight: 900, fontSize: 16,
                cursor: loading || !file ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase', letterSpacing: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
            >
              {loading
                ? <><Loader2 size={20} className="animate-spin" /> Analysing match...</>
                : <><Target size={20} /> Analyse JD Match</>}
            </LockedActionButton>
          </form>
        </div>
 
        {/* ════════════════════════════════════════════════════════
            ALL RESULTS — single guard block, no null crash
        ════════════════════════════════════════════════════════ */}
        {result && (
          <div ref={resultRef} className="space-y-6">
 
            {/* ── TOP SCORES ── */}
            <div style={{ background: '#000', color: '#fff',
                          border: '3px solid #000',
                          boxShadow: '7px 7px 0 #74B9FF',
                          padding: '24px 28px' }}>
 
              {/* Verdict */}
              {get.overview() && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700,
                                textTransform: 'uppercase', marginBottom: 8 }}>
                    Verdict
                  </div>
                  <span style={{
                    background: scoreColor(get.matchScore()),
                    border: '3px solid #fff',
                    padding: '8px 18px', fontWeight: 900, fontSize: 14,
                    textTransform: 'uppercase', color: '#000',
                    display: 'inline-block',
                  }}>
                    {get.overview()?.verdict || (get.matchScore() >= 75
                      ? 'GOOD MATCH' : get.matchScore() >= 55
                      ? 'PARTIAL MATCH' : 'WEAK MATCH')}
                  </span>
                </div>
              )}
 
              {/* Score chips */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap',
                            alignItems: 'flex-end', marginBottom: 20 }}>
                <ScoreChip value={get.matchScore()} label="Match Score" large />
                {get.roleFit() > 0 && (
                  <ScoreChip value={get.roleFit()} label="Role Fit" large />
                )}
                {get.confidence() && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: '#1a1a1a', border: '2px solid #444',
                      padding: '14px 18px', fontWeight: 900,
                      fontSize: 16, color: '#FFE566',
                    }}>
                      {get.confidence()}
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 4,
                                  fontWeight: 700, textTransform: 'uppercase' }}>
                      Confidence
                    </div>
                  </div>
                )}
                {get.hiringProb() && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: '#1a1a1a', border: '2px solid #444',
                      padding: '14px 18px', fontWeight: 900,
                      fontSize: 16, color: '#A8FF78',
                    }}>
                      {get.hiringProb()}
                    </div>
                    <div style={{ fontSize: 10, color: '#aaa', marginTop: 4,
                                  fontWeight: 700, textTransform: 'uppercase' }}>
                      Hiring Probability
                    </div>
                  </div>
                )}
              </div>
 
              {/* Should apply */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                            marginBottom: 16 }}>
                <span style={{ fontWeight: 700, color: '#aaa', fontSize: 13 }}>
                  Should Apply:
                </span>
                <span style={{
                  background: get.shouldApply() ? '#A8FF78' : '#FF6B6B',
                  border: '2px solid #fff', padding: '4px 14px',
                  fontWeight: 900, fontSize: 14, color: '#000',
                }}>
                  {get.shouldApply() ? '✅ YES — Apply!' : '❌ NOT RECOMMENDED'}
                </span>
              </div>
 
              {/* One-line summary */}
              {get.summary() && (
                <div style={{ background: '#1a1a1a', border: '2px solid #444',
                              padding: '10px 14px', fontSize: 13,
                              fontStyle: 'italic', color: '#ddd' }}>
                  "{get.summary()}"
                </div>
              )}
            </div>
 
            {/* ── SCORE BREAKDOWN (new backend) ── */}
            {get.scoreBreakdown() && (
              <Card>
                <SectionTitle icon={BarChart3} title="Score Breakdown" color="#74B9FF" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(130px,1fr))',
                                gap: 12, marginBottom: 14 }}>
                    {[
                      { label: 'Technical',  value: get.scoreBreakdown().technicalSkillsScore,  max: 40 },
                      { label: 'Experience', value: get.scoreBreakdown().experienceLevelScore,  max: 25 },
                      { label: 'Keywords',   value: get.scoreBreakdown().keywordDensityScore,   max: 20 },
                      { label: 'Domain',     value: get.scoreBreakdown().domainKnowledgeScore,  max: 15 },
                    ].map(item => (
                      <ScoreChip key={item.label} value={item.value || 0}
                                 label={item.label} max={item.max} />
                    ))}
                  </div>
                  {get.scoreBreakdown().breakdown_explanation && (
                    <div style={{ background: '#FFF9E6', border: '2px solid #000',
                                  padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>
                      💡 {get.scoreBreakdown().breakdown_explanation}
                    </div>
                  )}
                </div>
              </Card>
            )}
 
            {/* ── MATCHED + MISSING KEYWORDS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {get.matchedSkills().length > 0 && (
                <Card bg="#F0FFF0">
                  <SectionTitle icon={CheckCircle} title="Matched Keywords" color="#A8FF78" />
                  <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {get.matchedSkills().map((kw, i) => (
                      <Tag key={i} text={kw} bg="#A8FF78" />
                    ))}
                  </div>
                </Card>
              )}
              {get.missingSkills().length > 0 && (
                <Card bg="#FFF0F0">
                  <SectionTitle icon={XCircle} title="Missing Keywords" color="#FF6B6B" />
                  <div style={{ padding: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {get.missingSkills().map((kw, i) => (
                      <Tag key={i} text={kw} bg="#FF6B6B" />
                    ))}
                  </div>
                </Card>
              )}
            </div>
 
            {/* ── JD ANALYSIS ── */}
            {get.jdAnalysis() && (
              <Card>
                <SectionTitle icon={Briefcase} title="Job Description Analysis" color="#FFE566" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {/* Left col */}
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 8,
                                    display: 'flex', alignItems: 'center', gap: 6 }}>
                        <TrendingUp size={15} /> Seniority Level
                      </div>
                      <Tag text={get.jdAnalysis().seniorityLevel || 'Not specified'}
                           bg="#FFE566" />
 
                      <div style={{ fontWeight: 800, margin: '16px 0 8px',
                                    display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={15} /> Experience Required
                      </div>
                      <Tag text={get.jdAnalysis().estimatedYearsRequired || 'Not specified'}
                           bg="#E8F4FF" />
 
                      <div style={{ fontWeight: 800, margin: '16px 0 8px',
                                    display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Code size={15} /> Primary Tech Stack
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(get.jdAnalysis().primaryTechStack || []).map((t, i) => (
                          <Tag key={i} text={t} bg="#74B9FF" small />
                        ))}
                      </div>
 
                      <div style={{ fontWeight: 800, margin: '16px 0 8px',
                                    display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Layers size={15} /> Secondary Stack
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(get.jdAnalysis().secondaryTechStack || []).map((t, i) => (
                          <Tag key={i} text={t} bg="#F5F0E8" small />
                        ))}
                      </div>
                    </div>
 
                    {/* Right col */}
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 8,
                                    display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Star size={15} color="#c00" /> Must-Have Requirements
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {(get.jdAnalysis().mustHaveRequirements || []).map((r, i) => (
                          <li key={i} style={{ display: 'flex', gap: 6,
                                               marginBottom: 6, fontSize: 13,
                                               fontWeight: 600, alignItems: 'flex-start' }}>
                            <XCircle size={13} style={{ color: '#c00', flexShrink: 0,
                                                         marginTop: 2 }} />
                            {r}
                          </li>
                        ))}
                      </ul>
 
                      <div style={{ fontWeight: 800, margin: '14px 0 8px',
                                    display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Filter size={15} color="#B45309" /> Nice-to-Have
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {(get.jdAnalysis().niceToHaveRequirements || []).map((r, i) => (
                          <li key={i} style={{ display: 'flex', gap: 6,
                                               marginBottom: 6, fontSize: 13,
                                               fontWeight: 600, alignItems: 'flex-start' }}>
                            <CheckCircle size={13} style={{ color: '#B45309',
                                                             flexShrink: 0, marginTop: 2 }} />
                            {r}
                          </li>
                        ))}
                      </ul>
 
                      {get.jdAnalysis().hiddenRequirements?.length > 0 && (
                        <>
                          <div style={{ fontWeight: 800, margin: '14px 0 8px',
                                        fontSize: 12, textTransform: 'uppercase' }}>
                            Hidden Requirements
                          </div>
                          {get.jdAnalysis().hiddenRequirements.map((r, i) => (
                            <div key={i} style={{ fontSize: 12, fontWeight: 600,
                                                  color: '#555', marginBottom: 4 }}>
                              → {r}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
 
            {/* ── SKILL GAP ANALYSIS (new backend object) ── */}
            {get.skillGaps() && (
              <Card>
                <SectionTitle icon={Zap} title="Skill Gap Analysis" color="#FFE566" />
                <div style={{ padding: 20 }}>
 
                  {/* Perfect matches */}
                  {get.skillGaps().perfectMatches?.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 14,
                                    marginBottom: 10, display: 'flex',
                                    alignItems: 'center', gap: 6 }}>
                        <CheckCircle size={16} style={{ color: '#2a7a2a' }} />
                        Perfect Matches ({get.skillGaps().perfectMatches.length})
                      </div>
                      {get.skillGaps().perfectMatches.map((m, i) => (
                        <div key={i} style={{
                          border: '2px solid #000', padding: '10px 14px',
                          marginBottom: 8, background: '#F0FFF0',
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'flex-start', gap: 12,
                        }}>
                          <div>
                            <div style={{ fontWeight: 800 }}>{m.skill}</div>
                            {m.resumeEvidence && (
                              <div style={{ fontSize: 12, color: '#555',
                                            fontWeight: 600, marginTop: 3 }}>
                                {m.resumeEvidence}
                              </div>
                            )}
                          </div>
                          {m.confidenceLevel && (
                            <Tag text={m.confidenceLevel} bg="#A8FF78" small />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
 
                  {/* Partial matches */}
                  {get.skillGaps().partialMatches?.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 14,
                                    marginBottom: 10, display: 'flex',
                                    alignItems: 'center', gap: 6 }}>
                        <AlertCircle size={16} style={{ color: '#B45309' }} />
                        Partial Matches ({get.skillGaps().partialMatches.length})
                      </div>
                      {get.skillGaps().partialMatches.map((m, i) => (
                        <div key={i} style={{
                          border: '2px solid #000', padding: '12px 14px',
                          marginBottom: 8, background: '#FFF9E6',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between',
                                        marginBottom: 6 }}>
                            <span style={{ fontWeight: 800 }}>{m.skill}</span>
                            {m.severity && (
                              <Tag text={m.severity}
                                   bg={m.severity === 'Major' ? '#FF6B6B'
                                     : m.severity === 'Moderate' ? '#FFE566' : '#F5F0E8'}
                                   small />
                            )}
                          </div>
                          {m.jdRequirement && (
                            <div style={{ fontSize: 12, fontWeight: 600 }}>
                              JD needs: {m.jdRequirement}
                            </div>
                          )}
                          {m.resumeEvidence && (
                            <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
                              Resume has: {m.resumeEvidence}
                            </div>
                          )}
                          {m.gap && (
                            <div style={{ fontSize: 12, color: '#c00',
                                          fontWeight: 700, marginTop: 4 }}>
                              Gap: {m.gap}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
 
                  {/* Critical missing */}
                  {get.skillGaps().criticalMissing?.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontWeight: 800, fontSize: 14,
                                    marginBottom: 10, display: 'flex',
                                    alignItems: 'center', gap: 6, color: '#c00' }}>
                        <XCircle size={16} />
                        Critical Missing ({get.skillGaps().criticalMissing.length})
                      </div>
                      {get.skillGaps().criticalMissing.map((s, i) => (
                        <div key={i} style={{
                          border: '3px solid #FF6B6B', padding: '12px 14px',
                          marginBottom: 8, background: '#FFF0F0',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between',
                                        marginBottom: 8 }}>
                            <span style={{ fontWeight: 800, color: '#c00' }}>
                              {s.skill}
                            </span>
                            {s.priority && (
                              <Tag text={s.priority}
                                   bg={s.priority?.includes('P0') ? '#FF6B6B'
                                     : s.priority?.includes('P1') ? '#FFE566' : '#F5F0E8'}
                                   small />
                            )}
                          </div>
                          {s.whyItMatters && (
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                              Why: {s.whyItMatters}
                            </div>
                          )}
                          {s.howToFix && (
                            <div style={{ fontSize: 12, fontWeight: 700,
                                          color: '#2a7a2a', marginBottom: 4 }}>
                              Fix: {s.howToFix}
                            </div>
                          )}
                          {s.timeToLearn && (
                            <div style={{ fontSize: 12, color: '#666',
                                          display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={12} /> {s.timeToLearn}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
 
                  {/* Bonus skills */}
                  {get.skillGaps().bonusSkills?.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14,
                                    marginBottom: 10, display: 'flex',
                                    alignItems: 'center', gap: 6 }}>
                        <Award size={16} style={{ color: '#7B2D8B' }} />
                        Bonus Skills (you have these, JD doesn't require)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {get.skillGaps().bonusSkills.map((s, i) => (
                          <div key={i} style={{ border: '2px solid #000',
                                                padding: '8px 12px',
                                                background: '#F8F4FF' }}>
                            <div style={{ fontWeight: 800, fontSize: 13 }}>{s.skill}</div>
                            {s.relevance && (
                              <div style={{ fontSize: 11, color: '#555',
                                            fontWeight: 600, marginTop: 2 }}>
                                {s.relevance}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
 
            {/* ── SKILL GAPS (legacy flat array) ── */}
            {!get.skillGaps() && get.skillGapsFlat().length > 0 && (
              <Card>
                <SectionTitle icon={Zap} title="Skill Gaps" color="#FFE566" />
                <div style={{ padding: 20 }}>
                  {get.skillGapsFlat().map((gap, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8,
                                          marginBottom: 8, alignItems: 'flex-start' }}>
                      <XCircle size={15} style={{ color: '#c00', flexShrink: 0,
                                                   marginTop: 2 }} />
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{gap}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
 
            {/* ── KEYWORD AUDIT ── */}
            {get.keywordAudit() && (
              <Card>
                <SectionTitle icon={BookOpen} title="Keyword Audit" color="#A8FF78" />
                <div style={{ padding: 20 }}>
                  {/* Stats */}
                  <div style={{ display: 'grid',
                                gridTemplateColumns: 'repeat(3,1fr)',
                                gap: 12, marginBottom: 16 }}>
                    {[
                      { label: 'Matched', val: get.keywordAudit().matchedCount, bg: '#A8FF78' },
                      { label: 'Missing', val: get.keywordAudit().missingCount,  bg: '#FF6B6B' },
                      { label: 'ATS Pass %', val: `${get.keywordAudit().atsPredictedPassRate || 0}%`,
                        bg: '#74B9FF' },
                    ].map(s => (
                      <div key={s.label} style={{
                        border: '2px solid #000', padding: '12px 16px',
                        textAlign: 'center', background: s.bg,
                      }}>
                        <div style={{ fontWeight: 900, fontSize: 28 }}>{s.val}</div>
                        <div style={{ fontWeight: 700, fontSize: 11,
                                      textTransform: 'uppercase', marginTop: 2 }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
 
                  {/* Keyword table */}
                  {get.keywordAudit().keywordDetails?.length > 0 && (
                    <div style={{ border: '2px solid #000', maxHeight: 360,
                                  overflowY: 'auto' }}>
                      {get.keywordAudit().keywordDetails.map((kw, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'space-between', padding: '8px 12px',
                          borderBottom: '1px solid #ddd',
                          background: kw.status === 'FOUND'   ? '#F0FFF0'
                                    : kw.status === 'MISSING' ? '#FFF0F0' : '#FFF9E6',
                        }}>
                          <span style={{ fontWeight: 700, fontSize: 13 }}>
                            {kw.keyword}
                          </span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            {kw.importance && (
                              <span style={{
                                fontSize: 11, fontWeight: 700,
                                color: kw.importance === 'Critical' ? '#c00'
                                     : kw.importance === 'Important' ? '#B45309' : '#666',
                              }}>
                                {kw.importance}
                              </span>
                            )}
                            <Tag text={kw.status}
                                 bg={kw.status === 'FOUND'   ? '#A8FF78'
                                   : kw.status === 'MISSING' ? '#FF6B6B' : '#FFE566'}
                                 small />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}
 
            {/* ── EXPERIENCE ANALYSIS ── */}
            {get.expAnalysis() && (
              <Card>
                <SectionTitle icon={TrendingUp} title="Experience Analysis" color="#74B9FF" />
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'grid',
                                gridTemplateColumns: '1fr 1fr', gap: 12,
                                marginBottom: 14 }}>
                    <div style={{ border: '2px solid #000', padding: 12,
                                  background: '#E8F4FF' }}>
                      <div style={{ fontWeight: 800, fontSize: 11,
                                    textTransform: 'uppercase', marginBottom: 4 }}>
                        Required
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 18 }}>
                        {get.expAnalysis().requiredYears || 'N/A'}
                      </div>
                    </div>
                    <div style={{ border: '2px solid #000', padding: 12,
                                  background: '#F0FFF0' }}>
                      <div style={{ fontWeight: 800, fontSize: 11,
                                    textTransform: 'uppercase', marginBottom: 4 }}>
                        Your Experience
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 18 }}>
                        {get.expAnalysis().estimatedResumeYears || 'N/A'}
                      </div>
                    </div>
                  </div>
 
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14,
                                flexWrap: 'wrap' }}>
                    {get.expAnalysis().alignmentStatus && (
                      <Tag text={get.expAnalysis().alignmentStatus}
                           bg={get.expAnalysis().alignmentStatus === 'Well-matched' ? '#A8FF78'
                             : get.expAnalysis().alignmentStatus === 'Under-qualified' ? '#FF6B6B' : '#FFE566'} />
                    )}
                    {get.expAnalysis().domainRelevance && (
                      <Tag text={get.expAnalysis().domainRelevance} bg="#E8F4FF" />
                    )}
                    {get.expAnalysis().projectComplexityMatch && (
                      <Tag text={`Project complexity: ${get.expAnalysis().projectComplexityMatch}`}
                           bg="#F5F0E8" small />
                    )}
                  </div>
 
                  {get.expAnalysis().seniorityGap && (
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      <span style={{ fontWeight: 800 }}>Seniority: </span>
                      {get.expAnalysis().seniorityGap}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center',
                                marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 13 }}>Leadership required:</span>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      {get.expAnalysis().leadershipRequiredMet ? '✅ Met' : '❌ Not met'}
                    </span>
                  </div>
                  {get.expAnalysis().details && (
                    <div style={{ background: '#F5F0E8', border: '2px solid #000',
                                  padding: '10px 14px', fontSize: 13,
                                  fontWeight: 600, lineHeight: 1.7 }}>
                      {get.expAnalysis().details}
                    </div>
                  )}
                </div>
              </Card>
            )}
 
            {/* ── RED FLAGS ── */}
            {get.redFlags().length > 0 && (
              <Card>
                <SectionTitle icon={AlertTriangle} title="Red Flags ⚠️" color="#FF6B6B" />
                <div style={{ padding: 20 }}>
                  {get.redFlags().map((flag, i) => (
                    <div key={i} style={{
                      border: `3px solid ${
                        flag.severity === 'Dealbreaker' ? '#FF6B6B'
                        : flag.severity === 'Major' ? '#FFA07A' : '#FFE566'
                      }`,
                      padding: '12px 14px', marginBottom: 10,
                      background: flag.severity === 'Dealbreaker' ? '#FFF0F0'
                                : flag.severity === 'Major' ? '#FFF5EE' : '#FFF9E6',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                                    marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>{flag.flag}</span>
                        <Tag text={flag.severity}
                             bg={flag.severity === 'Dealbreaker' ? '#FF6B6B'
                               : flag.severity === 'Major' ? '#FFA07A' : '#FFE566'}
                             small />
                      </div>
                      {flag.impact && (
                        <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
                          {flag.impact}
                        </div>
                      )}
                      {flag.fix && (
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#2a7a2a',
                                      marginTop: 6 }}>
                          💡 Fix: {flag.fix}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
 
            {/* ── RESUME IMPROVEMENTS FOR THIS JD ── */}
            {get.improvements().length > 0 && (
              <Card>
                <SectionTitle icon={FileText} title="Resume Improvements for This JD"
                              color="#A8FF78" />
                <div style={{ padding: 20 }}>
                  {get.improvements().map((imp, i) => (
                    <div key={i} style={{ border: '3px solid #000', padding: 16,
                                          marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                                    marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                        <Tag text={imp.section} bg="#E8F4FF" />
                        <Tag text={`${imp.priority} Priority`}
                             bg={imp.priority === 'High' ? '#FF6B6B'
                               : imp.priority === 'Medium' ? '#FFE566' : '#F5F0E8'} small />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>
                        Issue: {imp.issue}
                      </div>
                      {imp.currentState && (
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                          📍 Current: {imp.currentState}
                        </div>
                      )}
                      <div style={{ background: '#F0FFF0', border: '2px solid #000',
                                    padding: '10px 12px', marginBottom: 8 }}>
                        <div style={{ fontWeight: 800, fontSize: 12,
                                      textTransform: 'uppercase',
                                      marginBottom: 4, color: '#2a7a2a' }}>
                          Recommended Change
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>
                          {imp.recommendedChange}
                        </p>
                      </div>
                      {imp.reasoning && (
                        <div style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
                          💡 {imp.reasoning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
 
            {/* ── TAILORED RESUME CHANGES ── */}
            {get.tailored() && (
              <Card>
                <SectionTitle icon={Zap} title="Quick Resume Tailoring Tips"
                              color="#DDA0DD" />
                <div style={{ padding: 20 }}>
                  {get.tailored().summaryRewrite && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>
                        Rewrite your summary as:
                      </div>
                      <div style={{ background: '#FFF9E6', border: '2px solid #000',
                                    padding: '10px 14px', fontSize: 13, fontWeight: 600,
                                    fontStyle: 'italic' }}>
                        {get.tailored().summaryRewrite}
                      </div>
                    </div>
                  )}
                  {get.tailored().skillsToAdd?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>
                        Add to your Skills section:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {get.tailored().skillsToAdd.map((s, i) => (
                          <Tag key={i} text={s} bg="#A8FF78" small />
                        ))}
                      </div>
                    </div>
                  )}
                  {get.tailored().skillsToHighlight?.length > 0 && (
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>
                        Move these to the top of your skills:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {get.tailored().skillsToHighlight.map((s, i) => (
                          <Tag key={i} text={s} bg="#FFE566" small />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
 
            {/* ── SUGGESTIONS / RECOMMENDATIONS ── */}
            {get.suggestions().length > 0 && (
              <Card>
                <SectionTitle icon={CheckCircle} title="Recommendations" color="#A8FF78" />
                <div style={{ padding: 20 }}>
                  {get.suggestions().map((rec, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10,
                                          marginBottom: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        background: '#000', color: '#FFE566',
                        fontWeight: 900, fontSize: 13,
                        minWidth: 26, height: 26,
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600,
                                     lineHeight: 1.6 }}>
                        {rec}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
 
            {/* ── OVERVIEW ── */}
            {get.overview() && (
              <Card bg="#FFF9E6">
                <SectionTitle icon={Brain} title="Recruiter's Perspective" color="#FFE566" />
                <div style={{ padding: 20 }}>
                  {get.overview().recruiterPerspective && (
                    <div style={{ background: '#fff', border: '2px solid #000',
                                  padding: '14px 18px', marginBottom: 14,
                                  borderLeft: '5px solid #000',
                                  fontStyle: 'italic', fontSize: 14,
                                  fontWeight: 600, lineHeight: 1.7 }}>
                      "{get.overview().recruiterPerspective}"
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {get.overview().atsRiskLevel && (
                      <div style={{ border: '2px solid #000', padding: '8px 14px' }}>
                        <div style={{ fontWeight: 800, fontSize: 11,
                                      textTransform: 'uppercase', marginBottom: 4 }}>
                          ATS Risk
                        </div>
                        <Tag text={get.overview().atsRiskLevel}
                             bg={get.overview().atsRiskLevel === 'Low' ? '#A8FF78'
                               : get.overview().atsRiskLevel === 'Critical' ? '#FF6B6B'
                               : '#FFE566'} small />
                      </div>
                    )}
                    {get.overview().timeToBeReady && (
                      <div style={{ border: '2px solid #000', padding: '8px 14px' }}>
                        <div style={{ fontWeight: 800, fontSize: 11,
                                      textTransform: 'uppercase', marginBottom: 4 }}>
                          Time To Be Ready
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {get.overview().timeToBeReady}
                        </div>
                      </div>
                    )}
                    {get.overview().topPriorityFix && (
                      <div style={{ flex: 1, border: '2px solid #000',
                                    padding: '8px 14px',
                                    background: '#FFE566', minWidth: 200 }}>
                        <div style={{ fontWeight: 800, fontSize: 11,
                                      textTransform: 'uppercase', marginBottom: 4 }}>
                          Top Priority Fix
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {get.overview().topPriorityFix}
                        </div>
                      </div>
                    )}
                  </div>
                  {get.overview().atsRiskExplanation && (
                    <div style={{ marginTop: 12, fontSize: 12, color: '#555',
                                  fontWeight: 600 }}>
                      ATS risk: {get.overview().atsRiskExplanation}
                    </div>
                  )}
                </div>
              </Card>
            )}
 
            {/* ── RE-ANALYSE ── */}
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
                <RefreshCw size={15} /> Analyse Another JD
              </button>
            </div>
 
          </div>
          // ← ALL results are inside this single {result && (...)} block
        )}
 
      </div>
    </div>
  );
};
 
export default JDMatchPage;