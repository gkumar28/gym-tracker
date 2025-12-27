import React from 'react';
import { View, ScrollView } from 'react-native';
import { DataTable, TextInput, Button, Text } from 'react-native-paper';

export type SetRow = {
  id?: string;
  name?: string;
  reps?: number;
  weight?: number;
  restSec?: number; // for set rows, represents rest after the set
  isRest?: boolean; // true if this is a rest-only row
};

type Props = {
  rows: SetRow[];
  onChange: (rows: SetRow[]) => void;
};

export default function SetTable({ rows, onChange }: Props) {
  const addSet = () => {
    onChange([...rows, { name: `Set ${rows.length + 1}`, reps: 8, weight: 20, restSec: 0, isRest: false }]);
  };

  const addRest = (afterIndex?: number) => {
    // insert rest row after the last actual set or after specified index
    const lastSetIndex = rows.map(r => r.isRest ? -1 : 1).lastIndexOf(1);
    let insertIndex = lastSetIndex;
    if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < rows.length) insertIndex = afterIndex;
    const newRows = [...rows];
    const restRow: SetRow = { isRest: true, restSec: 30, name: 'Rest' };
    if (insertIndex >= 0 && insertIndex < newRows.length) {
      newRows.splice(insertIndex + 1, 0, restRow);
    } else {
      newRows.push(restRow);
    }
    onChange(newRows);
  };

  const updateRowField = (index: number, field: keyof SetRow, value: any) => {
    const newRows = [...rows];
    const r = { ...newRows[index] };
    (r as any)[field] = value;
    newRows[index] = r;
    onChange(newRows);
  };

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    onChange(newRows);
  };

  const actualSetCount = rows.filter(r => !r.isRest).length;

  return (
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Set</DataTable.Title>
          <DataTable.Title numeric>Reps</DataTable.Title>
          <DataTable.Title numeric>Weight</DataTable.Title>
          <DataTable.Title numeric>Rest(s)</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {rows.map((r, idx) => (
          <DataTable.Row key={`row-${idx}-${r.isRest ? 'rest' : 'set'}`}>
            <DataTable.Cell style={{ flex: 2 }}>
              <TextInput
                mode="outlined"
                value={r.name ?? ''}
                onChangeText={(txt) => updateRowField(idx, 'name', txt)}
                disabled={!!r.isRest}
                style={{ height: 40 }}
                dense
              />
            </DataTable.Cell>

            <DataTable.Cell numeric>
              <TextInput
                keyboardType="numeric"
                value={r.reps?.toString() ?? ''}
                onChangeText={(txt) => updateRowField(idx, 'reps', txt ? Number(txt) : undefined)}
                disabled={!!r.isRest}
                style={{ height: 40, width: 80 }}
                dense
              />
            </DataTable.Cell>

            <DataTable.Cell numeric>
              <TextInput
                keyboardType="numeric"
                value={r.weight?.toString() ?? ''}
                onChangeText={(txt) => updateRowField(idx, 'weight', txt ? Number(txt) : undefined)}
                disabled={!!r.isRest}
                style={{ height: 40, width: 80 }}
                dense
              />
            </DataTable.Cell>

            <DataTable.Cell numeric>
              <TextInput
                keyboardType="numeric"
                value={(r.restSec ?? 0).toString()}
                onChangeText={(txt) => updateRowField(idx, 'restSec', txt ? Number(txt) : 0)}
                style={{ height: 40, width: 80 }}
                dense
              />
            </DataTable.Cell>

            <DataTable.Cell>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button compact mode="contained-tonal" onPress={() => addRest(idx)} disabled={r.isRest}>Add Rest Below</Button>
                <Button compact onPress={() => removeRow(idx)}>
                  Remove
                </Button>
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        ))}

      </DataTable>

      <View style={{ marginVertical: 12 }}>
        <Button mode="contained" onPress={addSet} style={{ marginBottom: 8 }}>Add Set</Button>
        <Button mode="contained" onPress={() => addRest()} disabled={actualSetCount === 0}>Add Rest</Button>
      </View>
    </ScrollView>
  );
}
