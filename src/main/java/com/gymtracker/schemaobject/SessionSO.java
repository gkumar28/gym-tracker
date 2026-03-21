package com.gymtracker.schemaobject;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionSO {
    private Long id;

    private Long workoutId;
    
    private String workoutName;

    @Valid
    @NotNull(message = "Session exercises cannot be null")
    @Size(min = 1, message = "At least one exercise is required")
    private List<SessionExerciseSO> sessionExercises = new ArrayList<>();

    @NotNull(message = "Session date cannot be null")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime sessionDate;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @Min(value = 0, message = "Duration minutes cannot be negative")
    private Integer durationMinutes;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
