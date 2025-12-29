import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';

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
  const [isLoading, setIsLoading] = useState(true);
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

  const handleRefresh = async () => {
    await execute(async () => {
      await loadWorkout();
      return Promise.resolve();
    });
  };

  if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 20 }} />;
  if (isError) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 16 }}>Failed to load workout details.</Text>
      <Button mode="contained" onPress={handleRefresh}>
        Retry
      </Button>
    </View>
  );

  if (!workout) {
    return <Text style={{ fontSize: 18, fontWeight: '600', padding: 16 }}>Workout not found</Text>
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Card style={{ marginBottom: 12 }}>
        <Card.Title title={workout.name} />
        <Card.Content>
          <Text variant="bodySmall">{workout.createdAt}</Text>
          <Text style={{ marginTop: 8 }}>{workout.sets?.length ?? 0} sets</Text>
        </Card.Content>
      </Card>

      {workout.sets?.map((s: any, idx: number) => (
        <Card key={idx} style={{ marginBottom: 8 }}>
          <Card.Content>
            <Text>{s.isRest ? 'Rest' : s.name ?? `Set ${idx + 1}`}</Text>
            {!s.isRest && <Text>Reps: {s.reps ?? '-'}</Text>}
            {!s.isRest && <Text>Weight: {s.weight ?? '-'}</Text>}
            <Text>Rest: {s.restSec ?? 0} sec</Text>
          </Card.Content>
        </Card>
      ))}

      <Button mode="contained" onPress={() => nav.navigate('CreateWorkout')} style={{ marginTop: 12 }}>
        Edit / Create New
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => nav.navigate('SessionList', { workoutId: route.params.id })} 
        style={{ marginTop: 12 }}
      >
        View Sessions
      </Button>
    </ScrollView>
  );
}
