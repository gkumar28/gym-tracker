package com.gymtracker.schemaobject;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionExerciseSO {
    private Long id;

    @NotBlank(message = "Exercise name cannot be blank")
    @Size(max = 255, message = "Exercise name cannot exceed 255 characters")
    private String exerciseName;

    @Valid
    @NotNull(message = "Sets cannot be null")
    @Size(min = 1, message = "At least one set is required")
    private List<SetSO> sets = new ArrayList<>();

    @Min(value = 0, message = "Exercise order cannot be negative")
    private Integer exerciseOrder;
}

