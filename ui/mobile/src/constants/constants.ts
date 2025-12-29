// src/constants/constants.ts
export const API_CONSTANTS = {
  // API URLs
  BASE_URL: 'http://localhost:8080/api', // Will be overridden by ConfigProvider
  EXERCISE_ENDPOINT: '/exercise',
  SESSION_ENDPOINT: '/session',
  WORKOUT_ENDPOINT: '/workout',
  TEMPLATE_ENDPOINT: '/template',
  
  // Timeouts
  REQUEST_TIMEOUT: 10000,
  
  // Pagination
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100,
  
  // Exercise-specific
  DIFFICULTY_LEVELS: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const,
  DEFAULT_CATEGORIES: ['Strength', 'Cardio', 'Flexibility'] as const,
  
  // Cache durations (in milliseconds)
  CACHE_DURATION: {
    EXERCISES: 5 * 60 * 1000, // 5 minutes
    CATEGORIES: 30 * 60 * 1000, // 30 minutes
  },
} as const;

export const UI_CONSTANTS = {
  // Screen names
  SCREEN_NAMES: {
    EXERCISE_LIST: 'ExerciseList',
    EXERCISE_DETAIL: 'ExerciseDetail',
    EXERCISE_SEARCH: 'ExerciseSearch',
    WORKOUT_SESSION: 'WorkoutSession',
  },
  
  // Animation durations
  ANIMATION_DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  
  // Layout
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  NOT_FOUND: 'Exercise not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Invalid input provided.',
} as const;

// Type exports for better TypeScript support
export type DifficultyLevel = typeof API_CONSTANTS.DIFFICULTY_LEVELS[number];
export type ExerciseCategory = typeof API_CONSTANTS.DEFAULT_CATEGORIES[number];
export type ScreenName = typeof UI_CONSTANTS.SCREEN_NAMES[keyof typeof UI_CONSTANTS.SCREEN_NAMES];
