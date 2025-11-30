package com.gymtracker.schemaobject;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Exercise schema object")
public class ExerciseSO {
    @Schema(description = "Unique identifier for the exercise", example = "1")
    private Long id;

    @NotBlank(message = "Exercise name cannot be blank")
    @Size(min = 1, max = 255, message = "Exercise name must be between 1 and 255 characters")
    @Schema(description = "Name of the exercise", example = "Bench Press", required = true)
    private String name;

    @Size(max = 1000, message = "Logo URL cannot exceed 1000 characters")
    @Schema(description = "Logo or image URL for the exercise", example = "https://example.com/bench-press.png")
    private String logo;
}

