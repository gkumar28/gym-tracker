-- V1: Create entity schemas for gym-tracker

-- exercises
CREATE TABLE exercises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo VARCHAR(1000),
    description VARCHAR(2000),
    category VARCHAR(255) NOT NULL,
    difficulty VARCHAR(255) NOT NULL,
    image_url VARCHAR(1000),
    video_url VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- exercise_muscle_groups (element collection)
CREATE TABLE exercise_muscle_groups (
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    muscle_group VARCHAR(255),
    PRIMARY KEY (exercise_id, muscle_group)
);

-- exercise_equipment (element collection)
CREATE TABLE exercise_equipment (
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    equipment VARCHAR(255),
    PRIMARY KEY (exercise_id, equipment)
);

-- exercise_instructions (element collection)
CREATE TABLE exercise_instructions (
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    instruction VARCHAR(1000),
    instruction_order INTEGER,
    PRIMARY KEY (exercise_id, instruction_order)
);

-- exercise_tips (element collection)
CREATE TABLE exercise_tips (
    exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    tip VARCHAR(500),
    tip_order INTEGER,
    PRIMARY KEY (exercise_id, tip_order)
);

-- workouts
CREATE TABLE workouts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- templates
CREATE TABLE templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- workout_exercises
CREATE TABLE workout_exercises (
    id BIGSERIAL PRIMARY KEY,
    workout_id BIGINT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_order INTEGER
);

-- workout_exercise_sets (embeddable Set)
CREATE TABLE workout_exercise_sets (
    workout_exercise_id BIGINT NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
    reps INTEGER,
    weight DOUBLE PRECISION,
    rest_seconds INTEGER,
    notes VARCHAR(255)
);

CREATE INDEX idx_workout_exercise_sets_exercise_id ON workout_exercise_sets(workout_exercise_id);

-- template_exercises
CREATE TABLE template_exercises (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_order INTEGER
);

-- template_exercise_sets (embeddable Set)
CREATE TABLE template_exercise_sets (
    template_exercise_id BIGINT NOT NULL REFERENCES template_exercises(id) ON DELETE CASCADE,
    reps INTEGER,
    weight DOUBLE PRECISION,
    rest_seconds INTEGER,
    notes VARCHAR(255)
);

CREATE INDEX idx_template_exercise_sets_exercise_id ON template_exercise_sets(template_exercise_id);

-- sessions
CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    workout_id BIGINT REFERENCES workouts(id) ON DELETE SET NULL,
    session_date TIMESTAMP NOT NULL,
    notes VARCHAR(1000),
    duration_minutes INTEGER,
    created_at TIMESTAMP
);

-- session_exercises
CREATE TABLE session_exercises (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_order INTEGER
);

-- session_exercise_sets (embeddable Set)
CREATE TABLE session_exercise_sets (
    session_exercise_id BIGINT NOT NULL REFERENCES session_exercises(id) ON DELETE CASCADE,
    reps INTEGER,
    weight DOUBLE PRECISION,
    rest_seconds INTEGER,
    notes VARCHAR(255)
);

CREATE INDEX idx_session_exercise_sets_exercise_id ON session_exercise_sets(session_exercise_id);

-- Additional indexes for common queries
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_template_exercises_template_id ON template_exercises(template_id);
CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX idx_sessions_workout_id ON sessions(workout_id);
CREATE INDEX idx_sessions_session_date ON sessions(session_date);
