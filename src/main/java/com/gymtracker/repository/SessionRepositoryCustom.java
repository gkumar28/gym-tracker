package com.gymtracker.repository;

import com.gymtracker.entity.Session;
import java.util.List;

public interface SessionRepositoryCustom {
    
    List<Session> searchSessions(
        Long workoutId,
        String sessionDateFrom,
        String sessionDateTo,
        Integer limit,
        Integer offset
    );
    
    Long countSessions(
        Long workoutId,
        String sessionDateFrom,
        String sessionDateTo
    );
}
