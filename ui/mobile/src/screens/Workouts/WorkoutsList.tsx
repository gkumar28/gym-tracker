import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import WorkoutCard from '../../components/WorkoutCard';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useApiCall } from '../../hooks/useApiCall';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutsList'>;

export default function WorkoutsList() {
  const { data, isLoading, isError } = useWorkouts();
  const navigation = useNavigation<NavProp>();
  const theme = useTheme();
  const { execute, error, reset } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const handleRefresh = async () => {
    await execute(async () => {
      // Trigger refetch by invalidating the query
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

  if (!data || data.length === 0) return <Text style={{ fontSize: 18, fontWeight: '600', padding: 16 }}>Workout not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
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
