package com.gymtracker.service.impl;

import com.gymtracker.constants.AppConstants;
import com.gymtracker.entity.Template;
import com.gymtracker.entity.Workout;
import com.gymtracker.entity.WorkoutExercise;
import com.gymtracker.mapper.WorkoutExerciseMapper;
import com.gymtracker.mapper.WorkoutMapper;
import com.gymtracker.repository.TemplateRepository;
import com.gymtracker.repository.WorkoutRepository;
import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.WorkoutSO;
import com.gymtracker.service.WorkoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutServiceImpl implements WorkoutService {
    
    private final WorkoutRepository workoutRepository;
    private final TemplateRepository templateRepository;
    
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<WorkoutSO> searchWorkouts(Integer page, Integer size, String sort, String name, String createdDateFrom, String createdDateTo) {
        // Validate and apply defaults
        int validatedPage = (page != null && page >= 0) ? page : AppConstants.DEFAULT_PAGE_NUMBER;
        int validatedSize = (size != null && size > 0 && size <= AppConstants.MAX_PAGE_SIZE) 
                ? size : AppConstants.DEFAULT_PAGE_SIZE;
        
        // Calculate offset
        int offset = validatedPage * validatedSize;
        
        // Fetch filtered data
        List<Workout> workouts = workoutRepository.searchWorkouts(
            name, createdDateFrom, createdDateTo, validatedSize, offset
        );
        
        // Count total results
        Long total = workoutRepository.countWorkouts(
            name, createdDateFrom, createdDateTo
        );
        
        // OPTIMIZED: Use mapper method that skips nested data to avoid N+1 queries
        List<WorkoutSO> workoutSOs = WorkoutMapper.toSOListWithoutNestedData(workouts);
        
        // Build response using existing PaginatedResponse structure
        return new PaginatedResponse<>(
            workoutSOs,
            total,
            (offset + validatedSize) < total, // hasMore
            offset, // offset
            validatedSize // limit
        );
    }
    
    @Override
    @Transactional
    public WorkoutSO createWorkout(WorkoutSO workoutSO) {
        Workout workout = WorkoutMapper.toEntity(workoutSO);
        Workout createdWorkout = workoutRepository.save(workout);
        return WorkoutMapper.toSO(createdWorkout);
    }
    
    @Override
    @Transactional
    public WorkoutSO updateWorkout(Long id, WorkoutSO workoutSO) {
        Workout existingWorkout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));
        
        // Update fields
        existingWorkout.setName(workoutSO.getName());
        
        // Clear existing exercises and set new ones
        existingWorkout.getWorkoutExercises().clear();
        if (workoutSO.getWorkoutExercises() != null) {
            List<WorkoutExercise> newExercises = WorkoutExerciseMapper.toEntityList(workoutSO.getWorkoutExercises());
            if (newExercises != null) {
                newExercises.forEach(we -> we.setWorkout(existingWorkout));
                existingWorkout.getWorkoutExercises().addAll(newExercises);
            }
        }
        
        Workout updatedWorkout = workoutRepository.save(existingWorkout);
        return WorkoutMapper.toSO(updatedWorkout);
    }
    
    @Override
    @Transactional(readOnly = true)
    public WorkoutSO getWorkoutById(Long id) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + id));
        return WorkoutMapper.toSO(workout);
    }
    
    @Override
    @Transactional
    public WorkoutSO createWorkoutFromTemplate(Long templateId, String workoutName) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + templateId));
        
        Workout workout = new Workout();
        workout.setName(workoutName != null && !workoutName.trim().isEmpty() 
                ? workoutName.trim() 
                : template.getName() + " Workout");
        
        // Convert TemplateExercise to WorkoutExercise
        List<WorkoutExercise> workoutExercises = template.getTemplateExercises().stream()
                .map(templateExercise -> {
                    WorkoutExercise workoutExercise = new WorkoutExercise();
                    workoutExercise.setWorkout(workout);
                    workoutExercise.setExerciseName(templateExercise.getExerciseName());
                    workoutExercise.setSets(new ArrayList<>(templateExercise.getSets()));
                    workoutExercise.setExerciseOrder(templateExercise.getExerciseOrder());
                    return workoutExercise;
                })
                .collect(Collectors.toList());
        
        workout.setWorkoutExercises(workoutExercises);
        
        Workout createdWorkout = workoutRepository.save(workout);
        return WorkoutMapper.toSO(createdWorkout);
    }
}

