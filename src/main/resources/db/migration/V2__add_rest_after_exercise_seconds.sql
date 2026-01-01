DO $$
BEGIN
    -- Add column to workout_exercises if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workout_exercises' 
        AND column_name = 'rest_after_exercise_seconds'
    ) THEN
        RAISE NOTICE 'Adding rest_after_exercise_seconds column to workout_exercises table';
        ALTER TABLE workout_exercises 
        ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'rest_after_exercise_seconds column already exists in workout_exercises table';
    END IF;

    -- Add column to session_exercises if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'session_exercises' 
        AND column_name = 'rest_after_exercise_seconds'
    ) THEN
        RAISE NOTICE 'Adding rest_after_exercise_seconds column to session_exercises table';
        ALTER TABLE session_exercises 
        ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'rest_after_exercise_seconds column already exists in session_exercises table';
    END IF;

    -- Add column to template_exercises if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'template_exercises' 
        AND column_name = 'rest_after_exercise_seconds'
    ) THEN
        RAISE NOTICE 'Adding rest_after_exercise_seconds column to template_exercises table';
        ALTER TABLE template_exercises 
        ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'rest_after_exercise_seconds column already exists in template_exercises table';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Migration failed: %', SQLERRM;
END $$;
