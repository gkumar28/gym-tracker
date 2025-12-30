import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { TextInput, Portal, Modal, Button } from 'react-native-paper';
import { exerciseService, Exercise } from '../services/exerciseService';
import { useTheme } from '../hooks/useTheme';
import { debounce } from '../utils/debounce';

interface ExerciseSearchProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectExercise: (exerciseName: string) => void;
  placeholder?: string;
}

export default function ExerciseSearch({ 
  visible, 
  onDismiss, 
  onSelectExercise, 
  placeholder = "Search exercises..." 
}: ExerciseSearchProps) {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.trim().length === 0) {
        setExercises([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      try {
        const response = await exerciseService.searchExercises({
          search: term.trim(),
          limit: 10
        });
        setExercises(response.items);
        setHasSearched(true);
      } catch (error) {
        console.error('Error searching exercises:', error);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Search when term changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise.name);
    setSearchTerm('');
    setExercises([]);
    setHasSearched(false);
    onDismiss();
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={{
        padding: 16,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
      onPress={() => handleSelectExercise(item)}
    >
      <Text style={{ 
        fontSize: 16, 
        fontWeight: '500', 
        color: theme.text,
        marginBottom: 4 
      }}>
        {item.name}
      </Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Text style={{ 
          fontSize: 12, 
          color: theme.textSecondary,
          backgroundColor: theme.background,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
        }}>
          {item.category}
        </Text>
        
        {item.muscleGroups.slice(0, 2).map((muscle, index) => (
          <Text key={index} style={{ 
            fontSize: 12, 
            color: theme.textSecondary,
            backgroundColor: theme.background,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            {muscle}
          </Text>
        ))}
        
        {item.equipment.slice(0, 1).map((equip, index) => (
          <Text key={index} style={{ 
            fontSize: 12, 
            color: theme.textSecondary,
            backgroundColor: theme.background,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
          }}>
            {equip}
          </Text>
        ))}
      </View>
      
      {item.description && (
        <Text style={{ 
          fontSize: 12, 
          color: theme.textSecondary, 
          marginTop: 4,
          fontStyle: 'italic'
        }} numberOfLines={1}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.background,
          margin: 20,
          borderRadius: 12,
          maxHeight: '80%',
        }}
      >
        <View style={{ padding: 16 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '600', 
            color: theme.text, 
            marginBottom: 16 
          }}>
            Search Exercises
          </Text>
          
          <TextInput
            label="Exercise name"
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={placeholder}
            mode="outlined"
            style={{ marginBottom: 16 }}
            textColor={theme.text}
            cursorColor={theme.primary}
            selectionColor={theme.primary}
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
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
            autoFocus
          />

          <View style={{ 
            flex: 1, 
            maxHeight: 400, 
            marginBottom: 16 
          }}>
            {loading ? (
              <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Text style={{ color: theme.textSecondary }}>
                  Searching...
                </Text>
              </View>
            ) : hasSearched && exercises.length === 0 ? (
              <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Text style={{ 
                  color: theme.textSecondary, 
                  textAlign: 'center',
                  marginBottom: 8 
                }}>
                  No exercises found for "{searchTerm}"
                </Text>
                <Text style={{ 
                  color: theme.textSecondary, 
                  fontSize: 12,
                  textAlign: 'center' 
                }}>
                  Try a different search term
                </Text>
              </View>
            ) : searchTerm.trim().length === 0 ? (
              <View style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Text style={{ 
                  color: theme.textSecondary, 
                  textAlign: 'center',
                  marginBottom: 8 
                }}>
                  Start typing to search exercises
                </Text>
                <Text style={{ 
                  color: theme.textSecondary, 
                  fontSize: 12,
                  textAlign: 'center' 
                }}>
                  Search by exercise name, muscle group, or equipment
                </Text>
              </View>
            ) : (
              <FlatList
                data={exercises}
                renderItem={renderExerciseItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          <Button mode="outlined" onPress={onDismiss}>
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
