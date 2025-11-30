package com.gymtracker.service;

import com.gymtracker.schemaobject.TemplateSO;

import java.util.List;

public interface TemplateService {
    
    List<TemplateSO> getAllTemplates();
    
    List<TemplateSO> searchTemplates(String searchTerm);
    
    TemplateSO createTemplate(TemplateSO templateSO);
    
    TemplateSO updateTemplate(Long id, TemplateSO templateSO);
}

