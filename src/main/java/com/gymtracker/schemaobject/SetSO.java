package com.gymtracker.schemaobject;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SetSO {
    @NotNull(message = "Reps cannot be null")
    @Min(value = 0, message = "Reps cannot be negative")
    private Integer reps;

    @Min(value = 0, message = "Weight cannot be negative")
    private Double weight;

    @Min(value = 0, message = "Rest seconds cannot be negative")
    private Integer restSeconds;

    private String notes;
}

