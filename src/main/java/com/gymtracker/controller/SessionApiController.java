package com.gymtracker.controller;

import com.gymtracker.api.SessionApi;
import com.gymtracker.schemaobject.SessionSO;
import com.gymtracker.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SessionApiController implements SessionApi {
    
    private final SessionService sessionService;
    
    @Override
    public ResponseEntity<SessionSO> createSession(SessionSO sessionSO) {
        SessionSO createdSession = sessionService.createSession(sessionSO);
        return ResponseEntity.status(201).body(createdSession);
    }
    
    @Override
    public ResponseEntity<SessionSO> getLastSessionByWorkoutId(Long workoutId) {
        SessionSO session = sessionService.getLastSessionByWorkoutId(workoutId);
        return ResponseEntity.ok(session);
    }
    
    @Override
    public ResponseEntity<List<SessionSO>> getAllSessionsByWorkoutId(Long workoutId) {
        List<SessionSO> sessions = sessionService.getAllSessionsByWorkoutId(workoutId);
        return ResponseEntity.ok(sessions);
    }
}

