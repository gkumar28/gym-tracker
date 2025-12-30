-- Add restAfterExerciseSeconds column to workout_exercises table
ALTER TABLE workout_exercises 
ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;

-- Add restAfterExerciseSeconds column to session_exercises table  
ALTER TABLE session_exercises 
ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;

-- Add restAfterExerciseSeconds column to template_exercises table
ALTER TABLE template_exercises 
ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;
