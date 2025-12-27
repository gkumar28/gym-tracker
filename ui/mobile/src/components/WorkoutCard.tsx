import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function WorkoutCard({ item, onPress }: { item: any; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ marginBottom: 12 }}>
        <Card.Title title={item.name ?? 'Untitled'} />
        <Card.Content>
          <Text variant="bodySmall">{item.createdAt ?? ''}</Text>
          <Text numberOfLines={2}>{item.sets?.length ? `${item.sets.length} sets` : 'No sets yet'}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
