package com.gymtracker.service;

import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.ExerciseSO;

import java.util.List;

public interface ExerciseService {
    
    PaginatedResponse<ExerciseSO> searchExercises(
        String search, String category, String muscle, String equipment, 
        String difficulty, Integer limit, Integer offset);
    
    ExerciseSO getExerciseById(Long id);
    
    List<String> getCategories();
    
    ExerciseSO createExercise(ExerciseSO exerciseSO);
}
