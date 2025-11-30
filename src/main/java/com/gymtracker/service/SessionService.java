package com.gymtracker.service;

import com.gymtracker.schemaobject.SessionSO;

import java.util.List;

public interface SessionService {
    
    SessionSO createSession(SessionSO sessionSO);
    
    SessionSO getLastSessionByWorkoutId(Long workoutId);
    
    List<SessionSO> getAllSessionsByWorkoutId(Long workoutId);
}

