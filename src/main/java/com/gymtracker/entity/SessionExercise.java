package com.gymtracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "session_exercises")
@Data
@NoArgsConstructor
public class SessionExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @ElementCollection
    @CollectionTable(name = "session_exercise_sets", joinColumns = @JoinColumn(name = "session_exercise_id"))
    private List<Set> sets = new ArrayList<>();

    @Column(name = "exercise_order")
    private Integer exerciseOrder;

    @Column(name = "rest_after_exercise_seconds")
    private Integer restAfterExerciseSeconds = 0;
}

