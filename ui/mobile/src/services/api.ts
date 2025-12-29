// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import { ConfigProvider } from '../config/configProvider';
import { API_CONSTANTS } from '../constants/constants';

const config = ConfigProvider.getInstance();

export const exerciseApi: AxiosInstance = axios.create({
  baseURL: `${config.getApiConfig().baseUrl}${API_CONSTANTS.EXERCISE_ENDPOINT}`,
  timeout: config.getApiConfig().timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
exerciseApi.interceptors.request.use(
  (config) => {
    if (ConfigProvider.getInstance().getFeatureFlags().enableLogging) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
exerciseApi.interceptors.response.use(
  (response) => {
    if (ConfigProvider.getInstance().getFeatureFlags().enableLogging) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Retry logic
    if (!originalRequest._retry && originalRequest._retryCount < config.getApiConfig().retryAttempts) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      console.log(`🔄 Retrying request (${originalRequest._retryCount}/${config.getApiConfig().retryAttempts})`);
      
      // Exponential backoff
      const delay = Math.pow(2, originalRequest._retryCount) * 1000;
      await new Promise<void>(resolve => setTimeout(resolve, delay));
      
      return exerciseApi(originalRequest);
    }
    
    return Promise.reject(error);
  }
);
