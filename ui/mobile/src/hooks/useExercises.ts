import { useQuery } from '@tanstack/react-query';
import { exerciseService, Exercise, ExerciseSearchParams, PaginatedExerciseResponse } from '../services/exerciseService';

// Re-export types for convenience
export type { Exercise, ExerciseSearchParams, PaginatedExerciseResponse };

export const useExercises = (params: ExerciseSearchParams = {}) => {
  return useQuery<PaginatedExerciseResponse, Error>({
    queryKey: ['exercises', params] as const,
    queryFn: () => exerciseService.searchExercises(params),
    enabled: true,
  });
};

export const useExerciseById = (id: string) => {
  return useQuery<Exercise | null, Error>({
    queryKey: ['exercise', id] as const,
    queryFn: () => exerciseService.getExerciseById(id),
    enabled: !!id,
  });
};

export const useExerciseCategories = () => {
  return useQuery<string[], Error>({
    queryKey: ['exerciseCategories'] as const,
    queryFn: () => exerciseService.getCategories(),
  });
};
