package com.gymtracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_exercises")
@Data
@NoArgsConstructor
public class WorkoutExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @ElementCollection
    @CollectionTable(name = "workout_exercise_sets", joinColumns = @JoinColumn(name = "workout_exercise_id"))
    private List<Set> sets = new ArrayList<>();

    @Column(name = "exercise_order")
    private Integer exerciseOrder;
}

