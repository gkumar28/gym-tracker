import { useColorScheme } from 'react-native';
import Constants from 'expo-constants';
import { getThemeForPlatform, ThemeConfig } from '../theme/theme';

export const useTheme = (): ThemeConfig => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Check for external theme configuration
  const externalTheme = Constants.expoConfig?.extra?.theme;
  
  if (externalTheme) {
    return externalTheme as ThemeConfig;
  }
  
  return getThemeForPlatform(isDark);
};
