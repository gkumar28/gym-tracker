package com.gymtracker.repository;

import com.gymtracker.entity.Exercise;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ExerciseRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Test
    void testSaveAndFindById() {
        Exercise exercise = new Exercise(null, "Bench Press", "logo.png");
        Exercise saved = entityManager.persistAndFlush(exercise);

        Exercise found = exerciseRepository.findById(saved.getId()).orElse(null);

        assertNotNull(found);
        assertEquals("Bench Press", found.getName());
        assertEquals("logo.png", found.getLogo());
    }

    @Test
    void testSearchByName() {
        Exercise exercise1 = new Exercise(null, "Bench Press", "logo1.png");
        Exercise exercise2 = new Exercise(null, "Squat Bench", "logo2.png");
        Exercise exercise3 = new Exercise(null, "Deadlift", "logo3.png");

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
        Exercise exercise = new Exercise(null, "Bench Press", "logo.png");
        entityManager.persistAndFlush(exercise);

        List<Exercise> results = exerciseRepository.searchByName("BENCH");

        assertEquals(1, results.size());
        assertEquals("Bench Press", results.get(0).getName());
    }

    @Test
    void testFindAll() {
        Exercise exercise1 = new Exercise(null, "Bench Press", "logo1.png");
        Exercise exercise2 = new Exercise(null, "Squat", "logo2.png");

        entityManager.persistAndFlush(exercise1);
        entityManager.persistAndFlush(exercise2);

        List<Exercise> all = exerciseRepository.findAll();

        assertEquals(2, all.size());
    }
}

