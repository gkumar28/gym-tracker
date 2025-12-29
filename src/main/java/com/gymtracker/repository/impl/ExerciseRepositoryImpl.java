package com.gymtracker.repository.impl;

import com.gymtracker.entity.Exercise;
import com.gymtracker.enums.Equipment;
import com.gymtracker.enums.MuscleGroup;
import com.gymtracker.repository.ExerciseRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ExerciseRepositoryImpl implements ExerciseRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Exercise> searchExercises(
            String search, String category, String muscle, String equipment, 
            String difficulty, Integer limit, Integer offset) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Exercise> query = cb.createQuery(Exercise.class);
        Root<Exercise> root = query.from(Exercise.class);

        List<Predicate> predicates = buildPredicates(cb, root, search, category, muscle, equipment, difficulty);
        
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        TypedQuery<Exercise> typedQuery = entityManager.createQuery(query);
        
        // Apply pagination
        if (offset != null && offset > 0) {
            typedQuery.setFirstResult(offset);
        }
        if (limit != null && limit > 0) {
            typedQuery.setMaxResults(limit);
        }

        return typedQuery.getResultList();
    }

    public Long countExercises(
            String search, String category, String muscle, String equipment, String difficulty) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Exercise> root = query.from(Exercise.class);

        List<Predicate> predicates = buildPredicates(cb, root, search, category, muscle, equipment, difficulty);
        
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }

        query.select(cb.count(root));
        return entityManager.createQuery(query).getSingleResult();
    }

    private List<Predicate> buildPredicates(
            CriteriaBuilder cb, Root<Exercise> root, 
            String search, String category, String muscle, String equipment, String difficulty) {
        
        List<Predicate> predicates = new ArrayList<>();

        // Search filter (name or description)
        if (search != null && !search.trim().isEmpty()) {
            String searchPattern = "%" + search.trim().toLowerCase() + "%";
            Predicate nameMatch = cb.like(cb.lower(root.get("name")), searchPattern);
            Predicate descriptionMatch = cb.like(cb.lower(root.get("description")), searchPattern);
            predicates.add(cb.or(nameMatch, descriptionMatch));
        }

        // Category filter
        if (category != null && !category.trim().isEmpty()) {
            predicates.add(cb.equal(root.get("category"), category.trim()));
        }

        // Muscle group filter
        if (muscle != null && !muscle.trim().isEmpty()) {
            try {
                MuscleGroup muscleGroup = MuscleGroup.valueOf(muscle.trim().toUpperCase());
                predicates.add(cb.isMember(muscleGroup, root.get("muscleGroups")));
            } catch (IllegalArgumentException e) {
                // Invalid muscle group, no predicate added
            }
        }

        // Equipment filter
        if (equipment != null && !equipment.trim().isEmpty()) {
            try {
                Equipment equipmentType = Equipment.valueOf(equipment.trim().toUpperCase().replace(" ", "_"));
                predicates.add(cb.isMember(equipmentType, root.get("equipment")));
            } catch (IllegalArgumentException e) {
                // Invalid equipment, no predicate added
            }
        }

        // Difficulty filter
        if (difficulty != null && !difficulty.trim().isEmpty()) {
            try {
                Exercise.Difficulty difficultyLevel = Exercise.Difficulty.valueOf(difficulty.trim().toUpperCase());
                predicates.add(cb.equal(root.get("difficulty"), difficultyLevel));
            } catch (IllegalArgumentException e) {
                // Invalid difficulty, no predicate added
            }
        }

        return predicates;
    }
}
