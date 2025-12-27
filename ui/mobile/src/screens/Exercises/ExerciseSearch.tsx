import React, { useState } from 'react';
import { View } from 'react-native';
import { Searchbar, Card, Text, Button, ActivityIndicator } from 'react-native-paper';
import { api } from '../../services/api';

export default function ExerciseSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/exercise/search', { params: { searchTerm: q } });
      setResults(res.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Searchbar placeholder="Search exercises" value={q} onChangeText={setQ} onIconPress={doSearch} />
      {loading && <ActivityIndicator />}
      {results.map((r, idx) => (
        <Card key={idx} style={{ marginTop: 8 }}>
          <Card.Title title={r.name} />
        </Card>
      ))}
      <Button mode="contained" onPress={doSearch} style={{ marginTop: 12 }}>Search</Button>
    </View>
  );
}
