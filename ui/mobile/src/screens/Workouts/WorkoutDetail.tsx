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

  const handleRefresh = async () => {
    await execute(async () => {
      await loadWorkout();
      return Promise.resolve();
    });
  };

  if (isLoading || !workout) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background }}>
      <ActivityIndicator animating={true} style={{ margin: 20 }} />
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 16 }}>Loading workout details...</Text>
    </View>
  );
  if (isError) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 16 }}>Failed to load workout details.</Text>
      <Button mode="contained" onPress={handleRefresh} buttonColor={theme.primary} textColor={theme.background}>
        Retry
      </Button>
    </View>
  );

  if (!workout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: theme.background }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>Workout not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 12, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
          <Card.Title 
            title={workout.name} 
            titleStyle={{ color: theme.text }}
          />
          <Card.Content>
            <Text variant="bodySmall" style={{ color: theme.textSecondary }}>{workout.createdAt}</Text>
            <Text style={{ marginTop: 8, color: theme.text }}>{workout.sets?.length ?? 0} sets</Text>
          </Card.Content>
        </Card>

        {workout.sets?.map((s: any, idx: number) => (
          <Card key={idx} style={{ marginBottom: 8, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
            <Card.Content>
              <Text style={{ color: theme.text, fontWeight: '600' }}>
                {s.isRest ? 'Rest' : s.name ?? `Set ${idx + 1}`}
              </Text>
              {!s.isRest && <Text style={{ color: theme.text }}>Reps: {s.reps ?? '-'}</Text>}
              {!s.isRest && <Text style={{ color: theme.text }}>Weight: {s.weight ?? '-'}</Text>}
              <Text style={{ color: theme.textSecondary }}>Rest: {s.restSec ?? 0} sec</Text>
            </Card.Content>
          </Card>
        ))}

        <Button 
          mode="contained" 
          onPress={() => nav.navigate('CreateWorkout')} 
          style={{ marginTop: 12, marginBottom: 8 }}
          buttonColor={theme.primary}
          textColor={theme.background}
        >
          Edit / Create New
        </Button>

        <Button 
          mode="outlined" 
          onPress={() => nav.navigate('SessionList', { workoutId: route.params.id })} 
          style={{ marginTop: 8 }}
          textColor={theme.primary}
        >
          View Sessions
        </Button>
      </View>
    </ScrollView>
  );
}
