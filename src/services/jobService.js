// Shumouliya - Mock Job Service
// Replace with real API calls in production

import { mockJobs, mockCompanies, mockApplicants } from '../data/mockData';

export const getJobs = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockJobs), 300));
};

export const getCompanies = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockCompanies), 300));
};

export const getApplicants = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(mockApplicants), 300));
};

export const submitApplication = async (formData) => {
  console.log('Submitting application:', formData);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
};

export const addJob = async (jobData) => {
  console.log('Adding job:', jobData);
  return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: Date.now() }), 500));
};
