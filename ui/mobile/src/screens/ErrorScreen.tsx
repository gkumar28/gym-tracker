import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';

interface ErrorScreenProps {
  error?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ error = 'Something went wrong', onRetry }: ErrorScreenProps) {
  const navigation = useNavigation();
  const theme = useTheme();

  const handleGoHome = () => {
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' as never }],
      });
    } catch (navError) {
      Alert.alert('Navigation Error', 'Unable to navigate to home screen. Please restart the app.');
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleGoHome();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { borderColor: theme.error }]}>
          <Text style={[styles.icon, { color: theme.error }]}>⚠️</Text>
        </View>
        
        <Text style={[styles.title, { color: theme.text }]}>
          Oops! Something went wrong
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {error}
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={handleRetry}
          >
            <Text style={[styles.buttonText, { color: '#ffffff' }]}>
              Try Again
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.homeButton, { borderColor: theme.border }]}
            onPress={handleGoHome}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  retryButton: {
    backgroundColor: '#6366f1',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
