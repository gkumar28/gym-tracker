package com.gymtracker.service;

import com.gymtracker.schemaobject.ExerciseSO;

import java.util.List;

public interface ExerciseService {
    
    List<ExerciseSO> searchExercises(String searchTerm);
    
    ExerciseSO createExercise(ExerciseSO exerciseSO);
}
