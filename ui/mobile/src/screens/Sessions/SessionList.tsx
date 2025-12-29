import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { baseApi } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';

export default function SessionList() {
  const theme = useTheme();
  const { execute, error, reset } = useApiCall({
    showNetworkErrorScreen: true,
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await baseApi.get('/session/workout/1');
      return res.data;
    },
  });

  const handleRefresh = async () => {
    await execute(async () => {
      refetch();
      return Promise.resolve();
    });
  };

  if (isLoading) return <ActivityIndicator animating={true} style={{ margin: 20 }} />;
  if (isError) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 16 }}>Failed to load sessions.</Text>
      <Button mode="contained" onPress={handleRefresh}>
        Retry
      </Button>
    </View>
  );

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title title={`Session ${item.id}`} />
            <Card.Content>
              <Text>{new Date(item.sessionDate).toLocaleString()}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
