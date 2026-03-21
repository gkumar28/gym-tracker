import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Card, Text, Button, ActivityIndicator, IconButton, Searchbar, Chip, Portal, Modal, FAB } from 'react-native-paper';
import { sessionService, Session, SessionSearchParams, PaginatedSessionResponse } from '../../services/sessionService';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { debounce } from 'lodash';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorComponent from '../../components/ErrorComponent';

type SessionListRouteProp = {
  params?: {
    workoutId?: string;
  };
};

type SessionListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SessionList'>;

export default function SessionList() {
  const route = useRoute() as SessionListRouteProp;
  const navigation = useNavigation<SessionListNavigationProp>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const [sessionsData, setSessionsData] = useState<PaginatedSessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  // Build search params
  const searchParams: SessionSearchParams = {
    search: searchQuery || undefined,
    workoutName: searchQuery || undefined,
    workoutId: selectedWorkoutId || route.params?.workoutId || undefined,
    dateFrom: selectedDateFrom || undefined,
    dateTo: selectedDateTo || undefined,
    size: 20,
    page: 0,
  };

  const debouncedLoadSessions = debounce(() => {
    loadSessions();
  }, 300);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      if (route.params?.workoutId && !selectedWorkoutId) {
        // Load sessions for specific workout (legacy support)
        const data = await sessionService.getSessionsForWorkout(route.params.workoutId);
        setSessionsData({
          items: data,
          total: data.length,
          hasMore: false,
          offset: 0,
          limit: 20
        });
      } else {
        // Use search API with filters
        const data = await sessionService.searchSessions(searchParams);
        setSessionsData(data);
      }
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    debouncedLoadSessions();
  }, [searchQuery, selectedDateFrom, selectedDateTo, selectedWorkoutId, route.params?.workoutId]);

  const handleRefresh = async () => {
    await execute(async () => {
      debouncedLoadSessions();
      return Promise.resolve();
    });
  };

  const clearFilters = () => {
    setSelectedDateFrom(null);
    setSelectedDateTo(null);
    setSelectedWorkoutId(null);
    setSearchQuery('');
  };

  const sessions = sessionsData?.items || [];
  const hasActiveFilters = searchQuery || selectedDateFrom || selectedDateTo || selectedWorkoutId;

  const navigateToWorkout = (workoutId?: string) => {
    if (workoutId) {
      navigation.navigate('WorkoutDetail', { id: workoutId });
    }
  };

  const getWorkoutDisplayName = (session: any) => {
    // Use workoutName if available, fallback to nested workout object
    if (session.workoutName) {
      return session.workoutName;
    }
    if (session.workout?.name) {
      return session.workout.name;
    }
    // Otherwise, show a generic message with workoutId
    return session.workoutId ? `Workout ID: ${session.workoutId}` : 'Unknown Workout';
  };

  const navigateToCreateSession = () => {
    // If we're viewing sessions for a specific workout, pass that workoutId to CreateSession
    if (route.params?.workoutId) {
      navigation.navigate('CreateSession', { workoutId: route.params.workoutId });
    } else {
      navigation.navigate('CreateSession');
    }
  };

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
                  onClose={() => setSelectedDateFrom(null)}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: '#fff' }}
                >
                  From: {new Date(selectedDateFrom).toLocaleDateString()}
                </Chip>
              )}
              {selectedDateTo && (
                <Chip 
                  onClose={() => setSelectedDateTo(null)}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: '#fff' }}
                >
                  To: {new Date(selectedDateTo).toLocaleDateString()}
                </Chip>
              )}
              {selectedWorkoutId && (
                <Chip 
                  onClose={() => setSelectedWorkoutId(null)}
                  style={{ 
                    marginRight: 8,
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    borderWidth: 1
                  }}
                  textStyle={{ color: '#fff' }}
                >
                  Workout Filtered
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
        <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: theme.text }}>
          {route.params?.workoutId 
            ? `Sessions for Workout ${route.params.workoutId}`
            : 'Recent Sessions'
          }
        </Text>
        
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 8, backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 1 }}>
              <Card.Title 
                title={`Session ${item.id}`}
                subtitle={getWorkoutDisplayName(item)}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="arrow-right"
                    onPress={() => navigateToWorkout(item.workoutId)}
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
                    {item.sessionExercises?.length || 0} exercises
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
                  onPress={() => navigateToWorkout(item.workoutId)}
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
                  {route.params?.workoutId 
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
            <Button mode="contained" onPress={() => setShowFilters(false)}>
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
