// src/services/workoutService.ts
import { baseApi } from './api';

export interface Workout {
  id: string;
  name?: string;
  createdAt?: string;
  sets?: any[];
}

export interface Session {
  id: string;
  workoutId?: string;
  sessionExercises?: any[];
  sessionDate?: string;
  durationMinutes?: number;
}

export class WorkoutService {
  // Get all workouts
  async getWorkouts(): Promise<Workout[]> {
    try {
      const response = await baseApi.get('/workout');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
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
