package com.gymtracker.mapper;

import com.gymtracker.entity.Session;
import com.gymtracker.entity.Workout;
import com.gymtracker.schemaobject.SessionSO;

import java.util.List;
import java.util.stream.Collectors;

public class SessionMapper {

    public static SessionSO toSO(Session session) {
        if (session == null) {
            return null;
        }
        SessionSO so = new SessionSO();
        so.setId(session.getId());
        if (session.getWorkout() != null) {
            so.setWorkoutId(session.getWorkout().getId());
        }
        so.setSessionExercises(SessionExerciseMapper.toSOList(session.getSessionExercises()));
        so.setSessionDate(session.getSessionDate());
        so.setNotes(session.getNotes());
        so.setDurationMinutes(session.getDurationMinutes());
        so.setCreatedAt(session.getCreatedAt());
        return so;
    }

    public static Session toEntity(SessionSO so, Workout workout) {
        if (so == null) {
            return null;
        }
        Session session = new Session();
        session.setId(so.getId());
        session.setWorkout(workout);
        session.setSessionDate(so.getSessionDate());
        session.setNotes(so.getNotes());
        session.setDurationMinutes(so.getDurationMinutes());
        session.setCreatedAt(so.getCreatedAt());
        
        List<SessionExercise> sessionExercises = SessionExerciseMapper.toEntityList(so.getSessionExercises());
        if (sessionExercises != null) {
            sessionExercises.forEach(se -> se.setSession(session));
            session.setSessionExercises(sessionExercises);
        }
        
        return session;
    }

    public static List<SessionSO> toSOList(List<Session> sessions) {
        if (sessions == null) {
            return null;
        }
        return sessions.stream()
                .map(SessionMapper::toSO)
                .collect(Collectors.toList());
    }
}
