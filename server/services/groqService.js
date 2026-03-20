// // /**
// //  * Groq AI Service - RESUME ANALYSIS ONLY
// //  * Model: llama-3.3-70b-versatile
// //  * 
// //  * This service is ONLY responsible for analyzing resumes.
// //  * All generation tasks (cover letter, JD match, resume rewrite, outreach)
// //  * are handled by openRouterService.js
// //  */

// // const { Groq } = require('groq-sdk');
// // require('dotenv').config();

// // const groq = new Groq({
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // // Domain-specific analysis prompts
// // const domainPrompts = {
// //   'software-engineer': `
// //     Focus on technical skills, programming languages, software development practices, system design, and project experience.
// //     Look for: coding languages, frameworks, databases, cloud platforms, DevOps tools, software architecture, algorithms, data structures.
// //     Evaluate: technical depth, project complexity, problem-solving abilities, code quality practices, team collaboration.
// //   `,
// //   'data-scientist': `
// //     Evaluate data analysis skills, machine learning expertise, statistical knowledge, programming proficiency, and research experience.
// //     Look for: Python/R, SQL, machine learning libraries, statistical methods, data visualization, big data tools, research publications.
// //     Evaluate: analytical thinking, model building, data storytelling, business impact, technical communication.
// //   `,
// //   'marketing': `
// //     Assess marketing strategy knowledge, campaign management, digital marketing skills, analytics understanding, and creative abilities.
// //     Look for: digital marketing channels, analytics tools, campaign metrics, content creation, brand management, market research.
// //     Evaluate: strategic thinking, creativity, data-driven decision making, ROI optimization, customer understanding.
// //   `,
// //   'product-manager': `
// //     Review product strategy, stakeholder management, technical understanding, market analysis, and leadership experience.
// //     Look for: product lifecycle, user research, roadmap planning, cross-functional collaboration, metrics tracking, market analysis.
// //     Evaluate: strategic vision, leadership skills, technical acumen, user empathy, business impact.
// //   `,
// //   'design': `
// //     Focus on design thinking, user experience, visual design skills, portfolio quality, and creative problem-solving.
// //     Look for: design tools, UX/UI principles, user research, prototyping, design systems, accessibility, portfolio projects.
// //     Evaluate: creative thinking, user-centered design, visual aesthetics, problem-solving, design process.
// //   `,
// //   'sales': `
// //     Evaluate sales performance, relationship building, negotiation skills, CRM proficiency, and revenue generation.
// //     Look for: sales metrics, CRM tools, lead generation, client relationships, negotiation experience, revenue targets.
// //     Evaluate: communication skills, relationship building, results orientation, persistence, customer focus.
// //   `,
// //   'other': `
// //     Evaluate your resume for a specific role, focusing on relevant skills and experience.
// //     Look for: specific job responsibilities, project experience, soft skills, and soft skills.
// //     Evaluate: specific job responsibilities, project experience, soft skills, and soft skills.
// //     Provide general professional analysis focusing on relevant skills and experience.
// //     you can also provide some general feedback on how to improve the resume for any role, such as formatting, grammar, and clarity.
// //   `,
// // };


// // async function analyzeResumeWithGroq(resumeText, targetDomain) {
// //   const domainContext = domainPrompts[targetDomain] || 'Provide general professional analysis focusing on relevant skills and experience.';

// //   const prompt = `
// //     You are a cynical, strict Senior Recruiter and Hiring Manager at a top-tier tech firm (FAANG level). 
// //     Your job is to critically audit this resume for a ${targetDomain.replace('-', ' ')} position. 
// //     DO NOT be polite. DO NOT give participation points.
    
// //     Your Goal: Distinguish between a "candidate who did the job" and a "candidate who drove results."
// //     Be harsh but constructive. Your feedback should be brutally honest, actionable, and focused on real-world impact.
// //     You are not just looking for relevant skills, but for demonstrated outcomes and business impact. 
// //     If the resume lacks specific metrics or clear results, call it out as a major weakness.
    
// //     DOMAIN STANDARDS:
// //     ${domainContext}

// //     RESUME CONTENT:
// //     "${resumeText}"

// //     STRICT ANALYSIS RULES:
// //     1.  **Scoring:** Be harsh. A score of 80+ should only be for resumes that include clear metrics ($, %, time saved) and zero errors. 
// //     2.  **Fluff Detection:** Heavily penalize phrases like "Responsible for," "Worked on," or "Assisted with" if they are not followed by a specific outcome.
// //     3.  **Technical Validity:** If a user lists a skill (e.g., "React") but shows no project/experience using it, mark it as a weak point.
// //     4.  **Consistency:** Cross-reference the "Skills" section with the "Experience" section. Mismatches are a red flag.

// //     REQUIRED JSON OUTPUT STRUCTURE (Must be exact):
// //     1. Overall Score (0-100): Weighted average. Deduct points for generic descriptions.
// //     2. ATS Compatibility (0-100): Deduct for tables, columns, icons, or lack of standard headers.
// //     3. Grammar Score (0-100): Deduct for typos, tense inconsistencies, and passive voice.
// //     4. Readability (0-100): Deduct for dense blocks of text or lack of bullet points.
// //     5. Experience Match (0-100): How well do the SPECIFIC projects/roles map to the ${targetDomain} domain?
// //     6. Strengths: 6-7 genuine competitive advantages (e.g., "Quantified impact in 3 roles").
// //     7. Weaknesses: 6-7 critical flaws (e.g., "Vague descriptions," "Tech stack listed but not demonstrated").
// //     8. Improvements: 6-10 specific fixes. "Add metrics" is too vague; say "Quantify the API optimization in the 2nd job."
// //     9. Hard Skills: Extracted from text.
// //     10. Soft Skills: Extracted from text.
// //     11. Keywords: Existing keywords found.
// //     12. Missing Keywords: Critical industry terms missing (be specific to ${targetDomain}).
// //     13. Sections Detected: List sections found.
// //     14. Missing Sections: List standard sections missing (Projects, Education, etc.).
// //     15. Formatting Issues: List specific layout problems.
// //     16. Grammar Issues: List specific examples of bad grammar.
// //     17. Bullet Point Improvements: Rewrite weak bullets into high-impact "XYZ format" (Accomplished [X] as measured by [Y], by doing [Z]).Generate at least 4 improvements.
// //     18. Scam/Overclaim Detection: Find out some scam or overclaim which dont applied on real life , such as scam dates and certificates that dont add any sense .
// //     19. Summary: Brutally honest executive summary woth some improvements that the user can do to make it better.Give atleast 4 - 5 lines of summary .
// //     20. Top Projects: Analyze projects based on complexity and technologies used. Score them strictly (0-10). A '10' requires complex architecture + business impact. Give top 4 projects with name, score, and reason.
// //     21. Interview Questions: Hard technical and behavioral questions based on specific claims in the resume. Generate MINIMUM 9 questions (3 Hard, 3 Medium, 3 Easy). You MUST generate exactly or more than 3 questions for each difficulty level. Maximum you can generate upto 20 questions.

// //     RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
// //     {
// //       "score": 75,
// //       "ats_compatibility": 70,
// //       "grammar_score": 85,
// //       "readability_score": 80,
// //       "experience_match": 70,
// //       "strengths": ["string", "string"],
// //       "weaknesses": ["string", "string"],
// //       "improvements": ["string", "string"],
// //       "hard_skills": ["string", "string"],
// //       "soft_skills": ["string", "string"],
// //       "keywords": ["string", "string"],
// //       "missing_keywords": ["string", "string"],
// //       "sections_detected": ["string", "string"],
// //       "missing_sections": ["string", "string"],
// //       "top_projects": [
// //         {
// //           "name": "Project Name",
// //           "score": 8,
// //           "reason": "Used microservices architecture and reduced latency by 40%."
// //         }
// //       ],
// //       "formatting_issues": ["string", "string"],
// //       "grammar_issues": ["string", "string"],
// //       "bullet_improvements": [
// //         {
// //           "original": "Wrote code for the app.",
// //           "improved": "Architected the core backend services using Node.js, supporting 10k+ concurrent users.",
// //           "reason": "Replaced passive language with strong action verbs and metrics."
// //         }
// //       ],
// //       "scam_flags": ["string"],
// //       "interview_questions": [
// //         {
// //           "question": "You mentioned optimizing SQL queries. Can you walk me through a specific slow query you fixed and how?",
// //           "importance": "High",
// //           "reason": "Validates the database optimization claim."
// //         }
// //       ],
// //       "summary": "string"
// //     }
// //   `;

// //   try {
// //     console.log(`🔍 Starting Groq analysis for ${targetDomain} position...`);

// //     const chatCompletion = await groq.chat.completions.create({
// //       messages: [
// //         {
// //           role: "system",
// //           content: "You are an expert resume analyzer with 50 years + experience . Always respond with valid JSON only, no additional text or formatting."
// //         },
// //         {
// //           role: "user",
// //           content: prompt
// //         }
// //       ],
// //       model: "llama-3.3-70b-versatile",
// //       temperature: 0.5,
// //       max_completion_tokens: 4096,
// //       top_p: 0.95,
// //       stream: false,
// //       stop: null
// //     });

// //     const responseContent = chatCompletion.choices[0]?.message?.content;

// //     if (!responseContent) {
// //       throw new Error('No response content from Groq API');
// //     }

// //     let cleanedResponse = responseContent.trim();
// //     cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

// //     const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
// //     const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;

// //     let analysis;
// //     try {
// //       analysis = JSON.parse(jsonString);
// //     } catch (parseError) {
// //       console.error("JSON Parse failed. Raw string:", jsonString);
// //       throw new Error("Failed to parse AI response into JSON");
// //     }

// //     const requiredFields = ['score', 'ats_compatibility', 'strengths', 'weaknesses', 'improvements', 'summary'];
// //     for (const field of requiredFields) {
// //       if (!(field in analysis)) {
// //         console.warn(`Missing field: ${field}, adding default.`);
// //         analysis[field] = Array.isArray(analysis[field]) ? [] : "Not provided";
// //       }
// //     }

// //     analysis.score = Math.max(0, Math.min(100, parseInt(analysis.score) || 0));
// //     analysis.ats_compatibility = Math.max(0, Math.min(100, parseInt(analysis.ats_compatibility) || 0));
// //     analysis.grammar_score = Math.max(0, Math.min(100, parseInt(analysis.grammar_score) || 0));
// //     analysis.readability_score = Math.max(0, Math.min(100, parseInt(analysis.readability_score) || 0));
// //     analysis.experience_match = Math.max(0, Math.min(100, parseInt(analysis.experience_match) || 0));

// //     analysis.top_projects = Array.isArray(analysis.top_projects) ? analysis.top_projects : [];
// //     analysis.interview_questions = Array.isArray(analysis.interview_questions) ? analysis.interview_questions : [];
// //     analysis.bullet_improvements = Array.isArray(analysis.bullet_improvements) ? analysis.bullet_improvements : [];

// //     console.log('✅ Successfully parsed Groq analysis');
// //     return analysis;
// //   } catch (error) {
// //     console.error('❌ Groq Analysis Error:', error);
// //     return {
// //       score: 50,
// //       ats_compatibility: 50,
// //       grammar_score: 50,
// //       readability_score: 50,
// //       experience_match: 50,
// //       strengths: ["Unable to analyze due to AI service error"],
// //       weaknesses: ["Please try again later"],
// //       improvements: ["Check internet connection and retry"],
// //       hard_skills: [],
// //       soft_skills: [],
// //       keywords: [],
// //       missing_keywords: [],
// //       sections_detected: [],
// //       missing_sections: [],
// //       formatting_issues: [],
// //       grammar_issues: [],
// //       top_projects: [],
// //       interview_questions: [],
// //       bullet_improvements: [
// //         {
// //           original: "System Error",
// //           improved: "Please try again",
// //           reason: "AI Service Timeout"
// //         }
// //       ],
// //       scam_flags: [],
// //       summary: "An error occurred while communicating with the AI analysis service. Please try again."
// //     };
// //   }
// // }

// // // Export functions - groqService handles analysis, openRouterService handles generation
// // module.exports = {
// //   analyzeResumeWithGroq,
// //   chatWithAssistant
// // };

