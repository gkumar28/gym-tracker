// src/config/config.ts
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  cache: {
    enabled: boolean;
    defaultTtl: number;
  };
  features: {
    enableLogging: boolean;
    enableAnalytics: boolean;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    animations: boolean;
  };
}
