import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import ExerciseSearch from './ExerciseSearch';
import { ExerciseSet, Set } from '../types/common';

interface ExerciseCardProps {
  exercise: ExerciseSet;
  index: number;
  onUpdate: (exerciseId: number, updates: Partial<ExerciseSet>) => void;
  onRemove: (exerciseId: number) => void;
}

export default function ExerciseCard({ exercise, index, onUpdate, onRemove }: ExerciseCardProps) {
  const theme = useTheme();
  const [showSearch, setShowSearch] = useState(false);

  const addSet = () => {
    const newSet: Set = {
      id: Date.now().toString(),
      reps: 8,
      weight: 50,
      restSeconds: 60
    };
    onUpdate(index, {
      sets: [...exercise.sets, newSet]
    });
  };

  const updateSet = (setIndex: number, updates: Partial<Set>) => {
    onUpdate(index, {
      sets: exercise.sets.map((set, id) => 
        id === setIndex ? { ...set, ...updates } : set
      )
    });
  };

  const removeSet = (setIndex: number) => {
    if (exercise.sets.length > 1) {
      onUpdate(index, {
        sets: exercise.sets.filter((set, id) => id !== setIndex)
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
      
      <Card.Content>
        <Card.Content style={{flexDirection: 'row', marginBottom: 16, alignItems: 'center', padding: 0}}>
          {/* Exercise Name */}
          <TouchableOpacity 
            onPress={() => setShowSearch(true)}
            style={{flex: 1, paddingRight: 16 }}
          >
          <TextInput
            label="Exercise Name"
            value={exercise.exerciseName}
            editable={false}
            style={{ backgroundColor: theme.surface,
              flex: 1,
            }}
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
          <IconButton 
              icon="delete" 
              onPress={() => onRemove(index)}
              iconColor={theme.error}
              size={24}
            />
        </Card.Content>

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
                onChangeText={(reps) => updateSet(setIndex, { reps: Number(reps) || 0 })}
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
                onChangeText={(weight) => updateSet(setIndex, { weight: Number(weight) || 0 })}
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
                onChangeText={(restSeconds) => updateSet(setIndex, { restSeconds: Number(restSeconds) || 0 })}
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
                  onPress={() => removeSet(setIndex)}
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
        onSelectExercise={(exerciseName) => onUpdate(index, { exerciseName: exerciseName })}
        placeholder="Search exercises..."
      />
    </Card>
  );
}
