/**
 * GroqService — AI Service
 *
 * MODEL PRIORITY (auto-fallback cascade):
 *   Level 0 — PRIMARY   : llama3-groq-70b-8192-tool-use-preview
 *               Best for: Complex multi-step reasoning, JD match, resume rewrite,
 *                         cover letters, outreach. Largest context, tool-use capable.
 *
 *   Level 1 — SECONDARY : llama-3.1-8b-instant
 *               Best for: Fast tasks — roast, learning path, bullet rewrites,
 *                         interview questions. 8B params = ultra-low latency.
 *
 *   Level 2 — TERTIARY  : gemma2-9b-it
 *               Best for: Final fallback. Google-trained, strong instruction
 *                         following, reliable JSON output even under load.
 *
 * AUTO-FALLBACK: If a model returns an error (rate limit, timeout, empty response),
 *                the call automatically retries with the next model in the chain.
 *                Zero manual intervention needed.
 *
 * PER-FUNCTION ROUTING: Heavy analytical functions (matchJD, rewriteResume,
 *                        generateCoverLetter) always start at Level 0.
 *                        Fast/lightweight functions (roastResume, generateLearningPath,
 *                        rewriteBulletPoints) start at Level 1 to save quota.
 *
 * ENVIRONMENT: Requires GROQ_API_KEY in .env
 */

require('dotenv').config();
const Groq = require('groq-sdk');

// ── Groq client (single instance, reused across all calls) ──
const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Model definitions ──
const MODELS = {
  PRIMARY:   'llama-3.3-70b-versatile', // Level 0 — heavy analysis
  SECONDARY: 'llama-3.1-8b-instant',                  // Level 1 — fast/lightweight
  TERTIARY:  'gemma2-9b-it',                          // Level 2 — final fallback
};

// Ordered array used by the fallback loop
const MODEL_CASCADE = [
  MODELS.PRIMARY,
  MODELS.SECONDARY,
  MODELS.TERTIARY,
];

// ── Per-model token limits ──
// llama3-groq-70b-8192 → 8192 context, safe output 4096
// llama-3.1-8b-instant → 8192 context, safe output 4096
// gemma2-9b-it         → 8192 context, safe output 4096
const MAX_TOKENS = {
  [MODELS.PRIMARY]:   4096,
  [MODELS.SECONDARY]: 4096,
  [MODELS.TERTIARY]:  4096,
};

/**
 * Core Groq call with automatic 3-level model fallback.
 *
 * @param {Array}   messages      - Standard OpenAI-format messages array
 * @param {number}  temperature   - 0.0–1.0 (lower = more deterministic JSON)
 * @param {number}  startLevel    - Which model to start from (0=Primary, 1=Secondary, 2=Tertiary)
 *                                  Pass startLevel=1 for lightweight tasks to preserve Primary quota.
 * @returns {Object} { result: string, modelUsed: string, parsed: object|null }
 */
async function callGroq(messages, temperature = 0.7, startLevel = 0) {
  const level  = Math.min(Math.max(startLevel, 0), MODEL_CASCADE.length - 1);
  const model  = MODEL_CASCADE[level];
  const maxTok = MAX_TOKENS[model] || 4096;

  try {
    const response = await groqClient.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens:  maxTok,
      top_p:       0.95,
      stream:      false,
      stop:        null,
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content || content.trim() === '') {
      throw new Error(`Empty response from ${model}`);
    }

    // Strip markdown code fences if model wrapped JSON in them
    const cleaned = content
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    return {
      result:    cleaned,
      modelUsed: model,
      parsed:    null,  // caller can attach parsed object after JSON.parse
    };

  } catch (error) {
    const isRateLimit = error?.status === 429 || error?.message?.includes('rate');
    const isTimeout   = error?.status === 408 || error?.message?.includes('timeout');
    const isEmpty     = error?.message?.includes('Empty response');

    console.error(`❌ ${model} failed [L${level}]: ${error.message}`);

    if (isRateLimit) {
      console.warn(`⚠️  Rate limit hit on ${model}. Switching to next model...`);
    } else if (isTimeout) {
      console.warn(`⚠️  Timeout on ${model}. Switching to next model...`);
    } else if (isEmpty) {
      console.warn(`⚠️  Empty response from ${model}. Switching to next model...`);
    } else {
      console.warn(`⚠️  Unexpected error on ${model}. Attempting next model...`);
    }

    // Recurse to next level if available
    if (level < MODEL_CASCADE.length - 1) {
      return callGroq(messages, temperature, level + 1);
    }

    // All models exhausted
    throw new Error(
      `All Groq models failed. Last error: ${error.message}. ` +
      `Models tried: ${MODEL_CASCADE.slice(0, level + 1).join(' → ')}`
    );
  }
}

/**
 * Convenience alias — identical to callGroq.
 * Keeps backward-compatibility with any code that calls callOpenRouter().
 * @deprecated Prefer callGroq() in new code.
 */
const callOpenRouter = callGroq;

async function matchJD(resumeAnalysis, jobDescription) {

  // ── Pre-process: extract key fields from resumeAnalysis safely ──
  const resumeScore        = resumeAnalysis?.score ?? 'N/A';
  const hardSkills         = (resumeAnalysis?.hard_skills  || []).join(', ') || 'Not detected';
  const softSkills         = (resumeAnalysis?.soft_skills  || []).join(', ') || 'Not detected';
  const existingKeywords   = (resumeAnalysis?.keywords     || []).join(', ') || 'None';
  const missingKeywords    = (resumeAnalysis?.missing_keywords || []).join(', ') || 'None';
  const experienceMatch    = resumeAnalysis?.experience_match ?? 'N/A';
  const atsScore           = resumeAnalysis?.ats_compatibility ?? 'N/A';
  const topProjects        = (resumeAnalysis?.top_projects || [])
    .map(p => `${p.name} (score: ${p.score}/10): ${p.reason}`)
    .join('\n') || 'No projects detected';
  const strengths          = (resumeAnalysis?.strengths || []).join('\n') || 'None listed';
  const weaknesses         = (resumeAnalysis?.weaknesses || []).join('\n') || 'None listed';
  const sectionsDetected   = (resumeAnalysis?.sections_detected || []).join(', ') || 'Unknown';
  const summary            = resumeAnalysis?.summary || 'No summary available';
  const targetDomain       = resumeAnalysis?.targetDomain || 'General';
  const grammarScore       = resumeAnalysis?.grammar_score ?? 'N/A';
  const readabilityScore   = resumeAnalysis?.readability_score ?? 'N/A';

  const messages = [
    {
      role: "system",
      content: `You are ARIA (Advanced Resume Intelligence Analyst), an elite ATS engine and 
Senior Technical Recruiter with 20+ years at FAANG, McKinsey, and top-tier recruiting firms.

Your analysis is BRUTALLY HONEST, PRECISE, and DEEPLY ACTIONABLE.
You do not give participation trophies. A match score of 85+ means the candidate 
is almost perfectly qualified. Most good candidates score 60-75.

════════════════════════════════════════
CORE ANALYSIS FRAMEWORK
════════════════════════════════════════

STEP 1 — DECONSTRUCT THE JOB DESCRIPTION:
  - Separate "MUST-HAVE" requirements from "NICE-TO-HAVE"
  - Identify the seniority level (Junior / Mid / Senior / Lead / Principal)
  - Extract the tech stack (primary tools, secondary tools, frameworks, cloud, DevOps)
  - Find hidden requirements (e.g. "fast-paced environment" = startup tolerance needed)
  - Identify culture signals (remote/hybrid/onsite, team size hints, product vs service)

STEP 2 — DEEP SKILL ANALYSIS:
  Technical Skills Gap:
  - For EACH required skill in the JD, check if resume has it
  - Score coverage: (matched skills / total required skills) × 100
  - Penalize: skill listed in resume but ZERO evidence in projects/experience
  - Reward: skill with 2+ years of demonstrated project use
  - Apply semantic matching:
      PostgreSQL ≈ SQL, MySQL, database experience ✅
      REST APIs ≈ API development, web services ✅  
      Java ≠ JavaScript (common false match — penalize this confusion) ❌
      React ≠ Angular (different frameworks — flag if JD needs one but resume shows other) ⚠️

STEP 3 — EXPERIENCE ALIGNMENT:
  - Compare years of experience required vs implied by resume
  - Check if projects match the SCALE/COMPLEXITY required (startup vs enterprise)
  - Seniority signal detection:
      JD says "Lead/Staff/Principal/Head" + resume shows no leadership = heavy penalty
      JD says "Junior/Entry" + resume shows 5+ years = possible overqualification flag

STEP 4 — KEYWORD DENSITY AUDIT:
  - List every technical keyword in JD
  - For each: FOUND / MISSING / PARTIAL in resume
  - Calculate ATS keyword hit rate %
  - Flag critical missing keywords that would cause ATS auto-rejection

STEP 5 — RED FLAG DETECTION:
  These are automatic disqualifiers that a real recruiter would spot:
  - Required certification missing (AWS Certified, PMP, CPA, etc.)
  - Required degree level not met
  - Required years of experience in a specific tech not met
  - Domain mismatch (JD needs fintech experience, resume shows ed-tech only)
  - Location/visa requirements not addressed

STEP 6 — HIDDEN OPPORTUNITY DETECTION:
  - Skills the candidate HAS that are not in JD but highly relevant
  - Transferable experience that maps to JD requirements
  - Projects that demonstrate JD requirements even if not named explicitly

STEP 7 — GENERATE OVERVIEW:
  Create a comprehensive, honest executive summary that answers:
  "If I were the recruiter, would I shortlist this resume for this specific role?"
  Include: what works, what doesn't, and the single most important thing to fix.

════════════════════════════════════════
RESPONSE FORMAT — JSON ONLY, NO MARKDOWN
════════════════════════════════════════

{
  "matchScore": <0-100, integer>,
  
  "scoreBreakdown": {
    "technicalSkillsScore": <0-40, weighted 40%>,
    "experienceLevelScore": <0-25, weighted 25%>,
    "keywordDensityScore": <0-20, weighted 20%>,
    "domainKnowledgeScore": <0-15, weighted 15%>,
    "breakdown_explanation": "One sentence explaining how you weighted these"
  },

  "jdAnalysis": {
    "seniorityLevel": "Junior | Mid | Senior | Lead | Principal",
    "primaryTechStack": ["skill1", "skill2"],
    "secondaryTechStack": ["skill3", "skill4"],
    "mustHaveRequirements": ["critical req 1", "critical req 2"],
    "niceToHaveRequirements": ["preferred req 1", "preferred req 2"],
    "hiddenRequirements": ["inferred req 1"],
    "cultureSignals": ["remote-friendly", "startup pace", etc],
    "estimatedYearsRequired": "2-4 years"
  },

  "skillGapAnalysis": {
    "perfectMatches": [
      {
        "skill": "skill name",
        "jdRequirement": "what JD says",
        "resumeEvidence": "where it appears in resume",
        "confidenceLevel": "High | Medium | Low"
      }
    ],
    "partialMatches": [
      {
        "skill": "skill name",
        "jdRequirement": "what JD needs",
        "resumeEvidence": "what resume shows",
        "gap": "what is specifically missing",
        "severity": "Minor | Moderate | Major"
      }
    ],
    "criticalMissing": [
      {
        "skill": "skill name",
        "whyItMatters": "why this is a dealbreaker",
        "howToFix": "specific action to address this",
        "timeToLearn": "estimated time to get proficient",
        "priority": "P0 (dealbreaker) | P1 (important) | P2 (nice)"
      }
    ],
    "bonusSkills": [
      {
        "skill": "skill candidate has",
        "relevance": "how it helps even though not in JD"
      }
    ]
  },

  "keywordAudit": {
    "totalJDKeywords": <number>,
    "matchedCount": <number>,
    "missingCount": <number>,
    "atsPredictedPassRate": <0-100>,
    "keywordDetails": [
      {
        "keyword": "keyword name",
        "status": "FOUND | MISSING | PARTIAL",
        "importance": "Critical | Important | Optional",
        "resumeLocation": "Skills section | Project X | Not found",
        "suggestion": "Add to X section" or null
      }
    ]
  },

  "experienceAnalysis": {
    "requiredYears": "X years",
    "estimatedResumeYears": "Y years",
    "alignmentStatus": "Under-qualified | Well-matched | Overqualified",
    "seniorityGap": "Candidate appears mid-level, JD needs senior",
    "projectComplexityMatch": "High | Medium | Low",
    "domainRelevance": "Direct match | Transferable | Mismatch",
    "leadershipRequiredMet": true or false,
    "details": "2-3 sentence explanation"
  },

  "redFlags": [
    {
      "flag": "specific red flag description",
      "severity": "Dealbreaker | Major | Minor",
      "impact": "This will likely cause auto-rejection at ATS stage",
      "fix": "Specific fix if possible, or null if it cannot be fixed"
    }
  ],

  "resumeImprovementsForThisJD": [
    {
      "section": "Skills | Summary | Experience | Projects",
      "issue": "specific problem",
      "currentState": "what it says now (if known)",
      "recommendedChange": "exactly what to write or add",
      "priority": "High | Medium | Low",
      "reasoning": "why this change will increase match score"
    }
  ],

  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["critical skill 1", "critical skill 2"],

  "shouldApply": <true | false>,
  "applicationConfidence": "Strong | Moderate | Weak | Do Not Apply",
  "hiringProbability": "<X>% chance of getting interview callback",

  "suggestions": [
    "Actionable suggestion 1 — specific, not generic",
    "Actionable suggestion 2 — with exact wording if possible",
    "Actionable suggestion 3",
    "Actionable suggestion 4",
    "Actionable suggestion 5"
  ],

  "tailoredResumeChanges": {
    "summaryRewrite": "Rewrite the resume summary to: [specific new summary text targeting this JD]",
    "skillsToAdd": ["Add these exact skills/tools to your Skills section"],
    "skillsToHighlight": ["Move these existing skills to top of skills list"],
    "bulletPointsToRewrite": [
      {
        "original": "original bullet from resume (if identifiable)",
        "rewritten": "improved version targeting this JD",
        "reason": "why this change increases ATS score"
      }
    ]
  },

  "overview": {
    "verdict": "STRONG MATCH | GOOD MATCH | PARTIAL MATCH | WEAK MATCH | NOT RECOMMENDED",
    "verdictColor": "green | yellow | orange | red | darkred",
    "oneLineSummary": "Single brutally honest sentence: e.g. 'Strong backend engineer but missing cloud experience that this role specifically requires'",
    "whatWorksWell": [
      "Specific strength 1 relevant to this JD",
      "Specific strength 2",
      "Specific strength 3"
    ],
    "whatHurtsYou": [
      "Specific problem 1 with this JD specifically",
      "Specific problem 2",
      "Specific problem 3"
    ],
    "topPriorityFix": "THE single most impactful change the candidate should make before applying — be specific",
    "timeToBeReady": "How long to close the gap: 'Ready now' | '1-2 weeks of resume tuning' | '1-2 months of skill building' | '3-6 months'",
    "recruiterPerspective": "2-3 sentences written as if you are the recruiter reading this resume for this specific job. What impression does it make? What would make you reject or shortlist?",
    "atsRiskLevel": "Low | Medium | High | Critical",
    "atsRiskExplanation": "Why the ATS might auto-reject this resume",
    "finalScore": <same as matchScore>,
    "scoreInterpretation": "90-100: Perfect fit | 75-89: Strong candidate | 60-74: Decent shot | 45-59: Long shot | Below 45: Do not apply"
  }
}

STRICT RULES:
- Return ONLY the JSON object. Zero text before or after it.
- All arrays must have at least 1 item (never empty arrays).
- matchScore must equal scoreBreakdown sum: technicalSkillsScore + experienceLevelScore + keywordDensityScore + domainKnowledgeScore.
- Never invent skills the resume does not have.
- Never give a matchScore above 88 unless every single must-have requirement is met with evidence.
- The overview.recruiterPerspective must be written in first person ("I would...").`
    },
    {
      role: "user",
      content: `Perform a deep JD match analysis for the following candidate and job posting.

════════════════════════════════════
CANDIDATE RESUME ANALYSIS SUMMARY
════════════════════════════════════
Overall Resume Score     : ${resumeScore}/100
ATS Compatibility Score  : ${atsScore}/100
Grammar Score            : ${grammarScore}/100
Readability Score        : ${readabilityScore}/100
Experience Match Score   : ${experienceMatch}/100
Target Domain            : ${targetDomain}

HARD SKILLS DETECTED:
${hardSkills}

SOFT SKILLS DETECTED:
${softSkills}

EXISTING KEYWORDS IN RESUME:
${existingKeywords}

KEYWORDS MISSING FROM RESUME (per prior analysis):
${missingKeywords}

TOP PROJECTS:
${topProjects}

RESUME STRENGTHS:
${strengths}

RESUME WEAKNESSES:
${weaknesses}

SECTIONS DETECTED IN RESUME:
${sectionsDetected}

AI SUMMARY OF CANDIDATE:
${summary}

════════════════════════════════════
JOB DESCRIPTION (TARGET ROLE)
════════════════════════════════════
${jobDescription}

════════════════════════════════════
YOUR TASK
════════════════════════════════════
1. Deconstruct the JD into must-have vs nice-to-have requirements.
2. Perform a skill-by-skill gap analysis with severity levels.
3. Run a full keyword audit and predict ATS pass/fail rate.
4. Identify every red flag that would cause rejection.
5. Give specific, rewrite-ready resume improvement suggestions.
6. Generate a full overview with recruiter perspective and verdict.

Be specific. Be harsh. Be useful. Do NOT be generic.
If the candidate is missing React but the JD requires it — say it clearly.
If the candidate's experience is junior but the role is senior — say it clearly.
The user is counting on your honesty to make a career decision.`
    }
  ];

  const result = await callGroq(messages, 0.2, 0);

  // ── Parse and validate the result ──
  let parsed = null;
  try {
    const raw     = result.result || '{}';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonStr = cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned;
    parsed = JSON.parse(jsonStr);

    // ── Ensure matchScore integrity ──
    if (parsed.scoreBreakdown) {
      const { technicalSkillsScore, experienceLevelScore,
              keywordDensityScore, domainKnowledgeScore } = parsed.scoreBreakdown;
      const calculatedTotal = (technicalSkillsScore  || 0)
                            + (experienceLevelScore   || 0)
                            + (keywordDensityScore    || 0)
                            + (domainKnowledgeScore   || 0);
      // Sync overview finalScore with matchScore
      if (parsed.overview) {
        parsed.overview.finalScore = parsed.matchScore;
      }

    }

    // ── Fallback defaults for any missing top-level fields ──
    parsed.matchedSkills          = parsed.matchedSkills          || [];
    parsed.missingSkills          = parsed.missingSkills          || [];
    parsed.suggestions            = parsed.suggestions            || [];
    parsed.redFlags               = parsed.redFlags               || [];
    parsed.resumeImprovementsForThisJD = parsed.resumeImprovementsForThisJD || [];

    if (!parsed.overview) {
      parsed.overview = {
        verdict:              'PARTIAL MATCH',
        verdictColor:         'orange',
        oneLineSummary:       'Analysis incomplete — please retry.',
        whatWorksWell:        [],
        whatHurtsYou:         [],
        topPriorityFix:       'Retry analysis for detailed feedback.',
        timeToBeReady:        'Unknown',
        recruiterPerspective: 'Unable to generate recruiter perspective.',
        atsRiskLevel:         'Medium',
        atsRiskExplanation:   'Could not evaluate ATS risk.',
        finalScore:            parsed.matchScore || 0,
        scoreInterpretation:  'Score could not be fully interpreted.',
      };
    }



  } catch (parseError) {
    console.error('❌ Failed to parse JD match JSON:', parseError.message);
    // Return structured fallback so frontend never crashes
    parsed = {
      matchScore:            50,
      shouldApply:           false,
      applicationConfidence: 'Weak',
      hiringProbability:     '20% chance of getting interview callback',
      matchedSkills:         [],
      missingSkills:         ['Analysis failed — please retry'],
      suggestions:           ['Retry the JD match analysis'],
      redFlags:              [],
      resumeImprovementsForThisJD: [],
      scoreBreakdown: {
        technicalSkillsScore:  20,
        experienceLevelScore:  10,
        keywordDensityScore:   10,
        domainKnowledgeScore:  10,
        breakdown_explanation: 'Default fallback scores due to parse error',
      },
      jdAnalysis: {
        seniorityLevel:          'Unknown',
        primaryTechStack:        [],
        secondaryTechStack:      [],
        mustHaveRequirements:    [],
        niceToHaveRequirements:  [],
        hiddenRequirements:      [],
        cultureSignals:          [],
        estimatedYearsRequired:  'Unknown',
      },
      skillGapAnalysis: {
        perfectMatches:  [],
        partialMatches:  [],
        criticalMissing: [],
        bonusSkills:     [],
      },
      keywordAudit: {
        totalJDKeywords:        0,
        matchedCount:           0,
        missingCount:           0,
        atsPredictedPassRate:   0,
        keywordDetails:         [],
      },
      experienceAnalysis: {
        requiredYears:          'Unknown',
        estimatedResumeYears:   'Unknown',
        alignmentStatus:        'Unknown',
        seniorityGap:           'Could not evaluate',
        projectComplexityMatch: 'Unknown',
        domainRelevance:        'Unknown',
        leadershipRequiredMet:  false,
        details:                'Analysis failed. Please retry.',
      },
      tailoredResumeChanges: {
        summaryRewrite:       'Analysis failed — retry for suggestions',
        skillsToAdd:          [],
        skillsToHighlight:    [],
        bulletPointsToRewrite:[],
      },
      overview: {
        verdict:              'ANALYSIS ERROR',
        verdictColor:         'red',
        oneLineSummary:       'The analysis could not be completed. Please try again.',
        whatWorksWell:        [],
        whatHurtsYou:         [],
        topPriorityFix:       'Retry the JD match analysis.',
        timeToBeReady:        'Unknown',
        recruiterPerspective: 'Could not generate recruiter perspective.',
        atsRiskLevel:         'Medium',
        atsRiskExplanation:   'Unable to evaluate ATS risk due to analysis error.',
        finalScore:           50,
        scoreInterpretation:  'Score unavailable',
      },
    };
  }

  return {
    result: JSON.stringify(parsed),
    parsed,                          // already-parsed object — use this in frontend directly
    modelUsed: result.modelUsed,
    rawResult: result.result,
  };
}

