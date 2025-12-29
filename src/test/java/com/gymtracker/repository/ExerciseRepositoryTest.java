package com.gymtracker.repository;

import com.gymtracker.entity.Exercise;
import com.gymtracker.enums.Equipment;
import com.gymtracker.enums.MuscleGroup;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Transactional
class ExerciseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Test
    void testSaveAndFindById() {
        Exercise exercise = new Exercise();
        exercise.setName("Bench Press");
        exercise.setLogo("logo.png");
        exercise.setDescription("Compound chest exercise");
        exercise.setCategory("Strength");
        exercise.setDifficulty(Exercise.Difficulty.INTERMEDIATE);

        Exercise saved = entityManager.persistAndFlush(exercise);

        Exercise found = exerciseRepository.findById(saved.getId()).orElse(null);

        assertNotNull(found);
        assertEquals("Bench Press", found.getName());
        assertEquals("logo.png", found.getLogo());
        assertEquals("Compound chest exercise", found.getDescription());
        assertEquals("Strength", found.getCategory());
        assertEquals(Exercise.Difficulty.INTERMEDIATE, found.getDifficulty());
    }

    @Test
    void testSearchByName() {
        Exercise exercise1 = new Exercise();
        exercise1.setName("Bench Press");
        exercise1.setLogo("logo1.png");
        exercise1.setCategory("Strength");
        exercise1.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        Exercise exercise2 = new Exercise();
        exercise2.setName("Squat Bench");
        exercise2.setLogo("logo2.png");
        exercise2.setCategory("Strength");
        exercise2.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        Exercise exercise3 = new Exercise();
        exercise3.setName("Deadlift");
        exercise3.setLogo("logo3.png");
        exercise3.setCategory("Strength");
        exercise3.setDifficulty(Exercise.Difficulty.ADVANCED);

        entityManager.persistAndFlush(exercise1);
        entityManager.persistAndFlush(exercise2);
        entityManager.persistAndFlush(exercise3);

        List<Exercise> results = exerciseRepository.searchByName("bench");

        assertEquals(2, results.size());
        assertTrue(results.stream().anyMatch(e -> e.getName().equals("Bench Press")));
        assertTrue(results.stream().anyMatch(e -> e.getName().equals("Squat Bench")));
    }

    @Test
    void testSearchByName_CaseInsensitive() {
        Exercise exercise = new Exercise();
        exercise.setName("Bench Press Case Test");
        exercise.setLogo("logo.png");
        exercise.setCategory("Strength");
        exercise.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        entityManager.persistAndFlush(exercise);

        List<Exercise> results = exerciseRepository.searchByName("BENCH");

        assertEquals(1, results.size());
        assertEquals("Bench Press Case Test", results.get(0).getName());
    }

    @Test
    void testFindAllCategories() {
        Exercise exercise1 = new Exercise();
        exercise1.setName("Bench Press Category Test");
        exercise1.setCategory("Strength");
        exercise1.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        Exercise exercise2 = new Exercise();
        exercise2.setName("Running Category Test");
        exercise2.setCategory("Cardio");
        exercise2.setDifficulty(Exercise.Difficulty.BEGINNER);
        
        Exercise exercise3 = new Exercise();
        exercise3.setName("Stretching Category Test");
        exercise3.setCategory("Flexibility");
        exercise3.setDifficulty(Exercise.Difficulty.BEGINNER);

        entityManager.persistAndFlush(exercise1);
        entityManager.persistAndFlush(exercise2);
        entityManager.persistAndFlush(exercise3);

        List<String> categories = exerciseRepository.findAllCategories();

        assertEquals(3, categories.size());
        assertTrue(categories.contains("Strength"));
        assertTrue(categories.contains("Cardio"));
        assertTrue(categories.contains("Flexibility"));
    }

    @Test
    void testSearchExercises_WithFilters() {
        Exercise exercise1 = new Exercise();
        exercise1.setName("Bench Press");
        exercise1.setCategory("Strength");
        exercise1.setMuscleGroups(List.of(MuscleGroup.CHEST, MuscleGroup.SHOULDERS));
        exercise1.setEquipment(List.of(Equipment.BARBELL));
        exercise1.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        Exercise exercise2 = new Exercise();
        exercise2.setName("Squat");
        exercise2.setCategory("Strength");
        exercise2.setMuscleGroups(List.of(MuscleGroup.QUADRICEPS));
        exercise2.setEquipment(List.of(Equipment.BARBELL));
        exercise2.setDifficulty(Exercise.Difficulty.BEGINNER);

        entityManager.persistAndFlush(exercise1);
        entityManager.persistAndFlush(exercise2);

        // Test search with muscle group filter
        List<Exercise> chestExercises = exerciseRepository.searchExercises(
            null, null, "Chest", null, null, 10, 0);
        assertEquals(1, chestExercises.size());
        assertEquals("Bench Press", chestExercises.get(0).getName());

        // Test search with equipment filter
        List<Exercise> barbellExercises = exerciseRepository.searchExercises(
            null, null, null, "Barbell", null, 10, 0);
        assertEquals(2, barbellExercises.size());

        // Test search with difficulty filter
        List<Exercise> beginnerExercises = exerciseRepository.searchExercises(
            null, null, null, null, "BEGINNER", 10, 0);
        assertEquals(1, beginnerExercises.size());
        assertEquals("Squat", beginnerExercises.get(0).getName());
    }

    @Test
    void testCountExercises_WithFilters() {
        Exercise exercise1 = new Exercise();
        exercise1.setName("Bench Press");
        exercise1.setCategory("Strength");
        exercise1.setMuscleGroups(List.of(MuscleGroup.CHEST));
        exercise1.setEquipment(List.of(Equipment.BARBELL));
        exercise1.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        Exercise exercise2 = new Exercise();
        exercise2.setName("Squat");
        exercise2.setCategory("Strength");
        exercise2.setMuscleGroups(List.of(MuscleGroup.QUADRICEPS));
        exercise2.setEquipment(List.of(Equipment.BARBELL));
        exercise2.setDifficulty(Exercise.Difficulty.BEGINNER);

        entityManager.persistAndFlush(exercise1);
        entityManager.persistAndFlush(exercise2);

        // Test count with muscle group filter
        Long chestCount = exerciseRepository.countExercises(
            null, null, "Chest", null, null);
        assertEquals(1L, chestCount);

        // Test count with equipment filter
        Long barbellCount = exerciseRepository.countExercises(
            null, null, null, "Barbell", null);
        assertEquals(2L, barbellCount);

        // Test count with difficulty filter
        Long beginnerCount = exerciseRepository.countExercises(
            null, null, null, null, "BEGINNER");
        assertEquals(1L, beginnerCount);
    }

    @Test
    void testFindAll() {
        Exercise exercise1 = new Exercise();
        exercise1.setName("Bench Press Find All Test");
        exercise1.setLogo("logo1.png");
        exercise1.setCategory("Strength");
        exercise1.setDifficulty(Exercise.Difficulty.INTERMEDIATE);
        
        Exercise exercise2 = new Exercise();
        exercise2.setName("Squat Find All Test");
        exercise2.setLogo("logo2.png");
        exercise2.setCategory("Strength");
        exercise2.setDifficulty(Exercise.Difficulty.ADVANCED);

        entityManager.persistAndFlush(exercise1);
        entityManager.persistAndFlush(exercise2);

        List<Exercise> all = exerciseRepository.findAll();

        assertEquals(2, all.size());
    }
}

