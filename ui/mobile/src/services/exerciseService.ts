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
    if (this.config.getFeatureFlags().enableMockData) {
      return this.getMockExercises(params);
    }
    
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
      // Fallback to mock data for development
      return this.getMockExercises(params);
    }
  }

  // Get exercise by ID
  async getExerciseById(id: string): Promise<Exercise | null> {
    if (this.config.getFeatureFlags().enableMockData) {
      const mockExercises = this.getMockExercises().items;
      return mockExercises.find(ex => ex.id === parseInt(id)) || null;
    }
    
    try {
      const response = await exerciseApi.get<Exercise>(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.NETWORK, error);
      // Fallback to mock exercise for development
      const mockExercises = this.getMockExercises().items;
      return mockExercises.find(ex => ex.id === parseInt(id)) || null;
    }
  }

  // Get all categories
  async getCategories(): Promise<string[]> {
    if (this.config.getFeatureFlags().enableMockData) {
      return [...API_CONSTANTS.DEFAULT_CATEGORIES];
    }
    
    try {
      const response = await exerciseApi.get<string[]>('/categories');
      return response.data;
    } catch (error) {
      console.error(ERROR_MESSAGES.NETWORK, error);
      // Fallback to mock categories
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

  // Mock data fallback
  private getMockExercises(params: ExerciseSearchParams = {}): PaginatedExerciseResponse {
    const mockExercises: Exercise[] = [
      {
        id: 1,
        name: 'Bench Press',
        description: 'Compound chest exercise targeting chest, shoulders, and triceps',
        category: 'Strength',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: ['Barbell', 'Bench'],
        difficulty: 'INTERMEDIATE',
        instructions: [
          'Lie on bench with feet flat on floor',
          'Grip bar slightly wider than shoulder width',
          'Lower bar to chest slowly',
          'Press bar up until arms are fully extended'
        ],
        tips: [
          'Keep back flat against bench',
          'Control the movement',
          'Don\'t bounce the bar off your chest'
        ],
        imageUrl: 'https://example.com/bench-press.jpg',
        videoUrl: 'https://example.com/bench-press.mp4',
        createdAt: '2025-12-29T10:00:00Z',
        updatedAt: '2025-12-29T10:00:00Z'
      },
      {
        id: 2,
        name: 'Squat',
        description: 'Compound leg exercise targeting quadriceps, glutes, and hamstrings',
        category: 'Strength',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: ['Barbell', 'Squat Rack'],
        difficulty: 'BEGINNER',
        instructions: [
          'Stand with bar across upper back',
          'Feet shoulder-width apart',
          'Lower body until thighs are parallel to floor',
          'Drive through heels to return to standing'
        ],
        tips: [
          'Keep chest up and back straight',
          'Knees should track over toes',
          'Go as low as comfortable'
        ],
        imageUrl: 'https://example.com/squat.jpg',
        videoUrl: 'https://example.com/squat.mp4',
        createdAt: '2025-12-29T10:00:00Z',
        updatedAt: '2025-12-29T10:00:00Z'
      },
      {
        id: 3,
        name: 'Deadlift',
        description: 'Full body exercise focusing on posterior chain',
        category: 'Strength',
        muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
        equipment: ['Barbell'],
        difficulty: 'ADVANCED',
        instructions: [
          'Stand with bar over mid-foot',
          'Bend at hips and knees to grip bar',
          'Lift bar by extending hips and knees',
          'Lower bar with controlled movement'
        ],
        tips: [
          'Keep back straight throughout',
          'Drive through heels',
          'Don\'t round your lower back'
        ],
        imageUrl: 'https://example.com/deadlift.jpg',
        videoUrl: 'https://example.com/deadlift.mp4',
        createdAt: '2025-12-29T10:00:00Z',
        updatedAt: '2025-12-29T10:00:00Z'
      }
    ];

    // Apply filters
    let filteredExercises = mockExercises;

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredExercises = filteredExercises.filter(ex => 
        ex.name.toLowerCase().includes(searchLower) ||
        ex.description?.toLowerCase().includes(searchLower)
      );
    }

    if (params.category) {
      filteredExercises = filteredExercises.filter(ex => 
        ex.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    if (params.muscle) {
      filteredExercises = filteredExercises.filter(ex => 
        ex.muscleGroups.some(mg => mg.toLowerCase() === params.muscle.toLowerCase())
      );
    }

    if (params.equipment) {
      filteredExercises = filteredExercises.filter(ex => 
        ex.equipment.some(eq => eq.toLowerCase() === params.equipment.toLowerCase())
      );
    }

    if (params.difficulty) {
      filteredExercises = filteredExercises.filter(ex => 
        ex.difficulty.toLowerCase() === params.difficulty.toLowerCase()
      );
    }

    // Apply pagination
    const limit = params.limit || API_CONSTANTS.DEFAULT_LIMIT;
    const offset = params.offset || API_CONSTANTS.DEFAULT_OFFSET;
    const startIndex = offset;
    const endIndex = startIndex + limit;
    const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

    return {
      items: paginatedExercises,
      total: filteredExercises.length,
      hasMore: endIndex < filteredExercises.length,
      offset: offset,
      limit: limit,
    };
  }
}

export const exerciseService = new ExerciseService();
