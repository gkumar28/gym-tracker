import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CustomTabBar from '../components/CustomTabBar';
import HomeScreen from '../screens/HomeScreen';
import WorkoutsList from '../screens/Workouts/WorkoutsList';
import WorkoutDetail from '../screens/Workouts/WorkoutDetail';
import CreateWorkout from '../screens/Workouts/CreateWorkout';
import SessionList from '../screens/Sessions/SessionList';
import CreateSession from '../screens/Sessions/CreateSession';
import ExerciseSearch from '../screens/Exercises/ExerciseSearch';
import { ErrorScreen } from '../screens/ErrorScreen';
import { useTheme } from '../hooks/useTheme';

// Create a navigation ref that can be accessed globally
export const navigationRef = React.createRef<any>();

const refreshWorkouts = () => {
  navigationRef.current?.navigate('Workouts', { refresh: true });
};

const refreshSessions = () => {
  navigationRef.current?.navigate('Sessions', { refresh: true });
};

const refreshExercises = () => {
  navigationRef.current?.navigate('Exercises', { refresh: true });
};

export { refreshWorkouts, refreshSessions, refreshExercises };

export default function RootNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Workouts" component={WorkoutsStack} options={{ headerShown: false }} />
      <Tab.Screen name="CreateSession" component={CreateSession} options={{ headerShown: false }} />
      <Tab.Screen name="Exercises" component={ExerciseSearch} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export type RootStackParamList = {
  Home: undefined;
  WorkoutsList: { refresh?: boolean };
  WorkoutDetail: { id: string };
  CreateWorkout: undefined;
  SessionList: { workoutId?: string };
  Error: { error?: string };
};

export type RootTabParamList = {
  Home: undefined;
  Workouts: undefined;
  CreateSession: undefined;
  Exercises: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function WorkoutsStack() {
  const theme = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.surface,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="WorkoutsList" component={WorkoutsList} options={{ title: 'Workouts' }} />
      <Stack.Screen name="WorkoutDetail" component={WorkoutDetail} options={{ title: 'Workout' }} />
      <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{ title: 'Create Workout' }} />
      <Stack.Screen name="SessionList" component={SessionList} options={{ title: 'Sessions' }} />
      <Stack.Screen name="Error" component={ErrorScreen} options={{ title: 'Error', headerShown: false }} />
    </Stack.Navigator>
  );
}

