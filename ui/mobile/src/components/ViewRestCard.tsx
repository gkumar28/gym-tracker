import React from 'react';
import { Card, Text, TextInput } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

type Props = {
  value: number;
};

export default function ViewRestCard({ value }: Props) {
  const theme = useTheme();

  return (
    <Card
      style={{
        marginBottom: 12,
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1,
      }}
    >
      <Card.Content>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: theme.textSecondary,
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          Rest after Exercise
        </Text>

        <TextInput
            label={"Seconds"}
            value={`${value}`}
            mode="outlined"    
            editable={false}
            style={{flex: 1,
                color: theme.text, 
                backgroundColor: theme.background,
                borderColor: theme.border,
                margin: 5,
                height: 40
              }}
            outlineColor={theme.border}
        />
      </Card.Content>
    </Card>
  );
}