package com.gymtracker.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Set {
    private Integer reps;
    private Double weight;
    private Integer restSeconds;
    private String notes;
}
