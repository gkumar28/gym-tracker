export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  restSeconds: number;  // Per-set rest (UI will manage this)
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
  restAfterExercise?: number;  // Exercise-level rest (backend only for now)
}
