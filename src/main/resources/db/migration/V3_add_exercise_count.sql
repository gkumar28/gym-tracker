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
    ELSE
        RAISE NOTICE 'exercise_count column already exists in workout table';
    END IF;

    -- Add column to exercise_count to session table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'session' 
        AND column_name = 'exercise_count'
    ) THEN
        RAISE NOTICE 'Adding rest_after_exercise_seconds column to session table';
        ALTER TABLE exercise_count 
        ADD COLUMN rest_after_exercise_seconds INTEGER DEFAULT 0;
    ELSE
        RAISE NOTICE 'exercise_count column already exists in session table';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Migration failed: %', SQLERRM;
END $$;
