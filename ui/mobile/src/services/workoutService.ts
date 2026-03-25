// src/services/workoutService.ts
import { PaginatedResponse } from '../types/api';
import { ExerciseItem } from '../types/common';
import { Session } from '../types/session';
import { Workout } from '../types/workout';
import { getExerciseEntity, getExerciseItems } from '../utils/generic';
import { baseApi } from './api';

export interface WorkoutSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  name?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

class WorkoutService {
  // Search workouts with pagination and filters
  async searchWorkouts(params?: WorkoutSearchParams): Promise<PaginatedResponse<Workout>> {
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
  async getWorkoutById(id: number): Promise<Workout | null> {
    try {
      const response = await baseApi.get(`/workout/${id}`);
      response.data.workoutItems = getExerciseItems(response.data?.workoutExercises);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch workout:', error);
      throw error;
    }
  }

  // Create new workout
  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<Workout> {
    try {
      let workoutEntity: any = workout;
      workoutEntity.workoutExercises = getExerciseEntity(workout.workoutItems);
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
