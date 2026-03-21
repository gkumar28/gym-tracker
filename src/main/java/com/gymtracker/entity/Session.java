package com.gymtracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id")
    private Workout workout;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("exerciseOrder ASC")
    private List<SessionExercise> sessionExercises = new ArrayList<>();

    @Column(name = "session_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime sessionDate;

    @Column(length = 1000)
    private String notes;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Column(name = "exercise_count")
    private Integer exerciseCount;

    @PrePersist
    @PreUpdate
    protected void onCreate() {
        if (sessionDate == null) {
            sessionDate = LocalDateTime.now();
        }
        if (createdAt == null) { 
            createdAt = LocalDateTime.now();
        }
        exerciseCount = this.getSessionExercises().size();
    }
}
