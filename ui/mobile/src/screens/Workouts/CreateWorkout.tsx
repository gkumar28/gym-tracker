import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, IconButton, Card } from 'react-native-paper';
import { workoutService } from '../../services/workoutService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import ExerciseCard from '../../components/ExerciseCard';
import SuccessBanner from '../../components/SuccessBanner';
import { WorkoutExercise, WorkoutSet } from '../../types/workout';

export default function CreateWorkout() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CreateWorkout'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const [workoutName, setWorkoutName] = useState<string>('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      id: Date.now().toString(),
      name: '',
      sets: [{ id: Date.now().toString(), reps: 8, weight: 50, restSeconds: 60 }],
      restAfterExercise: 0  // Backend field, not shown in UI
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (exerciseId: string, updates: Partial<WorkoutExercise>) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
    ));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    // Convert to backend format
    const workoutExercises = exercises.map(exercise => ({
      exerciseName: exercise.name,
      sets: exercise.sets.map(set => ({
        reps: set.reps,
        weight: set.weight,
        restSeconds: set.restSeconds
      })),
      exerciseOrder: 0, // Will be set by index
      restAfterExerciseSeconds: exercise.restAfterExercise || 0
    }));

    // Set exercise order based on array index
    workoutExercises.forEach((exercise, index) => {
      exercise.exerciseOrder = index;
    });

    const payload = { name: workoutName, workoutExercises };
    
    setIsSaving(true);
    
    const result = await execute(async () => {
      const createdWorkout = await workoutService.createWorkout(payload);
      
      // Show success banner briefly
      setShowSuccess(true);
      
      // Hide banner and navigate after short delay
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {
          navigation.navigate('WorkoutDetail', { id: createdWorkout.id });
        }, 100);
      }, 800);
      
      return true;
    });
    
    setIsSaving(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Success Banner */}
      <SuccessBanner 
        message="Workout created successfully!" 
        visible={showSuccess} 
      />
      
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ padding: 16 }}>
        {/* Workout Name Section */}
        <Card style={{ marginBottom: 16, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
          <Card.Content>
            <TextInput 
              label="Workout Name" 
              value={workoutName}
              onChangeText={setWorkoutName}
              style={{ backgroundColor: theme.surface }}
              textColor={theme.text}
              cursorColor={theme.primary}
              selectionColor={theme.primary}
              activeOutlineColor={theme.primary}
              outlineColor={theme.border}
              mode="outlined"
              theme={{
                colors: {
                  text: theme.text,
                  placeholder: theme.textSecondary,
                  primary: theme.primary,
                  background: theme.surface,
                  surface: theme.surface,
                  onSurface: theme.text,
                  outline: theme.border,
                }
              }}
            />
          </Card.Content>
        </Card>

        {/* Exercises Section */}
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
          loading={isSaving}
          disabled={!workoutName.trim() || exercises.length === 0}
          style={{ marginTop: 16 }}
          buttonColor={theme.primary}
          textColor={theme.background}
        >
          Save Workout
        </Button>
      </View>
      </ScrollView>
    </View>
  );
}
