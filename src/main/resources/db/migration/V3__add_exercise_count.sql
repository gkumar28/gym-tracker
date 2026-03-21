DO $$
BEGIN
    -- Add column to exercise_count to workouts table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workouts' 
        AND column_name = 'exercise_count'
    ) THEN
        RAISE NOTICE 'Adding exercise_count column to workouts table';
        ALTER TABLE workouts 
        ADD COLUMN exercise_count INTEGER DEFAULT 0;
        
        UPDATE workouts w
            SET exercise_count = sub.count
            FROM (
                SELECT workout_id, COUNT(*) AS count
                FROM workout_exercises
                GROUP BY workout_id
            ) sub
            WHERE w.id = sub.workout_id;

        UPDATE workouts
        SET exercise_count = 0
        WHERE exercise_count IS NULL;
    ELSE
        RAISE NOTICE 'exercise_count column already exists in workouts table';
    END IF;

    -- Add column to exercise_count to sessions table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sessions' 
        AND column_name = 'exercise_count'
    ) THEN
        RAISE NOTICE 'Adding exercise_count column to sessions table';
        ALTER TABLE sessions 
        ADD COLUMN exercise_count INTEGER DEFAULT 0;

        UPDATE sessions s
            SET exercise_count = sub.count
            FROM (
                SELECT session_id, COUNT(*) AS count
                FROM session_exercises
                GROUP BY session_id
            ) sub
            WHERE s.id = sub.session_id;

        UPDATE sessions
        SET exercise_count = 0
        WHERE exercise_count IS NULL;
    ELSE
        RAISE NOTICE 'exercise_count column already exists in sessions table';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Migration failed: %', SQLERRM;
END $$;
