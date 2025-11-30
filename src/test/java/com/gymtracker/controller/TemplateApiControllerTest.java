package com.gymtracker.controller;

import com.gymtracker.schemaobject.TemplateSO;
import com.gymtracker.service.TemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TemplateApiControllerTest {

    @Mock
    private TemplateService templateService;

    @InjectMocks
    private TemplateApiController templateApiController;

    private TemplateSO templateSO;

    @BeforeEach
    void setUp() {
        templateSO = new TemplateSO();
        templateSO.setId(1L);
        templateSO.setName("Chest Day");
    }

    @Test
    void testGetAllTemplates() {
        List<TemplateSO> templates = Arrays.asList(templateSO);
        when(templateService.getAllTemplates()).thenReturn(templates);

        ResponseEntity<List<TemplateSO>> response = templateApiController.getAllTemplates();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(templateService).getAllTemplates();
    }

    @Test
    void testSearchTemplates() {
        String searchTerm = "chest";
        List<TemplateSO> templates = Arrays.asList(templateSO);
        when(templateService.searchTemplates(searchTerm)).thenReturn(templates);

        ResponseEntity<List<TemplateSO>> response = templateApiController.searchTemplates(searchTerm);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(templateService).searchTemplates(searchTerm);
    }

    @Test
    void testCreateTemplate() {
        TemplateSO newTemplateSO = new TemplateSO();
        newTemplateSO.setName("Leg Day");
        TemplateSO createdTemplateSO = new TemplateSO();
        createdTemplateSO.setId(2L);
        createdTemplateSO.setName("Leg Day");

        when(templateService.createTemplate(newTemplateSO)).thenReturn(createdTemplateSO);

        ResponseEntity<TemplateSO> response = templateApiController.createTemplate(newTemplateSO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2L, response.getBody().getId());
        verify(templateService).createTemplate(newTemplateSO);
    }

    @Test
    void testUpdateTemplate() {
        Long templateId = 1L;
        TemplateSO updateSO = new TemplateSO();
        updateSO.setName("Updated Template");
        TemplateSO updatedTemplateSO = new TemplateSO();
        updatedTemplateSO.setId(templateId);
        updatedTemplateSO.setName("Updated Template");

        when(templateService.updateTemplate(templateId, updateSO)).thenReturn(updatedTemplateSO);

        ResponseEntity<TemplateSO> response = templateApiController.updateTemplate(templateId, updateSO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Template", response.getBody().getName());
        verify(templateService).updateTemplate(templateId, updateSO);
    }
}

