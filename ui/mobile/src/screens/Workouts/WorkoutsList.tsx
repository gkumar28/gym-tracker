import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import WorkoutCard from '../../components/WorkoutCard';
import { useWorkouts } from '../../hooks/useWorkouts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutsList'>;

export default function WorkoutsList() {
  const { data, isLoading, isError } = useWorkouts();
  const navigation = useNavigation<NavProp>();

  if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 20 }} />;
  if (isError) return <Text style={{ margin: 16 }}>Failed to load workouts.</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data ?? []}
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
