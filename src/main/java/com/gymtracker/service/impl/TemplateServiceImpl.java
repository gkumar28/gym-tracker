package com.gymtracker.service.impl;

import com.gymtracker.entity.Template;
import com.gymtracker.entity.TemplateExercise;
import com.gymtracker.mapper.TemplateExerciseMapper;
import com.gymtracker.mapper.TemplateMapper;
import com.gymtracker.repository.TemplateRepository;
import com.gymtracker.schemaobject.TemplateSO;
import com.gymtracker.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {
    
    private final TemplateRepository templateRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<TemplateSO> getAllTemplates() {
        List<Template> templates = templateRepository.findAll();
        return TemplateMapper.toSOList(templates);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TemplateSO> searchTemplates(String searchTerm) {
        List<Template> templates;
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            templates = templateRepository.findAll();
        } else {
            templates = templateRepository.searchByNameOrDescription(searchTerm.trim());
        }
        return TemplateMapper.toSOList(templates);
    }
    
    @Override
    @Transactional
    public TemplateSO createTemplate(TemplateSO templateSO) {
        Template template = TemplateMapper.toEntity(templateSO);
        Template createdTemplate = templateRepository.save(template);
        return TemplateMapper.toSO(createdTemplate);
    }
    
    @Override
    @Transactional
    public TemplateSO updateTemplate(Long id, TemplateSO templateSO) {
        Template existingTemplate = templateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
        
        // Update fields
        existingTemplate.setName(templateSO.getName());
        existingTemplate.setDescription(templateSO.getDescription());
        
        // Clear existing exercises and set new ones
        existingTemplate.getTemplateExercises().clear();
        if (templateSO.getTemplateExercises() != null) {
            List<TemplateExercise> newExercises = TemplateExerciseMapper.toEntityList(templateSO.getTemplateExercises());
            if (newExercises != null) {
                newExercises.forEach(te -> te.setTemplate(existingTemplate));
                existingTemplate.getTemplateExercises().addAll(newExercises);
            }
        }
        
        Template updatedTemplate = templateRepository.save(existingTemplate);
        return TemplateMapper.toSO(updatedTemplate);
    }
}

