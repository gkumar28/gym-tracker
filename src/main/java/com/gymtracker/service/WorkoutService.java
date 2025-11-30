package com.gymtracker.service;

import com.gymtracker.schemaobject.WorkoutSO;

import java.util.List;

public interface WorkoutService {
    
    List<WorkoutSO> getAllWorkouts();
    
    List<WorkoutSO> searchWorkouts(String searchTerm);
    
    WorkoutSO createWorkout(WorkoutSO workoutSO);
    
    WorkoutSO updateWorkout(Long id, WorkoutSO workoutSO);
    
    WorkoutSO createWorkoutFromTemplate(Long templateId, String workoutName);
}