// // // Chat with AI assistant (conversational - kept in Groq)
// // async function chatWithAssistant(message, resumeContext, targetDomain, conversationHistory) {
// //   const contextPrompt = resumeContext
// //     ? `RESUME CONTEXT: "${resumeContext.substring(0, 1000)}..."`
// //     : "No resume context available.";

// //   const domainPrompt = targetDomain
// //     ? `TARGET ROLE: ${targetDomain.replace('-', ' ')}`
// //     : "No specific role targeted.";

// //   const historyPrompt = conversationHistory.length > 0
// //     ? `CONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
// //     : "";

// //   const prompt = `
// //     You are an expert resume and career advisor. Help the user with their resume and career questions.
    
// //     ${contextPrompt}
// //     ${domainPrompt}
// //     ${historyPrompt}
    
// //     USER QUESTION: "${message}"
    
// //     Provide helpful, specific advice based on the resume context and target role. Be concise but thorough.
// //     Keep responses under 200 words and focus on actionable advice.
// //   `;

// //   try {
// //     const chatCompletion = await groq.chat.completions.create({
// //       messages: [
// //         { role: "system", content: "You are a helpful resume and career advisor. Provide specific, actionable advice." },
// //         { role: "user", content: prompt }
// //       ],
// //       model: "llama-3.3-70b-versatile",
// //       temperature: 0.6,
// //       max_completion_tokens: 1024,
// //     });

// //     return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
// //   } catch (error) {
// //     console.error('Chat Assistant Error:', error);
// //     return "I'm experiencing some technical difficulties. Please try asking your question again.";
// //   }
// // }













// // const { Groq } = require('groq-sdk');
// // require('dotenv').config();

// // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // // ─────────────────────────────────────────────
// // // CONSTANTS
// // // ─────────────────────────────────────────────
// // const ANALYSIS_MODEL = 'llama-3.3-70b-versatile';
// // const CHAT_MODEL     = 'llama-3.3-70b-versatile';
// // const MAX_RETRIES    = 3;
// // const RETRY_DELAY_MS = 1500;

// // // ─────────────────────────────────────────────
// // // DOMAIN PROMPTS
// // // ─────────────────────────────────────────────
// // const domainPrompts = {
// //   'software-engineer': `
// //     You are evaluating a Software Engineer candidate.
// //     TECHNICAL STANDARDS: Look for programming languages (Python, Java, Go, TypeScript), frameworks (React, Node, Spring, FastAPI),
// //     databases (PostgreSQL, Redis, MongoDB), cloud platforms (AWS, GCP, Azure), DevOps (Docker, K8s, CI/CD), system design, and CS fundamentals.
// //     RED FLAGS: Skills listed in the skills section but absent from any project or work experience. 
// //     Generic descriptions like "developed features" with no scale, load, or outcome stated.
// //     BENCHMARK: Top candidates show: system scale (users, RPS, data volume), architectural decisions and tradeoffs, open-source contributions or strong GitHub presence.
// //   `,
// //   'data-scientist': `
// //     You are evaluating a Data Scientist candidate.
// //     TECHNICAL STANDARDS: Python/R, SQL, ML libraries (scikit-learn, PyTorch, TensorFlow, XGBoost), statistical methods,
// //     data pipelines, experiment design (A/B testing), feature engineering, model deployment (MLOps), and data visualization.
// //     RED FLAGS: "Built a machine learning model" with no mention of the algorithm, dataset size, or accuracy improvement.
// //     Listing tools without showing they were used to produce a measurable business outcome.
// //     BENCHMARK: Top candidates show: model performance deltas (before/after), business impact in $ or %, published research or Kaggle rankings.
// //   `,
// //   'marketing': `
// //     You are evaluating a Marketing professional.
// //     TECHNICAL STANDARDS: Digital marketing (SEO, SEM, paid social, email), analytics (GA4, Mixpanel, Amplitude), 
// //     CRM (HubSpot, Salesforce), campaign management, content strategy, brand positioning, and funnel optimization.
// //     RED FLAGS: "Managed social media" with no follower growth, engagement rate, or conversion data. 
// //     "Led campaigns" with zero budget or ROI figures.
// //     BENCHMARK: Top candidates show: CAC, LTV, ROAS, MQL/SQL conversion rates, and specific revenue contribution.
// //   `,
// //   'product-manager': `
// //     You are evaluating a Product Manager candidate.
// //     TECHNICAL STANDARDS: Product strategy, OKRs, roadmap prioritization (RICE, MoSCoW), user research methods,
// //     data analysis, A/B testing, cross-functional leadership, and go-to-market execution.
// //     RED FLAGS: "Worked with engineers" instead of "led a team of X engineers to ship Y by Z date."
// //     No mention of metrics, user feedback loops, or how decisions were made.
// //     BENCHMARK: Top candidates show: shipped product impact in revenue or engagement, reduced churn, ownership over a P&L or key metric.
// //   `,
// //   'design': `
// //     You are evaluating a UX/Product Designer candidate.
// //     TECHNICAL STANDARDS: Design tools (Figma, Sketch, Adobe XD), UX research methods, prototyping, design systems,
// //     accessibility (WCAG), information architecture, and cross-functional collaboration with engineering.
// //     RED FLAGS: Portfolio not linked. "Designed UI for app" with no user testing, iteration, or outcome data.
// //     Aesthetic descriptions with zero user problem framing.
// //     BENCHMARK: Top candidates show: user research → design → measurable outcome cycle, design system contributions, accessibility compliance.
// //   `,
// //   'sales': `
// //     You are evaluating a Sales professional.
// //     TECHNICAL STANDARDS: CRM proficiency (Salesforce, HubSpot), pipeline management, outbound prospecting,
// //     enterprise vs. SMB sales motion, negotiation, and revenue forecasting.
// //     RED FLAGS: "Exceeded quota" with no actual quota figure or percentage. 
// //     "Built relationships" with no deal size, sales cycle length, or close rate.
// //     BENCHMARK: Top candidates show: ARR contributed, quota attainment %, average deal size, ramp-to-productivity time.
// //   `,
// //   'other': `
// //     You are evaluating a general professional resume.
// //     Apply universal professional standards: quantified achievements, clear career progression, demonstrated impact, 
// //     strong action verbs, and relevant skills backed by experience.
// //     Focus on: career trajectory, transferable skills, and whether the resume tells a coherent professional story.
// //   `,
// // };

// // // ─────────────────────────────────────────────
// // // UTILITY: Retry wrapper
// // // ─────────────────────────────────────────────
// // async function withRetry(fn, retries = MAX_RETRIES, delayMs = RETRY_DELAY_MS) {
// //   for (let attempt = 1; attempt <= retries; attempt++) {
// //     try {
// //       return await fn();
// //     } catch (err) {
// //       const isLastAttempt = attempt === retries;
// //       const isRetryable   = err?.status === 429 || err?.status >= 500 || err?.code === 'ECONNRESET';
// //       if (isLastAttempt || !isRetryable) throw err;
// //       console.warn(`⚠️  Attempt ${attempt} failed (${err.message}). Retrying in ${delayMs}ms…`);
// //       await new Promise(r => setTimeout(r, delayMs * attempt)); // exponential-ish backoff
// //     }
// //   }
// // }

// // // ─────────────────────────────────────────────
// // // UTILITY: Safe JSON extractor
// // // ─────────────────────────────────────────────
// // function extractJSON(raw) {
// //   const cleaned = raw.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
// //   const match   = cleaned.match(/\{[\s\S]*\}/);
// //   if (!match) throw new Error('No JSON object found in model response');
// //   return JSON.parse(match[0]);
// // }

// // // ─────────────────────────────────────────────
// // // UTILITY: Clamp integer fields
// // // ─────────────────────────────────────────────
// // function clamp(val, min = 0, max = 100) {
// //   return Math.max(min, Math.min(max, parseInt(val) || 0));
// // }

// // // ─────────────────────────────────────────────
// // // CORE: Resume Analysis (domain-based)
// // // ─────────────────────────────────────────────
// // async function analyzeResumeWithGroq(resumeText, targetDomain) {
// //   const domainContext = domainPrompts[targetDomain] || domainPrompts['other'];

// //   const prompt = `
// // You are a brutally honest Senior Recruiter and Hiring Manager at a FAANG-level firm with 20+ years of experience.
// // Your job is to critically audit this resume for a **${targetDomain.replace(/-/g, ' ')}** position.

// // RULES:
// // - Be harsh but constructive. No participation trophies.
// // - Every critique MUST cite the specific line, bullet, or section you are referencing — do NOT give generic feedback.
// // - A score of 80+ requires: zero vague bullets, minimum 3 quantified achievements, no formatting issues.
// // - Penalize "Responsible for", "Worked on", "Helped with", "Assisted" unless followed by a clear, measurable result.
// // - Cross-reference Skills section with Experience/Projects. Skills listed but never demonstrated = red flag.
// // - Detect employment gaps > 6 months and short tenures < 4 months — flag them.
// // - Detect suspicious claims: impossibly round numbers (100% improvement), vague certifications, overlapping dates.

// // ${domainContext}

// // RESUME TEXT:
// // """
// // ${resumeText}
// // """

// // RESPOND ONLY WITH VALID JSON MATCHING THIS EXACT SCHEMA — NO EXTRA TEXT:

// // {
// //   "score": 0,
// //   "ats_compatibility": 0,
// //   "grammar_score": 0,
// //   "readability_score": 0,
// //   "experience_match": 0,

// //   "career_trajectory": {
// //     "direction": "upward | lateral | downward | unclear",
// //     "assessment": "2–3 sentence evaluation of career progression visible in the resume",
// //     "promotions_detected": true,
// //     "avg_tenure_months": 0
// //   },

// //   "salary_estimate": {
// //     "currency": "USD"| "INR",
// //     "range_low": 0,
// //     "range_high": 0,
// //     "basis": "Brief explanation of what drove this estimate (YOE, skills, domain, location signals)"
// //   },

// //   "strengths": ["cite specific line or section — min 5 items"],
// //   "weaknesses": ["cite specific line or section — min 5 items"],
// //   "improvements": ["specific fix with location — min 6 items"],

// //   "hard_skills": ["extracted from resume text"],
// //   "soft_skills": ["extracted from resume text"],
// //   "keywords": ["ATS keywords present in the resume"],
// //   "missing_keywords": ["critical ${targetDomain.replace(/-/g, ' ')} keywords absent from resume"],

// //   "sections_detected": ["list of standard resume sections found"],
// //   "missing_sections": ["standard sections absent"],
// //   "formatting_issues": ["specific layout/design problems with location"],
// //   "grammar_issues": ["specific grammar/tense errors — quote the offending text"],

// //   "top_projects": [
// //     {
// //       "name": "Project name",
// //       "score": 0,
// //       "reason": "Strict evaluation: complexity, tech stack depth, and measurable business impact"
// //     }
// //   ],

// //   "bullet_improvements": [
// //     {
// //       "original": "exact bullet from resume",
// //       "improved": "Accomplished [X] as measured by [Y], by doing [Z]",
// //       "reason": "Why the original is weak and what the rewrite fixes"
// //     }
// //   ],

// //   "summary_rewrite": {
// //     "original": "existing summary/objective from resume or 'None found'",
// //     "improved": "A punchy 3–4 sentence professional summary rewritten for maximum recruiter impact",
// //     "reason": "What was wrong and what the rewrite improves"
// //   },

// //   "scam_flags": [],

// //   "red_flags": [],

// //   "benchmark": {
// //     "domain": "${targetDomain}",
// //     "missing_compared_to_top_candidates": ["3–5 things top candidates at this level typically show that this resume lacks"],
// //     "competitive_strengths": ["2–3 things this resume has that are genuinely competitive"]
// //   },

// //   "interview_questions": [
// //          {
// //            "question": "You mentioned optimizing SQL queries. Can you walk me through a specific slow query you fixed and how?",
// //            "importance": "High",
// //            "reason": "Validates the database optimization claim."
// //        },
// //        {
// //            "question": "Describe a time you had to learn a new technology quickly to complete a project. How did you approach it?",
// //            "importance": "Medium",
// //            "reason": "Tests adaptability and learning ability."},
// //            {
// //            "question": "Describe a time you had to learn a new technology quickly to complete a project. How did you approach it?",
// //            "importance": "Easy",
// //            "reason": "Tests adaptability and learning ability."},
// //        ],

