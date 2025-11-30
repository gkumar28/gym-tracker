package com.gymtracker.controller;

import com.gymtracker.api.WorkoutApi;
import com.gymtracker.schemaobject.WorkoutSO;
import com.gymtracker.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class WorkoutApiController implements WorkoutApi {
    
    private final WorkoutService workoutService;
    
    @Override
    public ResponseEntity<List<WorkoutSO>> getAllWorkouts() {
        List<WorkoutSO> workouts = workoutService.getAllWorkouts();
        return ResponseEntity.ok(workouts);
    }
    
    @Override
    public ResponseEntity<List<WorkoutSO>> searchWorkouts(String searchTerm) {
        List<WorkoutSO> workouts = workoutService.searchWorkouts(searchTerm);
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
    public ResponseEntity<WorkoutSO> createWorkoutFromTemplate(Long templateId, String workoutName) {
        WorkoutSO createdWorkout = workoutService.createWorkoutFromTemplate(templateId, workoutName);
        return ResponseEntity.status(201).body(createdWorkout);
    }
}

