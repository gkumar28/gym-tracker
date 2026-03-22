export interface Session {
    id: string;
    workoutId?: string;
    sessionExercises?: any[];
    sessionDate?: string;
    durationMinutes?: number;
}