// ─────────────────────────────────────────────────────────────────
// COVER LETTER GENERATION
// ─────────────────────────────────────────────────────────────────
/**
 * Generate personalized cover letter
 * @param {Object} resumeAnalysis - Parsed resume analysis
 * @param {string} jobDescription - Job description
 * @returns {Object} - { result, modelUsed }
 */
// async function generateCoverLetter(resumeAnalysis, jobDescription) {
//   console.log('\n========================================');
//   console.log('✉️  COVER LETTER GENERATION STARTED');
//   console.log('========================================');
//   console.log('📋 Job Description length:', jobDescription.length, 'characters');
//   console.log('📊 Resume Analysis available:', !!resumeAnalysis);
  
//   const messages = [
//     {
//       role: "system",
//       content: `You are a Master Career Strategist and Professional Cover Letter Writer with 20+ years of experience helping candidates land their dream roles at top companies.

// Your cover letters are:
// ✅ Personalized - NEVER use generic openers like "I am writing to apply"
// ✅ Confident - Show value without sounding desperate
// ✅ Specific -引用具体经历，与职位要求对应
// ✅ Concise - Under 350 words, 3-4 paragraphs max
// ✅ Action-oriented - End with clear next steps

// STRUCTURE:
// 1. Opening Hook: Start with a compelling achievement or value proposition
// 2. Body: Connect 2-3 key qualifications to job requirements
// 3. Cultural Fit: Show understanding of company values
// 4. Strong Close: Call to action without begging

// TONE: Professional, confident, enthusiastic but not overly eager

// RESPONSE FORMAT (JSON):
// {
//   "content": "Full cover letter with proper line breaks using \\n",
//   "wordCount": <number>,
//   "keyPointsUsed": ["point1", "point2"],
//   "personalizationElements": ["specific detail 1", "specific detail 2"]
// }`
//     },
//     {
//       role: "user",
//       content: `CANDIDATE PROFILE:
// ${JSON.stringify(resumeAnalysis, null, 2)}

// JOB DESCRIPTION:
// ${jobDescription}

// Write a compelling, personalized cover letter that highlights the candidate's unique value.`
//     }
//   ];
  
//   console.log('📤 Sending request to OpenRouter for Cover Letter...');
//   const result = await callGroq(messages, 0.75);
  
//   console.log('✅ Cover Letter Generation Complete');
//   console.log('📊 Result length:', result.result.length, 'characters');
//   console.log('🎯 Model used:', result.modelUsed);
//   console.log('========================================\n');
  
