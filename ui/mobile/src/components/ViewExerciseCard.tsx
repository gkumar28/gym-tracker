import React from "react";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { useTheme } from "../hooks/useTheme";

interface Set {
  reps: number;
  weight: number;
  restSeconds: number;
}

interface Exercise {
  id: number;
  exerciseName: string;
  sets: Set[];
}

interface Props {
  exercise: Exercise;
  index: number;
}

export default function ViewExerciseCard({ exercise, index }: Props) {
  const theme = useTheme();

  return (
    <Card
      style={{
        marginBottom: 16,
        backgroundColor: theme.surface,
        borderColor: theme.border,
        borderWidth: 1
      }}
    >
      <Card.Title
        title={`${exercise.exerciseName}`}
        titleStyle={{ color: theme.text }}
        subtitleStyle={{ color: theme.textSecondary }}
      />

      <Card.Content>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: theme.text,
            marginBottom: 8
          }}
        >
          Sets
        </Text>

        {exercise.sets.map((set, setIndex) => (
          <View
            key={setIndex}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
              backgroundColor: theme.surface,
              padding: 2,
              borderRadius: 2
            }}
          >
            <Text
              style={{
                color: theme.textSecondary,
                backgroundColor: theme.background,
                padding: 8,
                borderRadius: 8,
                margin: 1
              }}
            >
              {setIndex + 1}
            </Text>

            <Text style={{ flex: 1, 
                color: theme.text, 
                backgroundColor: theme.background,
                padding: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
                margin: 1
              }}>
              Reps: {set.reps ?? "-"}
            </Text>

            <Text style={{ flex: 1, 
                color: theme.text, 
                backgroundColor: theme.background,
                padding: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
                margin: 1
              }}>
              Weight: {set.weight ?? "-"} kg
            </Text>

            <Text style={{ flex: 1, 
                color: theme.text, 
                backgroundColor: theme.background,
                padding: 8,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.border,
                margin: 1
              }}>
              Rest: {set.restSeconds ?? 0}s
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}