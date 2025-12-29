package com.gymtracker.controller;

import com.gymtracker.api.WorkoutApi;
import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.WorkoutSO;
import com.gymtracker.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class WorkoutApiController implements WorkoutApi {
    
    private final WorkoutService workoutService;
    
    @Override
    public ResponseEntity<PaginatedResponse<WorkoutSO>> searchWorkouts(Integer page, Integer size, String sort, String name, String createdDateFrom, String createdDateTo) {
        PaginatedResponse<WorkoutSO> workouts = workoutService.searchWorkouts(page, size, sort, name, createdDateFrom, createdDateTo);
        return ResponseEntity.ok(workouts);
    }
    
    @Override
    public ResponseEntity<WorkoutSO> createWorkout(WorkoutSO workoutSO) {
        WorkoutSO createdWorkout = workoutService.createWorkout(workoutSO);
        return ResponseEntity.status(201).body(createdWorkout);
    }
    
    @Override
    public ResponseEntity<WorkoutSO> updateWorkout(Long id, WorkoutSO workoutSO) {
        WorkoutSO updatedWorkout = workoutService.updateWorkout(id, workoutSO);
        return ResponseEntity.ok(updatedWorkout);
    }
    
    @Override
    public ResponseEntity<WorkoutSO> getWorkoutById(Long id) {
        WorkoutSO workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }
    
    @Override
    public ResponseEntity<WorkoutSO> createWorkoutFromTemplate(Long templateId, String workoutName) {
        WorkoutSO createdWorkout = workoutService.createWorkoutFromTemplate(templateId, workoutName);
        return ResponseEntity.status(201).body(createdWorkout);
    }
}

