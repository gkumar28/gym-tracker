package com.gymtracker.service.impl;

import com.gymtracker.entity.Exercise;
import com.gymtracker.mapper.ExerciseMapper;
import com.gymtracker.repository.ExerciseRepository;
import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.ExerciseSO;
import com.gymtracker.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {
    
    private final ExerciseRepository exerciseRepository;
    
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<ExerciseSO> searchExercises(
            String search, String category, String muscle, String equipment, 
            String difficulty, Integer limit, Integer offset) {
        
        // Set defaults
        limit = limit != null ? limit : 10;
        offset = offset != null ? offset : 0;
        
        List<Exercise> exercises = exerciseRepository.searchExercises(
            search, category, muscle, equipment, difficulty, limit, offset);
        
        Long total = exerciseRepository.countExercises(
            search, category, muscle, equipment, difficulty);
        
        // OPTIMIZED: Use mapper method that skips nested data to avoid N+1 queries
        List<ExerciseSO> exerciseSOs = ExerciseMapper.toSOListWithoutNestedData(exercises);
        
        boolean hasMore = (offset + limit) < total;
        
        return new PaginatedResponse<>(exerciseSOs, total, hasMore, offset, limit);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ExerciseSO getExerciseById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + id));
        return ExerciseMapper.toSO(exercise);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return exerciseRepository.findAllCategories();
    }
    
    @Override
    @Transactional
    public ExerciseSO createExercise(ExerciseSO exerciseSO) {
        Exercise exercise = ExerciseMapper.toEntity(exerciseSO);
        Exercise createdExercise = exerciseRepository.save(exercise);
        return ExerciseMapper.toSO(createdExercise);
    }
}

