package com.gymtracker.mapper;

import com.gymtracker.entity.Workout;
import com.gymtracker.schemaobject.WorkoutSO;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

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
    void testToSOWithoutNestedData() {
        Workout workout = new Workout();
        workout.setId(1L);
        workout.setName("Chest Workout");
        workout.setCreatedAt(new Date());
        workout.setUpdatedAt(new Date());

        WorkoutSO so = WorkoutMapper.toSOWithoutNestedData(workout);

        assertNotNull(so);
        assertEquals(1L, so.getId());
        assertEquals("Chest Workout", so.getName());
        assertNotNull(so.getCreatedAt());
        assertNotNull(so.getUpdatedAt());
        // Verify nested data is null
        assertNull(so.getWorkoutExercises());
    }

    @Test
    void testToSOWithoutNestedData_Null() {
        WorkoutSO so = WorkoutMapper.toSOWithoutNestedData(null);
        assertNull(so);
    }

    @Test
    void testToSOListWithoutNestedData() {
        Workout workout1 = new Workout();
        workout1.setId(1L);
        workout1.setName("Chest Workout");
        workout1.setCreatedAt(new Date());
        workout1.setUpdatedAt(new Date());

        Workout workout2 = new Workout();
        workout2.setId(2L);
        workout2.setName("Leg Workout");
        workout2.setCreatedAt(new Date());
        workout2.setUpdatedAt(new Date());

        List<Workout> workouts = Arrays.asList(workout1, workout2);
        List<WorkoutSO> workoutSOs = WorkoutMapper.toSOListWithoutNestedData(workouts);

        assertNotNull(workoutSOs);
        assertEquals(2, workoutSOs.size());
        assertEquals(1L, workoutSOs.get(0).getId());
        assertEquals("Chest Workout", workoutSOs.get(0).getName());
        assertEquals(2L, workoutSOs.get(1).getId());
        assertEquals("Leg Workout", workoutSOs.get(1).getName());
        // Verify nested data is null for all items
        assertNull(workoutSOs.get(0).getWorkoutExercises());
        assertNull(workoutSOs.get(1).getWorkoutExercises());
    }

    @Test
    void testToSOListWithoutNestedData_Null() {
        List<WorkoutSO> workoutSOs = WorkoutMapper.toSOListWithoutNestedData(null);
        assertNull(workoutSOs);
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

