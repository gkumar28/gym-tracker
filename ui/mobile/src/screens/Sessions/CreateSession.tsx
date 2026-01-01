import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { 
  TextInput,
  Button,
  Card,
  Text,
  IconButton,
  Portal,
  Modal,
  Searchbar,
  Chip
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { sessionService } from '../../services/sessionService';
import { workoutService } from '../../services/workoutService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import { debounce } from 'lodash';
import ExerciseCard from '../../components/ExerciseCard';
import { WorkoutExercise, WorkoutSet } from '../../types/workout';

type CreateSessionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateSession'>;

export default function CreateSession() {
  const navigation = useNavigation<CreateSessionNavigationProp>();
  const route = useRoute();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [workoutDetails, setWorkoutDetails] = useState<any>(null);
  
  // Workout selection state
  const [workoutId, setWorkoutId] = useState<string | null>((route.params as any)?.workoutId || null);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [showWorkoutSearch, setShowWorkoutSearch] = useState(false);
  const [workoutSearchQuery, setWorkoutSearchQuery] = useState('');
  const [workoutSearchResults, setWorkoutSearchResults] = useState<any[]>([]);

  // Check if we're coming from workout detail (workoutId is pre-filled)
  const isFromWorkoutDetail = !!((route.params as any)?.workoutId);

  // Search workouts
  const debouncedSearchWorkouts = debounce(async (query: string) => {
    if (query.trim()) {
      try {
        const response = await workoutService.searchWorkouts({
          name: query,
          page: 0,
          size: 10
        });
        setWorkoutSearchResults(response.items);
      } catch (error) {
        console.error('Failed to search workouts:', error);
      }
    } else {
      setWorkoutSearchResults([]);
    }
  }, 300);

  useEffect(() => {
    debouncedSearchWorkouts(workoutSearchQuery);
  }, [workoutSearchQuery]);

  // Fetch workout details when coming from workout detail
  useEffect(() => {
    if (isFromWorkoutDetail && workoutId) {
      const fetchWorkoutDetails = async () => {
        try {
          const workout = await workoutService.getWorkoutById(workoutId);
          setWorkoutDetails(workout);
        } catch (error) {
          console.error('Failed to fetch workout details:', error);
        }
      };
      fetchWorkoutDetails();
    }
  }, [isFromWorkoutDetail, workoutId]);

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: '',
      sets: [{ id: Date.now().toString(), reps: 0, weight: 0, restSeconds: 60 }],
      restAfterExercise: 0
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(prevExercises => prevExercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (exerciseId: string, updates: Partial<WorkoutExercise>) => {
    setExercises(prevExercises => 
      prevExercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      )
    );
  };

  const selectWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setWorkoutId(workout.id);
    setShowWorkoutSearch(false);
    setWorkoutSearchQuery('');
    setWorkoutSearchResults([]);
  };

  const handleSave = async () => {
    if (!workoutId) {
      Alert.alert('Error', 'Please select a workout');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    // Convert to backend format
    const sessionExercises = exercises.map(exercise => ({
      exerciseName: exercise.name,
      sets: exercise.sets.map(set => ({
        reps: set.reps,
        weight: set.weight,
        restSeconds: set.restSeconds,
        notes: set.notes
      })),
      exerciseOrder: 0, // Will be set by index
      restAfterExerciseSeconds: exercise.restAfterExercise || 0
    }));

    // Set exercise order based on array index
    sessionExercises.forEach((exercise, index) => {
      exercise.exerciseOrder = index;
    });

    const payload = { 
      workoutId,
      sessionDate: new Date(sessionDate).toISOString(),
      durationMinutes: parseInt(durationMinutes) || undefined,
      notes: notes.trim() || undefined,
      sessionExercises 
    };
    
    setIsSaving(true);
    
    const result = await execute(async () => {
      const createdSession = await sessionService.createSession(payload);
      
      // Show success banner briefly
      setShowSuccess(true);
      
      // Hide banner and navigate after short delay
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {
          // Navigate to session list
          navigation.navigate('SessionList');
        }, 100);
      }, 800);
      
      return true;
    });
    
    setIsSaving(false);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Success Banner */}
        {showSuccess && (
          <View style={{
            backgroundColor: theme.success,
            padding: 16,
            alignItems: 'center',
          }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              Session created successfully!
            </Text>
          </View>
        )}

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: theme.text }}>
            {isFromWorkoutDetail && workoutDetails 
              ? `Create Session for ${workoutDetails.name}` 
              : 'Create Session'
            }
          </Text>

          {/* Workout Selection - Only show if not from workout detail */}
          {!isFromWorkoutDetail && (
            <Card style={{ marginBottom: 16, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
              <Card.Content>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: theme.text }}>
                  Workout
                </Text>
                
                {selectedWorkout ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, color: theme.text }}>{selectedWorkout.name}</Text>
                    <IconButton
                      icon="close"
                      onPress={() => {
                        setSelectedWorkout(null);
                        setWorkoutId(null);
                      }}
                    />
                  </View>
                ) : (
                  <Searchbar
                    placeholder="Search workout..."
                    value={workoutSearchQuery}
                    onChangeText={setWorkoutSearchQuery}
                    onFocus={() => setShowWorkoutSearch(true)}
                    style={{ backgroundColor: theme.background, borderColor: theme.border }}
                  />
                )}

                {/* Workout Search Results */}
                {showWorkoutSearch && workoutSearchResults.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    {workoutSearchResults.map((workout) => (
                      <Chip
                        key={workout.id}
                        onPress={() => selectWorkout(workout)}
                        style={{ 
                          marginBottom: 4,
                          backgroundColor: theme.primary,
                          borderColor: theme.primary,
                          borderWidth: 1
                        }}
                        textStyle={{ color: '#fff' }}
                      >
                        {workout.name}
                      </Chip>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>
          )}

          {/* Session Date */}
          <Card style={{ marginBottom: 16, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: theme.text }}>
                Session Date
              </Text>
              <TextInput
                label="Date"
                value={sessionDate}
                onChangeText={setSessionDate}
                mode="outlined"
                style={{ backgroundColor: theme.background }}
              />
            </Card.Content>
          </Card>

          {/* Duration */}
          <Card style={{ marginBottom: 16, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: theme.text }}>
                Duration (minutes)
              </Text>
              <TextInput
                label="Duration"
                value={durationMinutes}
                onChangeText={setDurationMinutes}
                mode="outlined"
                keyboardType="numeric"
                style={{ backgroundColor: theme.background }}
              />
            </Card.Content>
          </Card>

          {/* Notes */}
          <Card style={{ marginBottom: 16, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
            <Card.Content>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 12, color: theme.text }}>
                Notes
              </Text>
              <TextInput
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={{ backgroundColor: theme.background }}
              />
            </Card.Content>
          </Card>

          {/* Exercises */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: '600', 
              color: theme.text, 
              marginBottom: 12,
              letterSpacing: 1
            }}>
              EXERCISES
            </Text>
            
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                onUpdate={updateExercise}
                onRemove={removeExercise}
              />
            ))}
            
            {exercises.length === 0 && (
              <View style={{ 
                alignItems: 'center', 
                padding: 32, 
                backgroundColor: theme.surface,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
                borderStyle: 'dashed'
              }}>
                <Text style={{ color: theme.textSecondary, marginBottom: 8 }}>
                  No exercises yet
                </Text>
                <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Add your first exercise to get started
                </Text>
              </View>
            )}
            
            <Button 
              mode="outlined" 
              onPress={addExercise}
              style={{ marginTop: 12 }}
              textColor={theme.primary}
            >
              + Add Exercise
            </Button>
          </View>

          {/* Save Button */}
          <Button
            mode="contained"
            onPress={handleSave}
            disabled={isSaving}
            loading={isSaving}
            style={{ marginBottom: 32 }}
          >
            {isSaving ? 'Creating...' : 'Create Session'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
