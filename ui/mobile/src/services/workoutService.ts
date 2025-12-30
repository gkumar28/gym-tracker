// src/services/workoutService.ts
import { baseApi } from './api';

export interface Workout {
  id: string;
  name?: string;
  createdAt?: string;
  workoutExercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id?: string;
  exerciseName?: string;
  sets?: WorkoutSet[];
  exerciseOrder?: number;
  restAfterExerciseSeconds?: number;
}

export interface WorkoutSet {
  reps?: number;
  weight?: number;
  restSeconds?: number;
  notes?: string;
}

export interface Session {
  id: string;
  workoutId?: string;
  sessionExercises?: any[];
  sessionDate?: string;
  durationMinutes?: number;
}

export interface PaginatedWorkoutResponse {
  items: Workout[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

export interface WorkoutSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  name?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

export class WorkoutService {
  // Search workouts with pagination and filters
  async searchWorkouts(params?: WorkoutSearchParams): Promise<PaginatedWorkoutResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.name) queryParams.append('name', params.name);
      if (params?.createdDateFrom) queryParams.append('createdDateFrom', params.createdDateFrom);
      if (params?.createdDateTo) queryParams.append('createdDateTo', params.createdDateTo);
      
      const url = queryParams.toString() ? `/workout?${queryParams.toString()}` : '/workout';
      const response = await baseApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to search workouts:', error);
      throw error;
    }
  }

  // Get workout by ID
  async getWorkoutById(id: string): Promise<Workout | null> {
    try {
      const response = await baseApi.get(`/workout/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch workout:', error);
      throw error;
    }
  }

  // Create new workout
  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    try {
      const response = await baseApi.post('/workout', workout);
      return response.data;
    } catch (error) {
      console.error('Failed to create workout:', error);
      throw error;
    }
  }

  // Get sessions for a workout
  async getSessions(workoutId: string): Promise<Session[]> {
    try {
      const response = await baseApi.get(`/session/workout/${workoutId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      throw error;
    }
  }

  // Get all sessions
  async getAllSessions(): Promise<Session[]> {
    try {
      const response = await baseApi.get('/session');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch all sessions:', error);
      throw error;
    }
  }

  // Create new session
  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    try {
      const response = await baseApi.post('/session', session);
      return response.data;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }
}

export const workoutService = new WorkoutService();
