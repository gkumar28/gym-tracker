package com.gymtracker.controller;

import com.gymtracker.api.ExerciseApi;
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
    public ResponseEntity<List<ExerciseSO>> searchExercises(String searchTerm) {
        List<ExerciseSO> exerciseSOs = exerciseService.searchExercises(searchTerm);
        return ResponseEntity.ok(exerciseSOs);
    }
    
    @Override
    public ResponseEntity<ExerciseSO> createExercise(ExerciseSO exerciseSO) {
        ExerciseSO createdExerciseSO = exerciseService.createExercise(exerciseSO);
        return ResponseEntity.status(201).body(createdExerciseSO);
    }
}