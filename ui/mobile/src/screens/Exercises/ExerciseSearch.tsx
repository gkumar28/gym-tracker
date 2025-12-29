import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, ScrollView } from 'react-native';
import { 
  Searchbar, 
  Card, 
  Text, 
  Button, 
  ActivityIndicator, 
  Chip,
  IconButton,
  Portal,
  Modal,
  FAB
} from 'react-native-paper';
import { exerciseService, Exercise, ExerciseSearchParams } from '../../services/exerciseService';
import { useTheme } from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApiCall } from '../../hooks/useApiCall';

export default function ExerciseSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { execute, error, reset } = useApiCall({
    showNetworkErrorScreen: true,
  });
  
  const categories = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Sports'];
  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Glutes'];
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  
  const loadExercises = useCallback(async (reset: boolean = false) => {
    if (loading) return;
    
    setLoading(true);
    const result = await execute(async () => {
      const params: ExerciseSearchParams = {
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        muscle: selectedMuscle || undefined,
        difficulty: selectedDifficulty || undefined,
        limit: 10,
        offset: reset ? 0 : offset,
      };
      
      const response = await exerciseService.searchExercises(params);
      
      if (reset) {
        setExercises(response.items);
        setOffset(response.items.length);
      } else {
        setExercises(prev => [...prev, ...response.items]);
        setOffset(prev => prev + response.items.length);
      }
      
      setHasMore(response.hasMore);
      return response;
    });
    
    if (!result) {
      // Error was handled by useApiCall hook
      if (reset) {
        setExercises([]);
        setOffset(0);
      }
    }
    
    setLoading(false);
    setRefreshing(false);
  }, [loading, searchQuery, selectedCategory, selectedMuscle, selectedDifficulty, offset, execute]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setOffset(0);
    loadExercises(true);
  }, [loadExercises]);
  
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadExercises(false);
    }
  }, [hasMore, loading, loadExercises]);
  
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedMuscle(null);
    setSelectedDifficulty(null);
    setOffset(0);
  };
  
  const hasActiveFilters = selectedCategory || selectedMuscle || selectedDifficulty;
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOffset(0);
      loadExercises(true);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedMuscle, selectedDifficulty]);
  
  useEffect(() => {
    loadExercises(true);
  }, []);

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <Card 
      style={{ 
        marginHorizontal: 16, 
        marginVertical: 4,
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1
      }} 
      onPress={() => setSelectedExercise(item)}
    >
      <Card.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>
                {item.description}
              </Text>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              <Chip 
                mode="outlined" 
                compact 
                style={{ 
                  marginRight: 4, 
                  marginBottom: 4,
                  backgroundColor: item.category === 'Strength' ? theme.primary + '20' : theme.background,
                  borderColor: item.category === 'Strength' ? theme.primary : theme.border,
                  borderWidth: 1
                }}
                textStyle={{ 
                  color: item.category === 'Strength' ? theme.primary : theme.text 
                }}
              >
                {item.category}
              </Chip>
              {item.muscleGroups.slice(0, 2).map((muscle, index) => (
                <Chip 
                  key={index}
                  mode="flat" 
                  compact 
                  style={{ 
                    marginRight: 4, 
                    marginBottom: 4,
                    backgroundColor: theme.primary + '20',
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: theme.primary }}
                >
                  {muscle}
                </Chip>
              ))}
            </View>
          </View>
          <Chip 
            mode={item.difficulty === 'BEGINNER' ? 'flat' : 'outlined'}
            compact
            style={{ 
              marginLeft: 8,
              backgroundColor: item.difficulty === 'BEGINNER' ? theme.success + '20' : 'transparent',
              borderColor: item.difficulty === 'INTERMEDIATE' ? theme.warning : item.difficulty === 'ADVANCED' ? theme.error : theme.success,
              borderWidth: 1
            }}
            textStyle={{ 
              color: item.difficulty === 'BEGINNER' ? theme.success : item.difficulty === 'INTERMEDIATE' ? theme.warning : theme.error 
            }}
          >
            {item.difficulty}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );
  
  const renderFilterModal = () => (
    <Portal>
      <Modal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        contentContainerStyle={{
          backgroundColor: theme.surface,
          padding: 20,
          margin: 20,
          borderRadius: 12,
          maxHeight: '80%',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: theme.text }}>
          Filters
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
            Category
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
                style={{ 
                  marginRight: 8, 
                  marginBottom: 8,
                  backgroundColor: selectedCategory === category ? theme.primary : theme.background,
                  borderColor: theme.border,
                  borderWidth: 1
                }}
                textStyle={{ color: selectedCategory === category ? '#fff' : theme.text }}
              >
                {category}
              </Chip>
            ))}
          </View>
          
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
            Muscle Group
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {muscleGroups.map((muscle) => (
              <Chip
                key={muscle}
                selected={selectedMuscle === muscle}
                onPress={() => setSelectedMuscle(selectedMuscle === muscle ? null : muscle)}
                style={{ 
                  marginRight: 8, 
                  marginBottom: 8,
                  backgroundColor: selectedMuscle === muscle ? theme.primary : theme.background,
                  borderColor: theme.border,
                  borderWidth: 1
                }}
                textStyle={{ color: selectedMuscle === muscle ? '#fff' : theme.text }}
              >
                {muscle}
              </Chip>
            ))}
          </View>
          
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
            Difficulty
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            {difficulties.map((difficulty) => (
              <Chip
                key={difficulty}
                selected={selectedDifficulty === difficulty}
                onPress={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                style={{ 
                  marginRight: 8, 
                  marginBottom: 8,
                  backgroundColor: selectedDifficulty === difficulty ? theme.primary : theme.background,
                  borderColor: theme.border,
                  borderWidth: 1
                }}
                textStyle={{ color: selectedDifficulty === difficulty ? '#fff' : theme.text }}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Chip>
            ))}
          </View>
        </ScrollView>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <Button mode="outlined" onPress={clearFilters}>
            Clear All
          </Button>
          <Button mode="contained" onPress={() => setShowFilters(false)}>
            Apply Filters
          </Button>
        </View>
      </Modal>
    </Portal>
  );
  
  const renderExerciseDetail = () => (
    <Portal>
      <Modal
        visible={!!selectedExercise}
        onDismiss={() => setSelectedExercise(null)}
        contentContainerStyle={{
          backgroundColor: theme.surface,
          padding: 20,
          margin: 20,
          borderRadius: 12,
          maxHeight: '80%',
        }}
      >
        {selectedExercise && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, color: theme.text }}>
                {selectedExercise.name}
              </Text>
              <IconButton
                icon="close"
                onPress={() => setSelectedExercise(null)}
              />
            </View>
            
            {selectedExercise.description && (
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginTop: 8 }}>
                {selectedExercise.description}
              </Text>
            )}
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
              <Chip 
                mode="outlined" 
                compact 
                style={{ 
                  marginRight: 4, 
                  marginBottom: 4,
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                  borderWidth: 1
                }}
                textStyle={{ color: theme.text }}
              >
                {selectedExercise.category}
              </Chip>
              <Chip 
                mode={selectedExercise.difficulty === 'BEGINNER' ? 'flat' : 'outlined'}
                compact 
                style={{ 
                  marginRight: 4, 
                  marginBottom: 4,
                  backgroundColor: selectedExercise.difficulty === 'BEGINNER' ? theme.success + '20' : 'transparent',
                  borderColor: selectedExercise.difficulty === 'INTERMEDIATE' ? theme.warning : selectedExercise.difficulty === 'ADVANCED' ? theme.error : theme.success,
                  borderWidth: 1
                }}
                textStyle={{ 
                  color: selectedExercise.difficulty === 'BEGINNER' ? theme.success : selectedExercise.difficulty === 'INTERMEDIATE' ? theme.warning : theme.error 
                }}
              >
                {selectedExercise.difficulty}
              </Chip>
            </View>
            
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
                Muscle Groups
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedExercise.muscleGroups.map((muscle, index) => (
                  <Chip 
                    key={index} 
                    mode="flat" 
                    compact 
                    style={{ 
                      marginRight: 4, 
                      marginBottom: 4,
                      backgroundColor: theme.primary + '20',
                      borderColor: theme.primary,
                      borderWidth: 1
                    }}
                    textStyle={{ color: theme.primary }}
                  >
                    {muscle}
                  </Chip>
                ))}
              </View>
            </View>
            
            <View style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
                Equipment
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {selectedExercise.equipment.map((equip, index) => (
                  <Chip 
                    key={index} 
                    mode="flat" 
                    compact 
                    style={{ 
                      marginRight: 4, 
                      marginBottom: 4,
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      borderWidth: 1
                    }}
                    textStyle={{ color: theme.textSecondary }}
                  >
                    {equip}
                  </Chip>
                ))}
              </View>
            </View>
            
            {selectedExercise.instructions && selectedExercise.instructions.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
                  Instructions
                </Text>
                {selectedExercise.instructions.map((instruction, index) => (
                  <Text key={index} style={{ fontSize: 14, color: theme.text, marginBottom: 4 }}>
                    {index + 1}. {instruction}
                  </Text>
                ))}
              </View>
            )}
            
            {selectedExercise.tips && selectedExercise.tips.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, color: theme.text }}>
                  Tips
                </Text>
                {selectedExercise.tips.map((tip, index) => (
                  <Text key={index} style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 4 }}>
                    • {tip}
                  </Text>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </Modal>
    </Portal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ 
        padding: 16, 
        paddingBottom: 8,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.border
      }}>
        <Searchbar 
          placeholder="Search exercises..." 
          value={searchQuery} 
          onChangeText={setSearchQuery}
          style={{ 
            marginBottom: 8,
            backgroundColor: theme.background,
            borderColor: theme.border
          }}
          inputStyle={{ color: theme.text }}
          placeholderTextColor={theme.textSecondary}
          iconColor={theme.primary}
        />
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>
              {selectedCategory && (
                <Chip 
                  onClose={() => setSelectedCategory(null)}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: '#fff' }}
                >
                  {selectedCategory}
                </Chip>
              )}
              {selectedMuscle && (
                <Chip 
                  onClose={() => setSelectedMuscle(null)}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: '#fff' }}
                >
                  {selectedMuscle}
                </Chip>
              )}
              {selectedDifficulty && (
                <Chip 
                  onClose={() => setSelectedDifficulty(null)}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: '#fff' }}
                >
                  {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                </Chip>
              )}
            </View>
          </ScrollView>
          
          <IconButton
            icon="filter-variant"
            onPress={() => setShowFilters(true)}
            style={{ marginLeft: 8 }}
          />
        </View>
      </View>
      
      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.textSecondary }}>No exercises found</Text>
              {hasActiveFilters && (
                <Button mode="outlined" onPress={clearFilters} style={{ marginTop: 8 }}>
                  Clear Filters
                </Button>
              )}
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      />
      
      {renderFilterModal()}
      {renderExerciseDetail()}
    </View>
  );
}
