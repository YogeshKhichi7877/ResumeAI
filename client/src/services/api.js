

import axios from 'axios';

const API_URL = 'https://resumeai-api-pac6.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register:      (data) => api.post('/auth/register', data),
  login:         (data) => api.post('/auth/login', data),
  getMe:         ()     => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Resume API
export const resumeAPI = {
  uploadAndAnalyze:        (formData) => api.post('/resume/upload-analyze', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAnalysis:             (id)       => api.get(`/resume/${id}`),
  matchWithJD:             (data)     => api.post('/resume/match-jd', data),
  generateCoverLetter:     (data)     => api.post('/resume/cover-letter', data),
  rewriteBullet:           (data)     => api.post('/resume/rewrite-bullet', data),
  enhanceResume:           (data)     => api.post('/resume/enhance-resume', data),
  rewriteWithUpload:       (formData) => api.post('/resume/rewrite-with-upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  generateInterviewQuestions: (data)  => api.post('/resume/interview-questions', data),
  roastResume:             (data)     => api.post('/resume/roast', data),
  chatWithAssistant:       (data)     => api.post('/resume/chat', data),
  generateLearningPath:    (data)     => api.post('/resume/learning-path', data),
  fullAnalysis:            (data)     => api.post('/resume/full-analysis', data),
  generateOutreach:        (data)     => api.post('/resume/outreach', data),
};

// History API
export const historyAPI = {
  getHistory:      ()             => api.get('/history'),
  getHistoryById:  (id)           => api.get(`/history/${id}`),
  deleteHistory:   (id)           => api.delete(`/history/${id}`),
  getStats:        ()             => api.get('/history/stats'),
  getLeaderboard:  (domain, score)=> api.get(`/history/leaderboard/${domain}?score=${score}`),
};

// Payment API
export const paymentAPI = {
  submitUtr:         (plan, utrNumber) => api.post('/payment/submit-utr', { plan, utrNumber }),
  getUsage:          ()                => api.get('/payment/usage'),
  getMyTransactions: ()                => api.get('/payment/my-transactions'),
  listPending:       (adminSecret)     => api.get('/payment/pending', { headers: { 'admin-secret': adminSecret } }),
  approvePayment:    (txId, adminSecret) => api.post('/payment/approve', { transactionId: txId }, { headers: { 'admin-secret': adminSecret } }),
  rejectPayment:     (txId, reason, adminSecret) => api.post('/payment/reject', { transactionId: txId, reason }, { headers: { 'admin-secret': adminSecret } }),
};

export default api;