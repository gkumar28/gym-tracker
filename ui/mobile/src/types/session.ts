import { ExerciseItem } from "./common";

export interface Session {
    id: number;
    workoutId?: number;
    workoutName?: string;
    workout?: {
        id: string;
        name: string;
    };
    sessionItems?: ExerciseItem[];
    sessionDate?: string;
    durationMinutes?: number;
    notes?: string;
    exerciseCount?: number;
}