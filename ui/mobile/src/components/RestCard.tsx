import React from 'react';
import { View } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';

type Props = {
  value: number;
  onChange: (val: number) => void;
};

export default function RestCard({ value, onChange }: Props) {
  const theme = useTheme();

  const handleChange = (text: string) => {
    const num = parseInt(text, 10);
    onChange(isNaN(num) ? 0 : num);
  };

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
          label="Seconds"
          value={String(value)}
          onChangeText={handleChange}
          keyboardType="numeric"
          mode="outlined"
          style={{ marginBottom: 12 }}
          textColor={theme.text}
          cursorColor={theme.primary}
          selectionColor={theme.primary}
          activeOutlineColor={theme.primary}
          outlineColor={theme.border}
        />
      </Card.Content>
    </Card>
  );
}