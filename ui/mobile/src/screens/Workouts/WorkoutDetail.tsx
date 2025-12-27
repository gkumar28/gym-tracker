import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useWorkouts } from '../../hooks/useWorkouts';

type WorkoutDetailRouteProp = {
  params: {
    id: string;
  };
};

export default function WorkoutDetail() {
  const route = useRoute() as WorkoutDetailRouteProp;
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList, 'WorkoutDetail'>>();
  const { data } = useWorkouts();

  const workout = data?.find((w) => w.id === route.params.id);

  if (!workout) {
    return <Text style={{ padding: 16 }}>Workout not found</Text>;
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
    </ScrollView>
  );
}