// //   "summary": "Brutally honest 5–6 line executive summary with the top 2–3 specific things to fix immediately"
// // }

// // CRITICAL RULES FOR scam_flags AND red_flags:
// // - Both MUST be plain string arrays — NO nested objects, NO { claim, reason } objects.
// // - If nothing is suspicious, return an EMPTY ARRAY []. NEVER add "None found" placeholder entries.
// // - scam_flags strings format: "[exact quoted claim]  —  [reason it is suspicious]"
// //   Example: "\"Increased revenue by 100%\" — Round number with no baseline is unverifiable"
// // - red_flags strings format: "[TYPE]: [detail with dates]"
// //   Example: "employment_gap: No role listed between Jan 2022 and Aug 2023 (7 months)"
// //   Valid TYPEs: employment_gap | short_tenure | overlapping_dates | unverifiable_claim

// // MINIMUM COUNTS (return fewer = invalid):
// // - strengths: 5+, weaknesses: 5+, improvements: 6+, bullet_improvements: 4+
// // - interview_questions: 9+ total (min 3 Hard, 3 Medium, 3 Easy)
// // - top_projects: up to 4
// // - scam_flags: [] if clean, strings only if genuinely flagged
// // - red_flags: [] if clean, strings only if genuinely flagged
// // `;

// //   console.log(`🔍 Analyzing resume for: ${targetDomain}`);

// //   const raw = await withRetry(async () => {
// //     const res = await groq.chat.completions.create({
// //       messages: [
// //         {
// //           role: 'system',
// //           content: 'You are an expert resume analyst. Respond ONLY with valid JSON — no markdown, no prose, no code fences.',
// //         },
// //         { role: 'user', content: prompt },
// //       ],
// //       model:               ANALYSIS_MODEL,
// //       temperature:         0.4,
// //       max_completion_tokens: 5000,
// //       top_p:               0.9,
// //       stream:              false,
// //     });
// //     return res.choices[0]?.message?.content;
// //   });

// //   if (!raw) throw new Error('Empty response from Groq');

// //   let analysis;
// //   try {
// //     analysis = extractJSON(raw);
// //   } catch (parseError) {
// //     console.error('JSON parse failed. Raw:', raw.substring(0, 500));
// //     throw new Error('Failed to parse AI response into JSON');
// //   }

// //   // Normalize numeric scores
// //   analysis.score             = clamp(analysis.score);
// //   analysis.ats_compatibility = clamp(analysis.ats_compatibility);
// //   analysis.grammar_score     = clamp(analysis.grammar_score);
// //   analysis.readability_score = clamp(analysis.readability_score);
// //   analysis.experience_match  = clamp(analysis.experience_match);

// //   // Ensure arrays
// //   ['strengths','weaknesses','improvements','hard_skills','soft_skills',
// //    'keywords','missing_keywords','sections_detected','missing_sections',
// //    'formatting_issues','grammar_issues','top_projects','interview_questions',
// //    'bullet_improvements','scam_flags','red_flags'].forEach(key => {
// //     if (!Array.isArray(analysis[key])) analysis[key] = [];
// //   });

// //   // ── scam_flags: flatten any object shape → plain string (Mongoose expects [String]) ──
// //   analysis.scam_flags = analysis.scam_flags
// //     .filter(f => {
// //       // Drop "None found" placeholder entries the model sometimes adds
// //       if (typeof f === 'string') return !/none found|no suspicious|nothing suspicious/i.test(f);
// //       if (typeof f === 'object' && f !== null) {
// //         const claim = (f.claim || f.flag || f.issue || '').toLowerCase();
// //         return !/none found|no suspicious|nothing suspicious/.test(claim);
// //       }
// //       return false;
// //     })
// //     .map(f => {
// //       if (typeof f === 'string') return f;
// //       // Convert object → readable string so Mongoose [String] schema is satisfied
// //       const claim  = f.claim  || f.flag  || f.issue  || 'Unspecified claim';
// //       const reason = f.reason || f.detail || f.explanation || 'Flagged by AI';
// //       return `"${claim}" — ${reason}`;
// //     });

// //   // ── red_flags: same treatment ──
// //   if (!Array.isArray(analysis.red_flags)) analysis.red_flags = [];
// //   analysis.red_flags = analysis.red_flags
// //     .filter(f => {
// //       if (typeof f === 'string') return !/none found|no red flag/i.test(f);
// //       if (typeof f === 'object' && f !== null) {
// //         const detail = (f.detail || f.type || '').toLowerCase();
// //         return !/none found|no red flag/.test(detail);
// //       }
// //       return false;
// //     })
// //     .map(f => {
// //       if (typeof f === 'string') return f;
// //       const type   = f.type   || 'unverifiable_claim';
// //       const detail = f.detail || f.description || 'No detail provided';
// //       return `${type}: ${detail}`;
// //     });

// //   console.log(`✅ Analysis complete. Score: ${analysis.score}`);
// //   return analysis;
// // }

// // // ─────────────────────────────────────────────
// // // NEW: JD Match Analysis
// // // ─────────────────────────────────────────────
// // /**
// //  * Compares the resume directly against a specific job description.
// //  * Returns a match score, keyword gaps, tailoring suggestions, and a
// //  * cover-letter-ready positioning statement.
// //  */
// // async function analyzeJDMatch(resumeText, jobDescription, targetDomain) {
// //   const prompt = `
// // You are an expert ATS system and recruiter hybrid. Your job is to compare this resume against a specific job description
// // and tell the candidate exactly how well they match and what to change.

// // RESUME:
// // """
// // ${resumeText}
// // """

// // JOB DESCRIPTION:
// // """
// // ${jobDescription}
// // """

// // TARGET DOMAIN: ${(targetDomain || 'general').replace(/-/g, ' ')}

// // Respond ONLY with valid JSON in this exact format:

// // {
// //   "match_score": 0,
// //   "fit_verdict": "Strong Fit | Decent Fit | Weak Fit | Not a Fit",
// //   "verdict_reasoning": "2–3 sentence explanation",

// //   "matched_keywords": ["keywords from JD that appear in the resume"],
// //   "missing_keywords": ["keywords from JD that are completely absent from the resume"],
// //   "partially_matched": ["keywords present but not demonstrated with evidence"],

// //   "requirement_gaps": [
// //     {
// //       "requirement": "exact requirement from JD",
// //       "gap": "what is missing or weak in the resume",
// //       "fixable": true
// //     }
// //   ],

// //   "tailoring_suggestions": [
// //     {
// //       "section": "Summary | Experience | Skills | Projects",
// //       "suggestion": "specific change to better align this resume to this JD"
// //     }
// //   ],

// //   "positioning_statement": "A 2–3 sentence personalized pitch the candidate can use in their cover letter or intro email, tailored to this specific JD",

// //   "ats_pass_probability": "High | Medium | Low",
// //   "ats_notes": "Specific reasons the ATS might reject this resume for this JD"
// // }
// // `;

// //   console.log('🎯 Running JD Match analysis…');

// //   const raw = await withRetry(async () => {
// //     const res = await groq.chat.completions.create({
// //       messages: [
// //         { role: 'system', content: 'You are an expert ATS and recruiter. Respond ONLY with valid JSON.' },
// //         { role: 'user', content: prompt },
// //       ],
// //       model:               ANALYSIS_MODEL,
// //       temperature:         0.3,
// //       max_completion_tokens: 3000,
// //     });
// //     return res.choices[0]?.message?.content;
// //   });

// //   const result = extractJSON(raw);
// //   result.match_score = clamp(result.match_score);
// //   ['matched_keywords','missing_keywords','partially_matched',
// //    'requirement_gaps','tailoring_suggestions'].forEach(k => {
// //     if (!Array.isArray(result[k])) result[k] = [];
// //   });

// //   console.log(`✅ JD Match complete. Score: ${result.match_score}`);
// //   return result;
// // }

// // // ─────────────────────────────────────────────
// // // NEW: Section-level deep rewrite
// // // ─────────────────────────────────────────────
// // /**
// //  * Takes a single resume section (e.g. all experience bullets for one job)
// //  * and returns a fully rewritten, high-impact version.
// //  */
// // async function rewriteSection(sectionText, sectionType, targetDomain) {
// //   const prompt = `
// // You are a professional resume writer specializing in ${(targetDomain || 'general').replace(/-/g, ' ')} roles.
// // Rewrite the following resume ${sectionType} section to maximize recruiter impact.

// // RULES:
// // - Use strong action verbs. No "Responsible for", "Worked on", "Helped".
// // - Add placeholders like [X%] or [$Y] where metrics are implied but missing — mark them with "(add metric)".
// // - Use XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]".
// // - Keep the same factual content — do not invent new claims.
// // - Return ONLY valid JSON.

// // ORIGINAL SECTION:
// // """
// // ${sectionText}
// // """

// // JSON FORMAT:
// // {
// //   "rewritten": "full rewritten section text, preserving structure",
// //   "changes_made": ["list of specific changes and why they improve the section"],
// //   "metrics_to_add": ["list of places where the candidate should add real numbers"]
// // }
// // `;

// //   const raw = await withRetry(async () => {
// //     const res = await groq.chat.completions.create({
// //       messages: [
// //         { role: 'system', content: 'You are a professional resume writer. Respond ONLY with valid JSON.' },
// //         { role: 'user', content: prompt },
// //       ],
// //       model:       ANALYSIS_MODEL,
// //       temperature: 0.5,
// //       max_completion_tokens: 2000,
// //     });
// //     return res.choices[0]?.message?.content;
// //   });

// //   const result = extractJSON(raw);
// //   if (!Array.isArray(result.changes_made))    result.changes_made    = [];
// //   if (!Array.isArray(result.metrics_to_add))  result.metrics_to_add  = [];
// //   return result;
// // }

// // // ─────────────────────────────────────────────
// // // EXISTING: Chat Assistant (kept, fixed hoisting)
// // // ─────────────────────────────────────────────
// // async function chatWithAssistant(message, resumeContext, targetDomain, conversationHistory = []) {
// //   const contextPrompt = resumeContext
// //     ? `RESUME CONTEXT (first 1200 chars): "${resumeContext.substring(0, 1200)}"`
// //     : 'No resume context provided.';

// //   const domainPrompt = targetDomain
// //     ? `TARGET ROLE: ${targetDomain.replace(/-/g, ' ')}`
// //     : 'No specific role targeted.';

// //   const historyPrompt = conversationHistory.length > 0
// //     ? `CONVERSATION HISTORY:\n${conversationHistory
// //         .slice(-6) // keep last 6 turns to avoid token overflow
// //         .map(m => `${m.role.toUpperCase()}: ${m.content}`)
// //         .join('\n')}`
// //     : '';

// //   const prompt = `
// // You are an expert resume and career advisor. Be specific, direct, and actionable.
// // ${contextPrompt}
// // ${domainPrompt}
// // ${historyPrompt}

// // USER: "${message}"

// // Respond in under 220 words. Ground your advice in the resume content when relevant.
// // If the user asks something unrelated to resumes/careers, gently redirect them.
// // `;

// //   const raw = await withRetry(async () => {
// //     const res = await groq.chat.completions.create({
// //       messages: [
// //         { role: 'system', content: 'You are a helpful, specific resume and career advisor with over 40 years of experience. You analyse based on todays fast growing AI technology.' },
// //         { role: 'user', content: prompt },
// //       ],
// //       model:               CHAT_MODEL,
// //       temperature:         0.6,
// //       max_completion_tokens: 512,
// //     });
// //     return res.choices[0]?.message?.content;
// //   });

// //   return raw || "I couldn't process your question. Please try again.";
// // }

// // module.exports = {
// //   analyzeResumeWithGroq,
// //   analyzeJDMatch,
// //   rewriteSection,
// //   chatWithAssistant,
// // };































// // /**
// //  * Groq AI Service - RESUME ANALYSIS ONLY
// //  * Model: llama-3.3-70b-versatile
// //  * 
// //  * This service is ONLY responsible for analyzing resumes.
// //  * All generation tasks (cover letter, JD match, resume rewrite, outreach)
// //  * are handled by openRouterService.js
// //  */

