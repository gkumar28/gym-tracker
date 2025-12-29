import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import SetTable, { SetRow } from '../../components/SetTable';
import { workoutService } from '../../services/workoutService';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { useApiCall } from '../../hooks/useApiCall';
import { useTheme } from '../../hooks/useTheme';

export default function CreateWorkout() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CreateWorkout'>>();
  const theme = useTheme();
  const { execute } = useApiCall({
    showNetworkErrorScreen: true,
  });
  const [name, setName] = useState<string>('');
  const [rows, setRows] = useState<SetRow[]>([{ name: 'Set 1', reps: 8, weight: 50, restSec: 0, isRest: false }]);
  const [showRestRows, setShowRestRows] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Convert rows into sets and merge rest rows into previous actual set
    const rowsCopy = [...rows];
    const sets: any[] = [];
    for (let i = 0; i < rowsCopy.length; i++) {
      const row = rowsCopy[i];
      if (row.isRest) {
        // find previous actual set and add restSec to it
        for (let j = i - 1; j >= 0; j--) {
          if (!rowsCopy[j].isRest) {
            rowsCopy[j].restSec = (rowsCopy[j].restSec ?? 0) + (row.restSec ?? 0);
            break;
          }
        }
      } else {
        const setObj: any = { name: row.name, reps: row.reps, weight: row.weight };
        if ((row.restSec ?? 0) > 0) setObj.restSec = row.restSec;
        sets.push(setObj);
      }
    }

    const payload = { name, sets };
    console.log('Saving payload', payload);
    setIsSaving(true);
    
    const result = await execute(async () => {
      await workoutService.createWorkout(payload);
      Alert.alert('Saved', 'Workout created successfully');
      navigation.navigate('WorkoutsList');
      return true;
    });
    
    setIsSaving(false);
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <TextInput label="Workout Name" value={name} onChangeText={setName} style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ marginRight: 8 }}>Show inserted Rest rows</Text>
        <Switch value={showRestRows} onValueChange={setShowRestRows} />
      </View>

      <SetTable rows={rows} onChange={setRows} />

      <Button mode="contained" onPress={handleSave} loading={isSaving} style={{ marginTop: 16 }}>
        Save Workout
      </Button>
    </ScrollView>
  );
}
