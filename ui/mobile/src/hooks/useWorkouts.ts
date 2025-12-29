import { useQuery } from '@tanstack/react-query';
import { workoutService, Workout } from '../services/workoutService';

export const fetchWorkouts = async (): Promise<Workout[]> => {
  return workoutService.getWorkouts();
};

export const fetchWorkoutById = async (id: string): Promise<Workout | null> => {
  return workoutService.getWorkoutById(id);
};

export const useWorkouts = () => {
  return useQuery<Workout[], Error>({
    queryKey: ['workouts'] as const,
    queryFn: () => fetchWorkouts(),
  });
};

export const useWorkoutById = (id: string) => {
  return useQuery<Workout | null, Error>({
    queryKey: ['workout', id] as const,
    queryFn: () => fetchWorkoutById(id),
    enabled: !!id,
  });
};
