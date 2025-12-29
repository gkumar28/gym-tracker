package com.gymtracker.service.impl;

import com.gymtracker.entity.Template;
import com.gymtracker.entity.Workout;
import com.gymtracker.entity.WorkoutExercise;
import com.gymtracker.mapper.WorkoutExerciseMapper;
import com.gymtracker.mapper.WorkoutMapper;
import com.gymtracker.repository.TemplateRepository;
import com.gymtracker.repository.WorkoutRepository;
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
    public List<WorkoutSO> getAllWorkouts() {
        List<Workout> workouts = workoutRepository.findAll();
        return WorkoutMapper.toSOList(workouts);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WorkoutSO> searchWorkouts(String searchTerm) {
        List<Workout> workouts;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            workouts = workoutRepository.findAll();
        } else {
            workouts = workoutRepository.searchByName(searchTerm.trim());
        }
        return WorkoutMapper.toSOList(workouts);
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

