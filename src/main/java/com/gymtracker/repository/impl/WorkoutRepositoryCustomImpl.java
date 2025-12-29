package com.gymtracker.repository.impl;

import com.gymtracker.entity.Workout;
import com.gymtracker.repository.WorkoutRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Repository
public class WorkoutRepositoryCustomImpl implements WorkoutRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public List<Workout> searchWorkouts(
            String name,
            String createdDateFrom,
            String createdDateTo,
            Integer limit,
            Integer offset) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Workout> query = cb.createQuery(Workout.class);
        Root<Workout> root = query.from(Workout.class);
        
        List<Predicate> predicates = buildPredicates(cb, root, name, createdDateFrom, createdDateTo);
        
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }
        
        // Order by created date descending
        query.orderBy(cb.desc(root.get("createdAt")));
        
        TypedQuery<Workout> typedQuery = entityManager.createQuery(query);
        
        // Apply pagination
        if (offset != null && offset > 0) {
            typedQuery.setFirstResult(offset);
        }
        if (limit != null && limit > 0) {
            typedQuery.setMaxResults(limit);
        }
        
        return typedQuery.getResultList();
    }
    
    @Override
    public Long countWorkouts(
            String name,
            String createdDateFrom,
            String createdDateTo) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Workout> root = query.from(Workout.class);
        
        List<Predicate> predicates = buildPredicates(cb, root, name, createdDateFrom, createdDateTo);
        
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }
        
        query.select(cb.count(root));
        return entityManager.createQuery(query).getSingleResult();
    }
    
    private List<Predicate> buildPredicates(
            CriteriaBuilder cb, Root<Workout> root, 
            String name, String createdDateFrom, String createdDateTo) {
        
        List<Predicate> predicates = new ArrayList<>();
        
        // Name filter (case-insensitive search)
        if (name != null && !name.trim().isEmpty()) {
            String searchPattern = "%" + name.trim().toLowerCase() + "%";
            predicates.add(cb.like(cb.lower(root.get("name")), searchPattern));
        }
        
        // Created date from filter
        if (createdDateFrom != null && !createdDateFrom.trim().isEmpty()) {
            try {
                LocalDateTime fromDate = LocalDateTime.parse(createdDateFrom, DATE_FORMATTER);
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), fromDate));
            } catch (Exception e) {
                // Invalid date format, no predicate added
            }
        }
        
        // Created date to filter
        if (createdDateTo != null && !createdDateTo.trim().isEmpty()) {
            try {
                LocalDateTime toDate = LocalDateTime.parse(createdDateTo, DATE_FORMATTER);
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), toDate));
            } catch (Exception e) {
                // Invalid date format, no predicate added
            }
        }
        
        return predicates;
    }
}
