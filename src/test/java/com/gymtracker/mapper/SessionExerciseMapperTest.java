package com.gymtracker.mapper;

import com.gymtracker.entity.SessionExercise;
import com.gymtracker.schemaobject.SessionExerciseSO;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SessionExerciseMapperTest {

    @Test
    void testToSO() {
        SessionExercise sessionExercise = new SessionExercise();
        sessionExercise.setId(1L);
        sessionExercise.setExerciseName("Bench Press");
        sessionExercise.setExerciseOrder(1);

        SessionExerciseSO so = SessionExerciseMapper.toSO(sessionExercise);

        assertNotNull(so);
        assertEquals(1L, so.getId());
        assertEquals("Bench Press", so.getExerciseName());
        assertEquals(1, so.getExerciseOrder());
    }

    @Test
    void testToSO_Null() {
        SessionExerciseSO so = SessionExerciseMapper.toSO(null);
        assertNull(so);
    }

    @Test
    void testToEntity() {
        SessionExerciseSO so = new SessionExerciseSO();
        so.setId(1L);
        so.setExerciseName("Bench Press");
        so.setExerciseOrder(1);

        SessionExercise sessionExercise = SessionExerciseMapper.toEntity(so);

        assertNotNull(sessionExercise);
        assertEquals(1L, sessionExercise.getId());
        assertEquals("Bench Press", sessionExercise.getExerciseName());
        assertEquals(1, sessionExercise.getExerciseOrder());
    }

    @Test
    void testToEntity_Null() {
        SessionExercise sessionExercise = SessionExerciseMapper.toEntity(null);
        assertNull(sessionExercise);
    }

    @Test
    void testToSOList() {
        SessionExercise se1 = new SessionExercise();
        se1.setExerciseName("Bench Press");
        SessionExercise se2 = new SessionExercise();
        se2.setExerciseName("Squat");
        List<SessionExercise> sessionExercises = Arrays.asList(se1, se2);

        List<SessionExerciseSO> result = SessionExerciseMapper.toSOList(sessionExercises);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Bench Press", result.get(0).getExerciseName());
        assertEquals("Squat", result.get(1).getExerciseName());
    }

    @Test
    void testToSOList_Null() {
        List<SessionExerciseSO> result = SessionExerciseMapper.toSOList(null);
        assertNull(result);
    }

    @Test
    void testToEntityList() {
        SessionExerciseSO so1 = new SessionExerciseSO();
        so1.setExerciseName("Bench Press");
        SessionExerciseSO so2 = new SessionExerciseSO();
        so2.setExerciseName("Squat");
        List<SessionExerciseSO> sessionExerciseSOs = Arrays.asList(so1, so2);

        List<SessionExercise> result = SessionExerciseMapper.toEntityList(sessionExerciseSOs);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Bench Press", result.get(0).getExerciseName());
        assertEquals("Squat", result.get(1).getExerciseName());
    }

    @Test
    void testToEntityList_Null() {
        List<SessionExercise> result = SessionExerciseMapper.toEntityList(null);
        assertNull(result);
    }
}

