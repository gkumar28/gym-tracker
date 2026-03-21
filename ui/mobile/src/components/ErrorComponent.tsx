import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorComponent({ message, onRetry }: Props) {

  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.background
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: theme.error,
          marginBottom: 16
        }}
      >
        {message || "Something went wrong"}
      </Text>

      {onRetry && (
        <Button mode="contained" onPress={onRetry}>
          Retry
        </Button>
      )}
    </View>
  );
}