package com.gymtracker.mapper;

import com.gymtracker.entity.Session;
import com.gymtracker.entity.Workout;
import com.gymtracker.schemaobject.SessionSO;

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
        return session;
    }
}
