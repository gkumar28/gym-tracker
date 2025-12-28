import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { useThemeContext } from '../contexts/ThemeContext';

export default function ThemeToggleSlider() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeContext();
  const [animValue] = useState(new Animated.Value(isDark ? 1 : 0));

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isDark ? 1 : 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isDark, animValue]);

  const sliderPosition = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 44],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <TouchableOpacity onPress={toggleTheme}>
        <View style={[styles.sliderTrack, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.sliderThumb,
              {
                backgroundColor: theme.primary,
                transform: [{ translateX: sliderPosition }],
              },
            ]}
          >
            <IconButton
              icon={isDark ? "moon-waxing-crescent" : "white-balance-sunny"}
              size={16}
              iconColor="#ffffff"
              onPress={toggleTheme}
              style={styles.thumbIcon}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  sliderTrack: {
    width: 60,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 8,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    top: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbIcon: {
    margin: 0,
    padding: 0,
  },
});
