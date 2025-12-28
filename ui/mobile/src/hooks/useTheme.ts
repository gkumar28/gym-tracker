import { useColorScheme } from 'react-native';
import Constants from 'expo-constants';
import { getThemeForPlatform, ThemeConfig } from '../theme/theme';
import { useThemeContext } from '../contexts/ThemeContext';

export const useTheme = (): ThemeConfig => {
  // Try to use context first
  try {
    const contextTheme = useThemeContext();
    if (contextTheme) {
      return contextTheme.theme;
    }
  } catch (error) {
    // Context not available, fallback to original behavior
  }

  // Fallback to original behavior
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Check for external theme configuration
  const externalTheme = Constants.expoConfig?.extra?.theme;
  
  if (externalTheme) {
    return externalTheme as ThemeConfig;
  }
  
  return getThemeForPlatform(isDark);
};
