package com.gymtracker.controller;

import com.gymtracker.entity.Exercise;
import com.gymtracker.schemaobject.ExerciseSO;
import com.gymtracker.schemaobject.PaginatedResponse;
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
    private PaginatedResponse<ExerciseSO> paginatedResponse;

    @BeforeEach
    void setUp() {
        exerciseSO = new ExerciseSO();
        exerciseSO.setId(1L);
        exerciseSO.setName("Bench Press");
        exerciseSO.setLogo("logo.png");
        exerciseSO.setDescription("Compound chest exercise");
        exerciseSO.setCategory("Strength");
        exerciseSO.setMuscleGroups(Arrays.asList("Chest", "Shoulders", "Triceps"));
        exerciseSO.setEquipment(Arrays.asList("Barbell", "Bench"));
        exerciseSO.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        paginatedResponse = new PaginatedResponse<>(
            Arrays.asList(exerciseSO), 
            1L, 
            false, 
            0, 
            10
        );
    }

    @Test
    void testSearchExercises() {
        String search = "bench";
        String category = "Strength";
        String muscle = "Chest";
        String equipment = "Barbell";
        String difficulty = "INTERMEDIATE";
        Integer limit = 10;
        Integer offset = 0;

        when(exerciseService.searchExercises(search, category, muscle, equipment, difficulty, limit, offset))
            .thenReturn(paginatedResponse);

        ResponseEntity<PaginatedResponse<ExerciseSO>> response = exerciseApiController.searchExercises(
            search, category, muscle, equipment, difficulty, limit, offset);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getItems().size());
        assertEquals("Bench Press", response.getBody().getItems().get(0).getName());
        assertEquals(1L, response.getBody().getTotal());
        assertFalse(response.getBody().getHasMore());
        assertEquals(0, response.getBody().getOffset());
        assertEquals(10, response.getBody().getLimit());
        verify(exerciseService).searchExercises(search, category, muscle, equipment, difficulty, limit, offset);
    }

    @Test
    void testGetExerciseById() {
        when(exerciseService.getExerciseById(1L)).thenReturn(exerciseSO);

        ResponseEntity<ExerciseSO> response = exerciseApiController.getExerciseById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Bench Press", response.getBody().getName());
        verify(exerciseService).getExerciseById(1L);
    }

    @Test
    void testGetCategories() {
        List<String> categories = Arrays.asList("Strength", "Cardio", "Flexibility");
        when(exerciseService.getCategories()).thenReturn(categories);

        ResponseEntity<List<String>> response = exerciseApiController.getCategories();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(3, response.getBody().size());
        assertEquals("Strength", response.getBody().get(0));
        verify(exerciseService).getCategories();
    }

    @Test
    void testCreateExercise() {
        ExerciseSO newExerciseSO = new ExerciseSO();
        newExerciseSO.setName("Squat");
        newExerciseSO.setLogo("squat.png");
        newExerciseSO.setDescription("Compound leg exercise");
        newExerciseSO.setCategory("Strength");
        newExerciseSO.setMuscleGroups(Arrays.asList("Quadriceps", "Glutes", "Hamstrings"));
        newExerciseSO.setEquipment(Arrays.asList("Barbell", "Squat Rack"));
        newExerciseSO.setDifficulty(Exercise.Difficulty.BEGINNER);

        ExerciseSO createdExerciseSO = new ExerciseSO();
        createdExerciseSO.setId(2L);
        createdExerciseSO.setName("Squat");
        createdExerciseSO.setLogo("squat.png");
        createdExerciseSO.setDescription("Compound leg exercise");
        createdExerciseSO.setCategory("Strength");
        createdExerciseSO.setMuscleGroups(Arrays.asList("Quadriceps", "Glutes", "Hamstrings"));
        createdExerciseSO.setEquipment(Arrays.asList("Barbell", "Squat Rack"));
        createdExerciseSO.setDifficulty(Exercise.Difficulty.BEGINNER);

        when(exerciseService.createExercise(newExerciseSO)).thenReturn(createdExerciseSO);

        ResponseEntity<ExerciseSO> response = exerciseApiController.createExercise(newExerciseSO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2L, response.getBody().getId());
        assertEquals("Squat", response.getBody().getName());
        verify(exerciseService).createExercise(newExerciseSO);
    }
}