// // const { Groq } = require('groq-sdk');
// // require('dotenv').config();

// // const groq = new Groq({
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // // Domain-specific analysis prompts
// // const domainPrompts = {
// //   'software-engineer': `
// //     Focus on technical skills, programming languages, software development practices, system design, and project experience.
// //     Look for: coding languages, frameworks, databases, cloud platforms, DevOps tools, software architecture, algorithms, data structures.
// //     Evaluate: technical depth, project complexity, problem-solving abilities, code quality practices, team collaboration.
// //   `,
// //   'data-scientist': `
// //     Evaluate data analysis skills, machine learning expertise, statistical knowledge, programming proficiency, and research experience.
// //     Look for: Python/R, SQL, machine learning libraries, statistical methods, data visualization, big data tools, research publications.
// //     Evaluate: analytical thinking, model building, data storytelling, business impact, technical communication.
// //   `,
// //   'marketing': `
// //     Assess marketing strategy knowledge, campaign management, digital marketing skills, analytics understanding, and creative abilities.
// //     Look for: digital marketing channels, analytics tools, campaign metrics, content creation, brand management, market research.
// //     Evaluate: strategic thinking, creativity, data-driven decision making, ROI optimization, customer understanding.
// //   `,
// //   'product-manager': `
// //     Review product strategy, stakeholder management, technical understanding, market analysis, and leadership experience.
// //     Look for: product lifecycle, user research, roadmap planning, cross-functional collaboration, metrics tracking, market analysis.
// //     Evaluate: strategic vision, leadership skills, technical acumen, user empathy, business impact.
// //   `,
// //   'design': `
// //     Focus on design thinking, user experience, visual design skills, portfolio quality, and creative problem-solving.
// //     Look for: design tools, UX/UI principles, user research, prototyping, design systems, accessibility, portfolio projects.
// //     Evaluate: creative thinking, user-centered design, visual aesthetics, problem-solving, design process.
// //   `,
// //   'sales': `
// //     Evaluate sales performance, relationship building, negotiation skills, CRM proficiency, and revenue generation.
// //     Look for: sales metrics, CRM tools, lead generation, client relationships, negotiation experience, revenue targets.
// //     Evaluate: communication skills, relationship building, results orientation, persistence, customer focus.
// //   `,
// //   'other': `
// //     Evaluate your resume for a specific role, focusing on relevant skills and experience.
// //     Look for: specific job responsibilities, project experience, soft skills, and soft skills.
// //     Evaluate: specific job responsibilities, project experience, soft skills, and soft skills.
// //     Provide general professional analysis focusing on relevant skills and experience.
// //     you can also provide some general feedback on how to improve the resume for any role, such as formatting, grammar, and clarity.
// //   `,
// // };


// // async function analyzeResumeWithGroq(resumeText, targetDomain) {
// //   const domainContext = domainPrompts[targetDomain] || 'Provide general professional analysis focusing on relevant skills and experience.';

// //   const prompt = `
// //     You are a cynical, strict Senior Recruiter and Hiring Manager at a top-tier tech firm (FAANG level). 
// //     Your job is to critically audit this resume for a ${targetDomain.replace('-', ' ')} position. 
// //     DO NOT be polite. DO NOT give participation points.
    
// //     Your Goal: Distinguish between a "candidate who did the job" and a "candidate who drove results."
// //     Be harsh but constructive. Your feedback should be brutally honest, actionable, and focused on real-world impact.
// //     You are not just looking for relevant skills, but for demonstrated outcomes and business impact. 
// //     If the resume lacks specific metrics or clear results, call it out as a major weakness.
    
// //     DOMAIN STANDARDS:
// //     ${domainContext}

// //     RESUME CONTENT:
// //     "${resumeText}"

// //     STRICT ANALYSIS RULES:
// //     1.  **Scoring:** Be harsh. A score of 80+ should only be for resumes that include clear metrics ($, %, time saved) and zero errors. 
// //     2.  **Fluff Detection:** Heavily penalize phrases like "Responsible for," "Worked on," or "Assisted with" if they are not followed by a specific outcome.
// //     3.  **Technical Validity:** If a user lists a skill (e.g., "React") but shows no project/experience using it, mark it as a weak point.
// //     4.  **Consistency:** Cross-reference the "Skills" section with the "Experience" section. Mismatches are a red flag.

// //     REQUIRED JSON OUTPUT STRUCTURE (Must be exact):
// //     1. Overall Score (0-100): Weighted average. Deduct points for generic descriptions.
// //     2. ATS Compatibility (0-100): Deduct for tables, columns, icons, or lack of standard headers.
// //     3. Grammar Score (0-100): Deduct for typos, tense inconsistencies, and passive voice.
// //     4. Readability (0-100): Deduct for dense blocks of text or lack of bullet points.
// //     5. Experience Match (0-100): How well do the SPECIFIC projects/roles map to the ${targetDomain} domain?
// //     6. Strengths: 6-7 genuine competitive advantages (e.g., "Quantified impact in 3 roles").
// //     7. Weaknesses: 6-7 critical flaws (e.g., "Vague descriptions," "Tech stack listed but not demonstrated").
// //     8. Improvements: 6-10 specific fixes. "Add metrics" is too vague; say "Quantify the API optimization in the 2nd job."
// //     9. Hard Skills: Extracted from text.
// //     10. Soft Skills: Extracted from text.
// //     11. Keywords: Existing keywords found.
// //     12. Missing Keywords: Critical industry terms missing (be specific to ${targetDomain}).
// //     13. Sections Detected: List sections found.
// //     14. Missing Sections: List standard sections missing (Projects, Education, etc.).
// //     15. Formatting Issues: List specific layout problems.
// //     16. Grammar Issues: List specific examples of bad grammar.
// //     17. Bullet Point Improvements: Rewrite weak bullets into high-impact "XYZ format" (Accomplished [X] as measured by [Y], by doing [Z]).Generate at least 4 improvements.
// //     18. Scam/Overclaim Detection: Find out some scam or overclaim which dont applied on real life , such as scam dates and certificates that dont add any sense .
// //     19. Summary: Brutally honest executive summary woth some improvements that the user can do to make it better.Give atleast 4 - 5 lines of summary .
// //     20. Top Projects: Analyze projects based on complexity and technologies used. Score them strictly (0-10). A '10' requires complex architecture + business impact. Give top 4 projects with name, score, and reason.
// //     21. Interview Questions: Hard technical and behavioral questions based on specific claims in the resume. Generate MINIMUM 9 questions (3 Hard, 3 Medium, 3 Easy). You MUST generate exactly or more than 3 questions for each difficulty level. Maximum you can generate upto 20 questions.

// //     RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
// //     {
// //       "score": 75,
// //       "ats_compatibility": 70,
// //       "grammar_score": 85,
// //       "readability_score": 80,
// //       "experience_match": 70,
// //       "strengths": ["string", "string"],
// //       "weaknesses": ["string", "string"],
// //       "improvements": ["string", "string"],
// //       "hard_skills": ["string", "string"],
// //       "soft_skills": ["string", "string"],
// //       "keywords": ["string", "string"],
// //       "missing_keywords": ["string", "string"],
// //       "sections_detected": ["string", "string"],
// //       "missing_sections": ["string", "string"],
// //       "top_projects": [
// //         {
// //           "name": "Project Name",
// //           "score": 8,
// //           "reason": "Used microservices architecture and reduced latency by 40%."
// //         }
// //       ],
// //       "formatting_issues": ["string", "string"],
// //       "grammar_issues": ["string", "string"],
// //       "bullet_improvements": [
// //         {
// //           "original": "Wrote code for the app.",
// //           "improved": "Architected the core backend services using Node.js, supporting 10k+ concurrent users.",
// //           "reason": "Replaced passive language with strong action verbs and metrics."
// //         }
// //       ],
// //       "scam_flags": ["string"],
// //       "interview_questions": [
// //         {
// //           "question": "You mentioned optimizing SQL queries. Can you walk me through a specific slow query you fixed and how?",
// //           "importance": "High",
// //           "reason": "Validates the database optimization claim."
// //         }
// //       ],
// //       "summary": "string"
// //     }
// //   `;

// //   try {
// //     console.log(`🔍 Starting Groq analysis for ${targetDomain} position...`);

// //     const chatCompletion = await groq.chat.completions.create({
// //       messages: [
// //         {
// //           role: "system",
// //           content: "You are an expert resume analyzer with 50 years + experience . Always respond with valid JSON only, no additional text or formatting."
// //         },
// //         {
// //           role: "user",
// //           content: prompt
// //         }
// //       ],
// //       model: "llama-3.3-70b-versatile",
// //       temperature: 0.5,
// //       max_completion_tokens: 4096,
// //       top_p: 0.95,
// //       stream: false,
// //       stop: null
// //     });

// //     const responseContent = chatCompletion.choices[0]?.message?.content;

// //     if (!responseContent) {
// //       throw new Error('No response content from Groq API');
// //     }

// //     let cleanedResponse = responseContent.trim();
// //     cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');

// //     const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
// //     const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;

// //     let analysis;
// //     try {
// //       analysis = JSON.parse(jsonString);
// //     } catch (parseError) {
// //       console.error("JSON Parse failed. Raw string:", jsonString);
// //       throw new Error("Failed to parse AI response into JSON");
// //     }

// //     const requiredFields = ['score', 'ats_compatibility', 'strengths', 'weaknesses', 'improvements', 'summary'];
// //     for (const field of requiredFields) {
// //       if (!(field in analysis)) {
// //         console.warn(`Missing field: ${field}, adding default.`);
// //         analysis[field] = Array.isArray(analysis[field]) ? [] : "Not provided";
// //       }
// //     }

// //     analysis.score = Math.max(0, Math.min(100, parseInt(analysis.score) || 0));
// //     analysis.ats_compatibility = Math.max(0, Math.min(100, parseInt(analysis.ats_compatibility) || 0));
// //     analysis.grammar_score = Math.max(0, Math.min(100, parseInt(analysis.grammar_score) || 0));
// //     analysis.readability_score = Math.max(0, Math.min(100, parseInt(analysis.readability_score) || 0));
// //     analysis.experience_match = Math.max(0, Math.min(100, parseInt(analysis.experience_match) || 0));

// //     analysis.top_projects = Array.isArray(analysis.top_projects) ? analysis.top_projects : [];
// //     analysis.interview_questions = Array.isArray(analysis.interview_questions) ? analysis.interview_questions : [];
// //     analysis.bullet_improvements = Array.isArray(analysis.bullet_improvements) ? analysis.bullet_improvements : [];

// //     console.log('✅ Successfully parsed Groq analysis');
// //     return analysis;
// //   } catch (error) {
// //     console.error('❌ Groq Analysis Error:', error);
// //     return {
// //       score: 50,
// //       ats_compatibility: 50,
// //       grammar_score: 50,
// //       readability_score: 50,
// //       experience_match: 50,
// //       strengths: ["Unable to analyze due to AI service error"],
// //       weaknesses: ["Please try again later"],
// //       improvements: ["Check internet connection and retry"],
// //       hard_skills: [],
// //       soft_skills: [],
// //       keywords: [],
// //       missing_keywords: [],
// //       sections_detected: [],
// //       missing_sections: [],
// //       formatting_issues: [],
// //       grammar_issues: [],
// //       top_projects: [],
// //       interview_questions: [],
// //       bullet_improvements: [
// //         {
// //           original: "System Error",
// //           improved: "Please try again",
// //           reason: "AI Service Timeout"
// //         }
// //       ],
// //       scam_flags: [],
// //       summary: "An error occurred while communicating with the AI analysis service. Please try again."
// //     };
// //   }
// // }

// // // Export functions - groqService handles analysis, openRouterService handles generation
// // module.exports = {
// //   analyzeResumeWithGroq,
// //   chatWithAssistant
// // };

// // // Chat with AI assistant (conversational - kept in Groq)
// // async function chatWithAssistant(message, resumeContext, targetDomain, conversationHistory) {
// //   const contextPrompt = resumeContext
// //     ? `RESUME CONTEXT: "${resumeContext.substring(0, 1000)}..."`
// //     : "No resume context available.";

// //   const domainPrompt = targetDomain
// //     ? `TARGET ROLE: ${targetDomain.replace('-', ' ')}`
// //     : "No specific role targeted.";

