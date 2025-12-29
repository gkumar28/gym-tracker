// src/services/api.ts
import axios, { AxiosInstance } from 'axios';
import { ConfigProvider } from '../config/configProvider';
import { API_CONSTANTS } from '../constants/constants';
import { NetworkErrorHandler } from '../utils/networkErrorHandler';

const config = ConfigProvider.getInstance();

// Base API instance for general endpoints
export const baseApi: AxiosInstance = axios.create({
  baseURL: config.getApiConfig().baseUrl,
  timeout: config.getApiConfig().timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exercise-specific API instance
export const exerciseApi: AxiosInstance = axios.create({
  baseURL: `${config.getApiConfig().baseUrl}${API_CONSTANTS.EXERCISE_ENDPOINT}`,
  timeout: config.getApiConfig().timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors to both instances
[baseApi, exerciseApi].forEach(api => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      if (ConfigProvider.getInstance().getFeatureFlags().enableLogging) {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor with retry logic
  api.interceptors.response.use(
    (response) => {
      if (ConfigProvider.getInstance().getFeatureFlags().enableLogging) {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      
      // Check if it's a network error
      if (NetworkErrorHandler.isNetworkError(error)) {
        console.log('🚫 Network error detected:', NetworkErrorHandler.getErrorMessage(error));
        return Promise.reject(error);
      }
      
      // Retry logic for non-network errors
      if (!originalRequest._retry && originalRequest._retryCount < config.getApiConfig().retryAttempts) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        
        console.log(`🔄 Retrying request (${originalRequest._retryCount}/${config.getApiConfig().retryAttempts})`);
        
        // Exponential backoff
        const delay = Math.pow(2, originalRequest._retryCount) * 1000;
        await new Promise<void>(resolve => setTimeout(resolve, delay));
        
        return api(originalRequest);
      }
      
      return Promise.reject(error);
    }
  );
});
