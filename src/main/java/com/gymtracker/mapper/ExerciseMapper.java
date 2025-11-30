package com.gymtracker.mapper;

import com.gymtracker.entity.Exercise;
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
}