// //   const historyPrompt = conversationHistory.length > 0
// //     ? `CONVERSATION HISTORY:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
// //     : "";

// //   const prompt = `
// //     You are an expert resume and career advisor. Help the user with their resume and career questions.
    
// //     ${contextPrompt}
// //     ${domainPrompt}
// //     ${historyPrompt}
    
// //     USER QUESTION: "${message}"
    
// //     Provide helpful, specific advice based on the resume context and target role. Be concise but thorough.
// //     Keep responses under 200 words and focus on actionable advice.
// //   `;

// //   try {
// //     const chatCompletion = await groq.chat.completions.create({
// //       messages: [
// //         { role: "system", content: "You are a helpful resume and career advisor. Provide specific, actionable advice." },
// //         { role: "user", content: prompt }
// //       ],
// //       model: "llama-3.3-70b-versatile",
// //       temperature: 0.6,
// //       max_completion_tokens: 1024,
// //     });

// //     return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process your question. Please try again.";
// //   } catch (error) {
// //     console.error('Chat Assistant Error:', error);
// //     return "I'm experiencing some technical difficulties. Please try asking your question again.";
// //   }
// // }













// const { Groq } = require('groq-sdk');
// require('dotenv').config();

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // ─────────────────────────────────────────────
// // CONSTANTS
// // ─────────────────────────────────────────────
// const ANALYSIS_MODEL = 'llama-3.3-70b-versatile';
// const CHAT_MODEL     = 'llama-3.3-70b-versatile';
// const MAX_RETRIES    = 3;
// const RETRY_DELAY_MS = 1500;

// // ─────────────────────────────────────────────
// // DOMAIN PROMPTS
// // ─────────────────────────────────────────────
// const domainPrompts = {
//   'software-engineer': `
//     You are evaluating a Software Engineer candidate.
//     TECHNICAL STANDARDS: Look for programming languages (Python, Java, Go, TypeScript), frameworks (React, Node, Spring, FastAPI),
//     databases (PostgreSQL, Redis, MongoDB), cloud platforms (AWS, GCP, Azure), DevOps (Docker, K8s, CI/CD), system design, and CS fundamentals.
//     RED FLAGS: Skills listed in the skills section but absent from any project or work experience. 
//     Generic descriptions like "developed features" with no scale, load, or outcome stated.
//     BENCHMARK: Top candidates show: system scale (users, RPS, data volume), architectural decisions and tradeoffs, open-source contributions or strong GitHub presence.
//   `,
//   'data-scientist': `
//     You are evaluating a Data Scientist candidate.
//     TECHNICAL STANDARDS: Python/R, SQL, ML libraries (scikit-learn, PyTorch, TensorFlow, XGBoost), statistical methods,
//     data pipelines, experiment design (A/B testing), feature engineering, model deployment (MLOps), and data visualization.
//     RED FLAGS: "Built a machine learning model" with no mention of the algorithm, dataset size, or accuracy improvement.
//     Listing tools without showing they were used to produce a measurable business outcome.
//     BENCHMARK: Top candidates show: model performance deltas (before/after), business impact in $ or %, published research or Kaggle rankings.
//   `,
//   'marketing': `
//     You are evaluating a Marketing professional.
//     TECHNICAL STANDARDS: Digital marketing (SEO, SEM, paid social, email), analytics (GA4, Mixpanel, Amplitude), 
//     CRM (HubSpot, Salesforce), campaign management, content strategy, brand positioning, and funnel optimization.
//     RED FLAGS: "Managed social media" with no follower growth, engagement rate, or conversion data. 
//     "Led campaigns" with zero budget or ROI figures.
//     BENCHMARK: Top candidates show: CAC, LTV, ROAS, MQL/SQL conversion rates, and specific revenue contribution.
//   `,
//   'product-manager': `
//     You are evaluating a Product Manager candidate.
//     TECHNICAL STANDARDS: Product strategy, OKRs, roadmap prioritization (RICE, MoSCoW), user research methods,
//     data analysis, A/B testing, cross-functional leadership, and go-to-market execution.
//     RED FLAGS: "Worked with engineers" instead of "led a team of X engineers to ship Y by Z date."
//     No mention of metrics, user feedback loops, or how decisions were made.
//     BENCHMARK: Top candidates show: shipped product impact in revenue or engagement, reduced churn, ownership over a P&L or key metric.
//   `,
//   'design': `
//     You are evaluating a UX/Product Designer candidate.
//     TECHNICAL STANDARDS: Design tools (Figma, Sketch, Adobe XD), UX research methods, prototyping, design systems,
//     accessibility (WCAG), information architecture, and cross-functional collaboration with engineering.
//     RED FLAGS: Portfolio not linked. "Designed UI for app" with no user testing, iteration, or outcome data.
//     Aesthetic descriptions with zero user problem framing.
//     BENCHMARK: Top candidates show: user research → design → measurable outcome cycle, design system contributions, accessibility compliance.
//   `,
//   'sales': `
//     You are evaluating a Sales professional.
//     TECHNICAL STANDARDS: CRM proficiency (Salesforce, HubSpot), pipeline management, outbound prospecting,
//     enterprise vs. SMB sales motion, negotiation, and revenue forecasting.
//     RED FLAGS: "Exceeded quota" with no actual quota figure or percentage. 
//     "Built relationships" with no deal size, sales cycle length, or close rate.
//     BENCHMARK: Top candidates show: ARR contributed, quota attainment %, average deal size, ramp-to-productivity time.
//   `,
//   'other': `
//     You are evaluating a general professional resume.
//     Apply universal professional standards: quantified achievements, clear career progression, demonstrated impact, 
//     strong action verbs, and relevant skills backed by experience.
//     Focus on: career trajectory, transferable skills, and whether the resume tells a coherent professional story.
//   `,
// };

// // ─────────────────────────────────────────────
// // UTILITY: Retry wrapper
// // ─────────────────────────────────────────────
// async function withRetry(fn, retries = MAX_RETRIES, delayMs = RETRY_DELAY_MS) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       return await fn();
//     } catch (err) {
//       const isLastAttempt = attempt === retries;
//       const isRetryable   = err?.status === 429 || err?.status >= 500 || err?.code === 'ECONNRESET';
//       if (isLastAttempt || !isRetryable) throw err;
//       console.warn(`⚠️  Attempt ${attempt} failed (${err.message}). Retrying in ${delayMs}ms…`);
//       await new Promise(r => setTimeout(r, delayMs * attempt)); // exponential-ish backoff
//     }
//   }
// }

// // ─────────────────────────────────────────────
// // UTILITY: Safe JSON extractor
// // ─────────────────────────────────────────────
// function extractJSON(raw) {
//   const cleaned = raw.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
//   const match   = cleaned.match(/\{[\s\S]*\}/);
//   if (!match) throw new Error('No JSON object found in model response');
//   return JSON.parse(match[0]);
// }

// // ─────────────────────────────────────────────
// // UTILITY: Clamp integer fields
// // ─────────────────────────────────────────────
// function clamp(val, min = 0, max = 100) {
//   return Math.max(min, Math.min(max, parseInt(val) || 0));
// }

// // ─────────────────────────────────────────────
// // CORE: Resume Analysis (domain-based)
// // ─────────────────────────────────────────────
// async function analyzeResumeWithGroq(resumeText, targetDomain) {
//   const domainContext = domainPrompts[targetDomain] || domainPrompts['other'];

//   const prompt = `
// You are a brutally honest Senior Recruiter and Hiring Manager at a FAANG-level firm with 20+ years of experience.
// Your job is to critically audit this resume for a **${targetDomain.replace(/-/g, ' ')}** position.

// RULES:
// - Be harsh but constructive. No participation trophies.
// - Every critique MUST cite the specific line, bullet, or section you are referencing — do NOT give generic feedback.
// - A score of 80+ requires: zero vague bullets, minimum 3 quantified achievements, no formatting issues.
// - Penalize "Responsible for", "Worked on", "Helped with", "Assisted" unless followed by a clear, measurable result.
// - Cross-reference Skills section with Experience/Projects. Skills listed but never demonstrated = red flag.
// - Detect employment gaps > 6 months and short tenures < 4 months — flag them.
// - Detect suspicious claims: impossibly round numbers (100% improvement), vague certifications, overlapping dates.

// ${domainContext}

// RESUME TEXT:
// """
// ${resumeText}
// """

// RESPOND ONLY WITH VALID JSON MATCHING THIS EXACT SCHEMA — NO EXTRA TEXT:

// {
//   "score": 0,
//   "ats_compatibility": 0,
//   "grammar_score": 0,
//   "readability_score": 0,
//   "experience_match": 0,

//   "career_trajectory": {
//     "direction": "upward | lateral | downward | unclear",
//     "assessment": "2–3 sentence evaluation of career progression visible in the resume",
//     "promotions_detected": true,
//     "avg_tenure_months": 0
//   },

//   "salary_estimate": {
//     "currency": "USD",
//     "range_low": 0,
//     "range_high": 0,
//     "basis": "Brief explanation of what drove this estimate (YOE, skills, domain, location signals)"
//   },

//   "strengths": ["cite specific line or section — min 5 items"],
//   "weaknesses": ["cite specific line or section — min 5 items"],
//   "improvements": ["specific fix with location — min 6 items"],

//   "hard_skills": ["extracted from resume text"],
//   "soft_skills": ["extracted from resume text"],
//   "keywords": ["ATS keywords present in the resume"],
//   "missing_keywords": ["critical ${targetDomain.replace(/-/g, ' ')} keywords absent from resume"],

//   "sections_detected": ["list of standard resume sections found"],
//   "missing_sections": ["standard sections absent"],
//   "formatting_issues": ["specific layout/design problems with location"],
//   "grammar_issues": ["specific grammar/tense errors — quote the offending text"],

//   "top_projects": [
//     {
//       "name": "Project name",
//       "score": 0,
//       "reason": "Strict evaluation: complexity, tech stack depth, and measurable business impact"
//     }
//   ],

//   "bullet_improvements": [
//     {
//       "original": "exact bullet from resume",
//       "improved": "Accomplished [X] as measured by [Y], by doing [Z]",
//       "reason": "Why the original is weak and what the rewrite fixes"
//     }
//   ],

//   "summary_rewrite": {
//     "original": "existing summary/objective from resume or 'None found'",
//     "improved": "A punchy 3–4 sentence professional summary rewritten for maximum recruiter impact",
//     "reason": "What was wrong and what the rewrite improves"
//   },

//   "scam_flags": [],

//   "red_flags": [],

//   "benchmark": {
//     "domain": "${targetDomain}",
//     "missing_compared_to_top_candidates": ["3–5 things top candidates at this level typically show that this resume lacks"],
//     "competitive_strengths": ["2–3 things this resume has that are genuinely competitive"]
//   },

//   "interview_questions": [
//     {
//       "question": "You listed React in your skills but I see no React project in your experience — can you walk me through a React project you built?",
//       "difficulty": "Hard",
//       "reason": "Validates whether the skill is genuinely practiced or just listed."
//     },
//     {
//       "question": "You mentioned optimizing SQL queries in your second role. Walk me through the specific query, the problem, and exactly what you changed.",
//       "difficulty": "Hard",
//       "reason": "Tests depth of database knowledge and whether the claim is real."
//     },
//     {
//       "question": "Your most recent role lasted only 8 months. What happened and what did you learn from it?",
//       "difficulty": "Hard",
//       "reason": "Probes short tenure flagged in red_flags — tests self-awareness."
//     },
//     {
//       "question": "Describe a time you disagreed with your manager on a technical decision. What did you do?",
//       "difficulty": "Medium",
//       "reason": "Behavioral — tests communication and professional maturity."
//     },
//     {
//       "question": "You led a cross-functional project — how did you handle a situation where another team missed a deadline that blocked yours?",
//       "difficulty": "Medium",
//       "reason": "Validates the leadership claim with a concrete scenario."
//     },
//     {
//       "question": "Walk me through how you would design a system to handle 100k concurrent users, given your background.",
//       "difficulty": "Medium",
//       "reason": "Tests system design thinking appropriate to the domain."
//     },
//     {
//       "question": "What is your preferred way to receive feedback, and can you give a recent example of acting on it?",
//       "difficulty": "Easy",
//       "reason": "Reveals self-awareness and growth mindset."
//     },
//     {
//       "question": "How do you prioritize when you have three high-priority tasks and a single afternoon?",
//       "difficulty": "Easy",
//       "reason": "Tests time management and communication of trade-offs."
//     },
//     {
//       "question": "Tell me about yourself in 2 minutes — focus on the thread that connects your roles.",
//       "difficulty": "Easy",
//       "reason": "Tests whether the candidate has a coherent career narrative."
//     }
//   ],

