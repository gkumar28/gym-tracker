// src/config/envLoader.ts
import Constants from 'expo-constants';

// Declare process for Metro bundler environment variables
declare const process: {
  env: {
    API_URL?: string;
    API_TIMEOUT?: string;
    API_RETRY_ATTEMPTS?: string;
    ENABLE_MOCK_DATA?: string;
    ENABLE_LOGGING?: string;
    ENABLE_ANALYTICS?: string;
    NODE_ENV?: string;
  };
} | undefined;

export class EnvLoader {
  static loadEnvVars(): Record<string, string | undefined> {
    // Primary source: process.env (Metro bundler)
    const processEnv = typeof process !== 'undefined' && process.env ? {
      API_URL: process.env.API_URL,
      API_TIMEOUT: process.env.API_TIMEOUT,
      API_RETRY_ATTEMPTS: process.env.API_RETRY_ATTEMPTS,
      ENABLE_MOCK_DATA: process.env.ENABLE_MOCK_DATA,
      ENABLE_LOGGING: process.env.ENABLE_LOGGING,
      ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS,
      NODE_ENV: process.env.NODE_ENV,
    } : {};

    // Only use Expo Constants as fallback when process.env is completely unavailable
    // This ensures .env files are always preferred
    if (Object.keys(processEnv).length === 0) {
      const expoConstants = Constants.expoConfig?.extra || {};
      return {
        API_URL: expoConstants.apiUrl,
        API_TIMEOUT: expoConstants.apiTimeout,
        API_RETRY_ATTEMPTS: expoConstants.apiRetryAttempts,
        ENABLE_MOCK_DATA: expoConstants.enableMockData,
        ENABLE_LOGGING: expoConstants.enableLogging,
        ENABLE_ANALYTICS: expoConstants.enableAnalytics,
        NODE_ENV: expoConstants.environment || 'development',
      };
    }

    return processEnv;
  }

  static getEnvVar(key: string): string | undefined {
    const envVars = this.loadEnvVars();
    return envVars[key];
  }

  static getEnvVarAsNumber(key: string, defaultValue: number): number {
    const value = this.getEnvVar(key);
    return value ? parseInt(value, 10) : defaultValue;
  }

  static getEnvVarAsBoolean(key: string, defaultValue: boolean): boolean {
    const value = this.getEnvVar(key);
    return value ? value.toLowerCase() === 'true' : defaultValue;
  }
}
