import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { debounce } from 'lodash';

type SessionListRouteProp = {
  params?: {
    workoutId?: string;
  };
};

type SessionListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SessionList'>;

export default function SessionList() {
  const route = useRoute() as SessionListRouteProp;
  const navigation = useNavigation<SessionListNavigationProp>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const debouncedLoadSessions = debounce(() => {
    loadSessions();
  }, 300);

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
    debouncedLoadSessions();
  }, [route.params?.workoutId]);

  const handleRefresh = async () => {
    await execute(async () => {
      debouncedLoadSessions();
      return Promise.resolve();
    });
  };

  const navigateToWorkout = (workoutId?: string) => {
    if (workoutId) {
      navigation.navigate('WorkoutDetail', { id: workoutId });
    }
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

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
        {route.params?.workoutId 
          ? `Sessions for Workout ${route.params.workoutId}`
          : 'All Sessions'
        }
      </Text>
      <FlatList
        data={sessions ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title 
              title={`Session ${item.id}`}
              subtitle={item.workout?.name || 'Unknown Workout'}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="arrow-right"
                  onPress={() => navigateToWorkout(item.workoutId)}
                  size={20}
                />
              )}
            />
            <Card.Content>
              <Text>{new Date(item.sessionDate).toLocaleString()}</Text>
              {item.workout && (
                <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                  {item.workout.sets?.length || 0} exercises
                </Text>
              )}
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="text" 
                onPress={() => navigateToWorkout(item.workoutId)}
                compact
              >
                View Workout
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 16, color: theme.textSecondary }}>
              {route.params?.workoutId 
                ? 'No sessions found for this workout'
                : 'No sessions found'
              }
            </Text>
          </View>
        }
      />
    </View>
  );
}
