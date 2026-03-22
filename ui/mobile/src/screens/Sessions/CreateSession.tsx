import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
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
import { create, debounce } from 'lodash';
import ExerciseCard from '../../components/ExerciseCard';
import { ExerciseItem, ExerciseSet, RestAfterExercise } from '../../types/common';
import { equalsIgnoreCase } from '../../utils/generic';
import { Workout } from '../../types/workout';
import { toast } from 'react-toastify';
import RestCard from '../../components/RestCard';
import { AutocompleteDropdown, AutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';


type CreateSessionProps = { workoutId: number, workoutName: string}

export default function CreateSession({ workoutId, workoutName}: CreateSessionProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CreateSession'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ExerciseItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Workout selection state
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(workoutId);
  const [selectedWorkoutName, setSelectedWorkoutName] = useState<string | null>(workoutName);
  const [workoutSearchResult, setWorkoutSearchResult] = useState<AutocompleteDropdownItem[] | null>(null);
  const workoutResultCacheRef = useRef<Record<string, AutocompleteDropdownItem[] | null>>({});

  // Search workouts
  const debouncedSearchWorkouts = debounce(async (text: string) => {
    if (!text?.trim()) {
      return;
    }
    
    const normalizedQuery = text.toLowerCase() || '';
    if (normalizedQuery in workoutResultCacheRef.current) {
      setWorkoutSearchResult(workoutResultCacheRef.current[normalizedQuery]);
      return;
    }
    try {
      
      const response = await workoutService.searchWorkouts({
        name: normalizedQuery,
        page: 0,
        size: 10
      }).then(result => result.items);
      const autocompleteResult = response?.map(workout => {return {id: workout?.id?.toString(), title: workout?.name}});
      workoutResultCacheRef.current[normalizedQuery] = autocompleteResult;
      setWorkoutSearchResult(autocompleteResult);
    } catch (error) {
      console.error('Failed to search workouts:', error);
    }
  }, 300);

  const selectItem = (item) => {setSelectedWorkoutId(Number(item?.id)); setSelectedWorkoutName(item?.title)};
  const textChange = (text?: string) => debouncedSearchWorkouts(text);
  const textInputComponent = useCallback((props) => {
  
    return (
      <TextInput
        {...props}
        label='Workout Name'
        mode="outlined"
        style={[
          {
            color: theme.text,
          }
        ]}
      />
    );
  }, []);

  const addExercise = () => {
    const newExercise: ExerciseSet = {
      exerciseName: '',
      sets: [{ reps: 8, weight: 50, restSeconds: 60 }],
    };

    const rest: RestAfterExercise = {
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

  const updateExercise = (index: number, updates: Partial<ExerciseSet>) => {
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
    if (!workoutId) {
      Alert.alert('Error', 'Please select a workout');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return;
    }

    setIsSaving(true);
    const result = await execute(async () => {
      let createdSession;
      try {
        createdSession = await sessionService.createSession({
          workoutId: selectedWorkoutId,
          sessionDate: new Date(sessionDate).toISOString(),
          durationMinutes: parseInt(durationMinutes) || undefined,
          notes: notes.trim() || undefined,
          sessionItems: items });
        toast.success("Session Created Successfully!");
      } catch (error) {
        const message = error?.message || "Some error has occurred. Please try again later";
        toast.error(message);
        createdSession = undefined;
      }
      
      setTimeout(() => {
        if (createdSession) {
          // Navigate to WorkoutDetail (stack index 1)
          navigation.reset({
            index: 10,
            routes: [
              { name: "SessionList" },
              //{name: "SessionDetail", params: { id: createdSession.id, workoutId: selectedWorkoutId, workoutName: selectedWorkoutName}}
            ]
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "SessionList" }]
          });
        }
      }, 1000);
      
      return !!createdSession;
    });
    
    setIsSaving(false);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1, backgroundColor: theme.background, }}>
        <View style={{ padding: 16 }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            {/* Workout Selection - Only show if not from workout detail */}
            <Card style={{ 
              flex: 1, 
              marginRight: 16, 
              backgroundColor: theme.surface, 
              borderColor: theme.border, 
              borderWidth: 1 }}>
              <Card.Title title={"Workout"}/>
              <Card.Content>
                <AutocompleteDropdown
                  dataSet={workoutSearchResult}
                  useFilter={false}
                  onSelectItem={selectItem}        
                  onChangeText={textChange}
                  onClear={textChange}
                  closeOnBlur={true}
                  closeOnSubmit={true}
                  clearOnFocus={false}
                  direction={'down'}
                  showClear={false}
                  showChevron={false}
                  inputContainerStyle={{
                    backgroundColor: 'transparent',
                  }}
                  flatListProps={{
                    showsVerticalScrollIndicator: false,
                  }}
                  renderItem={(item) => (
                    <View style={{
                      padding: 16,
                      backgroundColor: theme.surface
                    }}>
                      <Text style={{ color: theme.text }}>{item.title}</Text>
                    </View>
                  )}
                  ItemSeparatorComponent={() => <View style={{backgroundColor: theme.background, height: 1,width: '100%'}} />}
                  EmptyResultComponent={
                  <View style={{ backgroundColor: theme.surface }}>
                    <Text style={{color: theme.text, padding: 16, textAlign: 'center'}}>Nothing found</Text>
                  </View>}
                  InputComponent={textInputComponent}
                />
              </Card.Content>
            </Card>

            {/* Session Date */}
            <Card style={{ 
              flex: 1,
              marginRight: 16,
              backgroundColor: theme.surface, 
              borderColor: theme.border, 
              borderWidth: 1 }}>
              <Card.Title title={"Session Date"}/>
              <Card.Content>
                <TextInput
                  label={'Date'}
                  value={sessionDate}
                  onChangeText={setSessionDate}
                  style={{ backgroundColor: theme.background }}
                  mode='outlined'
                />
              </Card.Content>
            </Card>

            {/* Duration */}
            <Card style={{ 
              flex: 1,
              backgroundColor: theme.surface, 
              borderColor: theme.border, 
              borderWidth: 1 }}>
                <Card.Title title='Duration'/>
              <Card.Content>
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
          </View>

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
    </KeyboardAvoidingView>
  );
}
