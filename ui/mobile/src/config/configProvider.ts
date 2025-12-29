// src/config/configProvider.ts
import { AppConfig } from './config';
import { EnvLoader } from './envLoader';

export class ConfigProvider {
  private static instance: ConfigProvider;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigProvider {
    if (!ConfigProvider.instance) {
      ConfigProvider.instance = new ConfigProvider();
    }
    return ConfigProvider.instance;
  }

  private loadConfig(): AppConfig {
    // Load all environment variables
    const envVars = EnvLoader.loadEnvVars();
    
    // Build configuration entirely from environment variables
    const config: AppConfig = {
      api: {
        baseUrl: envVars.API_URL || 'http://localhost:8080/api',
        timeout: EnvLoader.getEnvVarAsNumber('API_TIMEOUT', 10000),
        retryAttempts: EnvLoader.getEnvVarAsNumber('API_RETRY_ATTEMPTS', 3),
      },
      cache: {
        enabled: true, // Could be added to env if needed
        defaultTtl: 5 * 60 * 1000, // Could be added to env if needed
      },
      features: {
        enableMockData: EnvLoader.getEnvVarAsBoolean('ENABLE_MOCK_DATA', false),
        enableLogging: EnvLoader.getEnvVarAsBoolean('ENABLE_LOGGING', false),
        enableAnalytics: EnvLoader.getEnvVarAsBoolean('ENABLE_ANALYTICS', false),
      },
      ui: {
        theme: 'system', // Could be added to env if needed
        animations: true, // Could be added to env if needed
      },
    };

    return config;
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public getApiConfig() {
    return this.config.api;
  }

  public getFeatureFlags() {
    return this.config.features;
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = {
      api: { ...this.config.api, ...updates.api },
      cache: { ...this.config.cache, ...updates.cache },
      features: { ...this.config.features, ...updates.features },
      ui: { ...this.config.ui, ...updates.ui },
    };
  }
}
