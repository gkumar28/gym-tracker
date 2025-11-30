package com.gymtracker.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "template_exercises")
@Data
@NoArgsConstructor
public class TemplateExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;

    @Column(name = "exercise_name", nullable = false)
    private String exerciseName;

    @ElementCollection
    @CollectionTable(name = "template_exercise_sets", joinColumns = @JoinColumn(name = "template_exercise_id"))
    private List<Set> sets = new ArrayList<>();

    @Column(name = "exercise_order")
    private Integer exerciseOrder;
}

