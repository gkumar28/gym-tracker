import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import WorkoutCard from '../../components/WorkoutCard';
import { workoutService, Workout, PaginatedWorkoutResponse } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation, useRoute, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { debounce } from 'lodash';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutsList'>;

export default function WorkoutsList() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const hasHandledRefresh = useRef(false);
  const needsRefresh = useRef(false);

  const debouncedLoadWorkouts = debounce(() => {
    loadWorkouts();
  }, 300);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const response: PaginatedWorkoutResponse = await workoutService.searchWorkouts();
      setWorkouts(response.items);
      needsRefresh.current = false; // Reset refresh flag after successful load
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    debouncedLoadWorkouts();
  }, []);

  useEffect(() => {
    const params = route.params as { refresh?: boolean };
    if (params && params.refresh) {
      hasHandledRefresh.current = true;
      debouncedLoadWorkouts();
    }
  }, [route.params]);

  useEffect(() => {
    if (isFocused && needsRefresh.current) {
      debouncedLoadWorkouts(); // Only refresh if needed and screen is focused
    }
  }, [route.params, isFocused, needsRefresh.current]);

  const handleRefresh = async () => {
    await execute(async () => {
      debouncedLoadWorkouts();
      return Promise.resolve();
    });
  };

  if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 20 }} />;
  if (isError) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 16 }}>Failed to load workouts.</Text>
      <Button mode="contained" onPress={handleRefresh} buttonColor={theme.primary} textColor={theme.background}>
        Retry
      </Button>
    </View>
  );

  if (!workouts || workouts.length === 0) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>Workout not found</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <WorkoutCard item={item} onPress={() => navigation.navigate('WorkoutDetail', { id: item.id })} />
        )}
        ListHeaderComponent={() => (
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('CreateWorkout')} 
            style={{ marginBottom: 12 }}
            buttonColor={theme.primary}
            textColor={theme.background}
          >
            Create Workout
          </Button>
        )}
      />
    </View>
  );
}
