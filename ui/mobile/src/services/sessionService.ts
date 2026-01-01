// src/services/sessionService.ts
import { baseApi } from './api';

export interface Session {
  id: string;
  workoutId?: string;
  workout?: {
    id: string;
    name: string;
  };
  sessionExercises?: any[];
  sessionDate?: string;
  durationMinutes?: number;
  notes?: string;
}

export interface PaginatedSessionResponse {
  items: Session[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

export interface SessionSearchParams {
  page?: number;
  size?: number;
  sort?: string;
  workoutId?: string;
  dateFrom?: string;
  dateTo?: string;
  minDuration?: number;
  maxDuration?: number;
  search?: string; // Search by workout name or notes
}

export class SessionService {
  // Search sessions with pagination and filters
  async searchSessions(params?: SessionSearchParams): Promise<PaginatedSessionResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page !== undefined) queryParams.append('page', params.page.toString());
      if (params?.size !== undefined) queryParams.append('size', params.size.toString());
      if (params?.sort) queryParams.append('sort', params.sort);
      if (params?.workoutId) queryParams.append('workoutId', params.workoutId);
      if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
      if (params?.minDuration !== undefined) queryParams.append('minDuration', params.minDuration.toString());
      if (params?.maxDuration !== undefined) queryParams.append('maxDuration', params.maxDuration.toString());
      if (params?.search) queryParams.append('search', params.search);
      
      const url = queryParams.toString() ? `/session/search?${queryParams.toString()}` : '/session/search';
      const response = await baseApi.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to search sessions:', error);
      throw error;
    }
  }

  // Get session by ID
  async getSessionById(id: string): Promise<Session | null> {
    try {
      const response = await baseApi.get(`/session/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch session:', error);
      throw error;
    }
  }

  // Get sessions for a specific workout
  async getSessionsForWorkout(workoutId: string): Promise<Session[]> {
    try {
      const response = await baseApi.get(`/session/workout/${workoutId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sessions for workout:', error);
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

  // Update session
  async updateSession(id: string, session: Partial<Session>): Promise<Session> {
    try {
      const response = await baseApi.put(`/session/${id}`, session);
      return response.data;
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  }

  // Delete session
  async deleteSession(id: string): Promise<void> {
    try {
      await baseApi.delete(`/session/${id}`);
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  }
}

export const sessionService = new SessionService();
