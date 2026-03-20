const Analysis = require('../models/Analysis');
const History = require('../models/History');
const User = require('../models/User');
const { parsePDF } = require('../utils/pdfParser');
const groqService = require('../services/groqService');
const openRouterService = require('../services/openRouterService.js');


const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    let { targetDomain, customDomain } = req.body;

    // Trim whitespace from targetDomain
    if (typeof targetDomain === 'string') {
      targetDomain = targetDomain.trim();
    }
    if (typeof customDomain === 'string') {
      customDomain = customDomain.trim();
    }

    if (!targetDomain) {
      return res.status(400).json({ message: 'Please select a target domain' });
    }

    // Validate targetDomain against allowed enum values
    const allowedDomains = ['general', 'software-engineer', 'data-scientist', 'marketing', 'product-manager', 'design', 'sales', 'other'];
    if (!allowedDomains.includes(targetDomain)) {
      // If the domain is not in the allowed list, treat it as custom domain
      customDomain = targetDomain;
      targetDomain = 'other';
    }

    // Use custom domain if 'other' is selected
    const domainToAnalyze = targetDomain === 'other' && customDomain ? customDomain : targetDomain;

    // Parse PDF to text
    const resumeText = await parsePDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // Analyze with Groq
    const analysisResult = await groqService.analyzeResumeWithGroq(resumeText, domainToAnalyze);

    // Save analysis to database
    const analysis = await Analysis.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      targetDomain,
      customDomain: targetDomain === 'other' ? customDomain : null,
      resumeText,
      ...analysisResult
    });

    // Update user analysis count
    await User.findByIdAndUpdate(req.user._id, { $inc: { analysisCount: 1 } });

    // Add to history
    await History.create({
      userId: req.user._id,
      analysisId: analysis._id,
      fileName: req.file.originalname,
      targetDomain,
      score: analysisResult.score
    });

    // Log usage after successful analysis
    if (req.logUsage) await req.logUsage();

    res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Match resume with job description
