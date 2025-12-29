import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomTabBar from '../components/CustomTabBar';
import HomeScreen from '../screens/HomeScreen';
import WorkoutsList from '../screens/Workouts/WorkoutsList';
import WorkoutDetail from '../screens/Workouts/WorkoutDetail';
import CreateWorkout from '../screens/Workouts/CreateWorkout';
import SessionList from '../screens/Sessions/SessionList';
import CreateSession from '../screens/Sessions/CreateSession';
import ExerciseSearch from '../screens/Exercises/ExerciseSearch';
import { ErrorScreen } from '../screens/ErrorScreen';

export type RootStackParamList = {
  Home: undefined;
  WorkoutsList: undefined;
  WorkoutDetail: { id: string };
  CreateWorkout: undefined;
  Error: { error?: string };
};

export type RootTabParamList = {
  Home: undefined;
  Workouts: undefined;
  Sessions: undefined;
  Exercises: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function WorkoutsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutsList" component={WorkoutsList} options={{ title: 'Workouts' }} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} options={{ title: 'Workout' }} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{ title: 'Create Workout' }} />
      <Stack.Screen name="Error" component={ErrorScreen} options={{ title: 'Error', headerShown: false }} />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Workouts" component={WorkoutsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Sessions" component={SessionList} options={{ headerShown: false }} />
      <Tab.Screen name="Exercises" component={ExerciseSearch} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
