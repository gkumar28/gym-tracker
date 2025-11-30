package com.gymtracker.service.impl;

import com.gymtracker.entity.Exercise;
import com.gymtracker.mapper.ExerciseMapper;
import com.gymtracker.repository.ExerciseRepository;
import com.gymtracker.schemaobject.ExerciseSO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
        exercise = new Exercise(1L, "Bench Press", "logo.png");
        exerciseSO = new ExerciseSO(1L, "Bench Press", "logo.png");
    }

    @Test
    void testSearchExercises_WithSearchTerm() {
        String searchTerm = "bench";
        List<Exercise> exercises = Arrays.asList(exercise);

        when(exerciseRepository.searchByName(searchTerm)).thenReturn(exercises);

        List<ExerciseSO> result = exerciseService.searchExercises(searchTerm);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Bench Press", result.get(0).getName());
        verify(exerciseRepository).searchByName(searchTerm);
        verify(exerciseRepository, never()).findAll();
    }

    @Test
    void testSearchExercises_EmptySearchTerm() {
        List<Exercise> exercises = Arrays.asList(exercise);

        when(exerciseRepository.findAll()).thenReturn(exercises);

        List<ExerciseSO> result = exerciseService.searchExercises("");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(exerciseRepository).findAll();
        verify(exerciseRepository, never()).searchByName(anyString());
    }

    @Test
    void testSearchExercises_NullSearchTerm() {
        List<Exercise> exercises = Arrays.asList(exercise);

        when(exerciseRepository.findAll()).thenReturn(exercises);

        List<ExerciseSO> result = exerciseService.searchExercises(null);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(exerciseRepository).findAll();
    }

    @Test
    void testCreateExercise() {
        ExerciseSO newExerciseSO = new ExerciseSO(null, "Squat", "squat.png");
        Exercise newExercise = new Exercise(null, "Squat", "squat.png");
        Exercise savedExercise = new Exercise(2L, "Squat", "squat.png");

        when(exerciseRepository.save(any(Exercise.class))).thenReturn(savedExercise);

        ExerciseSO result = exerciseService.createExercise(newExerciseSO);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Squat", result.getName());
        verify(exerciseRepository).save(any(Exercise.class));
    }
}