// @route   POST /api/resume/match-jd
// @access  Private
const matchWithJD = async (req, res) => {
  try {
    const { resumeText, jobDescription, targetDomain, resumeAnalysis } = req.body;

    if (!resumeText || !jobDescription || !targetDomain) {
      return res.status(400).json({ message: 'Please provide resume text, job description, and target domain' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    // Pass both raw resume text and analysis for best results
    const analysisData = resumeAnalysis || { resumeText, targetDomain };
    const result = await openRouterService.matchJD(analysisData, jobDescription);
    
    // Clean the JSON response - remove markdown code blocks and fix common issues
    let cleanedResult = result.result;
    cleanedResult = cleanedResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to find valid JSON in the response
    let parsedResult;
    try {
      const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        // Try to fix common JSON issues
        const fixedJson = cleanedResult
          .replace(/,\s*}/g, '}')
          .replace(/,\s*\]/g, ']');
        parsedResult = JSON.parse(fixedJson);
      }
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      // Return a safe fallback
      parsedResult = {
        matchScore: 50,
        scoreBreakdown: {},
        jdAnalysis: {},
        skillGapAnalysis: {},
        keywordAudit: {},
        experienceAnalysis: {},
        redFlags: [],
        resumeImprovementsForThisJD: [],
        executiveSummary: 'Error parsing AI response',
        shouldApply: true
      };
    }
    
    // Transform to match frontend expectations - handle new detailed format
    const transformedResult = {
      match_percentage: parsedResult.matchScore || 0,
      role_fit_score: parsedResult.matchScore || 0,
      // Flatten matched skills from skillGapAnalysis
      matched_keywords: parsedResult.skillGapAnalysis?.perfectMatches?.map(s => s.skill) || 
                       parsedResult.keywordAudit?.keywordDetails?.filter(k => k.status === 'FOUND').map(k => k.keyword) || [],
      // Flatten missing skills from skillGapAnalysis  
      missing_keywords: parsedResult.skillGapAnalysis?.criticalMissing?.map(s => s.skill) ||
                       parsedResult.keywordAudit?.keywordDetails?.filter(k => k.status === 'MISSING').map(k => k.keyword) || [],
      skill_gaps: parsedResult.skillGapAnalysis?.criticalMissing?.map(s => `${s.skill}: ${s.howToFix}`) ||
                 parsedResult.redFlags?.map(r => r.flag) || [],
      recommendations: parsedResult.resumeImprovementsForThisJD?.map(r => r.recommendedChange) ||
                      parsedResult.skillGapAnalysis?.partialMatches?.map(s => s.gap) || [],
      should_apply: parsedResult.shouldApply || (parsedResult.matchScore >= 60),
      reasoning: parsedResult.executiveSummary || parsedResult.scoreBreakdown?.breakdown_explanation || '',
      // Include full detailed analysis for advanced display
      detailed: {
        scoreBreakdown: parsedResult.scoreBreakdown,
        jdAnalysis: parsedResult.jdAnalysis,
        skillGapAnalysis: parsedResult.skillGapAnalysis,
        keywordAudit: parsedResult.keywordAudit,
        experienceAnalysis: parsedResult.experienceAnalysis,
        redFlags: parsedResult.redFlags,
        resumeImprovements: parsedResult.resumeImprovementsForThisJD
      }
    };
    
    // Log usage after successful JD match
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error('❌ Match JD Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate cover letter
// @route   POST /api/resume/cover-letter
// @access  Private
const generateCoverLetter = async (req, res) => {
  try {
    // Support both old format (resumeAnalysis + jobDescription) and new format (resumeText + jobDescription + additional fields)
    let { resumeAnalysis, jobDescription, resumeText, jobTitle, userName, companyName, tone } = req.body;

    // If resumeAnalysis is not provided but resumeText is, construct a resumeAnalysis object
    if (!resumeAnalysis && resumeText) {
      resumeAnalysis = {
        resumeText: resumeText,
        candidateName: userName || 'The Candidate',
        targetDomain: jobTitle || 'the role',
        tone: tone || 'Professional',
        // Add company name if provided
        companyName: companyName || ''
      };
    }

    if (!resumeAnalysis || !jobDescription) {
      return res.status(400).json({ message: 'Please provide resume analysis/text and job description' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.generateCoverLetter(resumeAnalysis, jobDescription);
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Transform to match frontend - handle new detailed format
    const transformedResult = {
      content: parsed.coverLetter?.content || parsed.content || '',
      wordCount: parsed.coverLetter?.wordCount || 0,
      toneUsed: parsed.coverLetter?.toneUsed || 'Professional',
      alternativeOpeners: parsed.alternativeOpeners || [],
      emailSubjectLines: parsed.emailSubjectLines || [],
      linkedinMessage: parsed.linkedinMessage || '',
      followUpEmail: parsed.followUpEmail || '',
      personalizationAudit: parsed.personalizationAudit || {}
    };
    
    // Log usage after successful cover letter generation
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rewrite bullet points
// @route   POST /api/resume/rewrite-bullet
// @access  Private
const rewriteBullet = async (req, res) => {
  try {
    const { bulletText } = req.body;

    if (!bulletText) {
      return res.status(400).json({ message: 'Please provide bullet text to rewrite' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.rewriteBulletPoints(bulletText);
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    
    // Log usage after successful bullet rewrite
    if (req.logUsage) await req.logUsage();

    res.json(match ? JSON.parse(match[0]) : JSON.parse(cleaned));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enhance full resume
// @route   POST /api/resume/enhance-resume
// @access  Private
const enhanceResume = async (req, res) => {
  try {
    const { resumeText, resumeAnalysis, jobDescription, targetRole } = req.body;

    if (!resumeText || !targetRole) {
      return res.status(400).json({ message: 'Please provide resume text and target role' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.rewriteResume(resumeText, resumeAnalysis || {}, jobDescription || '');
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Transform to match frontend - handle new detailed format
    const transformedResult = {
      content: parsed.rewrittenResume?.content || parsed.content || '',
      wordCount: parsed.rewrittenResume?.wordCount || 0,
      estimatedAtsScore: parsed.rewrittenResume?.estimatedAtsScore || 0,
      summaryRewrite: parsed.summaryRewrite || {},
      bulletTransformations: parsed.bulletTransformations || [],
      skillsSectionRewrite: parsed.skillsSectionRewrite || {},
      keywordOptimization: parsed.keywordOptimization || {},
      beforeAfterScores: parsed.beforeAfterScores || {}
    };
    
    // Log usage after successful resume enhancement
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate interview questions
// @route   POST /api/resume/interview-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeText, targetDomain } = req.body;

    if (!resumeText || !targetDomain) {
      return res.status(400).json({ message: 'Please provide resume text and target domain' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.generateInterviewQuestions(resumeText, targetDomain);
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Transform to match frontend - handle both old and new formats
    const transformedResult = {
      questions: parsed.questions || parsed.interviewQuestions || [],
      totalQuestions: parsed.questions?.length || 0
    };
    
    // Log usage after successful interview questions generation
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Roast resume
// @route   POST /api/resume/roast
// @access  Private
const roastResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: 'Please provide resume text to roast' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.roastResume(resumeText);
    
    // Clean the JSON response - remove markdown code blocks
    let cleanedResult = result.result;
    cleanedResult = cleanedResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
    const parsedResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleanedResult);
    
    // Transform to match frontend expectations
    const transformedResult = {
      roast: parsedResult.roast || '',
      criticalIssues: parsedResult.criticalIssues || [],
      whatWorks: parsedResult.whatWorks || []
    };
    
    // Log usage after successful resume roast
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Chat with AI assistant
// @route   POST /api/resume/chat
// @access  Private
const chatWithAssistant = async (req, res) => {
  try {
    const { message, resumeContext, targetDomain, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    const result = await groqService.chatWithAssistant(
      message,
      resumeContext,
      targetDomain,
      conversationHistory || []
    );
    // Log usage after successful chat
    if (req.logUsage) await req.logUsage();

    res.json({ response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate learning path
// @route   POST /api/resume/learning-path
// @access  Private
const generateLearningPath = async (req, res) => {
  try {
    const { missingSkills, targetDomain } = req.body;

    if (!missingSkills || !targetDomain) {
      return res.status(400).json({ message: 'Please provide missing skills and target domain' });
    }

    // Use OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.generateLearningPath(missingSkills, targetDomain);
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Transform to match frontend - handle new detailed format
    const transformedResult = {
      learningPath: parsed.learningPath || [],
      overallTimeline: parsed.overallTimeline || ''
    };
    
    // Log usage after successful learning path generation
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single analysis
// @route   GET /api/resume/:id
// @access  Private
const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check if user owns this analysis
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this analysis' });
    }

    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Full comprehensive analysis in one call
// @route   POST /api/resume/full-analysis
// @access  Private
const fullAnalysis = async (req, res) => {
  try {
    const { resumeText, jobDescription, targetDomain } = req.body;

    if (!resumeText || !targetDomain) {
      return res.status(400).json({ message: 'Please provide resume text and target domain' });
    }

    // Use OpenRouter for comprehensive analysis
    const result = await openRouterService.fullAnalysis(resumeText, jobDescription, targetDomain);
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Log usage after successful full analysis
    if (req.logUsage) await req.logUsage();

    res.json(parsed);
  } catch (error) {
    console.error('❌ Full Analysis Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rewrite resume with file upload
// @route   POST /api/resume/rewrite-with-upload
// @access  Private
const rewriteResumeWithUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { targetRole, tone, jobDescription } = req.body;

    if (!targetRole) {
      return res.status(400).json({ message: 'Please provide target role' });
    }

    // Parse PDF to text
    const resumeText = await parsePDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // Rewrite with OpenRouter (Trinity Primary, MiniMax Fallback)
    const result = await openRouterService.rewriteResume(resumeText, {}, jobDescription || '');
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Transform to match frontend - handle new detailed format
    const transformedResult = {
      content: parsed.rewrittenResume?.content || parsed.content || '',
      wordCount: parsed.rewrittenResume?.wordCount || 0,
      estimatedAtsScore: parsed.rewrittenResume?.estimatedAtsScore || 0,
      beforeAfterScores: parsed.beforeAfterScores || {}
    };
    
    // Log usage after successful rewrite with upload
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @access  Private
const generateOutreach = async (req, res) => {
  try {
    const { resumeAnalysis, jobDescription, recipientName, platform } = req.body;

    if (!resumeAnalysis || !jobDescription || !recipientName) {
      return res.status(400).json({ message: 'Please provide resume analysis, job description, and recipient name' });
    }

    // Generate outreach with OpenRouter
    const result = await openRouterService.generateOutreach(
      resumeAnalysis,
      jobDescription,
      recipientName,
      platform || 'LinkedIn'
    );
    
    // Clean and parse JSON
    let cleaned = result.result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(cleaned);
    
    // Transform to match frontend - handle nested structure
    const transformedResult = {
      primaryMessage: parsed.primaryMessage || { content: '', wordCount: 0 },
      subjectLine: parsed.subjectLine || null,
      alternativeVersions: parsed.alternativeVersions || [],
      followUpSequence: parsed.followUpSequence || [],
      connectionNoteVersion: parsed.connectionNoteVersion || {},
      personalizationElements: parsed.personalizationElements || [],
      redFlags: parsed.redFlags || [],
      candidateValueProps: parsed.candidateValueProps || [],
      recipientPsychology: parsed.recipientPsychology || {},
      abTestSuggestions: parsed.abTestSuggestions || [],
      platformBestPractices: parsed.platformBestPractices || [],
      overview: parsed.overview || {}
    };
    
    // Log usage after successful outreach generation
    if (req.logUsage) await req.logUsage();

    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAndAnalyze,
  matchWithJD,
  generateCoverLetter,
  rewriteBullet,
  enhanceResume,
  generateInterviewQuestions,
  roastResume,
  chatWithAssistant,
  generateLearningPath,
  getAnalysis,
  rewriteResumeWithUpload,
  fullAnalysis,
  generateOutreach
};
