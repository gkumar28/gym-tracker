import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface SuccessBannerProps {
  message: string;
  visible: boolean;
}

export default function SuccessBanner({ message, visible }: SuccessBannerProps) {
  const theme = useTheme();
  
  if (!visible) return null;
  
  return (
    <View 
      style={{
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
      }}
    >
      <Text 
        style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        ✅ {message}
      </Text>
    </View>
  );
}
