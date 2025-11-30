package com.gymtracker.mapper;

import com.gymtracker.entity.Workout;
import com.gymtracker.schemaobject.WorkoutSO;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class WorkoutMapperTest {

    @Test
    void testToSO() {
        Workout workout = new Workout();
        workout.setId(1L);
        workout.setName("Chest Workout");
        workout.setCreatedAt(new Date());
        workout.setUpdatedAt(new Date());

        WorkoutSO so = WorkoutMapper.toSO(workout);

        assertNotNull(so);
        assertEquals(1L, so.getId());
        assertEquals("Chest Workout", so.getName());
        assertNotNull(so.getCreatedAt());
        assertNotNull(so.getUpdatedAt());
    }

    @Test
    void testToSO_Null() {
        WorkoutSO so = WorkoutMapper.toSO(null);
        assertNull(so);
    }

    @Test
    void testToEntity() {
        WorkoutSO so = new WorkoutSO();
        so.setId(1L);
        so.setName("Chest Workout");
        so.setCreatedAt(new Date());
        so.setUpdatedAt(new Date());

        Workout workout = WorkoutMapper.toEntity(so);

        assertNotNull(workout);
        assertEquals(1L, workout.getId());
        assertEquals("Chest Workout", workout.getName());
    }

    @Test
    void testToEntity_Null() {
        Workout workout = WorkoutMapper.toEntity(null);
        assertNull(workout);
    }
}

