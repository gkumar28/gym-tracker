import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Card, Text, Button, IconButton, Searchbar, Chip, Portal, Modal, FAB } from 'react-native-paper';
import { sessionService, SessionSearchParams } from '../../services/sessionService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { debounce } from 'lodash';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorComponent from '../../components/ErrorComponent';
import { useNavigation } from '@react-navigation/native';
import { PaginatedResponse } from '../../types/api';
import { Session } from '../../types/session';

type SessionListProps = { workoutId?: number, workoutName?: string }

export default function SessionList({ workoutId, workoutName }: SessionListProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SessionList'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const [sessionsData, setSessionsData] = useState<PaginatedResponse<Session> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [selectedWorkoutName, setSelectedWorkoutName] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNo, setPageNo] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<SessionSearchParams | null>(null);
  const [performSearch, setPerformSearch] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const loadSessions = async () => {
    if (!performSearch) { return; }

    try {
      setIsLoading(true);
      setIsError(false);
      setSearchParams({
        search: searchQuery,
        dateFrom: selectedDateFrom,
        dateTo: selectedDateTo,
        workoutId: selectedWorkoutId,
        size: pageSize,
        page: pageNo
      })
      
      const data = await sessionService.searchSessions(searchParams);
      setSessionsData(data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setPerformSearch(false);
    }
  };

  const debouncedLoadSessions = debounce(() => {
    loadSessions();
  }, 300);

  useEffect(() => {
    setSelectedWorkoutId(workoutId);
    setSelectedWorkoutName(workoutName);
    setPerformSearch(true);
  }, [workoutId, workoutName])

  useEffect(() => {
    debouncedLoadSessions();
  }, [performSearch, pageNo, pageSize]);

  const handleRefresh = async () => {
    await execute(async () => {
      debouncedLoadSessions();
      return Promise.resolve();
    });
  };

  const clearFilters = () => {
    setSelectedDateFrom(null);
    setSelectedDateTo(null);
    setSelectedWorkoutId(workoutId);
    setSearchQuery('');
    setPerformSearch(true);
  };
  
  const navigateToWorkout = (workoutId?: number, workoutName?: string) => {
    if (workoutId) {
      navigation.navigate('WorkoutDetail', { id: workoutId, workoutName: workoutName });
    }
  };

  const navigateToCreateSession = () => {
    // If we're viewing sessions for a specific workout, pass that workoutId to CreateSession
    if (selectedWorkoutId) {
      navigation.navigate('CreateSession', { workoutId: selectedWorkoutId, workoutName: selectedWorkoutName });
    } else {
      navigation.navigate('CreateSession');
    }
  };

  const hasActiveFilters = searchQuery || selectedDateFrom || selectedDateTo || selectedWorkoutId;

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent message='Failed to load Sessions' />

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Search and Filter Header */}
      <View style={{ 
        padding: 16, 
        paddingBottom: 8,
        backgroundColor: theme.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.border
      }}>
        <Searchbar 
          placeholder="Search sessions..." 
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
              {selectedDateFrom && (
                <Chip 
                  onClose={() => {setPerformSearch(true);setSelectedDateFrom(null)}}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: theme.background }}
                >
                  From: {new Date(selectedDateFrom).toLocaleDateString()}
                </Chip>
              )}
              {selectedDateTo && (
                <Chip 
                  onClose={() => {setPerformSearch(true);setSelectedDateTo(null)}}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: theme.background }}
                >
                  To: {new Date(selectedDateTo).toLocaleDateString()}
                </Chip>
              )}
              {selectedWorkoutId && (
                <Chip 
                  disabled={true}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: theme.background }}
                >
                  {selectedWorkoutName}
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

      {/* Sessions List */}
      <View style={{ padding: 16 }}>
        <FlatList
          data={sessionsData.items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
              <Card.Title 
                title={`Session ${item.id}`}
                subtitle={item.workoutName}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="arrow-right"
                    onPress={() => navigateToWorkout(item.workoutId, item.workoutName)}
                    size={20}
                  />
                )}
              />
              <Card.Content>
                <Text style={{ color: theme.text }}>{new Date(item.sessionDate || '').toLocaleString()}</Text>
                {item.durationMinutes && (
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                    Duration: {item.durationMinutes} minutes
                  </Text>
                )}
                {item.workout && (
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                    {item.exerciseCount || 0} exercises
                  </Text>
                )}
                {item.notes && (
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>
                    Notes: {item.notes}
                  </Text>
                )}
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="text" 
                  onPress={() => navigateToWorkout(item.workoutId, item.workoutName)}
                  compact
                >
                  View Workout
                </Button>
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={
            !isLoading && !isError ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 16, color: theme.textSecondary }}>
                  {selectedWorkoutId 
                    ? 'No sessions found for this workout'
                    : 'No sessions found'
                  }
                </Text>
                {hasActiveFilters && (
                  <Button mode="outlined" onPress={clearFilters} style={{ marginTop: 8 }}>
                    Clear Filters
                  </Button>
                )}
              </View>
            ) : null
          }
        />
      </View>

      {/* Filter Modal */}
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
              Date Range
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => setSelectedDateFrom(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
              style={{ marginBottom: 8 }}
            >
              Last 7 Days
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => setSelectedDateFrom(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
              style={{ marginBottom: 16 }}
            >
              Last 30 Days
            </Button>
          </ScrollView>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            <Button mode="outlined" onPress={clearFilters}>
              Clear All
            </Button>
            <Button mode="contained" onPress={() => { setPerformSearch(true); setShowFilters(false); }}>
              Apply Filters
            </Button>
          </View>
        </Modal>
      </Portal>
      
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
        onPress={navigateToCreateSession}
      />
    </View>
  );
}
