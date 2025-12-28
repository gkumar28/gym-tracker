import React, { useState } from 'react';
import { View, StyleSheet, DrawerLayoutAndroid } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { useTheme } from './src/hooks/useTheme';
import { createPaperTheme } from './src/theme/theme';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AppHeader from './src/components/AppHeader';
import DrawerContent from './src/components/DrawerContent';

const queryClient = new QueryClient();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function AppContent() {
  const theme = useTheme();
  const paperTheme = createPaperTheme(theme);

  return (
    <PaperProvider theme={paperTheme}>
      <NavigationContainer>
        <View style={styles.container}>
          <AppHeader onMenuPress={() => console.log('Menu pressed')} />
          <RootNavigator />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
