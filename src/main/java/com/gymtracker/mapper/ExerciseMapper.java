package com.gymtracker.mapper;

import com.gymtracker.entity.Exercise;
import com.gymtracker.enums.Equipment;
import com.gymtracker.enums.MuscleGroup;
import com.gymtracker.schemaobject.ExerciseSO;

import java.util.List;
import java.util.stream.Collectors;

public class ExerciseMapper {

    public static ExerciseSO toSO(Exercise exercise) {
        if (exercise == null) {
            return null;
        }
        ExerciseSO so = new ExerciseSO();
        so.setId(exercise.getId());
        so.setName(exercise.getName());
        so.setLogo(exercise.getLogo());
        so.setDescription(exercise.getDescription());
        so.setCategory(exercise.getCategory());
        
        // Convert muscle groups enum to string list
        if (exercise.getMuscleGroups() != null) {
            List<String> muscleGroupNames = exercise.getMuscleGroups().stream()
                .map(MuscleGroup::getDisplayName)
                .collect(Collectors.toList());
            so.setMuscleGroups(muscleGroupNames);
        }
        
        // Convert equipment enum to string list
        if (exercise.getEquipment() != null) {
            List<String> equipmentNames = exercise.getEquipment().stream()
                .map(Equipment::getDisplayName)
                .collect(Collectors.toList());
            so.setEquipment(equipmentNames);
        }
        
        so.setDifficulty(exercise.getDifficulty());
        so.setInstructions(exercise.getInstructions());
        so.setTips(exercise.getTips());
        so.setImageUrl(exercise.getImageUrl());
        so.setVideoUrl(exercise.getVideoUrl());
        so.setCreatedAt(exercise.getCreatedAt());
        so.setUpdatedAt(exercise.getUpdatedAt());
        
        return so;
    }

    public static Exercise toEntity(ExerciseSO so) {
        if (so == null) {
            return null;
        }
        Exercise exercise = new Exercise();
        exercise.setId(so.getId());
        exercise.setName(so.getName());
        exercise.setLogo(so.getLogo());
        exercise.setDescription(so.getDescription());
        exercise.setCategory(so.getCategory());
        
        // Convert string list to muscle groups enum
        if (so.getMuscleGroups() != null) {
            List<MuscleGroup> muscleGroups = so.getMuscleGroups().stream()
                .map(ExerciseMapper::stringToMuscleGroup)
                .collect(Collectors.toList());
            exercise.setMuscleGroups(muscleGroups);
        }
        
        // Convert string list to equipment enum
        if (so.getEquipment() != null) {
            List<Equipment> equipment = so.getEquipment().stream()
                .map(ExerciseMapper::stringToEquipment)
                .collect(Collectors.toList());
            exercise.setEquipment(equipment);
        }
        
        exercise.setDifficulty(so.getDifficulty());
        exercise.setInstructions(so.getInstructions());
        exercise.setTips(so.getTips());
        exercise.setImageUrl(so.getImageUrl());
        exercise.setVideoUrl(so.getVideoUrl());
        // Note: createdAt and updatedAt are managed by @PrePersist/@PreUpdate
        
        return exercise;
    }

    public static List<ExerciseSO> toSOList(List<Exercise> exercises) {
        if (exercises == null) {
            return null;
        }
        return exercises.stream()
                .map(ExerciseMapper::toSO)
                .collect(Collectors.toList());
    }

    public static List<Exercise> toEntityList(List<ExerciseSO> exerciseSOs) {
        if (exerciseSOs == null) {
            return null;
        }
        return exerciseSOs.stream()
                .map(ExerciseMapper::toEntity)
                .collect(Collectors.toList());
    }

    private static MuscleGroup stringToMuscleGroup(String muscleGroupName) {
        if (muscleGroupName == null) {
            return null;
        }
        
        // Try to find enum by display name
        for (MuscleGroup muscleGroup : MuscleGroup.values()) {
            if (muscleGroup.getDisplayName().equalsIgnoreCase(muscleGroupName.trim())) {
                return muscleGroup;
            }
        }
        
        // Fallback: try direct enum name matching
        try {
            return MuscleGroup.valueOf(muscleGroupName.trim().toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            // Return null if no match found
            return null;
        }
    }

    private static Equipment stringToEquipment(String equipmentName) {
        if (equipmentName == null) {
            return null;
        }
        
        // Try to find enum by display name
        for (Equipment equipment : Equipment.values()) {
            if (equipment.getDisplayName().equalsIgnoreCase(equipmentName.trim())) {
                return equipment;
            }
        }
        
        // Fallback: try direct enum name matching
        try {
            return Equipment.valueOf(equipmentName.trim().toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            // Return null if no match found
            return null;
        }
    }
}
