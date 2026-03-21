export interface WorkoutSet {
  id?: string;
  reps?: number;
  weight?: number;
  restSeconds?: number; 
  notes?: string;
}

export interface WorkoutExercise {
  id?: string;
  exerciseName?: string;
  sets?: WorkoutSet[];
  exerciseOrder?: number;
}

export interface WorkouteRestAfterExercise {
  restAfterExercise?: number;
}

export type WorkoutItem =
| {
    type: "EXERCISE";
    data: WorkoutExercise;
  }
| {
    type: "REST";
    data: WorkouteRestAfterExercise;
  };