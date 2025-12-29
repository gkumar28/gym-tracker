package com.gymtracker.service;

import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.WorkoutSO;

public interface WorkoutService {
    
    PaginatedResponse<WorkoutSO> searchWorkouts(Integer page, Integer size, String sort, String name, String createdDateFrom, String createdDateTo);
    
    WorkoutSO createWorkout(WorkoutSO workoutSO);
    
    WorkoutSO updateWorkout(Long id, WorkoutSO workoutSO);
    
    WorkoutSO getWorkoutById(Long id);
    
    WorkoutSO createWorkoutFromTemplate(Long templateId, String workoutName);
}

