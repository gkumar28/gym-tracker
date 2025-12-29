package com.gymtracker.repository;

import com.gymtracker.entity.Workout;
import java.util.List;

public interface WorkoutRepositoryCustom {
    
    List<Workout> searchWorkouts(
        String name,
        String createdDateFrom,
        String createdDateTo,
        Integer limit,
        Integer offset
    );
    
    Long countWorkouts(
        String name,
        String createdDateFrom,
        String createdDateTo
    );
}
