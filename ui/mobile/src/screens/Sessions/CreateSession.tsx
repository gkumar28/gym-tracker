import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import SetTable, { SetRow } from '../../components/SetTable';
import { api } from '../../services/api';

export default function CreateSession() {
  const [exerciseName, setExerciseName] = useState('Bench Press');
  const [rows, setRows] = useState<SetRow[]>([{ name: 'Set 1', reps: 8, weight: 50, restSec: 0 }]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // merge rest rows into previous set and create payload for sessionExercise
    const rowsCopy = [...rows];
    const sets: any[] = [];
    for (let i = 0; i < rowsCopy.length; i++) {
      const row = rowsCopy[i];
      if (row.isRest) {
        for (let j = i - 1; j >= 0; j--) {
          if (!rowsCopy[j].isRest) {
            rowsCopy[j].restSec = (rowsCopy[j].restSec ?? 0) + (row.restSec ?? 0);
            break;
          }
        }
      } else {
        const sObj: any = { reps: row.reps, weight: row.weight, notes: '' };
        if ((row.restSec ?? 0) > 0) sObj.restSec = row.restSec;
        sets.push(sObj);
      }
    }

    const payload = {
      workoutId: null,
      sessionExercises: [{ exerciseName, sets }],
      sessionDate: new Date(),
      durationMinutes: 30
    };

    setIsSaving(true);
    try {
      await api.post('/api/session', payload);
      Alert.alert('Saved', 'Session created');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save session');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <TextInput label="Exercise Name" value={exerciseName} onChangeText={setExerciseName} style={{ marginBottom: 12 }} />
      <SetTable rows={rows} onChange={setRows} />
      <Button mode="contained" onPress={handleSave} loading={isSaving} style={{ marginTop: 12 }}>Save Session</Button>
    </ScrollView>
  );
}
