import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, FAB } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorComponent from '../../components/ErrorComponent';
import ViewExerciseCard from '../../components/ViewExerciseCard';
import ViewRestCard from '../../components/ViewRestCard';
import { Workout } from '../../types/workout';

export type WorkoutDetailProps = {
  id: number;
}

export default function WorkoutDetail({ id }: WorkoutDetailProps) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList, 'WorkoutDetail'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const [workout, setWorkout] = useState<Workout>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false, show loading only during fetch
  const [isError, setIsError] = useState(false);

  const loadWorkout = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await workoutService.getWorkoutById(id);
      setWorkout(data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkout();
  }, [id]);

  const handleRefresh = async () => {
    await execute(async () => {
      await loadWorkout();
      return Promise.resolve();
    });
  };

  if (isLoading || !workout) return (
    <LoadingComponent />
  );
  if (isError) return (
    <ErrorComponent message='Failed to load workout details' />
  );

  if (!workout) {
    return (
      <ErrorComponent message='Workout Not Found' />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background}}>
      <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
      {workout.workoutItems?.map((item, index) => (
        <React.Fragment>
          {item.type === "EXERCISE" && <ViewExerciseCard
            key={`key-${index}`}
            exercise={item.data}
            index={index}
          />}

          {item.type === "REST" && (
            <ViewRestCard
              value={item.data?.restAfterExercise || 0}
            />
          )}
        </React.Fragment>
      ))}
      </View>
    </ScrollView>
    <Button 
          mode="contained" 
          onPress={() => nav.navigate('CreateSession', { workoutId: id })} 
          style={{ margin: 16, marginBottom: 8, width: 200 }}
          buttonColor={theme.primary}
          textColor={theme.background}
        >
          Create Session
    </Button>

    <Button 
      mode="contained" 
      onPress={() => nav.navigate('SessionList', { workoutId: id })} 
      style={{ margin: 16, marginTop: 8, width: 200 }}
      buttonColor={theme.primary}
      textColor={theme.background}
    >
      View Sessions
    </Button>
    <FAB
      icon="pencil"
      color={theme.background}
      style={{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.primary,
      }}
      onPress={() => nav.navigate('UpdateWorkout', { workout: workout})}
    />
    </View>
  );
}
