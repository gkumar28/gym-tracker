package com.gymtracker.controller;

import com.gymtracker.schemaobject.SessionSO;
import com.gymtracker.service.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionApiControllerTest {

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionApiController sessionApiController;

    private SessionSO sessionSO;

    @BeforeEach
    void setUp() {
        sessionSO = new SessionSO();
        sessionSO.setId(1L);
        sessionSO.setWorkoutId(1L);
        sessionSO.setSessionDate(new Date());
    }

    @Test
    void testCreateSession() {
        SessionSO newSessionSO = new SessionSO();
        newSessionSO.setWorkoutId(1L);
        newSessionSO.setSessionDate(new Date());
        SessionSO createdSessionSO = new SessionSO();
        createdSessionSO.setId(2L);
        createdSessionSO.setWorkoutId(1L);
        createdSessionSO.setSessionDate(new Date());

        when(sessionService.createSession(newSessionSO)).thenReturn(createdSessionSO);

        ResponseEntity<SessionSO> response = sessionApiController.createSession(newSessionSO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2L, response.getBody().getId());
        verify(sessionService).createSession(newSessionSO);
    }

    @Test
    void testGetLastSessionByWorkoutId() {
        Long workoutId = 1L;
        when(sessionService.getLastSessionByWorkoutId(workoutId)).thenReturn(sessionSO);

        ResponseEntity<SessionSO> response = sessionApiController.getLastSessionByWorkoutId(workoutId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        verify(sessionService).getLastSessionByWorkoutId(workoutId);
    }

    @Test
    void testGetAllSessionsByWorkoutId() {
        Long workoutId = 1L;
        List<SessionSO> sessions = Arrays.asList(sessionSO);
        when(sessionService.getAllSessionsByWorkoutId(workoutId)).thenReturn(sessions);

        ResponseEntity<List<SessionSO>> response = sessionApiController.getAllSessionsByWorkoutId(workoutId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(sessionService).getAllSessionsByWorkoutId(workoutId);
    }
}

