package com.gymtracker.service.impl;

import com.gymtracker.entity.Session;
import com.gymtracker.entity.Workout;
import com.gymtracker.mapper.SessionMapper;
import com.gymtracker.repository.SessionRepository;
import com.gymtracker.repository.WorkoutRepository;
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
        Workout workout = null;
        if (sessionSO.getWorkoutId() != null) {
            workout = workoutRepository.findById(sessionSO.getWorkoutId())
                    .orElseThrow(() -> new RuntimeException("Workout not found with id: " + sessionSO.getWorkoutId()));
        }
        
        Session session = SessionMapper.toEntity(sessionSO, workout);
        Session createdSession = sessionRepository.save(session);
        return SessionMapper.toSO(createdSession);
    }
    
    @Override
    @Transactional(readOnly = true)
    public SessionSO getLastSessionByWorkoutId(Long workoutId) {
        Session session = sessionRepository.findFirstByWorkoutIdOrderBySessionDateDesc(workoutId)
                .orElseThrow(() -> new RuntimeException("No session found for workout with id: " + workoutId));
        return SessionMapper.toSO(session);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SessionSO> getAllSessionsByWorkoutId(Long workoutId) {
        List<Session> sessions = sessionRepository.findByWorkoutIdOrderBySessionDateDesc(workoutId);
        return SessionMapper.toSOList(sessions);
    }
}

