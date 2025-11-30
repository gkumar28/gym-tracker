package com.gymtracker.service.impl;

import com.gymtracker.entity.Session;
import com.gymtracker.entity.Workout;
import com.gymtracker.repository.SessionRepository;
import com.gymtracker.repository.WorkoutRepository;
import com.gymtracker.schemaobject.SessionSO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceImplTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private WorkoutRepository workoutRepository;

    @InjectMocks
    private SessionServiceImpl sessionService;

    private Session session;
    private Workout workout;
    private SessionSO sessionSO;

    @BeforeEach
    void setUp() {
        workout = new Workout();
        workout.setId(1L);
        workout.setName("Chest Workout");

        session = new Session();
        session.setId(1L);
        session.setWorkout(workout);
        session.setSessionDate(new Date());

        sessionSO = new SessionSO();
        sessionSO.setId(1L);
        sessionSO.setWorkoutId(1L);
        sessionSO.setSessionDate(new Date());
    }

    @Test
    void testCreateSession_WithWorkout() {
        when(workoutRepository.findById(1L)).thenReturn(Optional.of(workout));
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        SessionSO result = sessionService.createSession(sessionSO);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(workoutRepository).findById(1L);
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void testCreateSession_WithoutWorkout() {
        SessionSO sessionSOWithoutWorkout = new SessionSO();
        sessionSOWithoutWorkout.setSessionDate(new Date());
        Session sessionWithoutWorkout = new Session();
        sessionWithoutWorkout.setId(2L);
        sessionWithoutWorkout.setSessionDate(new Date());

        when(sessionRepository.save(any(Session.class))).thenReturn(sessionWithoutWorkout);

        SessionSO result = sessionService.createSession(sessionSOWithoutWorkout);

        assertNotNull(result);
        verify(workoutRepository, never()).findById(any());
        verify(sessionRepository).save(any(Session.class));
    }

    @Test
    void testCreateSession_WorkoutNotFound() {
        sessionSO.setWorkoutId(999L);
        when(workoutRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> sessionService.createSession(sessionSO));
        verify(workoutRepository).findById(999L);
        verify(sessionRepository, never()).save(any());
    }

    @Test
    void testGetLastSessionByWorkoutId() {
        Long workoutId = 1L;
        when(sessionRepository.findFirstByWorkoutIdOrderBySessionDateDesc(workoutId))
                .thenReturn(Optional.of(session));

        SessionSO result = sessionService.getLastSessionByWorkoutId(workoutId);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(sessionRepository).findFirstByWorkoutIdOrderBySessionDateDesc(workoutId);
    }

    @Test
    void testGetLastSessionByWorkoutId_NotFound() {
        Long workoutId = 1L;
        when(sessionRepository.findFirstByWorkoutIdOrderBySessionDateDesc(workoutId))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> sessionService.getLastSessionByWorkoutId(workoutId));
        verify(sessionRepository).findFirstByWorkoutIdOrderBySessionDateDesc(workoutId);
    }

    @Test
    void testGetAllSessionsByWorkoutId() {
        Long workoutId = 1L;
        List<Session> sessions = Arrays.asList(session);
        when(sessionRepository.findByWorkoutIdOrderBySessionDateDesc(workoutId)).thenReturn(sessions);

        List<SessionSO> result = sessionService.getAllSessionsByWorkoutId(workoutId);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(sessionRepository).findByWorkoutIdOrderBySessionDateDesc(workoutId);
    }
}

