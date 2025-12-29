// src/services/exerciseService.ts
import { exerciseApi } from './api';
import { API_CONSTANTS, ERROR_MESSAGES } from '../constants/constants';
import { ConfigProvider } from '../config/configProvider';

export interface ExerciseSearchParams {
  search?: string;
  category?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedExerciseResponse {
  items: Exercise[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

export interface Exercise {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  instructions?: string[];
  tips?: string[];
  imageUrl?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class ExerciseService {
  private config = ConfigProvider.getInstance();
  
  // Search exercises with filters
  async searchExercises(params: ExerciseSearchParams = {}): Promise<PaginatedExerciseResponse> {
    try {
      const response = await exerciseApi.get<PaginatedExerciseResponse>('/search', {
        params: {
          search: params.search,
          category: params.category,
          muscle: params.muscle,
          equipment: params.equipment,
          difficulty: params.difficulty,
          limit: params.limit || API_CONSTANTS.DEFAULT_LIMIT,
          offset: params.offset || API_CONSTANTS.DEFAULT_OFFSET,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.NETWORK, error);
      throw error;
    }
  }

  // Get exercise by ID
  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const response = await exerciseApi.get<Exercise>(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.NETWORK, error);
      throw error;
    }
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await exerciseApi.get<string[]>('/categories');
      return response.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.NETWORK, error);
      // Fallback to default categories for development
      return [...API_CONSTANTS.DEFAULT_CATEGORIES];
    }
  }

  // Create new exercise
  async createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    try {
      const response = await exerciseApi.post<Exercise>('', exercise);
      return response.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.NETWORK, error);
      throw error;
    }
  }
}

export const exerciseService = new ExerciseService();
