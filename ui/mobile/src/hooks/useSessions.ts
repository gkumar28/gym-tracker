import { useQuery } from '@tanstack/react-query';
import { workoutService, Session } from '../services/workoutService';

export const useSessions = (workoutId: string) => {
  return useQuery<Session[], Error>({
    queryKey: ['sessions', workoutId] as const,
    queryFn: () => workoutService.getSessions(workoutId),
    enabled: !!workoutId,
  });
};

export const useCreateSession = () => {
  // This would typically use useMutation for creating sessions
  // For now, keeping it simple as the screens handle the creation directly
  return {
    createSession: workoutService.createSession.bind(workoutService),
  };
};
