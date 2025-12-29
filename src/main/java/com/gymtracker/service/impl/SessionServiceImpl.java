package com.gymtracker.service.impl;

import com.gymtracker.constants.AppConstants;
import com.gymtracker.entity.Session;
import com.gymtracker.entity.Workout;
import com.gymtracker.mapper.SessionMapper;
import com.gymtracker.repository.SessionRepository;
import com.gymtracker.repository.WorkoutRepository;
import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.SessionSO;
import com.gymtracker.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {
    
    private final SessionRepository sessionRepository;
    private final WorkoutRepository workoutRepository;
    
    @Override
    @Transactional
    public SessionSO createSession(SessionSO sessionSO) {
        Workout workout = workoutRepository.findById(sessionSO.getWorkoutId())
                .orElseThrow(() -> new RuntimeException("Workout not found with id: " + sessionSO.getWorkoutId()));
        
        Session session = SessionMapper.toEntity(sessionSO, workout);
        Session savedSession = sessionRepository.save(session);
        return SessionMapper.toSO(savedSession);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SessionSO getLastSessionByWorkoutId(Long workoutId) {
        Session session = sessionRepository.findFirstByWorkoutIdOrderBySessionDateDesc(workoutId)
                .orElseThrow(() -> new RuntimeException("No session found for workout id: " + workoutId));
        return SessionMapper.toSO(session);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SessionSO getSessionById(Long id) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        return SessionMapper.toSO(session);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SessionSO> getAllSessionsByWorkoutId(Long workoutId) {
        List<Session> sessions = sessionRepository.findByWorkoutIdOrderBySessionDateDesc(workoutId);
        return SessionMapper.toSOList(sessions);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<SessionSO> getAllSessions(Integer page, Integer size, String sort, Long workoutId, String sessionDateFrom, String sessionDateTo) {
        // Validate and apply defaults
        int validatedPage = (page != null && page >= 0) ? page : AppConstants.DEFAULT_PAGE_NUMBER;
        int validatedSize = (size != null && size > 0 && size <= AppConstants.MAX_PAGE_SIZE) 
                ? size : AppConstants.DEFAULT_PAGE_SIZE;
        
        // Calculate offset
        int offset = validatedPage * validatedSize;
        
        // Fetch filtered data
        List<Session> sessions = sessionRepository.searchSessions(
            workoutId, sessionDateFrom, sessionDateTo, validatedSize, offset
        );
        
        // Count total results
        Long total = sessionRepository.countSessions(
            workoutId, sessionDateFrom, sessionDateTo
        );
        
        // OPTIMIZED: Use mapper method that skips nested data to avoid N+1 queries
        List<SessionSO> sessionSOs = SessionMapper.toSOListWithoutNestedData(sessions);
        
        // Build response using existing PaginatedResponse structure
        return new PaginatedResponse<>(
            sessionSOs,
            total,
            (offset + validatedSize) < total, // hasMore
            offset, // offset
            validatedSize // limit
        );
    }
}

