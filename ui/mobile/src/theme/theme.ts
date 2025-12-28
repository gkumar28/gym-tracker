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
  primary: '#6366f1',
  secondary: '#8b5cf6',
  background: '#f1f5f9',
  surface: '#ffffff',
  accent: '#06b6d4',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const darkTheme: ThemeConfig = {
  primary: '#818cf8',
  secondary: '#a78bfa',
  background: '#0f172a',
  surface: '#1e293b',
  accent: '#22d3ee',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
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
