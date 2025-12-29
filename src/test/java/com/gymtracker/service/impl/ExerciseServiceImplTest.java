package com.gymtracker.service.impl;

import com.gymtracker.entity.Exercise;
import com.gymtracker.repository.ExerciseRepository;
import com.gymtracker.schemaobject.ExerciseSO;
import com.gymtracker.schemaobject.PaginatedResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseServiceImplTest {

    @Mock
    private ExerciseRepository exerciseRepository;

    @InjectMocks
    private ExerciseServiceImpl exerciseService;

    private Exercise exercise;
    private ExerciseSO exerciseSO;

    @BeforeEach
    void setUp() {
        exercise = new Exercise();
        exercise.setId(1L);
        exercise.setName("Bench Press");
        exercise.setLogo("logo.png");
        exercise.setDescription("Compound chest exercise");
        exercise.setCategory("Strength");
        exercise.setDifficulty(Exercise.Difficulty.INTERMEDIATE);

        exerciseSO = new ExerciseSO();
        exerciseSO.setId(1L);
        exerciseSO.setName("Bench Press");
        exerciseSO.setLogo("logo.png");
        exerciseSO.setDescription("Compound chest exercise");
        exerciseSO.setCategory("Strength");
        exerciseSO.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
    }

    @Test
    void testSearchExercises_WithFilters() {
        String search = "bench";
        String category = "Strength";
        String muscle = "Chest";
        String equipment = "Barbell";
        String difficulty = "INTERMEDIATE";
        Integer limit = 10;
        Integer offset = 0;

        List<Exercise> exercises = Arrays.asList(exercise);

        when(exerciseRepository.searchExercises(search, category, muscle, equipment, difficulty, limit, offset))
            .thenReturn(exercises);
        when(exerciseRepository.countExercises(search, category, muscle, equipment, difficulty))
            .thenReturn(1L);

        PaginatedResponse<ExerciseSO> result = exerciseService.searchExercises(
            search, category, muscle, equipment, difficulty, limit, offset);

        assertNotNull(result);
        assertEquals(1, result.getItems().size());
        assertEquals("Bench Press", result.getItems().get(0).getName());
        assertEquals(1L, result.getTotal());
        assertFalse(result.getHasMore());
        assertEquals(offset, result.getOffset());
        assertEquals(limit, result.getLimit());
        verify(exerciseRepository).searchExercises(search, category, muscle, equipment, difficulty, limit, offset);
        verify(exerciseRepository).countExercises(search, category, muscle, equipment, difficulty);
    }

    @Test
    void testGetExerciseById() {
        when(exerciseRepository.findById(1L)).thenReturn(java.util.Optional.of(exercise));

        ExerciseSO result = exerciseService.getExerciseById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Bench Press", result.getName());
        verify(exerciseRepository).findById(1L);
    }

    @Test
    void testGetExerciseById_NotFound() {
        when(exerciseRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        assertThrows(RuntimeException.class, () -> exerciseService.getExerciseById(1L));
        verify(exerciseRepository).findById(1L);
    }

    @Test
    void testGetCategories() {
        List<String> categories = Arrays.asList("Strength", "Cardio", "Flexibility");
        when(exerciseRepository.findAllCategories()).thenReturn(categories);

        List<String> result = exerciseService.getCategories();

        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("Strength", result.get(0));
        verify(exerciseRepository).findAllCategories();
    }

    @Test
    void testCreateExercise() {
        ExerciseSO newExerciseSO = new ExerciseSO();
        newExerciseSO.setName("Squat");
        newExerciseSO.setLogo("squat.png");
        newExerciseSO.setDescription("Compound leg exercise");
        newExerciseSO.setCategory("Strength");
        newExerciseSO.setDifficulty(Exercise.Difficulty.BEGINNER);

        Exercise savedExercise = new Exercise();
        savedExercise.setId(2L);
        savedExercise.setName("Squat");
        savedExercise.setLogo("squat.png");
        savedExercise.setDescription("Compound leg exercise");
        savedExercise.setCategory("Strength");
        savedExercise.setDifficulty(Exercise.Difficulty.BEGINNER);

        when(exerciseRepository.save(any(Exercise.class))).thenReturn(savedExercise);

        ExerciseSO result = exerciseService.createExercise(newExerciseSO);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Squat", result.getName());
        verify(exerciseRepository).save(any(Exercise.class));
    }
}

