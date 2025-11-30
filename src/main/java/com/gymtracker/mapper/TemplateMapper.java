package com.gymtracker.mapper;

import com.gymtracker.entity.Template;
import com.gymtracker.entity.TemplateExercise;
import com.gymtracker.schemaobject.TemplateSO;

import java.util.List;
import java.util.stream.Collectors;

public class TemplateMapper {

    public static TemplateSO toSO(Template template) {
        if (template == null) {
            return null;
        }
        TemplateSO so = new TemplateSO();
        so.setId(template.getId());
        so.setName(template.getName());
        so.setDescription(template.getDescription());
        so.setTemplateExercises(TemplateExerciseMapper.toSOList(template.getTemplateExercises()));
        so.setCreatedAt(template.getCreatedAt());
        so.setUpdatedAt(template.getUpdatedAt());
        return so;
    }

    public static Template toEntity(TemplateSO so) {
        if (so == null) {
            return null;
        }
        Template template = new Template();
        template.setId(so.getId());
        template.setName(so.getName());
        template.setDescription(so.getDescription());
        List<TemplateExercise> templateExercises = TemplateExerciseMapper.toEntityList(so.getTemplateExercises());
        if (templateExercises != null) {
            templateExercises.forEach(te -> te.setTemplate(template));
            template.setTemplateExercises(templateExercises);
        }
        template.setCreatedAt(so.getCreatedAt());
        template.setUpdatedAt(so.getUpdatedAt());
        return template;
    }

    public static List<TemplateSO> toSOList(List<Template> templates) {
        if (templates == null) {
            return null;
        }
        return templates.stream()
                .map(TemplateMapper::toSO)
                .collect(Collectors.toList());
    }
}
