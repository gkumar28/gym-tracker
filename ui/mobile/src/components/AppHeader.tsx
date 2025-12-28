import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { useThemeContext } from '../contexts/ThemeContext';
import ThemeToggleSlider from './ThemeToggleSlider';

interface AppHeaderProps {
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
  backgroundColor?: string;
  onMenuPress?: () => void;
}

export default function AppHeader({ 
  leftComponent, 
  rightComponent, 
  centerComponent, 
  backgroundColor
}: AppHeaderProps) {
  const theme = useTheme();
  const { isDark } = useThemeContext();
  const insets = useSafeAreaInsets();

  const basePaddingVertical = 14;

  const headerBackgroundColor = backgroundColor || theme.background;
  const headerIconColor = theme.text;

  const defaultLeftComponent = (
    <IconButton
      icon="menu"
      size={29}
      iconColor={headerIconColor}
    />
  );

  const defaultRightComponent = (
    <View style={styles.rightComponentContainer}>
      <ThemeToggleSlider />
      <Avatar.Text 
        size={43} 
        label="GT" 
        style={{ backgroundColor: theme.primary }} 
      />
    </View>
  );

  return (
    <View style={[
      styles.header, 
      { paddingTop: basePaddingVertical + insets.top, paddingBottom: basePaddingVertical },
      { backgroundColor: headerBackgroundColor }
    ]}>
      <View style={styles.headerContent}>
        {leftComponent || defaultLeftComponent}
        <View style={styles.flex1} />
        {centerComponent}
        <View style={styles.flex1} />
        {rightComponent || defaultRightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  rightComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
