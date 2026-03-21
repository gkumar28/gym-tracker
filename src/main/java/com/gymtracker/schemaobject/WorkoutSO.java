package com.gymtracker.schemaobject;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
public class WorkoutSO {
    private Long id;

    @NotBlank(message = "Workout name cannot be blank")
    @Size(min = 1, max = 255, message = "Workout name must be between 1 and 255 characters")
    private String name;

    @Valid
    @NotNull(message = "Workout exercises cannot be null")
    @Size(min = 1, message = "At least one exercise is required")
    private List<WorkoutExerciseSO> workoutExercises = new ArrayList<>();

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    private Integer exerciseCount;
}