//   "summary": "Brutally honest 5–6 line executive summary with the top 2–3 specific things to fix immediately"
// }

// CRITICAL RULES FOR scam_flags AND red_flags:
// - Both MUST be plain string arrays — NO nested objects, NO { claim, reason } objects.
// - If nothing is suspicious, return an EMPTY ARRAY []. NEVER add "None found" placeholder entries.
// - scam_flags strings format: "[exact quoted claim]  —  [reason it is suspicious]"
//   Example: "\"Increased revenue by 100%\" — Round number with no baseline is unverifiable"
// - red_flags strings format: "[TYPE]: [detail with dates]"
//   Example: "employment_gap: No role listed between Jan 2022 and Aug 2023 (7 months)"
//   Valid TYPEs: employment_gap | short_tenure | overlapping_dates | unverifiable_claim

// INTERVIEW QUESTIONS — NON-NEGOTIABLE RULES:
// - The field is called "interview_questions". Each item MUST have exactly these three keys:
//     "question" (string), "difficulty" (string), "reason" (string)
// - "difficulty" MUST be exactly one of: "Hard", "Medium", "Easy"  — no other values accepted.
// - You MUST return AT LEAST 3 Hard questions, AT LEAST 3 Medium questions, AT LEAST 3 Easy questions.
// - Total MINIMUM is 9 questions. You may return up to 20.
// - Questions MUST be grounded in specific claims from the resume — reference the exact role, project, or bullet.
// - Do NOT use generic questions like "Tell me about a challenge you faced." Make them SPECIFIC to this resume.
// - Returning fewer than 9 questions or using wrong difficulty values = INVALID RESPONSE.

// MINIMUM COUNTS (all fields — returning fewer = invalid response):
// - strengths: 5+, weaknesses: 5+, improvements: 6+, bullet_improvements: 4+
// - interview_questions: 9+ total (3+ Hard, 3+ Medium, 3+ Easy) — see rules above
// - top_projects: up to 4
// - scam_flags: [] if clean, strings only if genuinely flagged
// - red_flags: [] if clean, strings only if genuinely flagged
// `;

//   console.log(`🔍 Analyzing resume for: ${targetDomain}`);

//   const raw = await withRetry(async () => {
//     const res = await groq.chat.completions.create({
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an expert resume analyst. Respond ONLY with valid JSON — no markdown, no prose, no code fences.',
//         },
//         { role: 'user', content: prompt },
//       ],
//       model:               ANALYSIS_MODEL,
//       temperature:         0.4,
//       max_completion_tokens: 5000,
//       top_p:               0.9,
//       stream:              false,
//     });
//     return res.choices[0]?.message?.content;
//   });

//   if (!raw) throw new Error('Empty response from Groq');

//   let analysis;
//   try {
//     analysis = extractJSON(raw);
//   } catch (parseError) {
//     console.error('JSON parse failed. Raw:', raw.substring(0, 500));
//     throw new Error('Failed to parse AI response into JSON');
//   }

//   // Normalize numeric scores
//   analysis.score             = clamp(analysis.score);
//   analysis.ats_compatibility = clamp(analysis.ats_compatibility);
//   analysis.grammar_score     = clamp(analysis.grammar_score);
//   analysis.readability_score = clamp(analysis.readability_score);
//   analysis.experience_match  = clamp(analysis.experience_match);

//   // Ensure arrays
//   ['strengths','weaknesses','improvements','hard_skills','soft_skills',
//    'keywords','missing_keywords','sections_detected','missing_sections',
//    'formatting_issues','grammar_issues','top_projects','interview_questions',
//    'bullet_improvements','scam_flags','red_flags'].forEach(key => {
//     if (!Array.isArray(analysis[key])) analysis[key] = [];
//   });

//   // ── scam_flags: flatten any object shape → plain string (Mongoose expects [String]) ──
//   analysis.scam_flags = analysis.scam_flags
//     .filter(f => {
//       // Drop "None found" placeholder entries the model sometimes adds
//       if (typeof f === 'string') return !/none found|no suspicious|nothing suspicious/i.test(f);
//       if (typeof f === 'object' && f !== null) {
//         const claim = (f.claim || f.flag || f.issue || '').toLowerCase();
//         return !/none found|no suspicious|nothing suspicious/.test(claim);
//       }
//       return false;
//     })
//     .map(f => {
//       if (typeof f === 'string') return f;
//       // Convert object → readable string so Mongoose [String] schema is satisfied
//       const claim  = f.claim  || f.flag  || f.issue  || 'Unspecified claim';
//       const reason = f.reason || f.detail || f.explanation || 'Flagged by AI';
//       return `"${claim}" — ${reason}`;
//     });

//   // ── red_flags: same treatment ──
//   if (!Array.isArray(analysis.red_flags)) analysis.red_flags = [];
//   analysis.red_flags = analysis.red_flags
//     .filter(f => {
//       if (typeof f === 'string') return !/none found|no red flag/i.test(f);
//       if (typeof f === 'object' && f !== null) {
//         const detail = (f.detail || f.type || '').toLowerCase();
//         return !/none found|no red flag/.test(detail);
//       }
//       return false;
//     })
//     .map(f => {
//       if (typeof f === 'string') return f;
//       const type   = f.type   || 'unverifiable_claim';
//       const detail = f.detail || f.description || 'No detail provided';
//       return `${type}: ${detail}`;
//     });

//   // ── interview_questions: normalize + enforce minimum counts ──────────────────
//   // The model sometimes uses "importance" instead of "difficulty", or uses wrong
//   // values ("High/Medium/Low" instead of "Hard/Medium/Easy"). Fix both here.
//   const importanceMap = { high: 'Hard', medium: 'Medium', low: 'Easy', easy: 'Easy', hard: 'Hard' };
//   analysis.interview_questions = analysis.interview_questions
//     .filter(q => q && typeof q.question === 'string' && q.question.trim())
//     .map(q => {
//       // Normalise the difficulty field — accept either "difficulty" or "importance"
//       const raw = (q.difficulty || q.importance || '').trim();
//       const normalised = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
//       const difficulty = ['Hard','Medium','Easy'].includes(normalised)
//         ? normalised
//         : importanceMap[raw.toLowerCase()] || 'Medium';  // fallback to Medium, never drop the question
//       return {
//         question:   q.question.trim(),
//         difficulty,
//         reason:     q.reason || q.context || '',
//       };
//     });

//   // Count by difficulty after normalisation
//   const iqCounts = { Hard: 0, Medium: 0, Easy: 0 };
//   analysis.interview_questions.forEach(q => { if (iqCounts[q.difficulty] !== undefined) iqCounts[q.difficulty]++; });
//   console.log(`📋 Interview questions — Hard:${iqCounts.Hard} Medium:${iqCounts.Medium} Easy:${iqCounts.Easy} (total:${analysis.interview_questions.length})`);

//   // If total < 9 or any bucket < 3, log a warning. The retry wrapper above
//   // would have already retried on Groq errors, so at this point we just
//   // surface the gap rather than silently returning a broken payload.
//   if (analysis.interview_questions.length < 9 || iqCounts.Hard < 3 || iqCounts.Medium < 3 || iqCounts.Easy < 3) {
//     console.warn(`⚠️  Interview questions below minimum (need 3+ each): Hard:${iqCounts.Hard} Medium:${iqCounts.Medium} Easy:${iqCounts.Easy}`);
//   }

//   console.log(`✅ Analysis complete. Score: ${analysis.score}`);
//   return analysis;
// }

// // ─────────────────────────────────────────────
// // NEW: JD Match Analysis
// // ─────────────────────────────────────────────
// /**
//  * Compares the resume directly against a specific job description.
//  * Returns a match score, keyword gaps, tailoring suggestions, and a
//  * cover-letter-ready positioning statement.
//  */
// async function analyzeJDMatch(resumeText, jobDescription, targetDomain) {
//   const prompt = `
// You are an expert ATS system and recruiter hybrid. Your job is to compare this resume against a specific job description
// and tell the candidate exactly how well they match and what to change.

// RESUME:
// """
// ${resumeText}
// """

// JOB DESCRIPTION:
// """
// ${jobDescription}
// """

// TARGET DOMAIN: ${(targetDomain || 'general').replace(/-/g, ' ')}

// Respond ONLY with valid JSON in this exact format:

// {
//   "match_score": 0,
//   "fit_verdict": "Strong Fit | Decent Fit | Weak Fit | Not a Fit",
//   "verdict_reasoning": "2–3 sentence explanation",

//   "matched_keywords": ["keywords from JD that appear in the resume"],
//   "missing_keywords": ["keywords from JD that are completely absent from the resume"],
//   "partially_matched": ["keywords present but not demonstrated with evidence"],

//   "requirement_gaps": [
//     {
//       "requirement": "exact requirement from JD",
//       "gap": "what is missing or weak in the resume",
//       "fixable": true
//     }
//   ],

//   "tailoring_suggestions": [
//     {
//       "section": "Summary | Experience | Skills | Projects",
//       "suggestion": "specific change to better align this resume to this JD"
//     }
//   ],

//   "positioning_statement": "A 2–3 sentence personalized pitch the candidate can use in their cover letter or intro email, tailored to this specific JD",

//   "ats_pass_probability": "High | Medium | Low",
//   "ats_notes": "Specific reasons the ATS might reject this resume for this JD"
// }
// `;

//   console.log('🎯 Running JD Match analysis…');

//   const raw = await withRetry(async () => {
//     const res = await groq.chat.completions.create({
//       messages: [
//         { role: 'system', content: 'You are an expert ATS and recruiter. Respond ONLY with valid JSON.' },
//         { role: 'user', content: prompt },
//       ],
//       model:               ANALYSIS_MODEL,
//       temperature:         0.3,
//       max_completion_tokens: 3000,
//     });
//     return res.choices[0]?.message?.content;
//   });

//   const result = extractJSON(raw);
//   result.match_score = clamp(result.match_score);
//   ['matched_keywords','missing_keywords','partially_matched',
//    'requirement_gaps','tailoring_suggestions'].forEach(k => {
//     if (!Array.isArray(result[k])) result[k] = [];
//   });

//   console.log(`✅ JD Match complete. Score: ${result.match_score}`);
//   return result;
// }

// // ─────────────────────────────────────────────
// // NEW: Section-level deep rewrite
// // ─────────────────────────────────────────────
// /**
//  * Takes a single resume section (e.g. all experience bullets for one job)
//  * and returns a fully rewritten, high-impact version.
//  */
// async function rewriteSection(sectionText, sectionType, targetDomain) {
//   const prompt = `
// You are a professional resume writer specializing in ${(targetDomain || 'general').replace(/-/g, ' ')} roles.
// Rewrite the following resume ${sectionType} section to maximize recruiter impact.

// RULES:
// - Use strong action verbs. No "Responsible for", "Worked on", "Helped".
// - Add placeholders like [X%] or [$Y] where metrics are implied but missing — mark them with "(add metric)".
// - Use XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]".
// - Keep the same factual content — do not invent new claims.
// - Return ONLY valid JSON.

// ORIGINAL SECTION:
// """
// ${sectionText}
// """

// JSON FORMAT:
// {
//   "rewritten": "full rewritten section text, preserving structure",
//   "changes_made": ["list of specific changes and why they improve the section"],
//   "metrics_to_add": ["list of places where the candidate should add real numbers"]
// }
// `;

//   const raw = await withRetry(async () => {
//     const res = await groq.chat.completions.create({
//       messages: [
//         { role: 'system', content: 'You are a professional resume writer. Respond ONLY with valid JSON.' },
//         { role: 'user', content: prompt },
//       ],
//       model:       ANALYSIS_MODEL,
//       temperature: 0.5,
//       max_completion_tokens: 2000,
//     });
//     return res.choices[0]?.message?.content;
//   });

