// src/services/api.js
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// Contest APIs
export const contestAPI = {
  getAllContests: () => api.get('/contests'),
  getContestById: (id) => api.get(`/contests/${id}`),
  getActiveContests: () => api.get('/contests/active'),
  getLeaderboard: (contestId) => api.get(`/contests/${contestId}/leaderboard`),
};

// Problem APIs
export const problemAPI = {
  getProblemById: (id) => api.get(`/problems/${id}`),
  getProblemsByContestId: (contestId) => api.get(`/problems/contest/${contestId}`),
};

// Submission APIs
export const submissionAPI = {
  submitCode: (data) => api.post('/submissions', data),
  getSubmissionStatus: (id) => api.get(`/submissions/${id}`),
};

export default api;