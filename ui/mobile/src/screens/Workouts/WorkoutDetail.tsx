import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, FAB } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorComponent from '../../components/ErrorComponent';
import { formatTimestamp } from '../../utils/generic';
import ViewExerciseList from '../../components/ViewExerciseCard';
import ViewExerciseCard from '../../components/ViewExerciseCard';

type WorkoutDetailRouteProp = {
  params: {
    id: string;
  };
};

export default function WorkoutDetail() {
  const route = useRoute() as WorkoutDetailRouteProp;
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList, 'WorkoutDetail'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const [workout, setWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false, show loading only during fetch
  const [isError, setIsError] = useState(false);

  const loadWorkout = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await workoutService.getWorkoutById(route.params.id);
      setWorkout(data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkout();
  }, [route.params.id]);

  useLayoutEffect(() => {
    nav.setOptions({
      title: workout?.name || "Workout Details"
    });
  }, [nav, workout]);

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: theme.background }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>Workout not found</Text>
      </View>
    );
  }

  return (
    <View style={{  flex: 1, backgroundColor: theme.background}}>
      <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        {workout.workoutExercises?.map((exercise, index) => {
        console.log(exercise);
        return (<ViewExerciseCard
          key={exercise.id}
          exercise={exercise}
          index={index}
        />)
        })}
      </View>
    </ScrollView>
    <Button 
          mode="contained" 
          onPress={() => nav.navigate('CreateSession', { workoutId: route.params.id })} 
          style={{ margin: 16, marginBottom: 8, width: 200 }}
          buttonColor={theme.success}
          textColor={theme.background}
        >
          Create Session
    </Button>

    <Button 
      mode="contained" 
      onPress={() => nav.navigate('SessionList', { workoutId: route.params.id })} 
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
      onPress={() => nav.navigate('CreateWorkout')}
    />
    </View>
  );
}
