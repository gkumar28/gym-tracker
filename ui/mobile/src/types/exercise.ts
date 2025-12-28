export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  imageUrl?: string;
  videoUrl?: string;
  tips?: string[];
  variations?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  exerciseCount?: number;
}

export interface ExerciseSearchParams {
  searchTerm?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}

export interface ExerciseResponse {
  exercises: Exercise[];
  total: number;
  hasMore: boolean;
}
