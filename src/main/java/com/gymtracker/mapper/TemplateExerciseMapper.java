package com.gymtracker.mapper;

import com.gymtracker.entity.TemplateExercise;
import com.gymtracker.schemaobject.TemplateExerciseSO;

import java.util.List;
import java.util.stream.Collectors;

public class TemplateExerciseMapper {

    public static TemplateExerciseSO toSO(TemplateExercise templateExercise) {
        if (templateExercise == null) {
            return null;
        }
        TemplateExerciseSO so = new TemplateExerciseSO();
        so.setId(templateExercise.getId());
        so.setExerciseName(templateExercise.getExerciseName());
        so.setSets(SetMapper.toSOList(templateExercise.getSets()));
        so.setExerciseOrder(templateExercise.getExerciseOrder());
        return so;
    }

    public static TemplateExercise toEntity(TemplateExerciseSO so) {
        if (so == null) {
            return null;
        }
        TemplateExercise templateExercise = new TemplateExercise();
        templateExercise.setId(so.getId());
        templateExercise.setExerciseName(so.getExerciseName());
        templateExercise.setSets(SetMapper.toEntityList(so.getSets()));
        templateExercise.setExerciseOrder(so.getExerciseOrder());
        return templateExercise;
    }

    public static List<TemplateExerciseSO> toSOList(List<TemplateExercise> templateExercises) {
        if (templateExercises == null) {
            return null;
        }
        return templateExercises.stream()
                .map(TemplateExerciseMapper::toSO)
                .collect(Collectors.toList());
    }

    public static List<TemplateExercise> toEntityList(List<TemplateExerciseSO> templateExerciseSOs) {
        if (templateExerciseSOs == null) {
            return null;
        }
        return templateExerciseSOs.stream()
                .map(TemplateExerciseMapper::toEntity)
                .collect(Collectors.toList());
    }
}
