package com.gymtracker.mapper;

import com.gymtracker.entity.Session;
import com.gymtracker.entity.Workout;
import com.gymtracker.schemaobject.SessionSO;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class SessionMapperTest {

    @Test
    void testToSO() {
        Workout workout = new Workout();
        workout.setId(1L);

        Session session = new Session();
        session.setId(1L);
        session.setWorkout(workout);
        session.setSessionDate(new Date());
        session.setNotes("Good session");
        session.setDurationMinutes(60);

        SessionSO so = SessionMapper.toSO(session);

        assertNotNull(so);
        assertEquals(1L, so.getId());
        assertEquals(1L, so.getWorkoutId());
        assertNotNull(so.getSessionDate());
        assertEquals("Good session", so.getNotes());
        assertEquals(60, so.getDurationMinutes());
    }

    @Test
    void testToSO_WithoutWorkout() {
        Session session = new Session();
        session.setId(1L);
        session.setSessionDate(new Date());

        SessionSO so = SessionMapper.toSO(session);

        assertNotNull(so);
        assertNull(so.getWorkoutId());
    }

    @Test
    void testToSO_Null() {
        SessionSO so = SessionMapper.toSO(null);
        assertNull(so);
    }

    @Test
    void testToEntity() {
        Workout workout = new Workout();
        workout.setId(1L);

        SessionSO so = new SessionSO();
        so.setId(1L);
        so.setWorkoutId(1L);
        so.setSessionDate(new Date());
        so.setNotes("Good session");
        so.setDurationMinutes(60);

        Session session = SessionMapper.toEntity(so, workout);

        assertNotNull(session);
        assertEquals(1L, session.getId());
        assertNotNull(session.getWorkout());
        assertEquals(1L, session.getWorkout().getId());
        assertEquals("Good session", session.getNotes());
        assertEquals(60, session.getDurationMinutes());
    }

    @Test
    void testToEntity_Null() {
        Session session = SessionMapper.toEntity(null, null);
        assertNull(session);
    }
}

