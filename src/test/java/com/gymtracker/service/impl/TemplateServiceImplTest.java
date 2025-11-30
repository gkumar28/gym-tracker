package com.gymtracker.service.impl;

import com.gymtracker.entity.Template;
import com.gymtracker.repository.TemplateRepository;
import com.gymtracker.schemaobject.TemplateSO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TemplateServiceImplTest {

    @Mock
    private TemplateRepository templateRepository;

    @InjectMocks
    private TemplateServiceImpl templateService;

    private Template template;
    private TemplateSO templateSO;

    @BeforeEach
    void setUp() {
        template = new Template();
        template.setId(1L);
        template.setName("Chest Day");
        template.setDescription("Chest workout template");

        templateSO = new TemplateSO();
        templateSO.setId(1L);
        templateSO.setName("Chest Day");
        templateSO.setDescription("Chest workout template");
    }

    @Test
    void testGetAllTemplates() {
        List<Template> templates = Arrays.asList(template);
        when(templateRepository.findAll()).thenReturn(templates);

        List<TemplateSO> result = templateService.getAllTemplates();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(templateRepository).findAll();
    }

    @Test
    void testSearchTemplates_WithSearchTerm() {
        String searchTerm = "chest";
        List<Template> templates = Arrays.asList(template);
        when(templateRepository.searchByNameOrDescription(searchTerm)).thenReturn(templates);

        List<TemplateSO> result = templateService.searchTemplates(searchTerm);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(templateRepository).searchByNameOrDescription(searchTerm);
    }

    @Test
    void testSearchTemplates_EmptySearchTerm() {
        List<Template> templates = Arrays.asList(template);
        when(templateRepository.findAll()).thenReturn(templates);

        List<TemplateSO> result = templateService.searchTemplates("");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(templateRepository).findAll();
    }

    @Test
    void testCreateTemplate() {
        TemplateSO newTemplateSO = new TemplateSO();
        newTemplateSO.setName("Leg Day");
        Template savedTemplate = new Template();
        savedTemplate.setId(2L);
        savedTemplate.setName("Leg Day");

        when(templateRepository.save(any(Template.class))).thenReturn(savedTemplate);

        TemplateSO result = templateService.createTemplate(newTemplateSO);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        verify(templateRepository).save(any(Template.class));
    }

    @Test
    void testUpdateTemplate() {
        Long templateId = 1L;
        TemplateSO updateSO = new TemplateSO();
        updateSO.setName("Updated Chest Day");
        updateSO.setDescription("Updated description");

        when(templateRepository.findById(templateId)).thenReturn(Optional.of(template));
        when(templateRepository.save(any(Template.class))).thenReturn(template);

        TemplateSO result = templateService.updateTemplate(templateId, updateSO);

        assertNotNull(result);
        verify(templateRepository).findById(templateId);
        verify(templateRepository).save(any(Template.class));
    }

    @Test
    void testUpdateTemplate_NotFound() {
        Long templateId = 999L;
        TemplateSO updateSO = new TemplateSO();

        when(templateRepository.findById(templateId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> templateService.updateTemplate(templateId, updateSO));
        verify(templateRepository).findById(templateId);
        verify(templateRepository, never()).save(any());
    }
}

