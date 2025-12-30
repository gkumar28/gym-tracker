import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { WorkoutExercise, WorkoutSet } from '../types/workout';
import ExerciseSearch from './ExerciseSearch';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  onUpdate: (exerciseId: string, updates: Partial<WorkoutExercise>) => void;
  onRemove: (exerciseId: string) => void;
}

export default function ExerciseCard({ exercise, index, onUpdate, onRemove }: ExerciseCardProps) {
  const theme = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  const addSet = () => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      reps: 8,
      weight: 50,
      restSeconds: 60
    };
    onUpdate(exercise.id, {
      sets: [...exercise.sets, newSet]
    });
  };

  const updateSet = (setId: string, updates: Partial<WorkoutSet>) => {
    onUpdate(exercise.id, {
      sets: exercise.sets.map(set => 
        set.id === setId ? { ...set, ...updates } : set
      )
    });
  };

  const removeSet = (setId: string) => {
    if (exercise.sets.length > 1) {
      onUpdate(exercise.id, {
        sets: exercise.sets.filter(set => set.id !== setId)
      });
    }
  };

  return (
    <Card style={{ 
      marginBottom: 16, 
      backgroundColor: theme.surface, 
      borderColor: theme.border, 
      borderWidth: 1 
    }}>
      <Card.Title 
        title={`Exercise ${index + 1}`}
        subtitle={exercise.name || 'Untitled Exercise'}
        right={() => (
          <IconButton 
            icon="delete" 
            onPress={() => onRemove(exercise.id)}
            iconColor={theme.error}
          />
        )}
        titleStyle={{ color: theme.text }}
        subtitleStyle={{ color: theme.textSecondary }}
      />
      
      <Card.Content>
        {/* Exercise Name */}
        <TouchableOpacity 
          onPress={() => setShowSearch(true)}
          style={{ marginBottom: 16 }}
        >
          <TextInput
            label="Exercise Name"
            value={exercise.name}
            editable={false}
            style={{ backgroundColor: theme.surface }}
            textColor={theme.text}
            cursorColor={theme.primary}
            selectionColor={theme.primary}
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
            mode="outlined"
            right={
              <TextInput.Icon 
                icon="magnify" 
                color={theme.textSecondary}
                onPress={() => setShowSearch(true)}
              />
            }
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
        </TouchableOpacity>

        {/* Sets Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '600', 
            color: theme.text, 
            marginBottom: 8 
          }}>
            Sets
          </Text>
          
          {exercise.sets.map((set, setIndex) => (
            <View key={set.id} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 8,
              backgroundColor: theme.background,
              padding: 8,
              borderRadius: 8
            }}>
              <Text style={{ 
                color: theme.textSecondary, 
                marginRight: 8, 
                minWidth: 40 
              }}>
                {setIndex + 1}
              </Text>
              
              <TextInput
                label="Reps"
                value={set.reps.toString()}
                onChangeText={(reps) => updateSet(set.id, { reps: Number(reps) || 0 })}
                keyboardType="numeric"
                style={{ 
                  flex: 1, 
                  marginRight: 8, 
                  backgroundColor: theme.surface,
                  height: 40
                }}
                dense
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
              
              <TextInput
                label="Weight (kg)"
                value={set.weight.toString()}
                onChangeText={(weight) => updateSet(set.id, { weight: Number(weight) || 0 })}
                keyboardType="numeric"
                style={{ 
                  flex: 1, 
                  marginRight: 8, 
                  backgroundColor: theme.surface,
                  height: 40
                }}
                dense
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
              
              <TextInput
                label="Rest (s)"
                value={set.restSeconds.toString()}
                onChangeText={(restSeconds) => updateSet(set.id, { restSeconds: Number(restSeconds) || 0 })}
                keyboardType="numeric"
                style={{ 
                  flex: 1, 
                  marginRight: 8, 
                  backgroundColor: theme.surface,
                  height: 40
                }}
                dense
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
              
              {exercise.sets.length > 1 && (
                <IconButton
                  icon="delete"
                  onPress={() => removeSet(set.id)}
                  size={20}
                  iconColor={theme.error}
                />
              )}
            </View>
          ))}
          
          <Button 
            mode="text" 
            onPress={addSet}
            textColor={theme.primary}
            style={{ alignSelf: 'flex-start' }}
          >
            + Add Set
          </Button>
        </View>
      </Card.Content>
      
      <ExerciseSearch
        visible={showSearch}
        onDismiss={() => setShowSearch(false)}
        onSelectExercise={(exerciseName) => onUpdate(exercise.id, { name: exerciseName })}
        placeholder="Search exercises..."
      />
    </Card>
  );
}
