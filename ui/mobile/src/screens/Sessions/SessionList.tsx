import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { api } from '../../services/api';
import { useQuery } from '@tanstack/react-query';

export default function SessionList() {
  const { data, isLoading } = useQuery(['sessions'], async () => {
    const res = await api.get('/api/session/workout/1');
    return res.data;
  });

  if (isLoading) return <Text style={{ padding: 16 }}>Loading sessions...</Text>;

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