//   const result = extractJSON(raw);
//   if (!Array.isArray(result.changes_made))    result.changes_made    = [];
//   if (!Array.isArray(result.metrics_to_add))  result.metrics_to_add  = [];
//   return result;
// }

// // ─────────────────────────────────────────────
// // EXISTING: Chat Assistant (kept, fixed hoisting)
// // ─────────────────────────────────────────────
// async function chatWithAssistant(message, resumeContext, targetDomain, conversationHistory = []) {
//   const contextPrompt = resumeContext
//     ? `RESUME CONTEXT (first 1200 chars): "${resumeContext.substring(0, 1200)}"`
//     : 'No resume context provided.';

//   const domainPrompt = targetDomain
//     ? `TARGET ROLE: ${targetDomain.replace(/-/g, ' ')}`
//     : 'No specific role targeted.';

//   const historyPrompt = conversationHistory.length > 0
//     ? `CONVERSATION HISTORY:\n${conversationHistory
//         .slice(-6) // keep last 6 turns to avoid token overflow
//         .map(m => `${m.role.toUpperCase()}: ${m.content}`)
//         .join('\n')}`
//     : '';

//   const prompt = `
// You are an expert resume and career advisor. Be specific, direct, and actionable.
// ${contextPrompt}
// ${domainPrompt}
// ${historyPrompt}

// USER: "${message}"

// Respond in under 220 words. Ground your advice in the resume content when relevant.
// If the user asks something unrelated to resumes/careers, gently redirect them.
// `;

//   const raw = await withRetry(async () => {
//     const res = await groq.chat.completions.create({
//       messages: [
//         { role: 'system', content: 'You are a helpful, specific resume and career advisor with over 40 years of experience. You analyse based on todays fast growing AI technology.' },
//         { role: 'user', content: prompt },
//       ],
//       model:               CHAT_MODEL,
//       temperature:         0.6,
//       max_completion_tokens: 512,
//     });
//     return res.choices[0]?.message?.content;
//   });

//   return raw || "I couldn't process your question. Please try again.";
// }

// module.exports = {
//   analyzeResumeWithGroq,
//   analyzeJDMatch,
//   rewriteSection,
//   chatWithAssistant,
// };






















const { Groq } = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ANALYSIS_MODEL = 'llama-3.3-70b-versatile';
const CHAT_MODEL     = 'llama-3.3-70b-versatile';
const MAX_RETRIES    = 3;
const RETRY_DELAY_MS = 1500;

const domainPrompts = {
  'software-engineer': `
    You are evaluating a Software Engineer candidate.
    TECHNICAL STANDARDS: Look for programming languages (Python, Java, Go, TypeScript), frameworks (React, Node, Spring, FastAPI),
    databases (PostgreSQL, Redis, MongoDB), cloud platforms (AWS, GCP, Azure), DevOps (Docker, K8s, CI/CD), system design, and CS fundamentals.
    RED FLAGS: Skills listed in the skills section but absent from any project or work experience.
    Generic descriptions like "developed features" with no scale, load, or outcome stated.
    BENCHMARK: Top candidates show: system scale (users, RPS, data volume), architectural decisions and tradeoffs, open-source contributions or strong GitHub presence.
  `,
  'data-scientist': `
    You are evaluating a Data Scientist candidate.
    TECHNICAL STANDARDS: Python/R, SQL, ML libraries (scikit-learn, PyTorch, TensorFlow, XGBoost), statistical methods,
    data pipelines, experiment design (A/B testing), feature engineering, model deployment (MLOps), and data visualization.
    RED FLAGS: "Built a machine learning model" with no mention of the algorithm, dataset size, or accuracy improvement.
    Listing tools without showing they were used to produce a measurable business outcome.
    BENCHMARK: Top candidates show: model performance deltas (before/after), business impact in $ or %, published research or Kaggle rankings.
  `,
  'marketing': `
    You are evaluating a Marketing professional.
    TECHNICAL STANDARDS: Digital marketing (SEO, SEM, paid social, email), analytics (GA4, Mixpanel, Amplitude),
    CRM (HubSpot, Salesforce), campaign management, content strategy, brand positioning, and funnel optimization.
    RED FLAGS: "Managed social media" with no follower growth, engagement rate, or conversion data.
    "Led campaigns" with zero budget or ROI figures.
    BENCHMARK: Top candidates show: CAC, LTV, ROAS, MQL/SQL conversion rates, and specific revenue contribution.
  `,
  'product-manager': `
    You are evaluating a Product Manager candidate.
    TECHNICAL STANDARDS: Product strategy, OKRs, roadmap prioritization (RICE, MoSCoW), user research methods,
    data analysis, A/B testing, cross-functional leadership, and go-to-market execution.
    RED FLAGS: "Worked with engineers" instead of "led a team of X engineers to ship Y by Z date."
    No mention of metrics, user feedback loops, or how decisions were made.
    BENCHMARK: Top candidates show: shipped product impact in revenue or engagement, reduced churn, ownership over a P&L or key metric.
  `,
  'design': `
    You are evaluating a UX/Product Designer candidate.
    TECHNICAL STANDARDS: Design tools (Figma, Sketch, Adobe XD), UX research methods, prototyping, design systems,
    accessibility (WCAG), information architecture, and cross-functional collaboration with engineering.
    RED FLAGS: Portfolio not linked. "Designed UI for app" with no user testing, iteration, or outcome data.
    Aesthetic descriptions with zero user problem framing.
    BENCHMARK: Top candidates show: user research → design → measurable outcome cycle, design system contributions, accessibility compliance.
  `,
  'sales': `
    You are evaluating a Sales professional.
    TECHNICAL STANDARDS: CRM proficiency (Salesforce, HubSpot), pipeline management, outbound prospecting,
    enterprise vs. SMB sales motion, negotiation, and revenue forecasting.
    RED FLAGS: "Exceeded quota" with no actual quota figure or percentage.
    "Built relationships" with no deal size, sales cycle length, or close rate.
    BENCHMARK: Top candidates show: ARR contributed, quota attainment %, average deal size, ramp-to-productivity time.
  `,
  'other': `
    You are evaluating a general professional resume.
    Apply universal professional standards: quantified achievements, clear career progression, demonstrated impact,
    strong action verbs, and relevant skills backed by experience.
    Focus on: career trajectory, transferable skills, and whether the resume tells a coherent professional story.
  `,
};

async function withRetry(fn, retries = MAX_RETRIES, delayMs = RETRY_DELAY_MS) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = attempt === retries;
      const isRetryable   = err?.status === 429 || err?.status >= 500 || err?.code === 'ECONNRESET';
      if (isLastAttempt || !isRetryable) throw err;
      console.warn(`⚠️  Attempt ${attempt} failed (${err.message}). Retrying in ${delayMs}ms…`);
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
}

function extractJSON(raw) {
  const cleaned = raw.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
  const match   = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in model response');
  return JSON.parse(match[0]);
}

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, parseInt(val) || 0));
}

