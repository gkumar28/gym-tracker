package com.gymtracker.repository.impl;

import com.gymtracker.entity.Session;
import com.gymtracker.repository.SessionRepositoryCustom;
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
public class SessionRepositoryCustomImpl implements SessionRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    @Override
    public List<Session> searchSessions(
            Long workoutId,
            String sessionDateFrom,
            String sessionDateTo,
            Integer limit,
            Integer offset) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Session> query = cb.createQuery(Session.class);
        Root<Session> root = query.from(Session.class);
        
        List<Predicate> predicates = buildPredicates(cb, root, workoutId, sessionDateFrom, sessionDateTo);
        
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }
        
        // Order by session date descending
        query.orderBy(cb.desc(root.get("sessionDate")));
        
        TypedQuery<Session> typedQuery = entityManager.createQuery(query);
        
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
    public Long countSessions(
            Long workoutId,
            String sessionDateFrom,
            String sessionDateTo) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Session> root = query.from(Session.class);
        
        List<Predicate> predicates = buildPredicates(cb, root, workoutId, sessionDateFrom, sessionDateTo);
        
        if (!predicates.isEmpty()) {
            query.where(cb.and(predicates.toArray(new Predicate[0])));
        }
        
        query.select(cb.count(root));
        return entityManager.createQuery(query).getSingleResult();
    }
    
    private List<Predicate> buildPredicates(
            CriteriaBuilder cb, Root<Session> root, 
            Long workoutId, String sessionDateFrom, String sessionDateTo) {
        
        List<Predicate> predicates = new ArrayList<>();
        
        // Workout filter
        if (workoutId != null) {
            predicates.add(cb.equal(root.get("workout").get("id"), workoutId));
        }
        
        // Session date from filter
        if (sessionDateFrom != null && !sessionDateFrom.trim().isEmpty()) {
            try {
                LocalDateTime fromDate = LocalDateTime.parse(sessionDateFrom, DATE_FORMATTER);
                predicates.add(cb.greaterThanOrEqualTo(root.get("sessionDate"), fromDate));
            } catch (Exception e) {
                // Invalid date format, no predicate added
            }
        }
        
        // Session date to filter
        if (sessionDateTo != null && !sessionDateTo.trim().isEmpty()) {
            try {
                LocalDateTime toDate = LocalDateTime.parse(sessionDateTo, DATE_FORMATTER);
                predicates.add(cb.lessThanOrEqualTo(root.get("sessionDate"), toDate));
            } catch (Exception e) {
                // Invalid date format, no predicate added
            }
        }
        
        return predicates;
    }
}
