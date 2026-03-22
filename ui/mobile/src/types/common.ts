import { Exercise } from "./exercise";

export interface Set {
    id?: string;
    reps?: number;
    weight?: number;
    restSeconds?: number; 
    notes?: string;
  }
  
  export interface ExerciseSet {
    id?: string;
    exerciseName?: string;
    sets?: Set[];
    exerciseOrder?: number;
    details?: Exercise
  }
  
  export interface RestAfterExercise {
    restAfterExercise?: number;
  }
  
  export type ExerciseItem =
  | {
      type: "EXERCISE";
      data: ExerciseSet;
    }
  | {
      type: "REST";
      data: RestAfterExercise;
    };