async function analyzeResumeWithGroq(resumeText, targetDomain) {
  const domainContext = domainPrompts[targetDomain] || domainPrompts['other'];
  const domainLabel   = targetDomain.replace(/-/g, ' ');

  const prompt = `
You are a brutally honest Senior Recruiter and Hiring Manager at a FAANG-level firm with 20+ years of experience.
Your job is to critically audit this resume for a **${domainLabel}** position.

RULES:
- Be harsh but constructive. No participation trophies.
- Every critique MUST cite the specific line, bullet, or section you are referencing — do NOT give generic feedback.
- A score of 80+ requires: zero vague bullets, minimum 3 quantified achievements, no formatting issues.
- Penalize "Responsible for", "Worked on", "Helped with", "Assisted" unless followed by a clear, measurable result.
- Cross-reference Skills section with Experience/Projects. Skills listed but never demonstrated = red flag.
- Detect employment gaps > 6 months and short tenures < 4 months — flag them.
- Detect suspicious claims: impossibly round numbers (100% improvement), vague certifications, overlapping dates.
- For salary_estimate.currency: use "INR" if the resume shows Indian companies, Indian cities, or rupee amounts; otherwise use "USD".

${domainContext}

RESUME TEXT:
"""
${resumeText}
"""

RESPOND ONLY WITH VALID JSON MATCHING THIS EXACT SCHEMA — NO EXTRA TEXT, NO MARKDOWN FENCES:

{
  "score": 72,
  "ats_compatibility": 68,
  "grammar_score": 80,
  "readability_score": 75,
  "experience_match": 70,

  "career_trajectory": {
    "direction": "upward",
    "assessment": "2-3 sentence evaluation of career progression visible in the resume.",
    "promotions_detected": false,
    "avg_tenure_months": 18
  },

  "salary_estimate": {
    "currency": "INR",
    "range_low": 50000,
    "range_high": 110000,
    "basis": "Brief explanation of what drove this estimate based on YOUR, skills, domain, and location signals."
  },

  "strengths": ["Cite specific line or section — min 5 items"],
  "weaknesses": ["Cite specific line or section — min 5 items"],
  "improvements": ["Specific fix with location — min 6 items"],

  "hard_skills": ["extracted from resume text"],
  "soft_skills": ["extracted from resume text"],
  "keywords": ["ATS keywords present in the resume"],
  "missing_keywords": ["critical ${domainLabel} keywords absent from resume"],

  "sections_detected": ["list of standard resume sections found"],
  "missing_sections": ["standard sections absent"],
  "formatting_issues": ["specific layout/design problems with location"],
  "grammar_issues": ["specific grammar/tense errors — quote the offending text"],

  "top_projects": [
    {
      "name": "Project name",
      "score": 7,
      "reason": "Strict evaluation: complexity, tech stack depth, and measurable business impact."
    }
  ],

  "bullet_improvements": [
    {
      "original": "exact bullet from resume",
      "improved": "Accomplished [X] as measured by [Y], by doing [Z]",
      "reason": "Why the original is weak and what the rewrite fixes."
    }
  ],

  "summary_rewrite": {
    "original": "existing summary/objective from resume or 'None found'",
    "improved": "A punchy 3-4 sentence professional summary rewritten for maximum recruiter impact.",
    "reason": "What was wrong and what the rewrite improves."
  },

  "scam_flags": [],

  "red_flags": [],

  "benchmark": {
    "domain": "${targetDomain}",
    "missing_compared_to_top_candidates": ["3-5 things top candidates at this level typically show that this resume lacks"],
    "competitive_strengths": ["2-3 things this resume has that are genuinely competitive"]
  },

  "interview_questions": [
    {
      "question": "You listed React in your skills but I see no React project — walk me through a React project you built.",
      "difficulty": "Hard",
      "reason": "Validates whether the skill is genuinely practiced or just listed."
    },
    {
      "question": "Walk me through a specific slow SQL query you fixed — what the query was, the problem, and exactly what you changed.",
      "difficulty": "Hard",
      "reason": "Tests depth of database knowledge and whether the claim is real."
    },
    {
      "question": "Your most recent role lasted under a year. What happened and what did you learn from it?",
      "difficulty": "Hard",
      "reason": "Probes short tenure — tests self-awareness."
    },
    {
      "question": "Describe a time you disagreed with your manager on a technical decision. What did you do?",
      "difficulty": "Medium",
      "reason": "Behavioral — tests communication and professional maturity."
    },
    {
      "question": "You led a cross-functional project — how did you handle a situation where another team missed a deadline that blocked yours?",
      "difficulty": "Medium",
      "reason": "Validates the leadership claim with a concrete scenario."
    },
    {
      "question": "How would you design a system to handle 100k concurrent users, given your background?",
      "difficulty": "Medium",
      "reason": "Tests system design thinking appropriate to the domain."
    },
    {
      "question": "What is your preferred way to receive feedback, and can you give a recent example of acting on it?",
      "difficulty": "Easy",
      "reason": "Reveals self-awareness and growth mindset."
    },
    {
      "question": "How do you prioritize when you have three high-priority tasks and a single afternoon?",
      "difficulty": "Easy",
      "reason": "Tests time management and communication of trade-offs."
    },
    {
      "question": "Tell me about yourself in 2 minutes — focus on the thread that connects your roles.",
      "difficulty": "Easy",
      "reason": "Tests whether the candidate has a coherent career narrative."
    }
  ],

  "summary": "Brutally honest 5-6 line executive summary with the top 2-3 specific things to fix immediately."
}

CRITICAL RULES FOR scam_flags AND red_flags:
- Both MUST be plain string arrays — NO nested objects, NO { claim, reason } shapes.
- If nothing suspicious, return an EMPTY ARRAY []. NEVER add placeholder strings like "None found".
- scam_flags format: "\"exact quoted claim\" — reason it is suspicious"
  Example: "\"Increased revenue by 100%\" — Round number with no baseline is unverifiable"
- red_flags format: "TYPE: detail with dates"
  Example: "employment_gap: No role listed between Jan 2022 and Aug 2023 (7 months)"
  Valid TYPEs: employment_gap | short_tenure | overlapping_dates | unverifiable_claim

INTERVIEW QUESTIONS — NON-NEGOTIABLE RULES:
- Each item MUST have exactly three keys: "question" (string), "difficulty" (string), "reason" (string).
- "difficulty" MUST be exactly one of: "Hard", "Medium", "Easy" — no other values, no "High"/"Low"/"importance".
- You MUST return AT LEAST 3 Hard, AT LEAST 3 Medium, AT LEAST 3 Easy questions.
- Minimum total: 9 questions. Maximum: 20 questions.
- ALL questions MUST be grounded in specific claims, roles, or projects from THIS resume.
- Returning fewer than 9 or using wrong difficulty values = INVALID RESPONSE.

MINIMUM COUNTS — returning fewer = invalid response:
- strengths: 5+, weaknesses: 5+, improvements: 6+, bullet_improvements: 4+
- interview_questions: 9+ total (3+ Hard, 3+ Medium, 3+ Easy)
- top_projects: up to 4
`;

  const raw = await withRetry(async () => {
    const res = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyst. Respond ONLY with valid JSON — no markdown, no prose, no code fences. Start your response with { and end with }.',
        },
        { role: 'user', content: prompt },
      ],
      model:                 ANALYSIS_MODEL,
      temperature:           0.4,
      max_completion_tokens: 5000,
      top_p:                 0.9,
      stream:                false,
    });
    return res.choices[0]?.message?.content;
  });

  if (!raw) throw new Error('Empty response from Groq');

  let analysis;
  try {
    analysis = extractJSON(raw);
  } catch (parseError) {
    console.error('JSON parse failed. Raw:', raw.substring(0, 500));
    throw new Error('Failed to parse AI response into JSON');
  }

  // ── Normalize numeric scores ──────────────────────────────────────
  analysis.score             = clamp(analysis.score);
  analysis.ats_compatibility = clamp(analysis.ats_compatibility);
  analysis.grammar_score     = clamp(analysis.grammar_score);
  analysis.readability_score = clamp(analysis.readability_score);
  analysis.experience_match  = clamp(analysis.experience_match);

  // ── Ensure flat arrays exist ──────────────────────────────────────
  ['strengths','weaknesses','improvements','hard_skills','soft_skills',
   'keywords','missing_keywords','sections_detected','missing_sections',
   'formatting_issues','grammar_issues','top_projects',
   'bullet_improvements','scam_flags','red_flags'].forEach(key => {
    if (!Array.isArray(analysis[key])) analysis[key] = [];
  });

  // ── Ensure nested objects exist ───────────────────────────────────
  if (!analysis.career_trajectory || typeof analysis.career_trajectory !== 'object') {
    analysis.career_trajectory = { direction: 'unclear', assessment: '', promotions_detected: false, avg_tenure_months: 0 };
  }
  if (!analysis.salary_estimate || typeof analysis.salary_estimate !== 'object') {
    analysis.salary_estimate = { currency: 'USD', range_low: 0, range_high: 0, basis: '' };
  }
  if (!analysis.benchmark || typeof analysis.benchmark !== 'object') {
    analysis.benchmark = { domain: targetDomain, missing_compared_to_top_candidates: [], competitive_strengths: [] };
  }
  if (!Array.isArray(analysis.benchmark.missing_compared_to_top_candidates)) {
    analysis.benchmark.missing_compared_to_top_candidates = [];
  }
  if (!Array.isArray(analysis.benchmark.competitive_strengths)) {
    analysis.benchmark.competitive_strengths = [];
  }
  if (!analysis.summary_rewrite || typeof analysis.summary_rewrite !== 'object') {
    analysis.summary_rewrite = { original: '', improved: '', reason: '' };
  }

  analysis.scam_flags = analysis.scam_flags
    .filter(f => {
      if (typeof f === 'string') return !/none found|no suspicious|nothing suspicious/i.test(f);
      if (typeof f === 'object' && f !== null) {
        const claim = (f.claim || f.flag || f.issue || '').toLowerCase();
        return !/none found|no suspicious|nothing suspicious/.test(claim);
      }
      return false;
    })
    .map(f => {
      if (typeof f === 'string') return f;
      const claim  = f.claim  || f.flag  || f.issue  || 'Unspecified claim';
      const reason = f.reason || f.detail || f.explanation || 'Flagged by AI';
      return `"${claim}" — ${reason}`;
    });

  analysis.red_flags = analysis.red_flags
    .filter(f => {
      if (typeof f === 'string') return !/none found|no red flag/i.test(f);
      if (typeof f === 'object' && f !== null) {
        const detail = (f.detail || f.type || '').toLowerCase();
        return !/none found|no red flag/.test(detail);
      }
      return false;
    })
    .map(f => {
      if (typeof f === 'string') return f;
      const type   = f.type   || 'unverifiable_claim';
      const detail = f.detail || f.description || 'No detail provided';
      return `${type}: ${detail}`;
    });

  const diffMap = {
    hard: 'Hard', high: 'Hard',
    medium: 'Medium', med: 'Medium',
    easy: 'Easy', low: 'Easy',
  };

  if (!Array.isArray(analysis.interview_questions)) analysis.interview_questions = [];

  analysis.interview_questions = analysis.interview_questions
    .filter(q => q && typeof q.question === 'string' && q.question.trim())
    .map(q => {
      const rawDiff    = (q.difficulty || q.importance || '').trim().toLowerCase();
      const difficulty = diffMap[rawDiff] || 'Medium';
      return {
        question:   q.question.trim(),
        difficulty,
        reason:     (q.reason || q.context || '').trim(),
      };
    });

  // ── Log counts for debugging ──────────────────────────────────────
  const counts = { Hard: 0, Medium: 0, Easy: 0 };
  analysis.interview_questions.forEach(q => { if (counts[q.difficulty] !== undefined) counts[q.difficulty]++; });

  if (analysis.interview_questions.length < 9 || counts.Hard < 3 || counts.Medium < 3 || counts.Easy < 3) {
    console.warn(`⚠️  Below minimum IQ count — Hard:${counts.Hard} Medium:${counts.Medium} Easy:${counts.Easy}`);
  }

  return analysis;
}

// ─────────────────────────────────────────────────────────────
// JD Match Analysis
// ─────────────────────────────────────────────────────────────
async function analyzeJDMatch(resumeText, jobDescription, targetDomain) {
  const prompt = `
You are an expert ATS system and recruiter hybrid. Compare this resume against the job description
and tell the candidate exactly how well they match and what to change.

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

TARGET DOMAIN: ${(targetDomain || 'general').replace(/-/g, ' ')}

Respond ONLY with valid JSON in this exact format — no markdown, no prose:

{
  "match_score": 0,
  "fit_verdict": "Strong Fit | Decent Fit | Weak Fit | Not a Fit",
  "verdict_reasoning": "2-3 sentence explanation",

  "matched_keywords": ["keywords from JD that appear in the resume"],
  "missing_keywords": ["keywords from JD that are completely absent from the resume"],
  "partially_matched": ["keywords present but not demonstrated with evidence"],

  "requirement_gaps": [
    {
      "requirement": "exact requirement from JD",
      "gap": "what is missing or weak in the resume",
      "fixable": true
    }
  ],

  "tailoring_suggestions": [
    {
      "section": "Summary | Experience | Skills | Projects",
      "suggestion": "specific change to better align this resume to this JD"
    }
  ],

  "positioning_statement": "A 2-3 sentence personalized pitch the candidate can use in their cover letter or intro email, tailored to this specific JD",

  "ats_pass_probability": "High | Medium | Low",
  "ats_notes": "Specific reasons the ATS might reject this resume for this JD"
}
`;

  const raw = await withRetry(async () => {
    const res = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert ATS and recruiter. Respond ONLY with valid JSON. Start with { and end with }.' },
        { role: 'user', content: prompt },
      ],
      model:                 ANALYSIS_MODEL,
      temperature:           0.3,
      max_completion_tokens: 3000,
    });
    return res.choices[0]?.message?.content;
  });

  const result = extractJSON(raw);
  result.match_score = clamp(result.match_score);
  ['matched_keywords','missing_keywords','partially_matched',
   'requirement_gaps','tailoring_suggestions'].forEach(k => {
    if (!Array.isArray(result[k])) result[k] = [];
  });

  return result;
}

// ─────────────────────────────────────────────────────────────
// Section-level deep rewrite
// ─────────────────────────────────────────────────────────────
async function rewriteSection(sectionText, sectionType, targetDomain) {
  const prompt = `
You are a professional resume writer specializing in ${(targetDomain || 'general').replace(/-/g, ' ')} roles.
Rewrite the following resume ${sectionType} section to maximize recruiter impact.

RULES:
- Use strong action verbs. No "Responsible for", "Worked on", "Helped".
- Add placeholders like [X%] or [$Y] where metrics are implied but missing — mark them with "(add metric)".
- Use XYZ format: "Accomplished [X] as measured by [Y], by doing [Z]".
- Keep the same factual content — do not invent new claims.
- Return ONLY valid JSON, starting with { and ending with }.

ORIGINAL SECTION:
"""
${sectionText}
"""

JSON FORMAT:
{
  "rewritten": "full rewritten section text, preserving structure",
  "changes_made": ["list of specific changes and why they improve the section"],
  "metrics_to_add": ["list of places where the candidate should add real numbers"]
}
`;

  const raw = await withRetry(async () => {
    const res = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a professional resume writer. Respond ONLY with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      model:       ANALYSIS_MODEL,
      temperature: 0.5,
      max_completion_tokens: 2000,
    });
    return res.choices[0]?.message?.content;
  });

  const result = extractJSON(raw);
  if (!Array.isArray(result.changes_made))   result.changes_made   = [];
  if (!Array.isArray(result.metrics_to_add)) result.metrics_to_add = [];
  return result;
}

// ─────────────────────────────────────────────────────────────
// Chat Assistant
// ─────────────────────────────────────────────────────────────
async function chatWithAssistant(message, resumeContext, targetDomain, conversationHistory = []) {
  const contextPrompt = resumeContext
    ? `RESUME CONTEXT (first 1200 chars): "${resumeContext.substring(0, 1200)}"`
    : 'No resume context provided.';

  const domainPrompt = targetDomain
    ? `TARGET ROLE: ${targetDomain.replace(/-/g, ' ')}`
    : 'No specific role targeted.';

  const historyPrompt = conversationHistory.length > 0
    ? `CONVERSATION HISTORY:\n${conversationHistory
        .slice(-6)
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n')}`
    : '';

  const prompt = `
You are an expert resume and career advisor. Be specific, direct, and actionable.
${contextPrompt}
${domainPrompt}
${historyPrompt}

USER: "${message}"

Respond in under 220 words. Ground your advice in the resume content when relevant.
If the user asks something unrelated to resumes/careers, gently redirect them.
`;

  const raw = await withRetry(async () => {
    const res = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful, specific resume and career advisor with 40+ years of experience. You analyze resumes in the context of today\'s fast-growing AI-driven job market.' },
        { role: 'user', content: prompt },
      ],
      model:                 CHAT_MODEL,
      temperature:           0.6,
      max_completion_tokens: 512,
    });
    return res.choices[0]?.message?.content;
  });

  return raw || "I couldn't process your question. Please try again.";
}

module.exports = {
  analyzeResumeWithGroq,
  analyzeJDMatch,
  rewriteSection,
  chatWithAssistant,
};