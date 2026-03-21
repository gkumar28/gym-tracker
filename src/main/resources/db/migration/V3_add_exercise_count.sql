DO $$
BEGIN
    -- Add column to exercise_count to workout table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'workout' 
        AND column_name = 'exercise_count'
    ) THEN
        RAISE NOTICE 'Adding exercise_count column to workout table';
        ALTER TABLE workout 
        ADD COLUMN exercise_count INTEGER DEFAULT 0;
        
        UPDATE workout
        SET exercise_count = 0
        WHERE exercise_count IS NULL;
        
        UPDATE workout w
            SET exercise_count = sub.count
            FROM (
                SELECT workout_id, COUNT(*) AS count
                FROM workout_exercise
                GROUP BY workout_id
            ) sub
            WHERE w.id = sub.workout_id;
    ELSE
        RAISE NOTICE 'exercise_count column already exists in workout table';
    END IF;

    -- Add column to exercise_count to session table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'session' 
        AND column_name = 'exercise_count'
    ) THEN
        RAISE NOTICE 'Adding exercise_count column to session table';
        ALTER TABLE session 
        ADD COLUMN exercise_count INTEGER DEFAULT 0;

        UPDATE session
        SET exercise_count = 0
        WHERE exercise_count IS NULL;

        UPDATE session s
            SET exercise_count = sub.count
            FROM (
                SELECT session_id, COUNT(*) AS count
                FROM session_exercise
                GROUP BY session_id
            ) sub
            WHERE s.id = sub.session_id;
    ELSE
        RAISE NOTICE 'exercise_count column already exists in session table';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Migration failed: %', SQLERRM;
END $$;