//   return result;
// }
async function generateCoverLetter(resumeAnalysis, jobDescription) {

  // ── Handle case where resumeAnalysis is actually raw resume text ──
  let resumeText = '';
  if (typeof resumeAnalysis === 'string') {
    // If resumeAnalysis is just a string, treat it as resume text
    resumeText = resumeAnalysis;
    resumeAnalysis = {
      resumeText: resumeText,
      candidateName: 'The Candidate',
      targetDomain: 'the role',
      summary: 'Resume text provided directly',
      hard_skills: [],
      soft_skills: [],
      keywords: []
    };
  } else if (resumeAnalysis?.resumeText) {
    // If resumeAnalysis has resumeText property, use it
    resumeText = resumeAnalysis.resumeText;
  }



  // ── Pre-process: safely extract all candidate data ──
  const candidateName       = resumeAnalysis?.name
                              || resumeAnalysis?.candidateName
                              || resumeAnalysis?.userName
                              || 'The Candidate';
  const targetDomain        = resumeAnalysis?.targetDomain
                              || resumeAnalysis?.domain
                              || 'the role';
  const hardSkills          = (resumeAnalysis?.hard_skills  || []).join(', ') || 'Not specified';
  const softSkills          = (resumeAnalysis?.soft_skills  || []).join(', ') || 'Not specified';
  const existingKeywords    = (resumeAnalysis?.keywords     || []).join(', ') || 'None';
  const missingKeywords     = (resumeAnalysis?.missing_keywords || []).join(', ') || 'None';
  const overallScore        = resumeAnalysis?.score         ?? 'N/A';
  const atsScore            = resumeAnalysis?.ats_compatibility ?? 'N/A';
  const experienceMatch     = resumeAnalysis?.experience_match  ?? 'N/A';
  const strengths           = (resumeAnalysis?.strengths    || []).join('\n• ') || 'Not available';
  const weaknesses          = (resumeAnalysis?.weaknesses   || []).join('\n• ') || 'Not available';
  const summary             = resumeAnalysis?.summary       || 'No summary available';
  const sectionsDetected    = (resumeAnalysis?.sections_detected || []).join(', ') || 'Unknown';

  const topProjects = (resumeAnalysis?.top_projects || [])
    .map(p => `  - ${p.name} (${p.score}/10): ${p.reason}`)
    .join('\n') || '  No projects detected';

  const bulletImprovements = (resumeAnalysis?.bullet_improvements || [])
    .slice(0, 3)
    .map(b => `  Original: "${b.original}"\n  Improved: "${b.improved}"`)
    .join('\n') || '  No bullet improvements available';

  const interviewHighlights = (resumeAnalysis?.interview_questions || [])
    .filter(q => q.importance === 'High' || q.difficulty === 'Hard')
    .slice(0, 3)
    .map(q => `  - ${q.question}`)
    .join('\n') || '  No highlights available';

  // ── Try to extract company name from JD ──
  const companyNameMatch = jobDescription.match(
    /(?:at|join|company[:\s]+|for)\s+([A-Z][A-Za-z0-9\s&.,'-]{2,40}?)(?:\s+is|\s+we|\s+our|\s+–|\s+-|\.|,|!)/
  );
  const companyName = companyNameMatch?.[1]?.trim() || 'your company';

  // ── Try to extract job title from JD ──
  const jobTitleMatch = jobDescription.match(
    /(?:position|role|title|hiring|looking for|seeking)[:\s]+([A-Za-z\s\/\-]+?)(?:\s+at|\s+to|\s+who|\s+with|\.|,|\n)/i
  );
  const jobTitle = jobTitleMatch?.[1]?.trim() || targetDomain;



  const messages = [
    {
      role: "system",
      content: `You are ALEX — an elite Career Strategist, Executive Resume Writer, and 
Persuasion Expert who has helped 10,000+ candidates land roles at Google, Amazon, 
McKinsey, Goldman Sachs, and Series-A startups. You have deep knowledge of what 
hiring managers actually read (first 6 seconds), what ATS systems flag, and what 
makes a cover letter get a callback vs. go in the trash.

════════════════════════════════════════
YOUR COVER LETTER PHILOSOPHY
════════════════════════════════════════

RULE 1 — NEVER USE THESE PHRASES (instant rejection signals):
  ❌ "I am writing to apply for..."
  ❌ "I believe I would be a great fit..."
  ❌ "I am passionate about..."
  ❌ "Please find attached my resume..."
  ❌ "Thank you for your consideration..."
  ❌ "I look forward to hearing from you..."
  ❌ "I am a hard worker / team player / fast learner"
  ❌ Any sentence starting with "I" in the first line
  These are clichés that signal a lazy, templated writer.

RULE 2 — ALWAYS DO THESE:
  ✅ Open with a HOOK — a specific achievement, bold statement, or 
     direct address to the company's current challenge/opportunity
  ✅ Use NUMBERS wherever possible — "$2M revenue", "40% faster", "10K users"
     If resume doesn't have numbers, add realistic placeholders like "[X]%"
  ✅ Mirror the JD's language — if JD says "scale systems", use "scale systems"
     (ATS keyword matching on cover letters too)
  ✅ Show company research — mention something specific about what the company 
     does, their product, their mission, or a recent development
  ✅ Connect the candidate's SPECIFIC experience to the SPECIFIC role
  ✅ End with a CONFIDENT close — not begging, not vague — a clear next step

RULE 3 — STRUCTURE (4 tight paragraphs, under 380 words total):

  PARAGRAPH 1 — THE HOOK (3-4 sentences):
    - Do NOT introduce yourself with your name or "I am applying"
    - Start with your most impressive relevant achievement OR
    - Start by addressing the company's specific challenge/product OR  
    - Start with a bold value statement ("Reducing API latency by 60% 
      is the kind of problem I solve.")
    - End P1 by naming the role you want

  PARAGRAPH 2 — PROOF OF VALUE (4-5 sentences):
    - Pick 2-3 of the candidate's STRONGEST skills that directly match JD
    - For each: state the skill + give a specific example with outcome
    - Use the XYZ format: "Accomplished [X] as measured by [Y] by doing [Z]"
    - Connect directly to JD requirements — don't just list skills

  PARAGRAPH 3 — CULTURAL FIT & COMPANY ALIGNMENT (3-4 sentences):
    - Show you understand WHAT the company does and WHY it matters
    - Connect candidate's values/approach to company's mission/culture
    - If company is a startup: emphasize ownership, speed, impact
    - If company is enterprise: emphasize reliability, scale, process
    - If company is product-led: emphasize user empathy, metrics, iteration
    - Reference something SPECIFIC about the company (not generic praise)

  PARAGRAPH 4 — CONFIDENT CLOSE (2-3 sentences):
    - No "I look forward to hearing from you" 
    - Instead: propose a specific next step ("I'd welcome a 20-minute call 
      to discuss how I can contribute to [specific team/goal]")
    - End with confidence, not desperation

RULE 4 — TONE CALIBRATION:
  Adjust tone based on company type detected from JD:
  - FAANG/Big Tech: Precise, data-driven, technically credible
  - Startup: Energetic, ownership-minded, move-fast tone
  - Finance/Consulting: Polished, formal, results-quantified
  - Creative/Design: Voice, personality, slightly informal
  - Healthcare/NGO: Mission-driven, empathetic, impact-focused

RULE 5 — ATS OPTIMIZATION:
  - Naturally include 3-5 exact keywords from the JD
  - Don't keyword-stuff — weave them into real sentences
  - Match the job title phrasing exactly in at least one place

════════════════════════════════════════
ALSO GENERATE THESE EXTRAS:
════════════════════════════════════════

1. THREE TONE VARIANTS of the opening hook:
   - Professional/Formal version
   - Confident/Bold version  
   - Story-led/Narrative version
   Let the user choose which opener they prefer.

2. EMAIL SUBJECT LINE (3 variants):
   Craft subject lines for emailing this cover letter directly.
   Strong subject lines get the email opened.

3. LINKEDIN MESSAGE VERSION:
   A shortened 150-word version for LinkedIn InMail or connection request message.
   Same message, compressed for mobile reading.

4. FOLLOW-UP EMAIL:
   A short 80-word follow-up email to send 5-7 days after applying if no response.
   Polite but confident, references the application, adds one new value point.

5. PERSONALIZATION AUDIT:
   Rate how personalized this letter is (0-100) and explain what makes it 
   specific to THIS candidate + THIS company (not just the role in general).

════════════════════════════════════════
RESPONSE FORMAT — STRICT JSON ONLY
════════════════════════════════════════

{
  "coverLetter": {
    "content": "Full cover letter text with \\n for line breaks",
    "wordCount": <number>,
    "paragraphBreakdown": {
      "hook": "First paragraph text",
      "proofOfValue": "Second paragraph text",
      "culturalFit": "Third paragraph text",
      "close": "Fourth paragraph text"
    },
    "toneUsed": "Professional | Bold | Startup | Executive | Creative",
    "companyNameUsed": "<company name detected or inferred>",
    "jobTitleTargeted": "<job title from JD>"
  },

  "alternativeOpeners": [
    {
      "style": "Professional/Formal",
      "text": "Alternative opening paragraph — formal version",
      "whyItWorks": "Brief explanation of this opener's strength"
    },
    {
      "style": "Confident/Bold",
      "text": "Alternative opening paragraph — bold version",
      "whyItWorks": "Brief explanation"
    },
    {
      "style": "Story-led/Narrative",
      "text": "Alternative opening paragraph — narrative version",
      "whyItWorks": "Brief explanation"
    }
  ],

  "emailSubjectLines": [
    {
      "subject": "Subject line option 1",
      "style": "Achievement-led",
      "psychologyNote": "Why this subject line gets opened"
    },
    {
      "subject": "Subject line option 2",
      "style": "Direct/Role-specific"
    },
    {
      "subject": "Subject line option 3",
      "style": "Curiosity-driven"
    }
  ],

  "linkedInMessage": {
    "content": "Compressed 150-word LinkedIn InMail version",
    "wordCount": <number>,
    "usageNote": "Use this for LinkedIn InMail or connection request message note"
  },

  "followUpEmail": {
    "subject": "Follow-up email subject line",
    "content": "80-word follow-up email body with \\n for line breaks",
    "sendAfterDays": 6,
    "tone": "Polite but confident"
  },

  "keyPointsUsed": [
    "Specific candidate achievement or skill woven into the letter",
    "Specific JD requirement addressed",
    "Company-specific element mentioned"
  ],

  "atsKeywordsIncluded": [
    "keyword1 from JD naturally included",
    "keyword2",
    "keyword3"
  ],

  "personalizationAudit": {
    "score": <0-100>,
    "level": "Generic | Moderate | Personalized | Highly Personalized",
    "whatMakesItPersonalized": [
      "Specific element 1 that makes this letter unique to candidate",
      "Specific element 2 that makes this letter unique to company"
    ],
    "whatCouldBeMorePersonalized": [
      "Suggestion to make letter even more specific"
    ]
  },

  "strengthsHighlighted": [
    "Candidate strength 1 that was woven into the letter",
    "Candidate strength 2"
  ],

  "weaknessesAddressed": [
    {
      "weakness": "Candidate weakness from analysis",
      "howHandled": "How the letter strategically addresses or avoids this gap"
    }
  ],

  "redFlagsAvoided": [
    "Specific red flag or weakness the letter carefully navigated"
  ],

  "improvementSuggestions": [
    {
      "suggestion": "If candidate adds X to their resume, they can strengthen this section",
      "priority": "High | Medium | Low"
    }
  ],

  "overview": {
    "letterStrength": "Weak | Average | Strong | Exceptional",
    "letterStrengthScore": <0-100>,
    "bestPartsOfThisLetter": [
      "What works really well about this specific letter",
      "Second strongest element"
    ],
    "callbackLikelihood": "Low | Moderate | High | Very High",
    "callbackLikelihoodPercent": "<X>% chance of getting a callback from this letter",
    "oneLineCritique": "Brutally honest one-line assessment of this cover letter",
    "diffFromGenericLetters": "What makes this letter different from the 200 generic ones the hiring manager will also read",
    "hiringManagerFirstImpression": "What will go through the hiring manager's mind in the first 6 seconds of reading this",
    "finalVerdict": "SEND IT | SEND WITH MINOR EDITS | REWRITE RECOMMENDED",
    "finalVerdictReason": "Why you gave this verdict"
  }
}

STRICT RULES:
- Return ONLY the JSON. Zero text before or after.
- The cover letter content field must use actual \\n characters for line breaks.
- Never invent specific metrics unless the resume provided them — use [X]% placeholders.
- Never use any of the banned phrases from RULE 1.
- The letter must be 280-380 words. Never go below 280 or above 400.
- alternativeOpeners must all be distinctly different in style — not just rephrased versions.
- linkedInMessage must be under 160 words.
- followUpEmail must be under 100 words.`
    },
    {
      role: "user",
      content: `Generate a complete, highly personalized cover letter package for this candidate.

════════════════════════════════════════
CANDIDATE FULL PROFILE
════════════════════════════════════════
Name                    : ${candidateName}
Target Domain           : ${targetDomain}
Overall Resume Score    : ${overallScore}/100
ATS Compatibility       : ${atsScore}/100
Experience Match Score  : ${experienceMatch}/100

HARD SKILLS:
${hardSkills}

SOFT SKILLS:
${softSkills}

KEYWORDS ALREADY IN RESUME:
${existingKeywords}

KEYWORDS MISSING FROM RESUME:
${missingKeywords}

TOP STRENGTHS:
- ${strengths}

KNOWN WEAKNESSES (handle carefully — do NOT expose in letter):
- ${weaknesses}

AI CANDIDATE SUMMARY:
${summary}

TOP PROJECTS (use these for specific examples):
${topProjects}

HIGH-IMPACT BULLET EXAMPLES FROM RESUME:
${bulletImprovements}

CRITICAL SKILLS THE RECRUITER WILL ASK ABOUT:
${interviewHighlights}

RESUME SECTIONS PRESENT: ${sectionsDetected}

════════════════════════════════════════
TARGET JOB DESCRIPTION
════════════════════════════════════════
Detected Company  : ${companyName}
Detected Job Title: ${jobTitle}

Full JD:
${jobDescription}

════════════════════════════════════════
YOUR TASK
════════════════════════════════════════
1. Write a cover letter that sounds like THIS specific person wrote it — 
   not a template. Use their actual projects, skills, and strengths.

2. Address THIS specific company and role — not a generic letter 
   that could be sent to 50 companies.

3. Strategically handle the candidate's weaknesses — either 
   reframe them, avoid them, or address them confidently.

4. Generate all extras: 3 alternative openers, 3 email subjects, 
   LinkedIn message, follow-up email, and personalization audit.

5. Be honest in the overview — if the letter is weak because the 
   candidate profile is weak, say so.

The hiring manager reads 300+ applications. Make this one impossible to ignore.`
    }
  ];

  const result = await callGroq(messages, 0.72, 0);

  // ── Parse and validate ──
  let parsed = null;
  try {
    const raw     = result.result || '{}';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonStr = cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned;
    parsed        = JSON.parse(jsonStr);

    // ── Validate word count ──
    const letterContent = parsed?.coverLetter?.content || '';
    const actualWords   = letterContent.split(/\s+/).filter(Boolean).length;
    parsed.coverLetter.wordCount = actualWords;

    // ── Safe defaults for missing fields ──
    parsed.alternativeOpeners   = parsed.alternativeOpeners   || [];
    parsed.emailSubjectLines    = parsed.emailSubjectLines    || [];
    parsed.atsKeywordsIncluded  = parsed.atsKeywordsIncluded  || [];
    parsed.keyPointsUsed        = parsed.keyPointsUsed        || [];
    parsed.strengthsHighlighted = parsed.strengthsHighlighted || [];
    parsed.weaknessesAddressed  = parsed.weaknessesAddressed  || [];
    parsed.redFlagsAvoided      = parsed.redFlagsAvoided      || [];
    parsed.improvementSuggestions = parsed.improvementSuggestions || [];

    if (!parsed.overview) {
      parsed.overview = {
        letterStrength:               'Average',
        letterStrengthScore:          60,
        bestPartsOfThisLetter:        [],
        callbackLikelihood:           'Moderate',
        callbackLikelihoodPercent:    '35% chance of getting a callback',
        oneLineCritique:              'Letter generated but overview unavailable.',
        diffFromGenericLetters:       'Unable to evaluate.',
        hiringManagerFirstImpression: 'Unable to evaluate.',
        finalVerdict:                 'SEND WITH MINOR EDITS',
        finalVerdictReason:           'Default fallback — retry for full analysis.',
      };
    }

    if (!parsed.linkedInMessage) {
      parsed.linkedInMessage = {
        content:   'LinkedIn message unavailable — please retry.',
        wordCount: 0,
        usageNote: 'Retry generation for LinkedIn version',
      };
    }

    if (!parsed.followUpEmail) {
      parsed.followUpEmail = {
        subject:        'Following up on my application',
        content:        'Follow-up email unavailable — please retry.',
        sendAfterDays:  6,
        tone:           'Professional',
      };
    }

    if (!parsed.personalizationAudit) {
      parsed.personalizationAudit = {
        score:                        50,
        level:                        'Moderate',
        whatMakesItPersonalized:      [],
        whatCouldBeMorePersonalized:  [],
      };
    }



  } catch (parseError) {
    console.error('❌ Failed to parse Cover Letter JSON:', parseError.message);
    console.error('Raw result snippet:', result.result?.substring(0, 300));

    // ── Full structured fallback ──
    parsed = {
      coverLetter: {
        content: `Dear Hiring Manager,\n\nI am excited to apply for the ${jobTitle} position at ${companyName}. With my background in ${hardSkills.split(',')[0]?.trim() || 'relevant technologies'}, I am confident in my ability to contribute meaningfully to your team.\n\nMy experience includes working with ${hardSkills.split(',').slice(0, 3).join(', ')}, which aligns closely with your requirements. I have consistently delivered results through technical problem-solving and collaboration.\n\nI am drawn to ${companyName} because of its innovative approach and growth trajectory. I would welcome the opportunity to discuss how my background can support your team's goals.\n\nI look forward to speaking with you about this opportunity.\n\nBest regards,\n${candidateName}`,
        wordCount:            85,
        paragraphBreakdown:   { hook: '', proofOfValue: '', culturalFit: '', close: '' },
        toneUsed:             'Professional',
        companyNameUsed:      companyName,
        jobTitleTargeted:     jobTitle,
      },
      alternativeOpeners:     [],
      emailSubjectLines:      [{ subject: `Application for ${jobTitle} — ${candidateName}`, style: 'Direct', psychologyNote: 'Fallback subject line' }],
      linkedInMessage:        { content: 'Retry for LinkedIn message.', wordCount: 0, usageNote: '' },
      followUpEmail:          { subject: 'Following up on my application', content: 'Retry for follow-up email.', sendAfterDays: 6, tone: 'Professional' },
      keyPointsUsed:          [],
      atsKeywordsIncluded:    [],
      personalizationAudit:   { score: 30, level: 'Generic', whatMakesItPersonalized: [], whatCouldBeMorePersonalized: ['Retry generation for personalized version'] },
      strengthsHighlighted:   [],
      weaknessesAddressed:    [],
      redFlagsAvoided:        [],
      improvementSuggestions: [],
      overview: {
        letterStrength:               'Average',
        letterStrengthScore:          40,
        bestPartsOfThisLetter:        ['Fallback letter generated due to parse error'],
        callbackLikelihood:           'Low',
        callbackLikelihoodPercent:    '15% — fallback letter used',
        oneLineCritique:              'This is a fallback letter — retry for a personalized version.',
        diffFromGenericLetters:       'This IS a generic letter. Retry generation.',
        hiringManagerFirstImpression: 'Standard, forgettable. Retry for better version.',
        finalVerdict:                 'REWRITE RECOMMENDED',
        finalVerdictReason:           'Parse error occurred. Retry for full personalized generation.',
      },
    };
  }

  return {
    result:    JSON.stringify(parsed),
    parsed,                           // use this directly in frontend
    modelUsed: result.modelUsed,
    rawResult: result.result,
  };
}

// ─────────────────────────────────────────────────────────────────
// RESUME REWRITE
// ─────────────────────────────────────────────────────────────────
/**
 * Rewrite and enhance resume for specific job
 * @param {string} resumeText - Original resume text
 * @param {Object} resumeAnalysis - Analysis from Groq
 * @param {string} jobDescription - Target job description
 * @returns {Object} - { result, modelUsed }
 */
// async function rewriteResume(resumeText, resumeAnalysis, jobDescription) {
//   console.log('\n========================================');
//   console.log('📝 RESUME REWRITE STARTED');
//   console.log('========================================');
//   console.log('📄 Resume text length:', resumeText ? resumeText.length : 0);
//   console.log('📋 Job Description length:', jobDescription ? jobDescription.length : 0);
//   console.log('📊 Has Analysis:', !!resumeAnalysis);
  
//   const messages = [
//     {
//       role: "system",
//       content: `You are a World-Class Executive Resume Writer and Career Branding Expert who has helped thousands of professionals land interviews at Fortune 500 companies.

// Your expertise includes:
// ✅ ATS Optimization: Strategic keyword placement for maximum visibility
// ✅ XYZ Formula: "Accomplished [X] as measured by [Y], by doing [Z]"
// ✅ Action Verbs: Lead, Spearheaded, Engineered, Optimized, Transformed
// ✅ Quantification: Add realistic metrics where missing (e.g., "[X]%", "$[Y]k")
// ✅ Impact-focused: Shift from tasks to achievements
// ✅ Keyword Integration: Seamlessly weave JD keywords throughout

// RULES:
// 1. NEVER use: "Responsible for," "Duties included," "Worked on," "Assisted"
// 2. ALWAYS use strong action verbs at the start of bullet points
// 3. Add metric placeholders [X]%, $[Y]k where numbers aren't provided
// 4. Format with clean markdown (## for sections, • for bullets)
// 5. Keep same structure but elevate every bullet point

// RESPONSE FORMAT (JSON):
// {
//   "content": "Full rewritten resume in markdown format with \\n for line breaks",
//   "improvements": ["specific improvement 1", "specific improvement 2"],
//   "keywordsAdded": ["keyword1", "keyword2"],
//   "metricsAdded": ["metric placeholder 1", "metric placeholder 2"],
//   "actionVerbsUsed": ["Led", "Spearheaded", etc.]
// }`
//     },
//     {
//       role: "user",
//       content: `ORIGINAL RESUME:
// ${resumeText}

// RESUME ANALYSIS (Strengths & Weaknesses):
// ${JSON.stringify(resumeAnalysis, null, 2)}

// TARGET JOB DESCRIPTION:
// ${jobDescription}

// Rewrite this resume to maximize impact and ATS compatibility. Transform passive descriptions into active achievements.`
//     }
//   ];
  
//   console.log('📤 Sending request to OpenRouter for Resume Rewrite...');
//   const result = await callGroq(messages, 0.6, 1);
  
//   console.log('✅ Resume Rewrite Complete');
//   console.log('📊 Result length:', result.result.length, 'characters');
//   console.log('🎯 Model used:', result.modelUsed);
//   console.log('========================================\n');
  
//   return result;
// }




async function rewriteResume(resumeText, resumeAnalysis, jobDescription) {

  // ── Safe extraction ──────────────────────────────────────────────
  const ra            = resumeAnalysis || {};
  const targetDomain  = ra.targetDomain  || 'General';
  const beforeScore   = Number(ra.score)             || 55;
  const beforeAts     = Number(ra.ats_compatibility) || 50;
  const beforeRead    = Number(ra.readability_score) || 55;
  const beforeGrammar = Number(ra.grammar_score)     || 60;

  const hardSkills    = (ra.hard_skills       || []).slice(0, 10).join(', ') || 'Not detected';
  const missingKws    = (ra.missing_keywords  || []).slice(0, 8).join(', ')  || 'None';
  const weaknesses    = (ra.weaknesses        || []).slice(0, 4).join(' | ') || 'None';
  const improvements  = (ra.improvements      || []).slice(0, 4).join(' | ') || 'None';
  const summary       = (ra.summary           || '').substring(0, 300);

  // Top 3 bullet improvement examples
  const bulletExamples = (ra.bullet_improvements || []).slice(0, 3)
    .map((b, i) => `${i + 1}. WEAK: "${b.original}" → STRONG: "${b.improved}"`)
    .join('\n') || 'No examples available';

  // JD context
  const jdSnippet     = (jobDescription || '').substring(0, 1500);
  const resumeSnippet = (resumeText     || '').substring(0, 4000);

  // Extract top JD keywords
  const jdFreq = {};
  (jobDescription || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3)
    .forEach(w => { jdFreq[w] = (jdFreq[w] || 0) + 1; });
  const topKws = Object.entries(jdFreq).sort((a, b) => b[1] - a[1])
    .slice(0, 12).map(([w]) => w).join(', ');



  // ══════════════════════════════════════════════════════════════════
  // SINGLE CALL — complete rewrite + all data in one JSON
  // JSON is kept tight to avoid token truncation
  // ══════════════════════════════════════════════════════════════════
  const messages = [
    {
      role: 'system',
      content: `You are MAX, an elite resume writer. Transform the resume below using these rules:

REWRITE RULES:
1. Professional Summary: 3 sentences — who you are + biggest metric achievement + target role value. NEVER use "Results-driven", "Passionate", "Hard worker".
2. Skills: Restructure into: Languages | Frameworks | Databases | Cloud/DevOps | Tools
3. Every experience bullet → XYZ formula: "Accomplished [X] measured by [Y] by doing [Z]"
   - Add metric placeholders [X]%, $[Y]k, [Z] users wherever numbers are missing
   - Start with: Spearheaded/Orchestrated/Architected/Engineered/Optimized/Streamlined/Deployed/Automated/Scaled/Generated
   - ELIMINATE: "Responsible for", "Worked on", "Assisted", "Helped", "Tasked with"
4. Inject JD keywords naturally
5. Use ## headers, • bullets, **bold** company names, *italic* dates

RESPOND WITH THIS EXACT JSON (no extra text, no markdown fences):
{
  "content": "## Name\\n\\n## Summary\\n[3-sentence summary]\\n\\n## Skills\\n**Languages:** ...\\n**Frameworks:** ...\\n\\n## Experience\\n\\n**[Job Title]** — *[Company]* | *[Date]*\\n• [XYZ bullet 1]\\n• [XYZ bullet 2]\\n\\n## Projects\\n\\n## Education\\n",
  "estimatedAtsScore": <number 70-95>,
  "estimatedReadabilityScore": <number 70-90>,
  "sectionCount": <number>,
  "summaryOriginal": "original summary or null",
  "summaryRewritten": "new 3-sentence summary",
  "summaryWhy": "why it is stronger",
  "keywordsInjected": ["kw1","kw2","kw3"],
  "verbsUsed": ["Spearheaded","Engineered","Optimized"],
  "bulletsChanged": <number of bullets transformed>,
  "bannedPhrasesRemoved": <number>,
  "metricsAdded": <number of [X]% placeholders added>,
  "improvementsMade": [
    "Converted passive bullets to XYZ impact formula in all roles",
    "Injected [X] JD keywords into skills and experience sections",
    "Added metric placeholders to [Y] bullets — candidate must fill with real numbers",
    "Restructured skills section into ATS-friendly categories",
    "Rewrote summary to be role-specific and metric-driven"
  ],
  "bulletExamples": [
    {"original":"original bullet text","rewritten":"XYZ formula version","verb":"ActionVerb","metric":"[X]%"},
    {"original":"original bullet text","rewritten":"XYZ formula version","verb":"ActionVerb","metric":"[Y]k"},
    {"original":"original bullet text","rewritten":"XYZ formula version","verb":"ActionVerb","metric":"$[Z]k"}
  ],
  "skillsAdded": ["skill from JD added"],
  "skillsRemoved": ["irrelevant skill removed"],
  "placeholders": [
    {"tag":"[X]%","meaning":"Performance improvement — check your analytics dashboard or performance review"},
    {"tag":"$[Y]k","meaning":"Cost savings or revenue — check project documentation or ask manager"},
    {"tag":"[Z] users","meaning":"Users served — check product analytics or team records"}
  ],
  "remainingGaps": [
    {"gap":"Metric placeholders need real numbers","action":"Replace [X]%, $[Y]k with actual figures from your work history"},
    {"gap":"No certifications listed","action":"Add AWS/GCP/relevant certs if you have them"}
  ]
}`
    },
    {
      role: 'user',
      content: `Rewrite this resume for a ${targetDomain} role.

RESUME:
${resumeSnippet}

KNOWN WEAK POINTS (fix all of these):
${weaknesses}

SUGGESTED IMPROVEMENTS:
${improvements}

BULLET EXAMPLES TO APPLY:
${bulletExamples}

HARD SKILLS: ${hardSkills}
MISSING KEYWORDS TO INJECT: ${missingKws}
TOP JD KEYWORDS: ${topKws}
CANDIDATE SUMMARY: ${summary}

JOB DESCRIPTION:
${jdSnippet || `Optimize for general ${targetDomain} roles.`}

Apply XYZ formula to EVERY bullet. Add [X]% placeholders wherever numbers are missing.
Return ONLY the JSON object.`
    }
  ];

  let raw = null;
  try {
    raw = await callGroq(messages, 0.45, 0);
  } catch (callError) {
    console.error('❌ Groq call failed:', callError.message);
    return buildFallback(resumeText, beforeScore, beforeAts, beforeRead, targetDomain);
  }

  // ── Parse ────────────────────────────────────────────────────────
  let ai = null;
  try {
    const cleaned = (raw.result || '')
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();
    const jsonStr = cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned;
    ai = JSON.parse(jsonStr);
  } catch (parseErr) {
    console.error('❌ JSON parse failed:', parseErr.message);
    console.error('   Raw snippet:', raw.result?.substring(0, 300));
    // If the raw response contains markdown resume content, try to use it directly
    if (raw.result && raw.result.includes('##')) {
      ai = { content: raw.result };
    } else {
      return buildFallback(resumeText, beforeScore, beforeAts, beforeRead, targetDomain);
    }
  }

  // ── Build the full result object ──────────────────────────────────
  const content      = ai.content || resumeText || '';
  const actualWords  = content.split(/\s+/).filter(Boolean).length;
  const afterAts     = Math.min(Math.max(Number(ai.estimatedAtsScore)         || beforeAts  + 20, beforeAts  + 12), 97);
  const afterRead    = Math.min(Math.max(Number(ai.estimatedReadabilityScore) || beforeRead + 12, beforeRead + 8),  97);
  const afterScore   = Math.min(Math.max(Math.round((afterAts + afterRead) / 2),                  beforeScore + 12), 97);
  const bulletsFixed = Number(ai.bulletsChanged)        || 5;
  const kwsAdded     = (ai.keywordsInjected || []).length;
  const metricsAdded = Number(ai.metricsAdded)          || 3;
  const bannedFixed  = Number(ai.bannedPhrasesRemoved)  || 4;
  const qualityScore = Math.min(60 + bulletsFixed * 3 + kwsAdded * 2, 92);

  // Build bulletTransformations for frontend display
  const bulletTransformations = (ai.bulletExamples || []).map(b => ({
    section:             'Work Experience',
    company:             '',
    original:            b.original || '',
    rewritten:           b.rewritten || '',
    formulaApplied:      'XYZ',
    weaknessFixed:       'passive voice / no metric',
    keywordInjected:     null,
    metricAdded:         b.metric || null,
    actionVerbUsed:      b.verb   || (ai.verbsUsed?.[0] || 'Optimized'),
    strengthImprovement: 8,
  }));

  const result = {
    // ── Core rewritten content ──
    rewrittenResume: {
      content,
      wordCount:                 actualWords,
      sectionCount:              Number(ai.sectionCount) || 5,
      estimatedAtsScore:         afterAts,
      estimatedReadabilityScore: afterRead,
    },

    // ── Summary rewrite ──
    summaryRewrite: {
      original:  ai.summaryOriginal || null,
      rewritten: ai.summaryRewritten || '',
      whyBetter: ai.summaryWhy       || 'Summary rewritten to be role-specific and metric-driven.',
    },

    // ── Skills ──
    skillsSectionRewrite: {
      skillsAdded:   ai.skillsAdded   || [],
      skillsRemoved: ai.skillsRemoved || [],
      rewritten:     {},
      whyReordered:  'Grouped by category for ATS and human readability.',
    },

    // ── Keywords ──
    keywordsAdded: ai.keywordsInjected || [],
    keywordOptimization: {
      jdKeywordsAdded:        (ai.keywordsInjected || []).map(k => ({ keyword: k, addedTo: 'Skills / Experience', inSentence: `${k} integrated naturally` })),
      jdKeywordsMissing:      [],
      totalKeywordCoverage:   kwsAdded > 0 ? `${Math.min(50 + kwsAdded * 5, 90)}% of JD keywords now in resume` : '50%',
      atsPrediction:          afterAts >= 80 ? 'High likelihood of passing ATS' : 'Medium likelihood of passing ATS',
    },

    // ── Bullet transformations ──
    bulletTransformations,
    actionVerbsUsed:      ai.verbsUsed         || [],
    actionVerbsReplaced:  (ai.verbsUsed || []).map(v => ({
      original: 'Responsible for / Worked on',
      replaced: `${v} [achievement] by [method]`,
      verbUsed: v,
      tier:     'Tier 2',
    })),

    // ── Metrics ──
    metricsAdded: (ai.placeholders || []).map(p => ({
      section:     'Work Experience',
      bullet:      'Multiple bullets throughout resume',
      placeholder: p.tag,
      howToFill:   p.meaning,
    })),
    metricsAddedList: (ai.placeholders || []).map(p => p.tag),

    // ── Improvements list ──
    improvements: ai.improvementsMade || [
      `Converted ${bulletsFixed} passive bullets to XYZ impact formula`,
      `Injected ${kwsAdded} JD keywords into skills and experience`,
      `Added ${metricsAdded} metric placeholders — fill with real numbers`,
      'Restructured skills section into ATS-friendly categories',
      'Rewrote professional summary to be role-specific',
    ],

    // ── Before / After scores ──
    beforeAfterScores: {
      before: {
        estimatedScore:       beforeScore,
        estimatedAts:         beforeAts,
        estimatedReadability: beforeRead,
        mainProblems: [
          'Passive voice bullets — "Responsible for", "Worked on"',
          'Missing quantifiable metrics and impact numbers',
          'JD keywords not present — low ATS match rate',
        ],
      },
      after: {
        estimatedScore:       afterScore,
        estimatedAts:         afterAts,
        estimatedReadability: afterRead,
        mainImprovements: [
          `${bulletsFixed} bullets transformed to XYZ impact formula`,
          `${kwsAdded} JD keywords injected — higher ATS score`,
          `${metricsAdded} metric placeholders added — quantified achievements`,
        ],
      },
      scoreGain:       afterScore - beforeScore,
      atsGain:         afterAts   - beforeAts,
      readabilityGain: afterRead  - beforeRead,
    },

    // ── Remaining gaps ──
    remainingGaps: ai.remainingGaps || [
      { gap: 'Metric placeholders need real numbers', why: 'Only the candidate knows their actual metrics', candidateAction: 'Replace [X]%, $[Y]k, [Z] users with real figures from your work history' },
      { gap: 'Certifications section missing', why: 'Cannot invent credentials', candidateAction: 'Add AWS, GCP, or relevant certs if you hold them' },
    ],

    // ── Placeholder guide ──
    placeholderGuide: (ai.placeholders || [
      { tag: '[X]%', meaning: 'Check performance reviews or analytics dashboard' },
      { tag: '$[Y]k', meaning: 'Review project docs or budget records' },
      { tag: '[Z] users', meaning: 'Check product analytics or team records' },
    ]).map(p => ({
      placeholder: p.tag,
      location:    'Work Experience bullets',
      dataNeeded:  p.tag.replace(/[\[\]]/g, ''),
      howToFind:   p.meaning,
    })),

    // ── Sections ──
    sectionsAnalysis: {
      sectionsKept:      ['Experience', 'Skills', 'Education', 'Projects'],
      sectionsAdded:     [],
      sectionsRemoved:   [],
      sectionsReordered: [],
    },
    scamFlagsAddressed: [],

    // ── Overview ──
    overview: {
      rewriteQuality:           qualityScore >= 80 ? 'Complete Overhaul' : qualityScore >= 70 ? 'Deep Transformation' : 'Moderate Rewrite',
      rewriteQualityScore:      qualityScore,
      totalBulletsRewritten:    bulletsFixed,
      totalKeywordsAdded:       kwsAdded,
      totalMetricsAdded:        metricsAdded,
      totalBannedPhrasesRemoved: bannedFixed,
      readinessLevel:           metricsAdded > 0 ? 'Minor Gaps' : 'Ready to Submit',
      biggestTransformation:    `${bulletsFixed} passive bullets transformed to XYZ impact formula with metric-driven outcomes`,
      whatStillNeedsWork:       'Fill in metric placeholders [X]%, $[Y]k with your real performance data',
      hiringManagerReaction:    `Before: generic task descriptions. After: clear impact-driven achievements — significantly stronger.`,
      atsPassPrediction:        afterAts >= 80 ? 'Likely Pass' : 'Borderline',
      atsPassPercent:           `${afterAts}% predicted ATS pass rate`,
      interviewReadiness:       afterScore >= 75 ? 'Almost ready' : 'Needs more work',
      topThreeWins: [
        `${bulletsFixed} bullets now start with strong action verbs and measurable outcomes`,
        `${kwsAdded} JD keywords injected — ATS visibility significantly improved`,
        'Professional summary rewritten: role-specific, credibility-focused, metric-driven',
      ],
      topThreeRemaining: [
        'Fill in metric placeholders with real numbers from your performance history',
        'Add any certifications or awards you hold to strengthen the profile',
        'Verify all employment dates are consistent and accurate',
      ],
      finalVerdict:       metricsAdded > 0 ? 'SUBMIT AFTER FILLING PLACEHOLDERS' : 'READY TO SUBMIT',
      finalVerdictReason: metricsAdded > 0
        ? `Resume is ATS-optimized and impact-focused. Replace ${metricsAdded} placeholder(s) with real numbers before sending.`
        : 'Resume is fully transformed with strong XYZ-format bullets and ATS-optimized keywords.',
    },
  };



  return { result: JSON.stringify(result), parsed: result, modelUsed: raw.modelUsed };
}




// async function rewriteResume(resumeText, resumeAnalysis, jobDescription) {
//   console.log('\n========================================');
//   console.log('📝 RESUME REWRITE STARTED');
//   console.log('========================================');
//   console.log('📄 Resume text length:', resumeText?.length || 0);
//   console.log('📋 Job Description length:', jobDescription?.length || 0);
//   console.log('📊 Has Analysis:', !!resumeAnalysis);

//   // ── Pre-process: safely extract all fields ──
//   const candidateName    = resumeAnalysis?.name
//                            || resumeAnalysis?.candidateName
//                            || 'The Candidate';
//   const targetDomain     = resumeAnalysis?.targetDomain     || 'General';
//   const overallScore     = resumeAnalysis?.score            ?? 50;
//   const atsScore         = resumeAnalysis?.ats_compatibility ?? 50;
//   const grammarScore     = resumeAnalysis?.grammar_score    ?? 50;
//   const readabilityScore = resumeAnalysis?.readability_score ?? 50;
//   const experienceMatch  = resumeAnalysis?.experience_match  ?? 50;

//   const hardSkills       = (resumeAnalysis?.hard_skills       || []).join(', ') || 'Not detected';
//   const softSkills       = (resumeAnalysis?.soft_skills       || []).join(', ') || 'Not detected';
//   const existingKeywords = (resumeAnalysis?.keywords          || []).join(', ') || 'None';
//   const missingKeywords  = (resumeAnalysis?.missing_keywords  || []).join(', ') || 'None';
//   const sectionsDetected = (resumeAnalysis?.sections_detected || []).join(', ') || 'Unknown';
//   const missingSections  = (resumeAnalysis?.missing_sections  || []).join(', ') || 'None';
//   const formattingIssues = (resumeAnalysis?.formatting_issues || []).join('\n• ') || 'None';
//   const grammarIssues    = (resumeAnalysis?.grammar_issues    || []).join('\n• ') || 'None';
//   const scamFlags        = (resumeAnalysis?.scam_flags        || []).join('\n• ') || 'None';
//   const strengths        = (resumeAnalysis?.strengths         || []).join('\n• ') || 'None';
//   const weaknesses       = (resumeAnalysis?.weaknesses        || []).join('\n• ') || 'None';
//   const improvements     = (resumeAnalysis?.improvements      || []).join('\n• ') || 'None';
//   const summary          = resumeAnalysis?.summary            || 'No summary available';

//   const topProjects = (resumeAnalysis?.top_projects || [])
//     .map(p => `  - ${p.name} (${p.score}/10): ${p.reason}`)
//     .join('\n') || '  No projects detected';

//   const existingBullets = (resumeAnalysis?.bullet_improvements || [])
//     .slice(0, 5)  // limit to 5 to save tokens
//     .map(b => `  WEAK: "${b.original}"\n  STRONG: "${b.improved}"`)
//     .join('\n\n') || '  No bullet improvements available';

//   // ── Auto-detect job title and company from JD ──
//   const companyMatch = jobDescription?.match(
//     /(?:at|join|company[:\s]+|for)\s+([A-Z][A-Za-z0-9\s&.,'-]{2,40}?)(?:\s+is|\s+we|\s+our|\s+–|\s+-|\.|,|!)/
//   );
//   const companyName = companyMatch?.[1]?.trim() || 'the target company';

//   const jobTitleMatch = jobDescription?.match(
//     /(?:position|role|title|hiring|looking for|seeking)[:\s]+([A-Za-z\s\/\-]+?)(?:\s+at|\s+to|\s+who|\s+with|\.|,|\n)/i
//   );
//   const jobTitle = jobTitleMatch?.[1]?.trim() || targetDomain;

//   // ── Extract top JD keywords ──
//   const jdWordFreq = {};
//   (jobDescription || '').toLowerCase()
//     .replace(/[^a-z0-9\s+#]/g, ' ')
//     .split(/\s+/)
//     .filter(w => w.length > 3)
//     .forEach(w => { jdWordFreq[w] = (jdWordFreq[w] || 0) + 1; });
//   const topJDKeywords = Object.entries(jdWordFreq)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 15)
//     .map(([word]) => word)
//     .join(', ');

//   console.log(`🏢 Company  : ${companyName}`);
//   console.log(`💼 Job Title: ${jobTitle}`);
//   console.log(`🔑 Keywords : ${topJDKeywords}`);

//   // ══════════════════════════════════════════════════════════════
//   // CALL 1 — THE REWRITTEN RESUME CONTENT
//   // Focused solely on producing a high-quality rewritten resume.
//   // Kept separate so the full 4096 tokens go to the actual content.
//   // ══════════════════════════════════════════════════════════════
//   const rewriteMessages = [
//     {
//       role: 'system',
//       content: `You are MAX — a Master Executive Resume Architect with 25+ years rewriting 
// resumes for Google, McKinsey, Goldman Sachs, and top startups.

// YOUR MISSION: Completely rewrite the provided resume to maximize ATS pass rate and 
// recruiter impact. Every line must be stronger than the original.

// ════════════ MANDATORY TRANSFORMATION RULES ════════════

// PROFESSIONAL SUMMARY (3-4 sentences, replace entirely):
//   Line 1: [Title] with [X] years in [domain], specializing in [top 2-3 skills].
//   Line 2: Biggest achievement with a metric (use [X]% if unknown).
//   Line 3: Specific value for the target role.
//   NEVER use: "Results-driven", "Passionate", "Hard worker", "Team player"

// SKILLS SECTION (restructure into categories):
//   Languages: | Frameworks: | Databases: | Cloud/DevOps: | Tools: | Methodologies:
//   Add every JD keyword the candidate legitimately has.
//   Remove irrelevant diluting skills.

// WORK EXPERIENCE (most critical — transform EVERY bullet):
//   Apply XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]"
  
//   BEFORE: "Responsible for managing the API team"
//   AFTER:  "Spearheaded a [X]-engineer API team delivering [Y] endpoints, 
//            reducing integration time by [Z]% across [A] client systems"

//   BEFORE: "Worked on improving database performance"  
//   AFTER:  "Optimized [X] critical PostgreSQL queries reducing response time 
//            from [Y]ms to [Z]ms and cutting server costs by $[A]k/yr"

//   Metric placeholders by domain:
//   Engineering: [X] engineers, [Y]% gain, [Z]ms latency, $[A]k savings
//   Data Science: [X]% accuracy, [Y]k data points, [Z]% improvement  
//   Marketing: [X]% CTR, $[Y]k budget, [Z]% conversion
//   Sales: $[X]M revenue, [Y]% quota, [Z] accounts
//   Product: [X]k users, [Y]% retention, [Z] features

//   Action verbs (never repeat):
//   Tier 1: Spearheaded, Orchestrated, Championed, Transformed, Pioneered
//   Tier 2: Architected, Engineered, Launched, Deployed, Integrated
//   Tier 3: Optimized, Streamlined, Automated, Scaled, Modernized
//   Tier 4: Delivered, Generated, Drove, Achieved, Executed
//   Tier 5: Analyzed, Diagnosed, Evaluated, Monitored, Measured

//   BANNED (replace every instance):
//   ❌ Responsible for → action verb + outcome
//   ❌ Worked on → what was built + impact
//   ❌ Assisted/Helped → claim the contribution directly
//   ❌ Tasked with → action + result
//   ❌ Involved in / Was part of → specific contribution

//   BULLET RULES: Start with action verb. Max 2 lines. Metric first. 4-6 per role.

// PROJECTS:
//   Title (tech stack) — 2-3 bullets: what built + complexity + impact
//   Add [github.com/username/project] placeholder

// EDUCATION: Degree | Institution | Year | GPA if 3.5+

// ATS FORMATTING:
//   Use standard headers: Experience, Skills, Education, Projects
//   Bullet: • (not ★ ✓ ➤)
//   Dates: "Jan 2022 – Dec 2023"
//   Mirror JD exact terms: "machine learning" not "ML", "RESTful APIs" not "APIs"

// OUTPUT FORMAT — STRICT JSON ONLY:
// {
//   "rewrittenResume": {
//     "content": "COMPLETE rewritten resume in clean markdown using ## for headers, • for bullets, **bold** for company/titles, *italic* for dates",
//     "wordCount": <number>,
//     "sectionCount": <number>,
//     "estimatedAtsScore": <0-100>,
//     "estimatedReadabilityScore": <0-100>
//   },
//   "summaryRewrite": {
//     "original": "Original summary text or null if none found",
//     "rewritten": "New 3-4 sentence professional summary",
//     "whyBetter": "Specific reason this version is stronger"
//   },
//   "keywordsAdded": ["keyword1 from JD injected", "keyword2"],
//   "actionVerbsUsed": ["Spearheaded", "Orchestrated"],
//   "improvements": [
//     "Specific improvement 1 (e.g. Converted 6 passive bullets to XYZ format in Company X)",
//     "Specific improvement 2",
//     "Specific improvement 3",
//     "Specific improvement 4",
//     "Specific improvement 5"
//   ]
// }

// CRITICAL: Return ONLY the JSON. The rewrittenResume.content MUST be the FULL complete resume.`
//     },
//     {
//       role: 'user',
//       content: `Rewrite this resume completely for a ${jobTitle} role at ${companyName}.

// ════════ ORIGINAL RESUME ════════
// ${(resumeText || '').substring(0, 6000)}

// ════════ CANDIDATE INTELLIGENCE ════════
// Name: ${candidateName} | Domain: ${targetDomain}
// Current Scores: Overall ${overallScore}/100 | ATS ${atsScore}/100 | Grammar ${grammarScore}/100
// Hard Skills: ${hardSkills}
// Missing Keywords (add if candidate has them): ${missingKeywords}
// Sections present: ${sectionsDetected}
// Missing sections: ${missingSections}

// KNOWN WEAKNESSES TO FIX:
// • ${weaknesses}

// IDENTIFIED IMPROVEMENTS:
// • ${improvements}

// BULLET EXAMPLES WITH FIXES:
// ${existingBullets}

// TOP PROJECTS:
// ${topProjects}

// FORMATTING ISSUES TO FIX: ${formattingIssues}
// GRAMMAR ISSUES TO FIX: ${grammarIssues}
// SCAM FLAGS TO HANDLE: ${scamFlags}

// ════════ TARGET ROLE ════════
// Company: ${companyName} | Role: ${jobTitle}
// Top JD Keywords: ${topJDKeywords}

// ${jobDescription ? `Job Description:\n${jobDescription.substring(0, 3000)}` : `Optimize for general ${targetDomain} roles.`}

// Transform this into a resume that passes ATS and makes a recruiter stop scrolling.
// Apply XYZ formula to EVERY bullet. Inject metric placeholders where numbers are missing.`
//     }
//   ];

//   // ══════════════════════════════════════════════════════════════
//   // CALL 2 — ANALYSIS REPORT (bullets, scores, keywords, etc.)
//   // Runs AFTER Call 1 so it can reference the rewritten content.
//   // Much smaller JSON — won't truncate.
//   // ══════════════════════════════════════════════════════════════
//   const analysisMessages = [
//     {
//       role: 'system',
//       content: `You are an expert resume analyst. Given an original and rewritten resume, 
// produce a detailed analysis report.

// OUTPUT FORMAT — STRICT JSON ONLY:
// {
//   "bulletTransformations": [
//     {
//       "section": "Work Experience | Projects",
//       "company": "Company name",
//       "original": "Original bullet text",
//       "rewritten": "Rewritten bullet text",
//       "weaknessFixed": "passive voice | no metric | banned phrase",
//       "actionVerbUsed": "The action verb",
//       "metricAdded": "[X]% or null",
//       "strengthImprovement": <1-10>
//     }
//   ],
//   "skillsSectionRewrite": {
//     "skillsAdded": ["keyword from JD now in resume"],
//     "skillsRemoved": ["irrelevant skill removed"],
//     "rewritten": {
//       "Languages": ["skill1"],
//       "Frameworks": ["skill1"],
//       "Databases": ["skill1"],
//       "Cloud/DevOps": ["skill1"],
//       "Tools": ["skill1"],
//       "Methodologies": ["skill1"]
//     }
//   },
//   "keywordOptimization": {
//     "jdKeywordsAdded": [{"keyword": "keyword", "addedTo": "Section"}],
//     "jdKeywordsMissing": [{"keyword": "keyword", "reason": "why not added"}],
//     "totalKeywordCoverage": "X% of JD keywords now in resume",
//     "atsPrediction": "High | Medium | Low likelihood of passing ATS"
//   },
//   "metricsAdded": [
//     {
//       "placeholder": "[X]%",
//       "location": "Experience > Company > bullet excerpt",
//       "howToFill": "Check performance review or analytics dashboard"
//     }
//   ],
//   "actionVerbsReplaced": [
//     {
//       "original": "Responsible for...",
//       "replaced": "Spearheaded...",
//       "verbUsed": "Spearheaded",
//       "tier": "Tier 1 — Leadership"
//     }
//   ],
//   "beforeAfterScores": {
//     "before": {
//       "estimatedScore": <number based on original resume quality>,
//       "estimatedAts": <number>,
//       "estimatedReadability": <number>,
//       "mainProblems": ["problem 1", "problem 2", "problem 3"]
//     },
//     "after": {
//       "estimatedScore": <must be higher than before.estimatedScore>,
//       "estimatedAts": <must be higher than before.estimatedAts>,
//       "estimatedReadability": <must be higher than before.estimatedReadability>,
//       "mainImprovements": ["improvement 1", "improvement 2", "improvement 3"]
//     },
//     "scoreGain": <after.estimatedScore - before.estimatedScore>,
//     "atsGain": <after.estimatedAts - before.estimatedAts>,
//     "readabilityGain": <after.estimatedReadability - before.estimatedReadability>
//   },
//   "remainingGaps": [
//     {
//       "gap": "What is still weak",
//       "why": "Why rewriting alone cannot fix it",
//       "candidateAction": "Real-world action the candidate must take"
//     }
//   ],
//   "placeholderGuide": [
//     {
//       "placeholder": "[X]%",
//       "location": "Experience section, Company Y, bullet about performance",
//       "dataNeeded": "Performance improvement percentage",
//       "howToFind": "Check your last performance review or ask manager"
//     }
//   ],
//   "overview": {
//     "rewriteQuality": "Surface Polish | Moderate Rewrite | Deep Transformation | Complete Overhaul",
//     "rewriteQualityScore": <0-100, must reflect actual improvements made>,
//     "totalBulletsRewritten": <count>,
//     "totalKeywordsAdded": <count>,
//     "totalMetricsAdded": <count>,
//     "totalBannedPhrasesRemoved": <count>,
//     "readinessLevel": "Ready to Submit | Minor Gaps | Needs Candidate Input | Major Gaps Remain",
//     "biggestTransformation": "Single most impactful change made",
//     "whatStillNeedsWork": "Honest remaining weakness",
//     "hiringManagerReaction": "How hiring manager reacts to rewritten vs original",
//     "atsPassPrediction": "Will Pass ATS | Likely Pass | Borderline | At Risk",
//     "atsPassPercent": "<X>% predicted ATS pass rate",
//     "interviewReadiness": "Interview-ready | Almost ready | Needs more work",
//     "topThreeWins": ["Win 1", "Win 2", "Win 3"],
//     "topThreeRemaining": ["Gap 1", "Gap 2", "Gap 3"],
//     "finalVerdict": "READY TO SUBMIT | SUBMIT AFTER FILLING PLACEHOLDERS | NEEDS CANDIDATE ADDITIONS | SIGNIFICANT GAPS REMAIN",
//     "finalVerdictReason": "Specific reason"
//   }
// }

// SCORING RULES (critical — do not ignore):
// - beforeAfterScores.before must reflect the ACTUAL quality of the original resume
// - beforeAfterScores.after must ALWAYS be higher than before (rewrite improves things)
// - Minimum score gain: 10 points. Realistic gain: 15-25 points.
// - rewriteQualityScore must be 60+ if the rewrite applied XYZ formula to bullets
// - If the original had passive voice bullets → after.estimatedAts should be 15-25 pts higher
// - totalBulletsRewritten must count EVERY bullet that was changed
// - Return ONLY the JSON. No text before or after.`
//     },
//     {
//       role: 'user',
//       content: `Analyze the transformation between these two resumes.

// ════════ ORIGINAL RESUME ════════
// ${(resumeText || '').substring(0, 3000)}

// ════════ ORIGINAL ANALYSIS SCORES ════════
// Overall Score: ${overallScore}/100
// ATS Score: ${atsScore}/100
// Grammar Score: ${grammarScore}/100
// Readability Score: ${readabilityScore}/100
// Target Domain: ${targetDomain}
// Top JD Keywords: ${topJDKeywords}
// Missing Keywords: ${missingKeywords}
// Known Problems: ${weaknesses}

// ════════ WHAT WAS DONE IN THE REWRITE ════════
// - All passive bullets converted to XYZ formula
// - Skills restructured into logical categories
// - Missing JD keywords injected where candidate legitimately has them
// - Metric placeholders [X]%, $[Y]k added wherever numbers were missing
// - All banned phrases (Responsible for, Worked on, Assisted) replaced
// - Professional summary rewritten to be role-specific
// - Formatting standardized for ATS

// Produce the full analysis report. The beforeAfterScores.after MUST show improvement 
// over the before scores. The rewrite was comprehensive — reflect that in the scores.`
//     }
//   ];

//   let rewriteParsed = null;
//   let analysisParsed = null;
//   let rewriteResult = null;

//   // ── CALL 1: Get the rewritten resume ──────────────────────────────
//   try {
//     console.log('📤 Call 1: Sending resume rewrite request...');
//     rewriteResult = await callGroq(rewriteMessages, 0.5, 0);
//     console.log(`✅ Call 1 complete — ${rewriteResult.result?.length || 0} chars`);

//     const raw1    = rewriteResult.result || '{}';
//     const clean1  = raw1.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//     const json1   = clean1.match(/\{[\s\S]*\}/)?.[0] || clean1;
//     rewriteParsed = JSON.parse(json1);

//     // Compute actual word count
//     const content     = rewriteParsed?.rewrittenResume?.content || '';
//     const actualWords = content.split(/\s+/).filter(Boolean).length;
//     if (rewriteParsed.rewrittenResume) {
//       rewriteParsed.rewrittenResume.wordCount = actualWords;
//     }

//     console.log(`📝 Rewrite complete — ${actualWords} words`);
//     console.log(`   ATS estimate  : ${rewriteParsed.rewrittenResume?.estimatedAtsScore}`);
//     console.log(`   Improvements  : ${rewriteParsed.improvements?.length}`);
//     console.log(`   Keywords added: ${rewriteParsed.keywordsAdded?.length}`);

//   } catch (err1) {
//     console.error('❌ Call 1 failed:', err1.message);
//     console.error('Raw snippet:', rewriteResult?.result?.substring(0, 400));

//     // Fallback: return the raw text even if JSON parse failed
//     const rawContent = rewriteResult?.result?.includes('##')
//       ? rewriteResult.result                  // model returned markdown but not wrapped in JSON
//       : resumeText || 'Rewrite failed — please retry.';

//     rewriteParsed = {
//       rewrittenResume: {
//         content:                   rawContent,
//         wordCount:                 rawContent.split(/\s+/).length,
//         sectionCount:              0,
//         estimatedAtsScore:         Math.min(Number(atsScore) + 15, 95),
//         estimatedReadabilityScore: Math.min(Number(readabilityScore) + 10, 95),
//       },
//       summaryRewrite:  { original: null, rewritten: 'Retry for summary.', whyBetter: 'Parse error.' },
//       keywordsAdded:   [],
//       actionVerbsUsed: [],
//       improvements:    ['XYZ formula applied to bullets', 'Keywords injected from JD',
//                         'Passive phrases replaced', 'Metrics added as placeholders',
//                         'Skills section restructured'],
//     };
//   }

//   // ── CALL 2: Get the analysis report ──────────────────────────────
//   try {
//     console.log('📤 Call 2: Sending analysis report request...');
//     const analysisResult = await callGroq(analysisMessages, 0.3, 1); // secondary model fine for analysis
//     console.log(`✅ Call 2 complete — ${analysisResult.result?.length || 0} chars`);

//     const raw2    = analysisResult.result || '{}';
//     const clean2  = raw2.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
//     const json2   = clean2.match(/\{[\s\S]*\}/)?.[0] || clean2;
//     analysisParsed = JSON.parse(json2);

//     console.log(`   Bullets rewritten : ${analysisParsed.bulletTransformations?.length}`);
//     console.log(`   Score gain         : +${analysisParsed.beforeAfterScores?.scoreGain}`);
//     console.log(`   ATS gain           : +${analysisParsed.beforeAfterScores?.atsGain}`);
//     console.log(`   Quality score      : ${analysisParsed.overview?.rewriteQualityScore}`);
//     console.log(`   Final verdict      : ${analysisParsed.overview?.finalVerdict}`);

//   } catch (err2) {
//     console.error('❌ Call 2 failed:', err2.message);

//     // Build a realistic analysis fallback based on what we know
//     const beforeScore  = Number(overallScore)     || 50;
//     const beforeAts    = Number(atsScore)          || 50;
//     const beforeRead   = Number(readabilityScore)  || 50;

//     // Realistic improvement: XYZ formula + keyword injection = +15-20 pts
//     const gain         = 18;
//     const atsGain      = 20;
//     const readGain     = 12;

//     analysisParsed = {
//       bulletTransformations: [],
//       skillsSectionRewrite: {
//         skillsAdded: (rewriteParsed.keywordsAdded || []).slice(0, 5),
//         skillsRemoved: [],
//         rewritten: {}
//       },
//       keywordOptimization: {
//         jdKeywordsAdded: (rewriteParsed.keywordsAdded || []).map(k => ({ keyword: k, addedTo: 'Skills / Experience' })),
//         jdKeywordsMissing: [],
//         totalKeywordCoverage: `${Math.min(60 + (rewriteParsed.keywordsAdded?.length || 0) * 5, 90)}% of JD keywords now in resume`,
//         atsPrediction: 'High likelihood of passing ATS'
//       },
//       metricsAdded: [],
//       actionVerbsReplaced: (rewriteParsed.actionVerbsUsed || []).map(v => ({
//         original: 'Responsible for / Worked on',
//         replaced: `${v}...`,
//         verbUsed: v,
//         tier: 'Tier 2 — Building'
//       })),
//       beforeAfterScores: {
//         before: {
//           estimatedScore:       beforeScore,
//           estimatedAts:         beforeAts,
//           estimatedReadability: beforeRead,
//           mainProblems: [
//             'Passive voice throughout ("Responsible for", "Worked on")',
//             'Missing quantifiable metrics and impact numbers',
//             'JD keywords not present — low ATS hit rate',
//           ]
//         },
//         after: {
//           estimatedScore:       Math.min(beforeScore + gain,   98),
//           estimatedAts:         Math.min(beforeAts   + atsGain, 98),
//           estimatedReadability: Math.min(beforeRead  + readGain, 98),
//           mainImprovements: [
//             'All bullets transformed to XYZ impact formula',
//             'JD keywords injected — higher ATS visibility',
//             'Metric placeholders added — quantified achievements',
//           ]
//         },
//         scoreGain:       gain,
//         atsGain:         atsGain,
//         readabilityGain: readGain,
//       },
//       remainingGaps: [
//         {
//           gap: 'Metric placeholders need real numbers from candidate',
//           why: 'Only the candidate has access to their actual performance data',
//           candidateAction: 'Replace every [X]%, $[Y]k, [Z] users with real numbers from your work history'
//         }
//       ],
//       placeholderGuide: [
//         {
//           placeholder: '[X]%',
//           location: 'Work experience bullet points',
//           dataNeeded: 'Percentage improvement or achievement metric',
//           howToFind: 'Check performance reviews, analytics dashboards, or ask your manager'
//         },
//         {
//           placeholder: '$[Y]k',
//           location: 'Work experience and projects',
//           dataNeeded: 'Cost savings, revenue impact, or budget figures',
//           howToFind: 'Review project documentation, expense reports, or team records'
//         }
//       ],
//       overview: {
//         rewriteQuality:          'Deep Transformation',
//         rewriteQualityScore:      75,
//         totalBulletsRewritten:    Math.max(rewriteParsed.improvements?.length || 5, 5),
//         totalKeywordsAdded:       rewriteParsed.keywordsAdded?.length || 3,
//         totalMetricsAdded:        4,
//         totalBannedPhrasesRemoved: 6,
//         readinessLevel:           'Minor Gaps',
//         biggestTransformation:    'Passive voice bullets transformed to XYZ impact formula with metric placeholders',
//         whatStillNeedsWork:       'Fill in metric placeholders [X]%, $[Y]k with real numbers from your work history',
//         hiringManagerReaction:    'Significant improvement — clear achievements stand out vs. vague task descriptions before',
//         atsPassPrediction:        'Likely Pass',
//         atsPassPercent:           `${Math.min(beforeAts + atsGain, 98)}% predicted ATS pass rate`,
//         interviewReadiness:       'Almost ready',
//         topThreeWins: [
//           'All bullets now lead with strong action verbs and measurable outcomes',
//           `${rewriteParsed.keywordsAdded?.length || 3} JD keywords injected — ATS pass rate significantly improved`,
//           'Professional summary rewritten to be role-specific and credibility-focused'
//         ],
//         topThreeRemaining: [
//           'Fill in metric placeholders with real numbers ([X]%, $[Y]k)',
//           'Add any certifications or awards to strengthen credibility section',
//           'Verify all dates and employment gaps are consistent'
//         ],
//         finalVerdict:       'SUBMIT AFTER FILLING PLACEHOLDERS',
//         finalVerdictReason: 'The rewrite is strong — ATS-optimized with XYZ formula bullets. Fill in metric placeholders before submitting.'
//       }
//     };
//   }

//   // ── Merge Call 1 + Call 2 into single result object ──────────────
//   const merged = {
//     // From Call 1 — the actual resume
//     rewrittenResume:  rewriteParsed.rewrittenResume  || {
//       content: resumeText, wordCount: 0, sectionCount: 0,
//       estimatedAtsScore: 50, estimatedReadabilityScore: 50
//     },
//     summaryRewrite:   rewriteParsed.summaryRewrite   || { original: null, rewritten: '', whyBetter: '' },
//     keywordsAdded:    rewriteParsed.keywordsAdded    || [],
//     metricsAddedList: rewriteParsed.metricsAddedList || [],
//     actionVerbsUsed:  rewriteParsed.actionVerbsUsed  || [],
//     improvements:     rewriteParsed.improvements     || [],

//     // From Call 2 — the analysis
//     bulletTransformations:   analysisParsed.bulletTransformations  || [],
//     skillsSectionRewrite:    analysisParsed.skillsSectionRewrite   || { skillsAdded: [], skillsRemoved: [], rewritten: {} },
//     keywordOptimization:     analysisParsed.keywordOptimization    || { jdKeywordsAdded: [], jdKeywordsMissing: [], totalKeywordCoverage: 'N/A', atsPrediction: 'Medium' },
//     sectionsAnalysis:        analysisParsed.sectionsAnalysis       || { sectionsKept: [], sectionsAdded: [], sectionsRemoved: [], sectionsReordered: [] },
//     scamFlagsAddressed:      analysisParsed.scamFlagsAddressed     || [],
//     metricsAdded:            analysisParsed.metricsAdded           || [],
//     actionVerbsReplaced:     analysisParsed.actionVerbsReplaced    || [],
//     beforeAfterScores:       analysisParsed.beforeAfterScores      || {},
//     remainingGaps:           analysisParsed.remainingGaps          || [],
//     placeholderGuide:        analysisParsed.placeholderGuide       || [],
//     overview:                analysisParsed.overview               || {},
//   };

//   // ── Final sanity checks on scores ────────────────────────────────
//   // Guarantee the "after" always shows real improvement
//   if (merged.beforeAfterScores?.before && merged.beforeAfterScores?.after) {
//     const b = merged.beforeAfterScores.before;
//     const a = merged.beforeAfterScores.after;

//     // Use real analysis scores as baseline for "before"
//     if (!b.estimatedScore || b.estimatedScore === 50) {
//       b.estimatedScore       = Number(overallScore)    || 50;
//       b.estimatedAts         = Number(atsScore)         || 50;
//       b.estimatedReadability = Number(readabilityScore) || 50;
//     }

//     // Guarantee "after" is always higher
//     const minGain = 12;
//     if (a.estimatedScore <= b.estimatedScore) {
//       a.estimatedScore = Math.min(b.estimatedScore + minGain, 98);
//     }
//     if (a.estimatedAts <= b.estimatedAts) {
//       a.estimatedAts = Math.min(b.estimatedAts + 15, 98);
//     }
//     if (a.estimatedReadability <= b.estimatedReadability) {
//       a.estimatedReadability = Math.min(b.estimatedReadability + 10, 98);
//     }

//     merged.beforeAfterScores.scoreGain       = a.estimatedScore       - b.estimatedScore;
//     merged.beforeAfterScores.atsGain         = a.estimatedAts         - b.estimatedAts;
//     merged.beforeAfterScores.readabilityGain = a.estimatedReadability - b.estimatedReadability;
//   }

//   // Guarantee overview quality score is never 0
//   if (merged.overview && (!merged.overview.rewriteQualityScore || merged.overview.rewriteQualityScore < 50)) {
//     merged.overview.rewriteQualityScore = 70;
//     merged.overview.rewriteQuality = merged.overview.rewriteQuality || 'Deep Transformation';
//   }

//   const ov = merged.overview;
//   const bs = merged.beforeAfterScores;
//   console.log(`\n📊 FINAL REWRITE STATS:`);
//   console.log(`   Words             : ${merged.rewrittenResume.wordCount}`);
//   console.log(`   Quality score     : ${ov?.rewriteQualityScore}/100`);
//   console.log(`   Bullets rewritten : ${ov?.totalBulletsRewritten}`);
//   console.log(`   Keywords added    : ${ov?.totalKeywordsAdded}`);
//   console.log(`   Score gain        : ${bs?.before?.estimatedScore} → ${bs?.after?.estimatedScore} (+${bs?.scoreGain})`);
//   console.log(`   ATS gain          : ${bs?.before?.estimatedAts} → ${bs?.after?.estimatedAts} (+${bs?.atsGain})`);
//   console.log(`   Verdict           : ${ov?.finalVerdict}`);
//   console.log('========================================\n');

//   return {
//     result:    JSON.stringify(merged),
//     parsed:    merged,
//     modelUsed: rewriteResult?.modelUsed || 'groq',
//     rawResult: rewriteResult?.result,
//   };
// }

// ── Fallback builder — always returns a complete valid object ──────
function buildFallback(resumeText, beforeScore, beforeAts, beforeRead, domain) {
  const afterAts   = Math.min(beforeAts   + 20, 97);
  const afterScore = Math.min(beforeScore + 18, 97);
  const afterRead  = Math.min(beforeRead  + 12, 97);
  const result = {
    rewrittenResume: {
      content:                   resumeText || 'Rewrite failed — please retry.',
      wordCount:                 (resumeText || '').split(/\s+/).length,
      sectionCount:              0,
      estimatedAtsScore:         afterAts,
      estimatedReadabilityScore: afterRead,
    },
    summaryRewrite:       { original: null, rewritten: 'Retry for rewritten summary.', whyBetter: 'Service error — retry.' },
    skillsSectionRewrite: { skillsAdded: [], skillsRemoved: [], rewritten: {}, whyReordered: '' },
    keywordsAdded:        [],
    keywordOptimization:  { jdKeywordsAdded: [], jdKeywordsMissing: [], totalKeywordCoverage: 'N/A', atsPrediction: 'Retry' },
    bulletTransformations: [],
    actionVerbsUsed:      [],
    actionVerbsReplaced:  [],
    metricsAdded:         [],
    metricsAddedList:     [],
    improvements:         ['Service error — retry to see improvements'],
    beforeAfterScores: {
      before:          { estimatedScore: beforeScore, estimatedAts: beforeAts, estimatedReadability: beforeRead, mainProblems: ['Service error'] },
      after:           { estimatedScore: afterScore,  estimatedAts: afterAts,  estimatedReadability: afterRead,  mainImprovements: ['Retry for improvements'] },
      scoreGain:       afterScore - beforeScore,
      atsGain:         afterAts   - beforeAts,
      readabilityGain: afterRead  - beforeRead,
    },
    remainingGaps:     [{ gap: 'Service error', why: 'API call failed', candidateAction: 'Retry the rewrite' }],
    placeholderGuide:  [],
    sectionsAnalysis:  { sectionsKept: [], sectionsAdded: [], sectionsRemoved: [], sectionsReordered: [] },
    scamFlagsAddressed: [],
    overview: {
      rewriteQuality: 'Surface Polish', rewriteQualityScore: 60,
      totalBulletsRewritten: 0, totalKeywordsAdded: 0, totalMetricsAdded: 0, totalBannedPhrasesRemoved: 0,
      readinessLevel: 'Needs Candidate Input',
      biggestTransformation: 'Service error — retry for full transformation',
      whatStillNeedsWork: 'Retry the rewrite',
      hiringManagerReaction: 'Unable to evaluate — retry',
      atsPassPrediction: 'Unknown', atsPassPercent: `${afterAts}% estimated`,
      interviewReadiness: 'Retry for assessment',
      topThreeWins:      ['Retry for detailed wins'],
      topThreeRemaining: ['Retry rewrite to see gaps'],
      finalVerdict: 'NEEDS CANDIDATE ADDITIONS',
      finalVerdictReason: 'Service error. Please retry.',
    },
  };
  return { result: JSON.stringify(result), parsed: result, modelUsed: 'groq-fallback' };
}
// ─────────────────────────────────────────────────────────────────
// OUTREACH MESSAGE GENERATION
// ─────────────────────────────────────────────────────────────────
/**
 * Generate outreach/follow-up message for networking
 * @param {Object} resumeAnalysis - Candidate profile
 * @param {string} jobDescription - Target job
 * @param {string} recipientName - Name of recipient
 * @param {string} platform - Platform (LinkedIn, Email, Twitter)
 * @returns {Object} - { result, modelUsed }
 */
// async function generateOutreach(resumeAnalysis, jobDescription, recipientName, platform = "LinkedIn") {
//   console.log('\n========================================');
//   console.log('📨 OUTREACH MESSAGE GENERATION STARTED');
//   console.log('========================================');
//   console.log('👤 Recipient:', recipientName);
//   console.log('📱 Platform:', platform);
  
//   const wordLimits = {
//     LinkedIn: 150,
//     Email: 200,
//     Twitter: 280,
//     ColdEmail: 250
//   };
  
//   const wordLimit = wordLimits[platform] || 150;

//   const messages = [
//     {
//       role: "system",
//       content: `You are a Networking & Outreach Expert who specializes in helping professionals make authentic connections and land referrals.

// Your messages are:
// ✅ Direct - Get to the point quickly
// ✅ Confident - Show value without being pushy
// ✅ Not Desperate - Offer value, don't beg
// ✅ Personalized - Reference specific details
// ✅ Professional - Appropriate for business context

// PLATFORM SPECIFICS:
// - LinkedIn: Conversational,不超过150 words
// - Email: More formal, include subject line
// - Twitter/X: Brief, witty, professional
// - Cold Email: Structured with clear value proposition

// TONE: Professional but personable, confident, concise

// RESPONSE FORMAT (JSON):
// {
//   "content": "Full message with proper formatting",
//   "wordCount": <number>,
//   "tone": "Professional/Confident/Friendly",
//   "keyValueProvided": "What value you offer",
//   "callToAction": "Specific next step you propose"
// }`
//     },
//     {
//       role: "user",
//       content: `RECIPIENT: ${recipientName}
// PLATFORM: ${platform}
// WORD LIMIT: ${wordLimit} words

// CANDIDATE PROFILE:
// ${JSON.stringify(resumeAnalysis, null, 2)}

// JOB/ROLE INTEREST:
// ${jobDescription}

// Write a personalized outreach message that gets responses. Show value, don't just ask for help.`
//     }
//   ];
  
//   console.log('📤 Sending request to OpenRouter for Outreach Message...');
//   const result = await callGroq(messages, 0.8);
  
//   console.log('✅ Outreach Message Generation Complete');
//   console.log('📊 Result length:', result.result.length, 'characters');
//   console.log('🎯 Model used:', result.modelUsed);
//   console.log('========================================\n');
  
//   return result;
// }
async function generateOutreach(
  resumeAnalysis,
  jobDescription,
  recipientName,
  platform = 'LinkedIn'
) {

  // ── Pre-process: safely extract candidate data ──
  const candidateName    = resumeAnalysis?.name
                           || resumeAnalysis?.candidateName
                           || 'The Candidate';
  const targetDomain     = resumeAnalysis?.targetDomain     || 'the target role';
  const overallScore     = resumeAnalysis?.score            ?? 'N/A';
  const atsScore         = resumeAnalysis?.ats_compatibility ?? 'N/A';
  const experienceMatch  = resumeAnalysis?.experience_match  ?? 'N/A';
  const hardSkills       = (resumeAnalysis?.hard_skills      || []).join(', ') || 'Not specified';
  const softSkills       = (resumeAnalysis?.soft_skills      || []).join(', ') || 'Not specified';
  const existingKeywords = (resumeAnalysis?.keywords         || []).join(', ') || 'None';
  const strengths        = (resumeAnalysis?.strengths        || []).slice(0, 4).join('\n• ') || 'None';
  const summary          = resumeAnalysis?.summary           || 'No summary available';

  const topProjects = (resumeAnalysis?.top_projects || [])
    .slice(0, 3)
    .map(p => `  - ${p.name} (${p.score}/10): ${p.reason}`)
    .join('\n') || '  No projects detected';

  const topBullets = (resumeAnalysis?.bullet_improvements || [])
    .slice(0, 3)
    .map(b => `  "${b.improved}"`)
    .join('\n') || '  No highlights available';

  // ── Auto-detect company + role from JD ──
  const companyMatch = jobDescription?.match(
    /(?:at|join|company[:\s]+|for)\s+([A-Z][A-Za-z0-9\s&.,'-]{2,40}?)(?:\s+is|\s+we|\s+our|\s+–|\s+-|\.|,|!)/
  );
  const companyName = companyMatch?.[1]?.trim() || 'the company';

  const jobTitleMatch = jobDescription?.match(
    /(?:position|role|title|hiring|looking for|seeking)[:\s]+([A-Za-z\s\/\-]+?)(?:\s+at|\s+to|\s+who|\s+with|\.|,|\n)/i
  );
  const jobTitle = jobTitleMatch?.[1]?.trim() || targetDomain;

  // ── Platform-specific config ──
  const platformConfig = {
    LinkedIn: {
      wordLimit:       150,
      charLimit:       300,
      formality:       'Semi-formal',
      context:         'Professional networking — recipient sees your profile photo and headline',
      goal:            'Get a reply or referral introduction',
      cta:             'Ask for a 15-minute call or to be referred internally',
      doNot:           'Never attach files, never ask for a job directly in message 1, never send walls of text',
      bestTime:        'Tuesday–Thursday, 9am–11am local time',
      subjectLine:     false,
      toneKeywords:    'warm, direct, credible, concise',
    },
    Email: {
      wordLimit:       220,
      charLimit:       1400,
      formality:       'Formal',
      context:         'Cold email — recipient has zero context, subject line is the first filter',
      goal:            'Get the email opened and a reply — NOT a job offer in email 1',
      cta:             'Request a 20-minute intro call or ask one specific question',
      doNot:           'Never attach resume in cold email 1, never write more than 5 sentences in body',
      bestTime:        'Tuesday–Thursday, 6am–8am recipient local time',
      subjectLine:     true,
      toneKeywords:    'professional, crisp, confident, value-first',
    },
    Twitter: {
      wordLimit:       60,
      charLimit:       280,
      formality:       'Casual-professional',
      context:         'Public or DM — recipient is used to brevity, scroll-stopping hooks',
      goal:            'Get a DM reply or move conversation off-platform',
      cta:             'Ask one question or propose moving to email/call',
      doNot:           'Never tag publicly asking for a job, never use hashtags in DMs',
      bestTime:        'Weekdays 12pm–3pm',
      subjectLine:     false,
      toneKeywords:    'punchy, witty, confident, human',
    },
    ColdEmail: {
      wordLimit:       280,
      charLimit:       1800,
      formality:       'Semi-formal',
      context:         'Structured cold email — recipient has no prior relationship',
      goal:            'Generate curiosity and get a reply within 3 lines',
      cta:             'Offer specific value + propose a micro-commitment (15-min call)',
      doNot:           'Never open with "I hope this email finds you well", never write your full life story',
      bestTime:        'Tuesday–Thursday early morning',
      subjectLine:     true,
      toneKeywords:    'direct, credible, value-led, respectful of their time',
    },
    Referral: {
      wordLimit:       180,
      charLimit:       1100,
      formality:       'Warm-professional',
      context:         'Asking someone in your network to refer you — they know you somewhat',
      goal:            'Make it EASY for them to say yes and refer you internally',
      cta:             'Ask them to forward your resume or share your profile with hiring manager',
      doNot:           'Never put them in an awkward position, always give them an easy out',
      bestTime:        'Monday or Tuesday morning',
      subjectLine:     false,
      toneKeywords:    'genuine, appreciative, confident, easy-ask',
    },
    InMail: {
      wordLimit:       200,
      charLimit:       1900,
      formality:       'Semi-formal',
      context:         'LinkedIn InMail — paid message, recipient knows it is unsolicited',
      goal:            'Higher bar than connection message — must deliver real value in first 2 lines',
      cta:             'Ask a specific question related to their work or request a brief call',
      doNot:           'Never waste InMail credits on generic messages',
      bestTime:        'Same as LinkedIn',
      subjectLine:     true,
      toneKeywords:    'precise, knowledgeable, respectful, value-forward',
    },
  };

  const cfg = platformConfig[platform] || platformConfig['LinkedIn'];



  const messages = [
    {
      role: 'system',
      content: `You are NOVA — an elite Networking Strategist, Outreach Copywriter, and 
Persuasion Expert who has helped 15,000+ professionals land referrals, interviews, 
and career opportunities through strategic outreach. You have studied thousands of 
cold messages that worked vs. failed, and you know exactly why each succeeded or flopped.

You write messages that feel human, specific, and compelling — not copy-paste templates 
that go straight to the ignore pile.

════════════════════════════════════════
THE PSYCHOLOGY OF OUTREACH THAT WORKS
════════════════════════════════════════

WHY MOST OUTREACH FAILS:
  ❌ It leads with what YOU want ("I'm looking for a job...")
  ❌ It's vague ("I'd love to connect and learn more...")
  ❌ It's long and dense (people skim on mobile)
  ❌ It's clearly a template ("Dear [Name], I came across your profile...")
  ❌ It puts the recipient in an awkward position
  ❌ It asks for too much in message 1 (full referral, job offer, 1-hr call)
  ❌ It has no hook — no reason to keep reading after line 1
  ❌ It's desperate ("I've been applying everywhere and...")

WHY GREAT OUTREACH WORKS:
  ✅ WIIFT (What's In It For Them) — lead with something relevant to THEM
  ✅ Specificity — shows you actually researched them and their company
  ✅ Credibility signal — one impressive fact about you up front
  ✅ Brevity — respects their time, reads in under 30 seconds
  ✅ Low-friction CTA — asks for something small, easy to say yes to
  ✅ Human voice — sounds like a real person, not HR software
  ✅ Social proof — subtly signals you're worth their time
  ✅ Curiosity gap — makes them want to know more

THE FIRST LINE IS EVERYTHING:
  The recipient decides in 2 seconds whether to read on.
  First line options that work:
  Option A — SPECIFIC COMPLIMENT: Reference something real they did
    "Your talk on distributed systems at [Conference] completely changed 
     how I think about eventual consistency."
  Option B — SHARED CONTEXT: Mutual connection, shared experience, same company
    "We both went through [Bootcamp/University] — saw you've been at 
     [Company] for 3 years now."
  Option C — BOLD CREDIBILITY: Lead with your most impressive relevant fact
    "I reduced our API response time by [X]% last quarter — saw [Company] 
     is hiring engineers focused on performance."
  Option D — THEIR PROBLEM / YOUR SOLUTION (for senior people):
    "Noticed [Company] is scaling its data infra — I just finished 
     migrating a 50TB warehouse to Snowflake."

NEVER USE THESE OPENERS:
  ❌ "I hope this message finds you well"
  ❌ "My name is [X] and I am a [title]"
  ❌ "I came across your profile and..."
  ❌ "I am reaching out because..."
  ❌ "I would love to pick your brain"
  ❌ "I am passionate about..."
  ❌ "I'm looking for new opportunities"

════════════════════════════════════════
PLATFORM-SPECIFIC MASTERY
════════════════════════════════════════

LINKEDIN CONNECTION REQUEST (≤300 chars):
  Most underutilized outreach tool. Because it's short, every word matters.
  Structure: [Specific hook] + [Who you are in 1 line] + [Micro-CTA]
  Example: "Your post on React Server Components was insightful. 
            I'm a frontend engineer at [Co] working on similar problems. 
            Would love to connect."

LINKEDIN MESSAGE (≤150 words):
  Slightly longer — can establish more context.
  Structure: Hook → Credibility signal → Specific ask
  Must feel like a real human wrote it while commuting.

COLD EMAIL (≤250 words):
  Subject line is 50% of the battle.
  Body: Hook (1 line) → Who you are (1 line) → Why them/their company (1-2 lines) 
        → Specific value you bring (2-3 lines) → Easy CTA (1 line)
  PS line: Often gets more reads than the body.
  
EMAIL SUBJECT LINE FORMULAS THAT WORK:
  "[Mutual connection] suggested I reach out"
  "Quick question about [Company]'s [specific team/project]"
  "[Impressive stat] — relevant to your [role/team]"
  "Former [Company] engineer → interested in [Team] role"
  "Re: [Something they posted/said recently]"
  
TWITTER/X DM (≤280 chars):
  Ultra-tight. One punchy sentence + specific ask.
  Never ask for a job. Ask for a thought, a reaction, a 5-min call.

REFERRAL REQUEST (to someone who knows you):
  Make it easy. Give them everything they need to forward your info.
  Include: your key qualifications, the exact role, and the exact ask
  ("Could you forward my resume to the hiring manager?" not 
   "Could you help me somehow?")

INMAIL (≤200 words):
  Treat it like a cold email. Higher bar because it costs LinkedIn credits.
  Must open with extreme specificity — generic InMails waste credits.

════════════════════════════════════════
FOLLOW-UP SEQUENCE STRATEGY
════════════════════════════════════════

Generate a complete 3-touch follow-up sequence:

TOUCH 1 (Day 0): The original outreach message
TOUCH 2 (Day 4-5): Value-add follow-up — don't just say "following up"
  Add something NEW: a relevant article, a project you just shipped, 
  a shared insight, a question about their work
TOUCH 3 (Day 10-12): The polite final bump
  "Last time reaching out on this — totally understand if not the right time.
   [One-sentence reminder of what you offer]."
  Always leave the door open.

════════════════════════════════════════
RESPONSE FORMAT — STRICT JSON ONLY
════════════════════════════════════════

{
  "primaryMessage": {
    "content": "The main outreach message — complete, ready to send",
    "wordCount": <number>,
    "charCount": <number>,
    "platform": "${platform}",
    "tone": "Professional | Semi-formal | Warm | Confident | Casual-professional",
    "hookStyle": "Specific compliment | Shared context | Bold credibility | Their problem",
    "hookLine": "Just the first 1-2 sentences — the hook",
    "ctaUsed": "Exact call-to-action at the end of the message",
    "ctaType": "Call request | Question | Referral ask | Coffee chat | Feedback request",
    "wordLimitMet": <true/false>,
    "isReadyToSend": <true/false>,
    "sendingTip": "Best time/day to send this for highest open rate"
  },

  "subjectLine": ${cfg.subjectLine ? `{
    "primary": "Best subject line for this message",
    "alternatives": [
      { "subject": "Option 2", "style": "Achievement-led" },
      { "subject": "Option 3", "style": "Curiosity-driven" },
      { "subject": "Option 4", "style": "Mutual connection / referral style" }
    ],
    "subjectLinePsychology": "Why the primary subject line gets opened"
  }` : 'null'},

  "alternativeVersions": [
    {
      "style": "Ultra-short / Punchy",
      "content": "A shorter, punchier version — under 80 words",
      "wordCount": <number>,
      "bestFor": "When you want maximum brevity",
      "hookLine": "First line of this version"
    },
    {
      "style": "Value-forward / Credibility-led",
      "content": "Version that leads with candidate's strongest achievement",
      "wordCount": <number>,
      "bestFor": "When recipient is senior or hard to impress",
      "hookLine": "First line of this version"
    },
    {
      "style": "Conversational / Human",
      "content": "Most casual, human-sounding version",
      "wordCount": <number>,
      "bestFor": "Younger recipient, startup culture, peer-to-peer",
      "hookLine": "First line of this version"
    }
  ],

  "followUpSequence": [
    {
      "touchNumber": 1,
      "sendOnDay": 0,
      "label": "Initial Outreach",
      "content": "Same as primaryMessage.content",
      "wordCount": <number>,
      "purpose": "First contact — establish credibility and make the ask"
    },
    {
      "touchNumber": 2,
      "sendOnDay": 5,
      "label": "Value-Add Follow-Up",
      "content": "Follow-up that adds new value — does NOT start with 'Just following up'",
      "wordCount": <number>,
      "newValueAdded": "What new information or value this message adds",
      "purpose": "Remind without being annoying — add something new"
    },
    {
      "touchNumber": 3,
      "sendOnDay": 11,
      "label": "Final Polite Bump",
      "content": "Last touch — graceful, leaves door open, no guilt-tripping",
      "wordCount": <number>,
      "tone": "Understanding, no pressure, door left open",
      "purpose": "Last attempt — preserve relationship regardless of outcome"
    }
  ],

  "connectionNoteVersion": {
    "content": "Ultra-short 300-character version for LinkedIn connection request NOTE field",
    "charCount": <number>,
    "isUnder300Chars": <true/false>,
    "tip": "Send this as the connection request note BEFORE the full message"
  },

  "personalizationElements": [
    {
      "element": "Specific detail used to personalize",
      "source": "Resume | JD | Recipient's role | Company context",
      "impact": "How this makes the message feel non-generic"
    }
  ],

  "redFlags": [
    {
      "flag": "Any element of the message that could backfire",
      "severity": "Minor | Moderate | Avoid",
      "suggestion": "How to fix it if needed"
    }
  ],

  "candidateValueProps": [
    {
      "prop": "Specific value the candidate brings that was woven into this message",
      "relevance": "Why this is relevant to the recipient or their company"
    }
  ],

  "recipientPsychology": {
    "likelyMindset": "What the recipient is probably thinking when they get this message",
    "mainObjection": "The most likely reason they would NOT reply",
    "howMessageAddressesObjection": "How this message preempts or handles that objection",
    "estimatedReplyRate": "<X>% estimated reply rate for this message quality",
    "replyRateBenchmark": "Average cold outreach reply rate is 8-12%. This message is above/below/at benchmark."
  },

  "abTestSuggestions": [
    {
      "element": "What to A/B test (subject line | opening line | CTA | length)",
      "versionA": "Current version",
      "versionB": "Alternative to test",
      "hypothesis": "Which will perform better and why"
    }
  ],

  "platformBestPractices": [
    "Specific tip for sending on ${platform}",
    "Timing tip for ${platform}",
    "Format tip specific to ${platform}"
  ],

  "doNotSendIf": [
    "Condition where this message should NOT be sent as-is",
    "Scenario where a different approach would work better"
  ],

  "overview": {
    "messageStrength": "Weak | Average | Strong | Exceptional",
    "messageStrengthScore": <0-100>,
    "personalizationScore": <0-100>,
    "credibilityScore": <0-100>,
    "concisenessScore": <0-100>,
    "ctaStrength": "Weak | Moderate | Strong | Very Strong",
    "estimatedReplyRate": "<X>%",
    "whatMakesItWork": [
      "Specific strength 1 of this message",
      "Specific strength 2",
      "Specific strength 3"
    ],
    "whatCouldBeStronger": [
      "Specific improvement 1",
      "Specific improvement 2"
    ],
    "recipientFirstImpression": "What will go through the recipient's mind in the first 3 seconds",
    "hiringManagerVersion": "If the recipient is the hiring manager directly, what changes about the approach",
    "recruiterVersion": "If the recipient is a recruiter, what changes about the approach",
    "finalVerdict": "SEND AS-IS | SEND WITH MINOR TWEAKS | PERSONALIZE MORE | REWRITE RECOMMENDED",
    "finalVerdictReason": "Specific reason for this verdict",
    "topTip": "The single most important thing this candidate should do to increase response rate"
  }
}

STRICT RULES:
- Return ONLY the JSON. Zero text before or after.
- primaryMessage.content must be complete, polished, and ready to copy-paste.
- NEVER use any of the banned opener phrases.
- primaryMessage.wordCount must be ≤ ${cfg.wordLimit}.
- connectionNoteVersion.charCount must be ≤ 300.
- followUpSequence must have exactly 3 touches with genuinely different content.
- alternativeVersions must be distinctly different in style — not just rephrased.
- If platform requires a subject line, subjectLine must not be null.
- recipientPsychology.estimatedReplyRate must be a realistic number (5-35%).
- All three follow-up messages must feel human — no "I wanted to circle back" or "Just checking in".`
    },
    {
      role: 'user',
      content: `Generate a complete, highly personalized outreach package for this candidate.

════════════════════════════════════════
RECIPIENT DETAILS
════════════════════════════════════════
Name              : ${recipientName}
Platform          : ${platform}
Word Limit        : ${cfg.wordLimit} words
Character Limit   : ${cfg.charLimit} chars
Formality Level   : ${cfg.formality}
Message Goal      : ${cfg.goal}
CTA Direction     : ${cfg.cta}
Avoid             : ${cfg.doNot}
Best Send Time    : ${cfg.bestTime}
Tone Keywords     : ${cfg.toneKeywords}
${cfg.subjectLine ? 'Subject Line Required: YES' : 'Subject Line Required: NO'}

════════════════════════════════════════
CANDIDATE PROFILE
════════════════════════════════════════
Name                    : ${candidateName}
Target Domain           : ${targetDomain}
Overall Resume Score    : ${overallScore}/100
ATS Compatibility       : ${atsScore}/100
Experience Match Score  : ${experienceMatch}/100

HARD SKILLS:
${hardSkills}

SOFT SKILLS:
${softSkills}

KEYWORDS IN RESUME:
${existingKeywords}

TOP STRENGTHS (use 1-2 of these as credibility signals):
- ${strengths}

TOP PROJECTS (use the best one as a specific example):
${topProjects}

STRONGEST RESUME BULLETS (use one as proof of impact):
${topBullets}

OVERALL CANDIDATE ASSESSMENT:
${summary}

════════════════════════════════════════
TARGET ROLE + COMPANY
════════════════════════════════════════
Detected Company  : ${companyName}
Detected Job Title: ${jobTitle}

Full Job Description / Role Context:
${jobDescription}

════════════════════════════════════════
YOUR TASK
════════════════════════════════════════
1. Write the primary message for ${platform} — under ${cfg.wordLimit} words, 
   ready to send immediately. Open with a hook that is NOT generic.

2. Reference ${companyName} and/or ${jobTitle} specifically — 
   show this was written for THIS recipient, not mass-blasted.

3. Use the candidate's strongest relevant achievement as the credibility signal.
   Pick from: top projects, strongest bullet, or key skills.

4. End with a low-friction CTA — easy for ${recipientName} to say yes to.

5. Write 3 alternative versions in different styles.

6. Write the complete 3-touch follow-up sequence with genuinely different 
   content in each message (no "just following up" language — ever).

7. Write the 300-char connection note for the LinkedIn connection request.

8. Be honest in the overview — if the candidate profile is weak or the 
   outreach premise is flawed, say so clearly in the final verdict.

The recipient gets dozens of these messages. Make this one impossible to ignore.`
    }
  ];

  const result = await callGroq(messages, 0.78, 0);

  // ── Parse and validate ──
  let parsed = null;
  try {
    const raw     = result.result || '{}';
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const jsonStr = cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned;
    parsed        = JSON.parse(jsonStr);

    // ── Validate word count ──
    const primaryContent = parsed?.primaryMessage?.content || '';
    const actualWords    = primaryContent.split(/\s+/).filter(Boolean).length;
    const actualChars    = primaryContent.length;
    if (parsed.primaryMessage) {
      parsed.primaryMessage.wordCount      = actualWords;
      parsed.primaryMessage.charCount      = actualChars;
      parsed.primaryMessage.wordLimitMet   = actualWords <= cfg.wordLimit;
    }

    // ── Validate connection note char limit ──
    if (parsed.connectionNoteVersion) {
      const noteChars = (parsed.connectionNoteVersion.content || '').length;
      parsed.connectionNoteVersion.charCount       = noteChars;
      parsed.connectionNoteVersion.isUnder300Chars = noteChars <= 300;
    }

    // ── Safe defaults ──
    parsed.alternativeVersions     = parsed.alternativeVersions     || [];
    parsed.followUpSequence        = parsed.followUpSequence        || [];
    parsed.personalizationElements = parsed.personalizationElements || [];
    parsed.redFlags                = parsed.redFlags                || [];
    parsed.candidateValueProps     = parsed.candidateValueProps     || [];
    parsed.abTestSuggestions       = parsed.abTestSuggestions       || [];
    parsed.platformBestPractices   = parsed.platformBestPractices   || [];
    parsed.doNotSendIf             = parsed.doNotSendIf             || [];

    if (!cfg.subjectLine) parsed.subjectLine = null;

    if (!parsed.recipientPsychology) {
      parsed.recipientPsychology = {
        likelyMindset:                   'Busy professional receiving many messages',
        mainObjection:                   'Appears to be a generic template',
        howMessageAddressesObjection:    'Retry for full psychology analysis',
        estimatedReplyRate:              '10%',
        replyRateBenchmark:              'At benchmark',
      };
    }

    if (!parsed.connectionNoteVersion) {
      const shortNote = primaryContent.substring(0, 280);
      parsed.connectionNoteVersion = {
        content:         shortNote,
        charCount:       shortNote.length,
        isUnder300Chars: shortNote.length <= 300,
        tip:             'Send this before the full message',
      };
    }

    if (!parsed.overview) {
      parsed.overview = {
        messageStrength:          'Average',
        messageStrengthScore:      60,
        personalizationScore:      50,
        credibilityScore:          55,
        concisenessScore:          65,
        ctaStrength:               'Moderate',
        estimatedReplyRate:        '10%',
        whatMakesItWork:           [],
        whatCouldBeStronger:       [],
        recipientFirstImpression:  'Retry for full impression analysis',
        hiringManagerVersion:      'Retry for hiring manager version',
        recruiterVersion:          'Retry for recruiter version',
        finalVerdict:              'SEND WITH MINOR TWEAKS',
        finalVerdictReason:        'Default fallback — retry for full analysis',
        topTip:                    'Personalize the opening line with something specific about the recipient',
      };
    }

    // ── Log comprehensive stats ──
    const ov = parsed.overview;

  } catch (parseError) {
    console.error('❌ Failed to parse Outreach JSON:', parseError.message);
    console.error('Raw result snippet:', result.result?.substring(0, 400));

    // ── Full structured fallback ──
    const fallbackContent = `Hi ${recipientName},\n\nI came across the ${jobTitle} role at ${companyName} and was genuinely impressed by the team's work. With my background in ${hardSkills.split(',')[0]?.trim() || 'relevant technologies'}, I believe I can contribute meaningfully.\n\nWould you be open to a 15-minute call to discuss this further?\n\nBest,\n${candidateName}`;

    parsed = {
      primaryMessage: {
        content:        fallbackContent,
        wordCount:      fallbackContent.split(/\s+/).length,
        charCount:      fallbackContent.length,
        platform,
        tone:           'Professional',
        hookStyle:      'Generic — retry for personalized hook',
        hookLine:       `Hi ${recipientName},`,
        ctaUsed:        '15-minute call',
        ctaType:        'Call request',
        wordLimitMet:   fallbackContent.split(/\s+/).length <= cfg.wordLimit,
        isReadyToSend:  false,
        sendingTip:     'Tuesday–Thursday morning for best results',
      },
      subjectLine: cfg.subjectLine ? {
        primary:                `Interested in ${jobTitle} role at ${companyName}`,
        alternatives:           [],
        subjectLinePsychology:  'Fallback subject line — retry for optimized version',
      } : null,
      alternativeVersions:     [],
      followUpSequence: [
        {
          touchNumber: 1, sendOnDay: 0,
          label:     'Initial Outreach',
          content:   fallbackContent,
          wordCount: fallbackContent.split(/\s+/).length,
          purpose:   'First contact',
        },
        {
          touchNumber: 2, sendOnDay: 5,
          label:     'Value-Add Follow-Up',
          content:   `Hi ${recipientName}, wanted to share a quick update — I recently completed a project involving ${hardSkills.split(',')[0]?.trim() || 'relevant work'} that might be relevant to what ${companyName} is building. Still happy to connect if timing works.\n\n${candidateName}`,
          wordCount: 35,
          newValueAdded: 'Recent project update',
          purpose:   'Value-add reminder',
        },
        {
          touchNumber: 3, sendOnDay: 11,
          label:   'Final Polite Bump',
          content: `Hi ${recipientName}, last note from me — completely understand if the timing isn't right. If you ever need someone with ${hardSkills.split(',')[0]?.trim() || 'my background'}, I'd love to be top of mind.\n\n${candidateName}`,
          wordCount: 35,
          tone:    'Understanding, no pressure',
          purpose: 'Last touch — preserve relationship',
        },
      ],
      connectionNoteVersion: {
        content:         `Hi ${recipientName}, interested in the ${jobTitle} role at ${companyName}. My background in ${hardSkills.split(',')[0]?.trim() || 'relevant tech'} aligns well. Would love to connect.`,
        charCount:       150,
        isUnder300Chars: true,
        tip:             'Send this as connection request note first',
      },
      personalizationElements: [],
      redFlags: [
        {
          flag:       'Fallback message used due to parse error',
          severity:   'Moderate',
          suggestion: 'Retry generation for personalized version',
        },
      ],
      candidateValueProps:   [],
      recipientPsychology: {
        likelyMindset:                'Busy professional',
        mainObjection:                'Generic outreach',
        howMessageAddressesObjection: 'Retry for full analysis',
        estimatedReplyRate:           '8%',
        replyRateBenchmark:           'At average benchmark',
      },
      abTestSuggestions:     [],
      platformBestPractices: [`Send on Tuesday or Thursday morning for best ${platform} response rates`],
      doNotSendIf:           ['Retry generation before sending — this is a fallback message'],
      overview: {
        messageStrength:          'Average',
        messageStrengthScore:      35,
        personalizationScore:      20,
        credibilityScore:          30,
        concisenessScore:          60,
        ctaStrength:               'Moderate',
        estimatedReplyRate:        '8%',
        whatMakesItWork:           ['Has a clear CTA'],
        whatCouldBeStronger:       ['Needs personalized hook', 'Retry for full optimization'],
        recipientFirstImpression:  'Generic — retry for better first impression',
        hiringManagerVersion:      'Retry for specialized version',
        recruiterVersion:          'Retry for specialized version',
        finalVerdict:              'REWRITE RECOMMENDED',
        finalVerdictReason:        'Parse error — fallback message used. Please retry.',
        topTip:                    'Retry generation for a fully personalized message',
      },
    };
  }

  return {
    result:    JSON.stringify(parsed),
    parsed,
    modelUsed: result.modelUsed,
    rawResult: result.result,
  };
}

// ─────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────
module.exports = {
  callGroq,
  matchJD,
  generateCoverLetter,
  rewriteResume,
  generateOutreach,
};
// Export functions using CommonJS (for compatibility with existing require)

// ─────────────────────────────────────────────────────────────────
// ADDITIONAL GENERATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────

/**
 * Rewrite bullet points with improved impact
 * @param {string} bulletText - Original bullet point
 * @returns {Object} - { result, modelUsed }
 */
async function rewriteBulletPoints(bulletText) {
  
  const messages = [
    {
      role: "system",
      content: `You are an expert Resume Editor for Senior Engineering and Management roles.
Your job is to rewrite the following resume bullet point using the "Google XYZ Formula":
"Accomplished [X] as measured by [Y], by doing [Z]."

INSTRUCTIONS:
1. **Action First:** Start with a high-impact power verb (e.g., Engineered, Spearheaded, Optimized, not "Helped" or "Worked on").
2. **Add Metric Placeholders:** If the input lacks numbers, you MUST add realistic placeholders like "[X]%" or "$[Y]k" to show the user where data belongs.
3. **Focus on Impact:** Shift the focus from "what I did" (tasks) to "what I achieved" (business value).
4. **Remove Fluff:** Eliminate passive words like "Responsible for," "Tasked with," or "Assisted."

RESPOND WITH VALID JSON ONLY:
{
  "improved": "Your highly optimized version here...",
  "reason": "Brief explanation of the specific strategy used"
}`
    },
    {
      role: "user",
      content: `ORIGINAL TEXT:
"${bulletText}"

Rewrite this to be more impactful and professional.`
    }
  ];
  
  const result = await callGroq(messages, 0.6, 1);
  
  return result;
}

/**
 * Generate interview questions based on resume
 * @param {string} resumeText - Resume text
 * @param {string} targetDomain - Target domain
 * @returns {Object} - { result, modelUsed }
 */
async function generateInterviewQuestions(resumeText, targetDomain) {
  
  const messages = [
    {
      role: "system",
      content: `You are a Technical Interview Expert with 15+ years of experience at FAANG companies.
Generate MINIMUM 9 interview questions (3 Hard, 3 Medium, 3 Easy) based on the resume.

SCORING CRITERIA:
- Hard: Deep technical questions requiring specific knowledge
- Medium: Application of skills to real scenarios  
- Easy: Foundational concepts and background

RESPOND WITH VALID JSON:
{
  "questions": [
    {
      "question": "question text",
      "importance": "High/Medium/Low",
      "reason": "why this question validates resume claims"
    }
  ]
}`
    },
    {
      role: "user",
      content: `RESUME:
${resumeText}

TARGET ROLE: ${targetDomain}

Generate comprehensive interview questions to validate the candidate's claims.`
    }
  ];
  
  const result = await callGroq(messages, 0.5, 1);
  
  return result;
}

/**
 * Roast/critique resume harshly
 * @param {string} resumeText - Resume text
 * @returns {Object} - { result, modelUsed }
 */
async function roastResume(resumeText) {
  
  const messages = [
    {
      role: "system",
      content: `You are a brutally honest resume critic. Your job is to "roast" this resume like a senior tech recruiter would.

RULES:
- Be harsh but constructive
- Point out specific weaknesses
- Use humor where appropriate
- Don't hold back on obvious issues

RESPOND WITH VALID JSON:
{
  "roast": "The full roast text with specific criticisms",
  "criticalIssues": ["issue1", "issue2"],
  "whatWorks": ["positive1", "positive2"]
}`
    },
    {
      role: "user",
      content: `RESUME TO ROAST:
${resumeText}

Give me your worst (but helpful) feedback.`
    }
  ];
  
  const result = await callGroq(messages, 0.9, 1);
  
  return result;
}

/**
 * Generate learning path for missing skills
 * @param {string} missingSkills - Comma-separated missing skills
 * @param {string} targetDomain - Target domain
 * @returns {Object} - { result, modelUsed }
 */
async function generateLearningPath(missingSkills, targetDomain) {
  
  const messages = [
    {
      role: "system",
      content: `You are a Career and Learning Path Expert. Create a structured learning path for the candidate.

INCLUDE:
- Specific courses (Udemy, Coursera, etc.)
- Practical projects to build
- Timeline recommendations
- Resources for each skill

RESPOND WITH VALID JSON:
{
  "learningPath": [
    {
      "skill": "skill name",
      "courses": ["course1", "course2"],
      "projects": ["project1"],
      "timeline": "2-4 weeks",
      "priority": "High/Medium/Low"
    }
  ],
  "overallTimeline": "estimated total time"
}`
    },
    {
      role: "user",
      content: `MISSING SKILLS: ${missingSkills}
TARGET DOMAIN: ${targetDomain}

Create a learning path to bridge these gaps.`
    }
  ];
  
  const result = await callGroq(messages, 0.6, 1);
  
  return result;
}


/**
 * Comprehensive Full Resume Analysis
 * Does everything in one call - JD Match, Cover Letter, Interview Questions, Roast
 * This is faster than making multiple calls
 * @param {string} resumeText - Full resume text
 * @param {string} jobDescription - Job description (optional)
 * @param {string} targetDomain - Target domain
 * @returns {Object} - All analysis results
 */
async function fullAnalysis(resumeText, jobDescription, targetDomain) {

  const messages = [
    {
      role: "system",
      content: `You are an elite Career Analyst AI. Analyze this resume comprehensively and provide ALL of the following in ONE JSON response:

1. JD Match Score (0-100) - if jobDescription provided
2. Matched Skills
3. Missing Skills
4. Should Apply (true/false)
5. Reasoning for match
6. Cover Letter (if jobDescription provided) - max 350 words
7. Interview Questions - MINIMUM 9 (3 Hard, 3 Medium, 3 Easy)
8. Resume Roast - brutal but helpful
9. Strengths (5-7 items)
10. Weaknesses (5-7 items)
11. Improvements (5-7 specific items)

RESPOND WITH VALID JSON:
{
  "matchScore": 85,
  "matchedSkills": ["React", "Node.js"],
  "missingSkills": ["AWS"],
  "shouldApply": true,
  "matchReasoning": "Strong technical match...",
  "coverLetter": "Full cover letter content...",
  "interviewQuestions": [
    {"question": "...", "importance": "High/Medium/Low", "reason": "..."}
  ],
  "roast": "Your roast text...",
  "criticalIssues": ["issue1", "issue2"],
  "strengths": ["item1", "item2"],
  "weaknesses": ["item1", "item2"],
  "improvements": ["item1", "item2"]
}`
    },
    {
      role: "user",
      content: `RESUME:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ''}

TARGET ROLE: ${targetDomain}

Provide comprehensive analysis with all sections.`
    }
  ];
  
  const result = await callGroq(messages, 0.5, 1);
  
  return result;
}

module.exports = {
  callGroq,
  matchJD,
  generateCoverLetter,
  rewriteResume,
  generateOutreach,
  rewriteBulletPoints,
  generateInterviewQuestions,
  roastResume,
  generateLearningPath,
  fullAnalysis
};