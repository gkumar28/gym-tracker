package com.gymtracker.controller;

import com.gymtracker.api.TemplateApi;
import com.gymtracker.schemaobject.TemplateSO;
import com.gymtracker.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TemplateApiController implements TemplateApi {
    
    private final TemplateService templateService;
    
    @Override
    public ResponseEntity<List<TemplateSO>> getAllTemplates() {
        List<TemplateSO> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }
    
    @Override
    public ResponseEntity<List<TemplateSO>> searchTemplates(String searchTerm) {
        List<TemplateSO> templates = templateService.searchTemplates(searchTerm);
        return ResponseEntity.ok(templates);
    }
    
    @Override
    public ResponseEntity<TemplateSO> createTemplate(TemplateSO templateSO) {
        TemplateSO createdTemplate = templateService.createTemplate(templateSO);
        return ResponseEntity.status(201).body(createdTemplate);
    }
    
    @Override
    public ResponseEntity<TemplateSO> updateTemplate(Long id, TemplateSO templateSO) {
        TemplateSO updatedTemplate = templateService.updateTemplate(id, templateSO);
        return ResponseEntity.ok(updatedTemplate);
    }
}

