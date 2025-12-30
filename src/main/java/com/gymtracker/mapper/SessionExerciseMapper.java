package com.gymtracker.mapper;

import com.gymtracker.entity.SessionExercise;
import com.gymtracker.schemaobject.SessionExerciseSO;

import java.util.List;
import java.util.stream.Collectors;

public class SessionExerciseMapper {

    public static SessionExerciseSO toSO(SessionExercise sessionExercise) {
        if (sessionExercise == null) {
            return null;
        }
        SessionExerciseSO so = new SessionExerciseSO();
        so.setId(sessionExercise.getId());
        so.setExerciseName(sessionExercise.getExerciseName());
        so.setSets(SetMapper.toSOList(sessionExercise.getSets()));
        so.setExerciseOrder(sessionExercise.getExerciseOrder());
        so.setRestAfterExerciseSeconds(sessionExercise.getRestAfterExerciseSeconds());
        return so;
    }

    public static SessionExercise toEntity(SessionExerciseSO so) {
        if (so == null) {
            return null;
        }
        SessionExercise sessionExercise = new SessionExercise();
        sessionExercise.setId(so.getId());
        sessionExercise.setExerciseName(so.getExerciseName());
        sessionExercise.setSets(SetMapper.toEntityList(so.getSets()));
        sessionExercise.setExerciseOrder(so.getExerciseOrder());
        sessionExercise.setRestAfterExerciseSeconds(so.getRestAfterExerciseSeconds());
        return sessionExercise;
    }

    public static List<SessionExerciseSO> toSOList(List<SessionExercise> sessionExercises) {
        if (sessionExercises == null) {
            return null;
        }
        return sessionExercises.stream()
                .map(SessionExerciseMapper::toSO)
                .collect(Collectors.toList());
    }

    public static List<SessionExercise> toEntityList(List<SessionExerciseSO> sessionExerciseSOs) {
        if (sessionExerciseSOs == null) {
            return null;
        }
        return sessionExerciseSOs.stream()
                .map(SessionExerciseMapper::toEntity)
                .collect(Collectors.toList());
    }
}

