import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import {
  Card,
  Text,
  Button,
  ActivityIndicator,
  IconButton,
  Searchbar,
  FAB
} from 'react-native-paper';
import { workoutService, Workout, PaginatedWorkoutResponse } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { debounce } from 'lodash';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorComponent from '../../components/ErrorComponent';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';

type WorkoutListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WorkoutsList'>;

export default function WorkoutsList() {

  const navigation = useNavigation<WorkoutListNavigationProp>();
  const theme = useTheme();

  const { execute } = useApiCall({
    showNetworkErrorScreen: true
  });

  const [workouts, setWorkouts] = useState<PaginatedWorkoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const debouncedLoadWorkouts = debounce((searchQuery: string) => {
    loadWorkouts(searchQuery);
  }, 300);

  const loadWorkouts = async (searchQuery: string) => {
    try {

      setIsLoading(true);
      setIsError(false);

      const data = await workoutService.searchWorkouts({
        name: searchQuery,
        createdDateFrom: selectedDateFrom,
        createdDateTo: selectedDateTo
      });

      setWorkouts(data);

    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    debouncedLoadWorkouts(searchQuery);
  }, [searchQuery]);

  const handleRefresh = async () => {
    await execute(async () => {
      debouncedLoadWorkouts(searchQuery);
      return Promise.resolve();
    });
  };

  const navigateToWorkout = (id: string) => {
    navigation.navigate('WorkoutDetail', { id });
  };

  const navigateToCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  if (isLoading && !workouts) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent message='No Workouts found'/>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

    {/* Search */}
    <View style={{ 
        padding: 16, 
        paddingBottom: 8,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.border
      }}>
      <Searchbar
        placeholder="Search workouts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        loading={isLoading}
        style={{
          marginBottom: 8,
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderColor: theme.border 
        }}
        inputStyle={{ color: theme.text }}
        placeholderTextColor={theme.textSecondary}
        iconColor={theme.primary}
      />
    </View>

    {/* Workout List */}
    <View style={{ padding: 16 }}>

      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 16,
          color: theme.text
        }}
      >
        Recent Workouts
      </Text>

      <FlatList
        data={workouts?.items || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            style={{
              marginBottom: 8,
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1
            }}
          >
            <Card.Title
              title={item.name}
              subtitle={`${item.workoutExercises?.length || 0} exercises`}
            />

            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigateToWorkout(item.id)}
                buttonColor={theme.primary}
                compact
              >
                View Workout
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              padding: 20
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: theme.textSecondary
              }}
            >
              No workouts found
            </Text>
          </View>
        }
      />
    </View>

    {/* Create Workout FAB */}
    <FAB
      icon="plus"
      color={theme.background}
      style={{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.primary,
      }}
      onPress={navigateToCreateWorkout}
    />

    </View>
  );
}