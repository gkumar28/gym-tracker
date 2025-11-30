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
public class TemplateSO {
    private Long id;

    @NotBlank(message = "Template name cannot be blank")
    @Size(min = 1, max = 255, message = "Template name must be between 1 and 255 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Valid
    @NotNull(message = "Template exercises cannot be null")
    @Size(min = 1, message = "At least one exercise is required")
    private List<TemplateExerciseSO> templateExercises = new ArrayList<>();

    private Date createdAt;
    private Date updatedAt;
}

