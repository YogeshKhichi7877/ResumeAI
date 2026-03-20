// const express = require('express');
// const router = express.Router();
// const { 
//   uploadAndAnalyze,
//   matchWithJD,
//   generateCoverLetter,
//   rewriteBullet,
//   enhanceResume,
//   generateInterviewQuestions,
//   roastResume,
//   chatWithAssistant,
//   generateLearningPath,
//   getAnalysis,
//   rewriteResumeWithUpload,
//   fullAnalysis,
//   generateOutreach
// } = require('../controllers/resumeController');
// const { protect } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// router.post('/upload-analyze', protect, upload.single('file'), uploadAndAnalyze);
// router.post('/match-jd', protect, matchWithJD);
// router.post('/cover-letter', protect, generateCoverLetter);
// router.post('/rewrite-bullet', protect, rewriteBullet);
// router.post('/enhance-resume', protect, enhanceResume);
// router.post('/rewrite-with-upload', protect, upload.single('file'), rewriteResumeWithUpload);
// router.post('/interview-questions', protect, generateInterviewQuestions);
// router.post('/roast', protect, roastResume);
// router.post('/chat', protect, chatWithAssistant);
// router.post('/learning-path', protect, generateLearningPath);
// router.post('/full-analysis', protect, fullAnalysis);
// router.post('/outreach', protect, generateOutreach);
// router.get('/:id', protect, getAnalysis);

// module.exports = router;















const express = require('express');
const router  = express.Router();
const {
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
} = require('../controllers/resumeController');
const { protect }            = require('../middleware/authMiddleware');
const { checkSubscription }  = require('../middleware/checkSubscription');
const upload                 = require('../middleware/uploadMiddleware');

// Each route: protect (auth) → checkSubscription (plan limits) → controller
router.post('/upload-analyze',    protect, checkSubscription('resume_analysis'),    upload.single('file'), uploadAndAnalyze);
router.post('/full-analysis',     protect, checkSubscription('resume_analysis'),    fullAnalysis);
router.post('/match-jd',          protect, checkSubscription('jd_match'),           matchWithJD);
router.post('/cover-letter',      protect, checkSubscription('cover_letter'),        generateCoverLetter);
router.post('/outreach',          protect, checkSubscription('mail_gen'),            generateOutreach);
router.post('/rewrite-bullet',    protect, checkSubscription('resume_rewrite'),     rewriteBullet);
router.post('/enhance-resume',    protect, checkSubscription('resume_rewrite'),     enhanceResume);
router.post('/rewrite-with-upload', protect, checkSubscription('resume_rewrite'),   upload.single('file'), rewriteResumeWithUpload);
router.post('/interview-questions', protect, checkSubscription('interview_questions'), generateInterviewQuestions);
router.post('/roast',             protect, checkSubscription('roast'),               roastResume);
router.post('/chat',              protect, checkSubscription('chat'),                chatWithAssistant);
router.post('/learning-path',     protect, checkSubscription('interview_questions'), generateLearningPath);

router.get('/:id', protect, getAnalysis);

module.exports = router;