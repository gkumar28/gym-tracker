import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import { useRoute } from '@react-navigation/native';

type SessionListRouteProp = {
  params?: {
    workoutId?: string;
  };
};

export default function SessionList() {
  const route = useRoute() as SessionListRouteProp;
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      let data;
      if (route.params?.workoutId) {
        // Load sessions for specific workout
        data = await workoutService.getSessions(route.params.workoutId);
      } else {
        // Load all sessions
        data = await workoutService.getAllSessions();
      }
      setSessions(data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [route.params?.workoutId]);

  const handleRefresh = async () => {
    await execute(async () => {
      await loadSessions();
      return Promise.resolve();
    });
  };

  if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 20 }} />;
  if (isError) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 16 }}>Failed to load sessions.</Text>
      <Button mode="contained" onPress={handleRefresh}>
        Retry
      </Button>
    </View>
  );

  // Show message when no workoutId is provided
  if (!route.params?.workoutId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 16 }}>
          All Sessions
        </Text>
        <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center', marginBottom: 16 }}>
          Navigate to a workout to see its specific sessions, or select a workout from the list below.
        </Text>
        <Button mode="contained" onPress={() => {/* Navigate to workouts */}}>
          View Workouts
        </Button>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
        Sessions for Workout {route.params.workoutId}
      </Text>
      <FlatList
        data={sessions ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title title={`Session ${item.id}`} />
            <Card.Content>
              <Text>{new Date(item.sessionDate).toLocaleString()}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 16, color: theme.textSecondary }}>
              No sessions found for this workout
            </Text>
          </View>
        }
      />
    </View>
  );
}
