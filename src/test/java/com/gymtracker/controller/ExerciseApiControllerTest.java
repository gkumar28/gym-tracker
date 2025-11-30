package com.gymtracker.controller;

import com.gymtracker.schemaobject.ExerciseSO;
import com.gymtracker.service.ExerciseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseApiControllerTest {

    @Mock
    private ExerciseService exerciseService;

    @InjectMocks
    private ExerciseApiController exerciseApiController;

    private ExerciseSO exerciseSO;

    @BeforeEach
    void setUp() {
        exerciseSO = new ExerciseSO(1L, "Bench Press", "logo.png");
    }

    @Test
    void testSearchExercises() {
        String searchTerm = "bench";
        List<ExerciseSO> exercises = Arrays.asList(exerciseSO);

        when(exerciseService.searchExercises(searchTerm)).thenReturn(exercises);

        ResponseEntity<List<ExerciseSO>> response = exerciseApiController.searchExercises(searchTerm);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Bench Press", response.getBody().get(0).getName());
        verify(exerciseService).searchExercises(searchTerm);
    }

    @Test
    void testCreateExercise() {
        ExerciseSO newExerciseSO = new ExerciseSO(null, "Squat", "squat.png");
        ExerciseSO createdExerciseSO = new ExerciseSO(2L, "Squat", "squat.png");

        when(exerciseService.createExercise(newExerciseSO)).thenReturn(createdExerciseSO);

        ResponseEntity<ExerciseSO> response = exerciseApiController.createExercise(newExerciseSO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2L, response.getBody().getId());
        assertEquals("Squat", response.getBody().getName());
        verify(exerciseService).createExercise(newExerciseSO);
    }
}

