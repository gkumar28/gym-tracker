package com.gymtracker.service.impl;

import com.gymtracker.entity.Template;
import com.gymtracker.entity.Workout;
import com.gymtracker.repository.TemplateRepository;
import com.gymtracker.repository.WorkoutRepository;
import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.WorkoutSO;
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
class WorkoutServiceImplTest {

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private TemplateRepository templateRepository;

    @InjectMocks
    private WorkoutServiceImpl workoutService;

    private Workout workout;
    private Template template;

    @BeforeEach
    void setUp() {
        workout = new Workout();
        workout.setId(1L);
        workout.setName("Chest Workout");

        template = new Template();
        template.setId(1L);
        template.setName("Chest Template");
    }

    @Test
    void testSearchWorkouts() {
        List<Workout> workouts = Arrays.asList(workout);
        when(workoutRepository.searchWorkouts(null, null, null, 20, 0)).thenReturn(workouts);
        when(workoutRepository.countWorkouts(null, null, null)).thenReturn(1L);

        PaginatedResponse<WorkoutSO> result = workoutService.searchWorkouts(0, 20, "createdAt,desc", null, null, null);

        assertNotNull(result);
        assertEquals(1, result.getItems().size());
        assertEquals(1L, result.getTotal());
        verify(workoutRepository).searchWorkouts(null, null, null, 20, 0);
        verify(workoutRepository).countWorkouts(null, null, null);
    }

    @Test
    void testCreateWorkout() {
        WorkoutSO workoutSO = new WorkoutSO();
        workoutSO.setName("Leg Workout");
        Workout savedWorkout = new Workout();
        savedWorkout.setId(2L);
        savedWorkout.setName("Leg Workout");

        when(workoutRepository.save(any(Workout.class))).thenReturn(savedWorkout);

        WorkoutSO result = workoutService.createWorkout(workoutSO);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    void testUpdateWorkout() {
        Long workoutId = 1L;
        WorkoutSO updateSO = new WorkoutSO();
        updateSO.setName("Updated Workout");

        when(workoutRepository.findById(workoutId)).thenReturn(Optional.of(workout));
        when(workoutRepository.save(any(Workout.class))).thenReturn(workout);

        WorkoutSO result = workoutService.updateWorkout(workoutId, updateSO);

        assertNotNull(result);
        verify(workoutRepository).findById(workoutId);
        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    void testUpdateWorkout_NotFound() {
        Long workoutId = 999L;
        WorkoutSO updateSO = new WorkoutSO();

        when(workoutRepository.findById(workoutId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> workoutService.updateWorkout(workoutId, updateSO));
        verify(workoutRepository).findById(workoutId);
        verify(workoutRepository, never()).save(any());
    }

    @Test
    void testCreateWorkoutFromTemplate() {
        Long templateId = 1L;
        String workoutName = "My Chest Workout";

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(workoutRepository.save(any(Workout.class))).thenReturn(workout);

        WorkoutSO result = workoutService.createWorkoutFromTemplate(templateId, workoutName);

        assertNotNull(result);
        verify(templateRepository).findById(templateId);
        verify(workoutRepository).save(any(Workout.class));
    }

    @Test
    void testCreateWorkoutFromTemplate_TemplateNotFound() {
        Long templateId = 999L;
        String workoutName = "My Workout";

        when(templateRepository.findById(templateId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> workoutService.createWorkoutFromTemplate(templateId, workoutName));
        verify(templateRepository).findById(templateId);
        verify(workoutRepository, never()).save(any());
    }
}

