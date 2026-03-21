import React from "react";
import { View } from "react-native";
import { Card, TextInput, Text } from "react-native-paper";
import { useTheme } from "../hooks/useTheme";
import { WorkoutExercise } from "../types/workout";
interface Props {
  exercise: WorkoutExercise;
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

            <TextInput 
            label="Reps"
            value={`${set.reps}` || "-"}
            editable={false}
            style={{flex: 1,
                color: theme.text, 
                backgroundColor: theme.background,
                borderColor: theme.border,
                margin: 5,
                height: 40
              }}
            outlineColor={theme.border}
            mode="outlined" />

            <TextInput 
            label="Weight (kg)"
            value={`${set.weight}` || "0"}
            editable={false}
            style={{flex: 1,
                color: theme.text, 
                backgroundColor: theme.background,
                borderColor: theme.border,
                margin: 5,
                height: 40
              }}
            outlineColor={theme.border}
            mode="outlined" />

            <TextInput 
            label="Rest (s)"
            value={`${set.restSeconds}` || "0"}
            editable={false}
            style={{flex: 1,
                color: theme.text, 
                backgroundColor: theme.background,
                borderColor: theme.border,
                margin: 5,
                height: 40
              }}
            outlineColor={theme.border}
            mode="outlined" />
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}