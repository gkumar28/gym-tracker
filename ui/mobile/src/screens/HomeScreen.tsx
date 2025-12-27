import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation';

type HomeNavProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();

  return (
    <View style={{ padding: 16 }}>
      <Text variant="headlineMedium">Gym Tracker</Text>
      <Text style={{ marginTop: 8 }}>Mobile app scaffold</Text>
      <Button onPress={() => navigation.navigate('Workouts')} style={{ marginTop: 12 }}>
        Go to Workouts
      </Button>
    </View>
  );
}
