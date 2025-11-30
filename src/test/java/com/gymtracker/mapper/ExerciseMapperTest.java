package com.gymtracker.mapper;

import com.gymtracker.entity.Exercise;
import com.gymtracker.schemaobject.ExerciseSO;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ExerciseMapperTest {

    @Test
    void testToSO() {
        Exercise exercise = new Exercise(1L, "Bench Press", "logo.png");
        ExerciseSO so = ExerciseMapper.toSO(exercise);

        assertNotNull(so);
        assertEquals(1L, so.getId());
        assertEquals("Bench Press", so.getName());
        assertEquals("logo.png", so.getLogo());
    }

    @Test
    void testToSO_Null() {
        ExerciseSO so = ExerciseMapper.toSO(null);
        assertNull(so);
    }

    @Test
    void testToEntity() {
        ExerciseSO so = new ExerciseSO(1L, "Bench Press", "logo.png");
        Exercise exercise = ExerciseMapper.toEntity(so);

        assertNotNull(exercise);
        assertEquals(1L, exercise.getId());
        assertEquals("Bench Press", exercise.getName());
        assertEquals("logo.png", exercise.getLogo());
    }

    @Test
    void testToEntity_Null() {
        Exercise exercise = ExerciseMapper.toEntity(null);
        assertNull(exercise);
    }

    @Test
    void testToSOList() {
        List<Exercise> exercises = Arrays.asList(
            new Exercise(1L, "Bench Press", "logo1.png"),
            new Exercise(2L, "Squat", "logo2.png")
        );

        List<ExerciseSO> exerciseSOs = ExerciseMapper.toSOList(exercises);

        assertNotNull(exerciseSOs);
        assertEquals(2, exerciseSOs.size());
        assertEquals("Bench Press", exerciseSOs.get(0).getName());
        assertEquals("Squat", exerciseSOs.get(1).getName());
    }

    @Test
    void testToSOList_Null() {
        List<ExerciseSO> exerciseSOs = ExerciseMapper.toSOList(null);
        assertNull(exerciseSOs);
    }

    @Test
    void testToEntityList() {
        List<ExerciseSO> exerciseSOs = Arrays.asList(
            new ExerciseSO(1L, "Bench Press", "logo1.png"),
            new ExerciseSO(2L, "Squat", "logo2.png")
        );

        List<Exercise> exercises = ExerciseMapper.toEntityList(exerciseSOs);

        assertNotNull(exercises);
        assertEquals(2, exercises.size());
        assertEquals("Bench Press", exercises.get(0).getName());
        assertEquals("Squat", exercises.get(1).getName());
    }

    @Test
    void testToEntityList_Null() {
        List<Exercise> exercises = ExerciseMapper.toEntityList(null);
        assertNull(exercises);
    }
}

