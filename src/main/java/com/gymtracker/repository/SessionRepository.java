package com.gymtracker.repository;

import com.gymtracker.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long>, SessionRepositoryCustom {
    
    @EntityGraph(attributePaths = {"workout"})
    List<Session> findByWorkoutIdOrderBySessionDateDesc(Long workoutId);
    
    @EntityGraph(attributePaths = {"workout"})
    Optional<Session> findFirstByWorkoutIdOrderBySessionDateDesc(Long workoutId);
}

