package com.gymtracker.schemaobject;

import com.gymtracker.entity.Exercise;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Exercise schema object")
public class ExerciseSO {
    @Schema(description = "Unique identifier for the exercise", example = "1")
    private Long id;

    @NotBlank(message = "Exercise name cannot be blank")
    @Size(min = 1, max = 255, message = "Exercise name must be between 1 and 255 characters")
    @Schema(description = "Name of the exercise", example = "Bench Press")
    private String name;

    @Size(max = 1000, message = "Logo URL cannot exceed 1000 characters")
    @Schema(description = "Logo or image URL for the exercise", example = "https://example.com/bench-press.png")
    private String logo;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Schema(description = "Description of the exercise", example = "Compound exercise targeting chest, shoulders, and triceps")
    private String description;

    @NotBlank(message = "Category cannot be blank")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    @Schema(description = "Exercise category", example = "Strength")
    private String category;

    @Schema(description = "List of muscle groups targeted by this exercise")
    private List<String> muscleGroups;

    @Schema(description = "List of equipment needed for this exercise")
    private List<String> equipment;

    @NotNull(message = "Difficulty cannot be null")
    @Schema(description = "Difficulty level of the exercise", allowableValues = {"BEGINNER", "INTERMEDIATE", "ADVANCED"})
    private Exercise.Difficulty difficulty;

    @Schema(description = "Step-by-step instructions for performing the exercise")
    private List<String> instructions;

    @Schema(description = "Tips and best practices for the exercise")
    private List<String> tips;

    @Size(max = 1000, message = "Image URL cannot exceed 1000 characters")
    @Schema(description = "URL to exercise demonstration image", example = "https://example.com/bench-press-demo.jpg")
    private String imageUrl;

    @Size(max = 1000, message = "Video URL cannot exceed 1000 characters")
    @Schema(description = "URL to exercise demonstration video", example = "https://example.com/bench-press-demo.mp4")
    private String videoUrl;

    @Schema(description = "Date when the exercise was created")
    private Date createdAt;

    @Schema(description = "Date when the exercise was last updated")
    private Date updatedAt;
}

