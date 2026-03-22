import { ExerciseItem } from "./common";

export interface Workout {
  id: number;
  name?: string;
  createdAt?: string;
  exerciseCount?: number;
  workoutItems?: ExerciseItem[];
}