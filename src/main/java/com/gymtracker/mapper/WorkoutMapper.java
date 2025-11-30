package com.gymtracker.mapper;

import com.gymtracker.entity.Workout;
import com.gymtracker.entity.WorkoutExercise;
import com.gymtracker.schemaobject.WorkoutSO;

import java.util.List;
import java.util.stream.Collectors;

public class WorkoutMapper {

    public static WorkoutSO toSO(Workout workout) {
        if (workout == null) {
            return null;
        }
        WorkoutSO so = new WorkoutSO();
        so.setId(workout.getId());
        so.setName(workout.getName());
        so.setWorkoutExercises(WorkoutExerciseMapper.toSOList(workout.getWorkoutExercises()));
        so.setCreatedAt(workout.getCreatedAt());
        so.setUpdatedAt(workout.getUpdatedAt());
        return so;
    }

    public static Workout toEntity(WorkoutSO so) {
        if (so == null) {
            return null;
        }
        Workout workout = new Workout();
        workout.setId(so.getId());
        workout.setName(so.getName());
        List<WorkoutExercise> workoutExercises = WorkoutExerciseMapper.toEntityList(so.getWorkoutExercises());
        if (workoutExercises != null) {
            workoutExercises.forEach(we -> we.setWorkout(workout));
            workout.setWorkoutExercises(workoutExercises);
        }
        workout.setCreatedAt(so.getCreatedAt());
        workout.setUpdatedAt(so.getUpdatedAt());
        return workout;
    }

    public static List<WorkoutSO> toSOList(List<Workout> workouts) {
        if (workouts == null) {
            return null;
        }
        return workouts.stream()
                .map(WorkoutMapper::toSO)
                .collect(Collectors.toList());
    }
}
