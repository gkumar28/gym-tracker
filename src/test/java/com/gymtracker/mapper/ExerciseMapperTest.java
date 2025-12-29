package com.gymtracker.mapper;

import com.gymtracker.entity.Exercise;
import com.gymtracker.enums.Equipment;
import com.gymtracker.enums.MuscleGroup;
import com.gymtracker.schemaobject.ExerciseSO;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ExerciseMapperTest {

    @Test
    void testToSO() {
        Exercise exercise = new Exercise();
        exercise.setId(1L);
        exercise.setName("Bench Press");
        exercise.setLogo("logo.png");
        exercise.setDescription("Compound chest exercise");
        exercise.setCategory("Strength");
        exercise.setMuscleGroups(Arrays.asList(MuscleGroup.CHEST, MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS));
        exercise.setEquipment(Arrays.asList(Equipment.BARBELL, Equipment.BENCH_PRESS));
        exercise.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        exercise.setInstructions(Arrays.asList("Lie on bench", "Lower bar to chest", "Press up"));
        exercise.setTips(Arrays.asList("Keep back flat", "Control movement"));
        exercise.setImageUrl("bench-press.jpg");
        exercise.setVideoUrl("bench-press.mp4");
        exercise.setCreatedAt(new Date());
        exercise.setUpdatedAt(new Date());

        ExerciseSO so = ExerciseMapper.toSO(exercise);

        assertNotNull(so);
        assertEquals(1L, so.getId());
        assertEquals("Bench Press", so.getName());
        assertEquals("logo.png", so.getLogo());
        assertEquals("Compound chest exercise", so.getDescription());
        assertEquals("Strength", so.getCategory());
        assertEquals(3, so.getMuscleGroups().size());
        assertTrue(so.getMuscleGroups().contains("Chest"));
        assertTrue(so.getMuscleGroups().contains("Shoulders"));
        assertTrue(so.getMuscleGroups().contains("Triceps"));
        assertEquals(2, so.getEquipment().size());
        assertTrue(so.getEquipment().contains("Barbell"));
        assertTrue(so.getEquipment().contains("Bench Press"));
        assertEquals(Exercise.Difficulty.INTERMEDIATE, so.getDifficulty());
        assertEquals(3, so.getInstructions().size());
        assertEquals("Lie on bench", so.getInstructions().get(0));
        assertEquals(2, so.getTips().size());
        assertEquals("Keep back flat", so.getTips().get(0));
        assertEquals("bench-press.jpg", so.getImageUrl());
        assertEquals("bench-press.mp4", so.getVideoUrl());
        assertNotNull(so.getCreatedAt());
        assertNotNull(so.getUpdatedAt());
    }

    @Test
    void testToSO_Null() {
        ExerciseSO so = ExerciseMapper.toSO(null);
        assertNull(so);
    }

    @Test
    void testToEntity() {
        ExerciseSO so = new ExerciseSO();
        so.setId(1L);
        so.setName("Bench Press");
        so.setLogo("logo.png");
        so.setDescription("Compound chest exercise");
        so.setCategory("Strength");
        so.setMuscleGroups(Arrays.asList("Chest", "Shoulders", "Triceps"));
        so.setEquipment(Arrays.asList("Barbell", "Bench Press"));
        so.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        so.setInstructions(Arrays.asList("Lie on bench", "Lower bar to chest", "Press up"));
        so.setTips(Arrays.asList("Keep back flat", "Control movement"));
        so.setImageUrl("bench-press.jpg");
        so.setVideoUrl("bench-press.mp4");
        so.setCreatedAt(new Date());
        so.setUpdatedAt(new Date());

        Exercise exercise = ExerciseMapper.toEntity(so);

        assertNotNull(exercise);
        assertEquals(1L, exercise.getId());
        assertEquals("Bench Press", exercise.getName());
        assertEquals("logo.png", exercise.getLogo());
        assertEquals("Compound chest exercise", exercise.getDescription());
        assertEquals("Strength", exercise.getCategory());
        assertEquals(3, exercise.getMuscleGroups().size());
        assertTrue(exercise.getMuscleGroups().contains(MuscleGroup.CHEST));
        assertTrue(exercise.getMuscleGroups().contains(MuscleGroup.SHOULDERS));
        assertTrue(exercise.getMuscleGroups().contains(MuscleGroup.TRICEPS));
        assertEquals(2, exercise.getEquipment().size());
        assertTrue(exercise.getEquipment().contains(Equipment.BARBELL));
        assertTrue(exercise.getEquipment().contains(Equipment.BENCH_PRESS));
        assertEquals(Exercise.Difficulty.INTERMEDIATE, exercise.getDifficulty());
        assertEquals(3, exercise.getInstructions().size());
        assertEquals("Lie on bench", exercise.getInstructions().get(0));
        assertEquals(2, exercise.getTips().size());
        assertEquals("Keep back flat", exercise.getTips().get(0));
        assertEquals("bench-press.jpg", exercise.getImageUrl());
        assertEquals("bench-press.mp4", exercise.getVideoUrl());
    }

    @Test
    void testToEntity_Null() {
        Exercise exercise = ExerciseMapper.toEntity(null);
        assertNull(exercise);
    }

    @Test
    void testToSOList() {
        Exercise exercise1 = new Exercise();
        exercise1.setId(1L);
        exercise1.setName("Bench Press");
        exercise1.setLogo("logo1.png");
        exercise1.setMuscleGroups(Arrays.asList(MuscleGroup.CHEST));
        exercise1.setEquipment(Arrays.asList(Equipment.BARBELL));

        Exercise exercise2 = new Exercise();
        exercise2.setId(2L);
        exercise2.setName("Squat");
        exercise2.setLogo("logo2.png");
        exercise2.setMuscleGroups(Arrays.asList(MuscleGroup.QUADRICEPS));
        exercise2.setEquipment(Arrays.asList(Equipment.BARBELL));

        List<ExerciseSO> exerciseSOs = ExerciseMapper.toSOList(Arrays.asList(exercise1, exercise2));

        assertNotNull(exerciseSOs);
        assertEquals(2, exerciseSOs.size());
        assertEquals("Bench Press", exerciseSOs.get(0).getName());
        assertEquals("Squat", exerciseSOs.get(1).getName());
        assertEquals("Chest", exerciseSOs.get(0).getMuscleGroups().get(0));
        assertEquals("Quadriceps", exerciseSOs.get(1).getMuscleGroups().get(0));
    }

    @Test
    void testToSOList_Null() {
        List<ExerciseSO> exerciseSOs = ExerciseMapper.toSOList(null);
        assertNull(exerciseSOs);
    }

    @Test
    void testToEntityList() {
        ExerciseSO so1 = new ExerciseSO();
        so1.setId(1L);
        so1.setName("Bench Press");
        so1.setLogo("logo1.png");
        so1.setMuscleGroups(Arrays.asList("Chest"));
        so1.setEquipment(Arrays.asList("Barbell"));

        ExerciseSO so2 = new ExerciseSO();
        so2.setId(2L);
        so2.setName("Squat");
        so2.setLogo("logo2.png");
        so2.setMuscleGroups(Arrays.asList("Quadriceps"));
        so2.setEquipment(Arrays.asList("Barbell"));

        List<Exercise> exercises = ExerciseMapper.toEntityList(Arrays.asList(so1, so2));

        assertNotNull(exercises);
        assertEquals(2, exercises.size());
        assertEquals("Bench Press", exercises.get(0).getName());
        assertEquals("Squat", exercises.get(1).getName());
        assertEquals(MuscleGroup.CHEST, exercises.get(0).getMuscleGroups().get(0));
        assertEquals(MuscleGroup.QUADRICEPS, exercises.get(1).getMuscleGroups().get(0));
    }

    @Test
    void testToEntityList_Null() {
        List<Exercise> exercises = ExerciseMapper.toEntityList(null);
        assertNull(exercises);
    }

    @Test
    void testStringToMuscleGroup_ValidDisplayName() {
        // Test through toEntity method since stringToMuscleGroup is private
        ExerciseSO so = new ExerciseSO();
        so.setMuscleGroups(Arrays.asList("Chest"));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getMuscleGroups());
        assertEquals(1, exercise.getMuscleGroups().size());
        assertEquals(MuscleGroup.CHEST, exercise.getMuscleGroups().get(0));
    }

    @Test
    void testStringToMuscleGroup_ValidEnumName() {
        // Test through toEntity method since stringToMuscleGroup is private
        ExerciseSO so = new ExerciseSO();
        so.setMuscleGroups(Arrays.asList("CHEST"));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getMuscleGroups());
        assertEquals(1, exercise.getMuscleGroups().size());
        assertEquals(MuscleGroup.CHEST, exercise.getMuscleGroups().get(0));
    }

    @Test
    void testStringToMuscleGroup_Invalid() {
        // Test through toEntity method since stringToMuscleGroup is private
        ExerciseSO so = new ExerciseSO();
        so.setMuscleGroups(Arrays.asList("Invalid Muscle"));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getMuscleGroups());
        assertEquals(1, exercise.getMuscleGroups().size());
        assertNull(exercise.getMuscleGroups().get(0)); // Invalid values become null
    }

    @Test
    void testStringToMuscleGroup_Null() {
        // Test through toEntity method since stringToMuscleGroup is private
        ExerciseSO so = new ExerciseSO();
        so.setMuscleGroups(Arrays.asList((String) null));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getMuscleGroups());
        assertEquals(1, exercise.getMuscleGroups().size());
        assertNull(exercise.getMuscleGroups().get(0));
    }

    @Test
    void testStringToEquipment_ValidDisplayName() {
        // Test through toEntity method since stringToEquipment is private
        ExerciseSO so = new ExerciseSO();
        so.setEquipment(Arrays.asList("Barbell"));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getEquipment());
        assertEquals(1, exercise.getEquipment().size());
        assertEquals(Equipment.BARBELL, exercise.getEquipment().get(0));
    }

    @Test
    void testStringToEquipment_ValidEnumName() {
        // Test through toEntity method since stringToEquipment is private
        ExerciseSO so = new ExerciseSO();
        so.setEquipment(Arrays.asList("BARBELL"));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getEquipment());
        assertEquals(1, exercise.getEquipment().size());
        assertEquals(Equipment.BARBELL, exercise.getEquipment().get(0));
    }

    @Test
    void testStringToEquipment_Invalid() {
        // Test through toEntity method since stringToEquipment is private
        ExerciseSO so = new ExerciseSO();
        so.setEquipment(Arrays.asList("Invalid Equipment"));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getEquipment());
        assertEquals(1, exercise.getEquipment().size());
        assertNull(exercise.getEquipment().get(0)); // Invalid values become null
    }

    @Test
    void testStringToEquipment_Null() {
        // Test through toEntity method since stringToEquipment is private
        ExerciseSO so = new ExerciseSO();
        so.setEquipment(Arrays.asList((String) null));
        Exercise exercise = ExerciseMapper.toEntity(so);
        
        assertNotNull(exercise.getEquipment());
        assertEquals(1, exercise.getEquipment().size());
        assertNull(exercise.getEquipment().get(0));
    }
}

