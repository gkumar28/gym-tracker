package com.gymtracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(name = "session_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date sessionDate;

    @Column(length = 1000)
    private String notes;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @PrePersist
    protected void onCreate() {
        if (sessionDate == null) {
            sessionDate = new Date();
        }
        createdAt = new Date();
    }
}
