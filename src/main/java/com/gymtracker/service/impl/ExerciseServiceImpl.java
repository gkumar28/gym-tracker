package com.gymtracker.service.impl;

import com.gymtracker.entity.Exercise;
import com.gymtracker.mapper.ExerciseMapper;
import com.gymtracker.repository.ExerciseRepository;
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
    public List<ExerciseSO> searchExercises(String searchTerm) {
        List<Exercise> exercises;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            exercises = exerciseRepository.findAll();
        } else {
            exercises = exerciseRepository.searchByName(searchTerm.trim());
        }
        return ExerciseMapper.toSOList(exercises);
    }
    
    @Override
    @Transactional
    public ExerciseSO createExercise(ExerciseSO exerciseSO) {
        Exercise exercise = ExerciseMapper.toEntity(exerciseSO);
        Exercise createdExercise = exerciseRepository.save(exercise);
        return ExerciseMapper.toSO(createdExercise);
    }
}

