import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export interface Workout {
  id: string;
  name?: string;
  createdAt?: string;
  sets?: any[];
}

export const fetchWorkouts = async (): Promise<Workout[]> => {
  const res = await api.get('/api/workout');
  return res.data;
};

export const useWorkouts = () => {
  return useQuery<Workout[], Error>({
    queryKey: ['workouts'] as const,
    queryFn: () => fetchWorkouts(),
  });
};
