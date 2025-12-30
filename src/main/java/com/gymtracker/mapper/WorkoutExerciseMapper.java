package com.gymtracker.mapper;

import com.gymtracker.entity.WorkoutExercise;
import com.gymtracker.schemaobject.WorkoutExerciseSO;

import java.util.List;
import java.util.stream.Collectors;

public class WorkoutExerciseMapper {

    public static WorkoutExerciseSO toSO(WorkoutExercise workoutExercise) {
        if (workoutExercise == null) {
            return null;
        }
        WorkoutExerciseSO so = new WorkoutExerciseSO();
        so.setId(workoutExercise.getId());
        so.setExerciseName(workoutExercise.getExerciseName());
        so.setSets(SetMapper.toSOList(workoutExercise.getSets()));
        so.setExerciseOrder(workoutExercise.getExerciseOrder());
        so.setRestAfterExerciseSeconds(workoutExercise.getRestAfterExerciseSeconds());
        return so;
    }

    public static WorkoutExercise toEntity(WorkoutExerciseSO so) {
        if (so == null) {
            return null;
        }
        WorkoutExercise workoutExercise = new WorkoutExercise();
        workoutExercise.setId(so.getId());
        workoutExercise.setExerciseName(so.getExerciseName());
        workoutExercise.setSets(SetMapper.toEntityList(so.getSets()));
        workoutExercise.setExerciseOrder(so.getExerciseOrder());
        workoutExercise.setRestAfterExerciseSeconds(so.getRestAfterExerciseSeconds());
        return workoutExercise;
    }

    public static List<WorkoutExerciseSO> toSOList(List<WorkoutExercise> workoutExercises) {
        if (workoutExercises == null) {
            return null;
        }
        return workoutExercises.stream()
                .map(WorkoutExerciseMapper::toSO)
                .collect(Collectors.toList());
    }

    public static List<WorkoutExercise> toEntityList(List<WorkoutExerciseSO> workoutExerciseSOs) {
        if (workoutExerciseSOs == null) {
            return null;
        }
        return workoutExerciseSOs.stream()
                .map(WorkoutExerciseMapper::toEntity)
                .collect(Collectors.toList());
    }
}
