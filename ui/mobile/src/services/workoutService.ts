// src/services/workoutService.ts
import { PaginatedResponse } from '../types/api';
import { Workout, WorkoutItem } from '../types/workout';
import { baseApi } from './api';
import { Session } from './sessionService';

export interface WorkoutSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  name?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

export function getWorkoutItems(workoutExercises) {
  const items: WorkoutItem[] = [];

  for (let i = 0;i < workoutExercises.length;i++) {
    let exercise = workoutExercises[i];
    items.push({
      type: 'EXERCISE',
      data: {
        exerciseName: exercise.exerciseName,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          restSeconds: set.restSeconds,
        })),
      },
    });

    // 2. Add the Rest item if a rest duration exists
    if (i != workoutExercises.length - 1) {
      items.push({
        type: 'REST',
        data: {
          restAfterExercise: exercise.restAfterExerciseSeconds,
        },
      });
    }
  }

  return items;
}

export function getWorkoutExercisesEntity(workoutItems: WorkoutItem[]) {
  const workoutExercises = [];
  for (let i = 0; i < workoutItems?.length; i++) {
    const item = workoutItems[i];
  
    if (item.type === 'EXERCISE') {
      let restAfter = 0;
      const nextItem = workoutItems[i + 1];
      if (nextItem && nextItem.type === "REST") {
        restAfter = nextItem.data.restAfterExercise;
      }
  
      workoutExercises.push({
        exerciseName: item.data.exerciseName,
        sets: item.data.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
          restSeconds: set.restSeconds,
        })),
        restAfterExerciseSeconds: restAfter,
      });
    }
  }
  workoutExercises.forEach((exercise, index) => {
    exercise.exerciseOrder = index;
  });

  return workoutExercises;
}

export class WorkoutService {
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
      response.data.workoutItems = getWorkoutItems(response.data?.workoutExercises);
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
      workoutEntity.workoutExercises = getWorkoutExercisesEntity(workout.workoutItems);
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
