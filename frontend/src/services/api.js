import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Settings
export const testApiKey = async (apiKey) => {
  const response = await api.post('/settings/test-api-key', { api_key: apiKey });
  return response.data;
};

// Templates
export const getTemplates = async (category = null) => {
  const params = category ? { category } : {};
  const response = await api.get('/templates', { params });
  return response.data;
};

export const getTemplateCategories = async () => {
  const response = await api.get('/templates/categories');
  return response.data;
};

// Research
export const researchTopic = async (topic) => {
  try {
    const response = await api.post('/research', { topic });
    return response.data;
  } catch (error) {
    console.error('Research error:', error);
    throw error.response?.data || error;
  }
};

// Planning
export const generatePlan = async (apiKey, contentType, data) => {
  const payload = {
    api_key: apiKey,
    content_type: contentType,
    ...data,
  };
  const response = await api.post('/plan/generate', payload);
  return response.data;
};

// Image Generation
export const generateImage = async (apiKey, spec, customPrompt = null) => {
  const response = await api.post('/image/generate', {
    api_key: apiKey,
    spec,
    custom_prompt: customPrompt,
  });
  return response.data;
};

// File Download
export const getFileUrl = (filename) => {
  return `${API_BASE_URL}/files/${filename}`;
};

export const downloadFile = async (filename) => {
  const response = await api.get(`/files/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
};

// Export
export const exportFile = async (format, imagePath) => {
  const response = await api.post(`/export/${format}`, {
    image_path: imagePath,
  }, {
    responseType: 'blob',
  });
  return response.data;
};

export default api;
