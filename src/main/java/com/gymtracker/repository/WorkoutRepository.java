package com.gymtracker.repository;

import com.gymtracker.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long>, WorkoutRepositoryCustom {
    
    @Query("SELECT w FROM Workout w WHERE LOWER(w.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Workout> searchByName(@Param("searchTerm") String searchTerm);
}

