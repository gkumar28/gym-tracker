import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import WorkoutCard from '../../components/WorkoutCard';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutsList'>;

export default function WorkoutsList() {
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await workoutService.getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleRefresh = async () => {
    await execute(async () => {
      await loadWorkouts();
      return Promise.resolve();
    });
  };

  if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 20 }} />;
  if (isError) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 16 }}>Failed to load workouts.</Text>
      <Button mode="contained" onPress={handleRefresh}>
        Retry
      </Button>
    </View>
  );

  if (!workouts || workouts.length === 0) return <Text style={{ fontSize: 18, fontWeight: '600', padding: 16 }}>Workout not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <WorkoutCard item={item} onPress={() => navigation.navigate('WorkoutDetail', { id: item.id })} />
        )}
        ListHeaderComponent={() => (
          <Button mode="contained" onPress={() => navigation.navigate('CreateWorkout')} style={{ marginBottom: 12 }}>
            Create Workout
          </Button>
        )}
      />
    </View>
  );
}
