package com.gymtracker.repository;

import com.gymtracker.entity.Exercise;

import java.util.List;

public interface ExerciseRepositoryCustom {
    
    List<Exercise> searchExercises(
        String search, String category, String muscle, String equipment, 
        String difficulty, Integer limit, Integer offset);
    
    Long countExercises(
        String search, String category, String muscle, String equipment, String difficulty);
}
