package com.gymtracker.schemaobject;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionSO {
    private Long id;

    @NotNull(message = "Workout ID cannot be null")
    private Long workoutId;

    @NotNull(message = "Session date cannot be null")
    private Date sessionDate;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @Min(value = 0, message = "Duration minutes cannot be negative")
    private Integer durationMinutes;

    private Date createdAt;
}

