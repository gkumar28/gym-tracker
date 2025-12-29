import { Platform, Dimensions } from 'react-native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper/lib/typescript/types';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

export interface ResponsiveConfig {
  breakpoints: Breakpoints;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  maxWidth: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export const lightTheme: ThemeConfig = {
  primary: '#2563eb',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  accent: '#0284c7',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const darkTheme: ThemeConfig = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  background: '#111827',
  surface: '#1f2937',
  accent: '#0ea5e9',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  border: '#374151',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const platformThemes = {
  ios: {
    light: { ...lightTheme, primary: '#007AFF', secondary: '#5856D6' },
    dark: { ...darkTheme, primary: '#0A84FF', secondary: '#5E5CE6' },
  },
  android: {
    light: { ...lightTheme, primary: '#6200EE', secondary: '#03DAC6' },
    dark: { ...darkTheme, primary: '#BB86FC', secondary: '#03DAC6' },
  },
};

export const createPaperTheme = (config: ThemeConfig): MD3Theme => ({
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: config.primary,
    secondary: config.secondary,
    background: config.background,
    surface: config.surface,
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: config.text,
    onSurface: config.text,
    outline: config.border,
  },
});

export const responsiveConfig: ResponsiveConfig = {
  breakpoints: {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  maxWidth: {
    mobile: 767,
    tablet: 1023,
    desktop: 1200,
  },
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const { width } = Dimensions.get('window');
  if (width >= responsiveConfig.breakpoints.desktop) return 'desktop';
  if (width >= responsiveConfig.breakpoints.tablet) return 'tablet';
  return 'mobile';
};

export const getThemeForPlatform = (isDark: boolean = false): ThemeConfig => {
  const platform = Platform.OS as 'ios' | 'android';
  const themeVariant = isDark ? 'dark' : 'light';
  
  return platformThemes[platform]?.[themeVariant] || 
         (isDark ? darkTheme : lightTheme);
};

export const useResponsiveValue = <T>(values: Partial<Record<'mobile' | 'tablet' | 'desktop', T>>): T => {
  const deviceType = getDeviceType();
  return values[deviceType] || values.mobile || (Object.values(values)[0] as T);
};
