import { Exercise, ExerciseSearchParams, ExerciseResponse } from '../types/exercise';

// TODO: Replace with your actual API endpoint
const API_BASE_URL = 'https://api.example.com'; // Replace with your API

class ExerciseService {
  async searchExercises(params: ExerciseSearchParams = {}): Promise<ExerciseResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.searchTerm) queryParams.append('search', params.searchTerm);
      if (params.category) queryParams.append('category', params.category);
      if (params.muscleGroup) queryParams.append('muscle', params.muscleGroup);
      if (params.equipment) queryParams.append('equipment', params.equipment);
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());

      const response = await fetch(`${API_BASE_URL}/exercises?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        exercises: data.exercises || [],
        total: data.total || 0,
        hasMore: data.hasMore || false,
      };
    } catch (error) {
      console.error('Error searching exercises:', error);
      // Return mock data for development
      return this.getMockExercises(params);
    }
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/exercises/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching exercise:', error);
      // Return mock exercise for development
      const mockExercises = this.getMockExercises().exercises;
      return mockExercises.find(ex => ex.id === id) || null;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return mock categories for development
      return ['Cardio', 'Strength', 'Flexibility', 'Balance', 'Sports'];
    }
  }

  private getMockExercises(params: ExerciseSearchParams = {}): ExerciseResponse {
    const mockExercises: Exercise[] = [
      {
        id: '1',
        name: 'Push-up',
        description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
        category: 'Strength',
        muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner',
        instructions: [
          'Start in plank position with hands shoulder-width apart',
          'Lower your body until chest nearly touches the floor',
          'Push back up to starting position',
          'Keep your body straight throughout the movement'
        ],
        tips: ['Keep core engaged', 'Breathe out when pushing up'],
      },
      {
        id: '2',
        name: 'Squat',
        description: 'Fundamental lower body exercise for legs and glutes',
        category: 'Strength',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower your body as if sitting in a chair',
          'Keep your back straight and chest up',
          'Return to starting position'
        ],
        tips: ['Keep knees behind toes', 'Go as low as comfortable'],
      },
      {
        id: '3',
        name: 'Running',
        description: 'Cardiovascular exercise that improves endurance',
        category: 'Cardio',
        muscleGroups: ['Legs', 'Core', 'Cardio'],
        equipment: ['None'],
        difficulty: 'beginner',
        instructions: [
          'Start with a warm-up walk',
          'Gradually increase pace to a jog',
          'Maintain steady breathing',
          'Cool down with walking'
        ],
        tips: ['Wear proper shoes', 'Stay hydrated'],
      },
      {
        id: '4',
        name: 'Plank',
        description: 'Core strengthening exercise',
        category: 'Strength',
        muscleGroups: ['Core', 'Shoulders'],
        equipment: ['Bodyweight'],
        difficulty: 'beginner',
        instructions: [
          'Start in push-up position',
          'Hold body straight like a plank',
          'Engage core muscles',
          'Hold for desired time'
        ],
        tips: ['Keep hips level', "Don't let back sag"],
      },
      {
        id: '5',
        name: 'Lunge',
        description: 'Single-leg exercise for lower body strength',
        category: 'Strength',
        muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
        equipment: ['Bodyweight'],
        difficulty: 'intermediate',
        instructions: [
          'Step forward with one leg',
          'Lower hips until both knees are bent at 90 degrees',
          'Push back to starting position',
          'Alternate legs'
        ],
        tips: ['Keep front knee behind toes', 'Keep torso upright'],
      },
    ];

    // Filter based on search params
    let filteredExercises = mockExercises;
    
    if (params.searchTerm) {
      filteredExercises = filteredExercises.filter(ex =>
        ex.name.toLowerCase().includes(params.searchTerm!.toLowerCase()) ||
        ex.description?.toLowerCase().includes(params.searchTerm!.toLowerCase())
      );
    }
    
    if (params.category) {
      filteredExercises = filteredExercises.filter(ex =>
        ex.category.toLowerCase() === params.category!.toLowerCase()
      );
    }
    
    if (params.muscleGroup) {
      filteredExercises = filteredExercises.filter(ex =>
        ex.muscleGroups.some(mg => 
          mg.toLowerCase().includes(params.muscleGroup!.toLowerCase())
        )
      );
    }

    const limit = params.limit || 10;
    const offset = params.offset || 0;
    const paginatedExercises = filteredExercises.slice(offset, offset + limit);

    return {
      exercises: paginatedExercises,
      total: filteredExercises.length,
      hasMore: offset + limit < filteredExercises.length,
    };
  }
}

export const exerciseService = new ExerciseService();
