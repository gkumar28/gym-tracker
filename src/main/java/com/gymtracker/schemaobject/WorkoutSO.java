package com.gymtracker.schemaobject;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    private Date createdAt;
    private Date updatedAt;
}

