package com.gymtracker.controller;

import com.gymtracker.api.ExerciseApi;
import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.ExerciseSO;
import com.gymtracker.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExerciseApiController implements ExerciseApi {
    
    private final ExerciseService exerciseService;
    
    @Override
    public ResponseEntity<PaginatedResponse<ExerciseSO>> searchExercises(
            String search, String category, String muscle, String equipment, 
            String difficulty, Integer limit, Integer offset) {
        PaginatedResponse<ExerciseSO> response = exerciseService.searchExercises(
            search, category, muscle, equipment, difficulty, limit, offset);
        return ResponseEntity.ok(response);
    }
    
    @Override
    public ResponseEntity<ExerciseSO> getExerciseById(Long id) {
        ExerciseSO exerciseSO = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exerciseSO);
    }
    
    @Override
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = exerciseService.getCategories();
        return ResponseEntity.ok(categories);
    }
    
    @Override
    public ResponseEntity<ExerciseSO> createExercise(ExerciseSO exerciseSO) {
        ExerciseSO createdExerciseSO = exerciseService.createExercise(exerciseSO);
        return ResponseEntity.status(201).body(createdExerciseSO);
    }
}