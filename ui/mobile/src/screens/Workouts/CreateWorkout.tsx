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
import { WorkouteRestAfterExercise, WorkoutExercise, WorkoutItem, WorkoutSet } from '../../types/workout';
import RestCard from '../../components/RestCard';
import { toast } from 'react-toastify';

export default function CreateWorkout() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CreateWorkout'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const [workoutName, setWorkoutName] = useState<string>('');
  const [items, setItems] = useState<WorkoutItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addExercise = () => {
    const newExercise: WorkoutExercise = {
      exerciseName: '',
      sets: [{ reps: 8, weight: 50, restSeconds: 60 }],
    };

    const rest: WorkouteRestAfterExercise = {
      restAfterExercise: 60
    }

    if (items.length == 0) {
      setItems([{ type: 'EXERCISE', data: newExercise }]);
    }
    else {
      setItems([...items, 
        { type: "REST", data: rest}, 
        { type: "EXERCISE", data: newExercise}]);
    }
  };

  const updateExercise = (index: number, updates: Partial<WorkoutExercise>) => {
    setItems(items.map((item, id) => 
      id == index && item.type == "EXERCISE" ? { type: item.type, data: { ...item.data, ...updates }} : item
    ));
  };

  const removeExercise = (index: number) => {

    setItems(items => {
      return items.filter((_, id) => {
        if (index === items.length - 1) {
          // Last item → remove index and previous
          return id !== index && id !== index - 1;
        } else {
          // Normal case → remove index and next
          return id !== index && id !== index + 1;
        }
      });
    });
  };

  const handleSave = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    // Convert to backend format
    const workoutExercises = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
    
      if (item.type === 'EXERCISE') {
        let restAfter = 0;
        const nextItem = items[i + 1];
        if (nextItem && nextItem.type === "REST") {
          restAfter = nextItem.data.restAfterExercise;
        }
    
        workoutExercises.push({
          exerciseName: item.data.exerciseName,
          sets: item.data.sets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            restSeconds: set.restSeconds,
          })),
          restAfterExerciseSeconds: restAfter,
        });
      }
    }

    // Set exercise order based on array index
    workoutExercises.forEach((exercise, index) => {
      exercise.exerciseOrder = index;
    });

    const payload = { name: workoutName, workoutExercises };
    
    setIsSaving(true);
    
    const result = await execute(async () => {
      let workout;
    
      try {
        workout = await workoutService.createWorkout(payload);
        toast.success("Workout Created Successfully!");
      } catch (error) {
        const message = error?.message || "Some error has occurred. Please try again later";
        toast.error(message);
        workout = undefined;
      }
    
      setTimeout(() => {
        if (workout) {
          // Navigate to WorkoutDetail (stack index 1)
          navigation.reset({
            index: 1,
            routes: [
              { name: "WorkoutsList" },
              { name: "WorkoutDetail", params: { id: workout.id } }
            ]
          });
        } else {
          // Navigate only to WorkoutsList (stack index 0)
          navigation.reset({
            index: 0,
            routes: [{ name: "WorkoutsList" }]
          });
        }
      }, 1000);
    
      return !!workout; 
    });    
    
    setIsSaving(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      
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
          
          {items.map((item, index) => {
            if (item.type === "EXERCISE") {
              return (
                <ExerciseCard
                  key={`key-${index}`}
                  exercise={item.data}
                  index={index}
                  onUpdate={updateExercise}
                  onRemove={removeExercise}
                />
              );
            }

            if (item.type === "REST") {
              return (
                <RestCard
                  key={`key-${index}`}
                  value={item.data.restAfterExercise}
                  onChange={(val) => {
                    setItems(items.map((it, i) =>
                      i === index && it.type === "REST"
                        ? { ...it, data: { restAfterExercise: val } }
                        : it
                    ));
                  }}
                />
              );
            }
          })}
          
          {items.length === 0 && (
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
          disabled={!workoutName.trim() || items.length === 0}
          style={{ marginTop: 16 }}
          buttonColor={theme.primary}
          textColor={theme.background}
          theme={{
            colors: {
              primary: theme.primary,
              surfaceDisabled: theme.border,
              onSurfaceDisabled: theme.textSecondary
            }
          }}
        >
          Save Workout
        </Button>
      </View>
      </ScrollView>
    </View>
  );
}
