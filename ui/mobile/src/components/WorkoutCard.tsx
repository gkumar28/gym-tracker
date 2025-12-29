import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

export default function WorkoutCard({ item, onPress }: { item: any; onPress: () => void }) {
  const theme = useTheme();
  
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={{ 
        marginBottom: 12,
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1
      }}>
        <Card.Title 
          title={item.name ?? 'Untitled'} 
          titleStyle={{ color: theme.text }}
        />
        <Card.Content>
          <Text variant="bodySmall" style={{ color: theme.textSecondary }}>
            {item.createdAt ?? ''}
          </Text>
          <Text 
            numberOfLines={2} 
            style={{ color: theme.text }}
          >
            {item.sets?.length ? `${item.sets.length} sets` : 'No sets yet'}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
