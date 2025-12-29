package com.gymtracker.controller;

import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.WorkoutSO;
import com.gymtracker.service.WorkoutService;
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
class WorkoutApiControllerTest {

    @Mock
    private WorkoutService workoutService;

    @InjectMocks
    private WorkoutApiController workoutApiController;

    private WorkoutSO workoutSO;

    @BeforeEach
    void setUp() {
        workoutSO = new WorkoutSO();
        workoutSO.setId(1L);
        workoutSO.setName("Chest Workout");
    }

    @Test
    void testSearchWorkouts() {
        List<WorkoutSO> workouts = Arrays.asList(workoutSO);
        PaginatedResponse<WorkoutSO> paginatedResponse = new PaginatedResponse<>(workouts, 1L, false, 0, 20);
        when(workoutService.searchWorkouts(0, 20, "createdAt,desc", null, null, null)).thenReturn(paginatedResponse);

        ResponseEntity<PaginatedResponse<WorkoutSO>> response = workoutApiController.searchWorkouts(0, 20, "createdAt,desc", null, null, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getItems().size());
        verify(workoutService).searchWorkouts(0, 20, "createdAt,desc", null, null, null);
    }

    @Test
    void testCreateWorkout() {
        WorkoutSO newWorkoutSO = new WorkoutSO();
        newWorkoutSO.setName("Leg Workout");
        WorkoutSO createdWorkoutSO = new WorkoutSO();
        createdWorkoutSO.setId(2L);
        createdWorkoutSO.setName("Leg Workout");

        when(workoutService.createWorkout(newWorkoutSO)).thenReturn(createdWorkoutSO);

        ResponseEntity<WorkoutSO> response = workoutApiController.createWorkout(newWorkoutSO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2L, response.getBody().getId());
        verify(workoutService).createWorkout(newWorkoutSO);
    }

    @Test
    void testUpdateWorkout() {
        Long workoutId = 1L;
        WorkoutSO updateSO = new WorkoutSO();
        updateSO.setName("Updated Workout");
        WorkoutSO updatedWorkoutSO = new WorkoutSO();
        updatedWorkoutSO.setId(workoutId);
        updatedWorkoutSO.setName("Updated Workout");

        when(workoutService.updateWorkout(workoutId, updateSO)).thenReturn(updatedWorkoutSO);

        ResponseEntity<WorkoutSO> response = workoutApiController.updateWorkout(workoutId, updateSO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Workout", response.getBody().getName());
        verify(workoutService).updateWorkout(workoutId, updateSO);
    }

    @Test
    void testCreateWorkoutFromTemplate() {
        Long templateId = 1L;
        String workoutName = "My Workout";
        WorkoutSO createdWorkoutSO = new WorkoutSO();
        createdWorkoutSO.setId(2L);
        createdWorkoutSO.setName(workoutName);

        when(workoutService.createWorkoutFromTemplate(templateId, workoutName)).thenReturn(createdWorkoutSO);

        ResponseEntity<WorkoutSO> response = workoutApiController.createWorkoutFromTemplate(templateId, workoutName);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2L, response.getBody().getId());
        verify(workoutService).createWorkoutFromTemplate(templateId, workoutName);
    }
}

