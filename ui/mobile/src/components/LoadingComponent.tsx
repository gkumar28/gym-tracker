import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

export default function LoadingComponent() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background
      }}
    >
      <ActivityIndicator
        animating
        size="large"
        color={theme.primary}
      />
    </View>
  );
}