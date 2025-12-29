package com.gymtracker.api;

import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.WorkoutSO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(
    name = "Workout API",
    description = "API endpoints for managing and searching workouts"
)
@RequestMapping("/api/workout")
public interface WorkoutApi {
    
    @Operation(
        summary = "Search workouts with pagination and filters",
        description = "Searches for workouts with pagination support and optional filters. Results are ordered by creation date (most recent first).",
        operationId = "searchWorkouts"
    )
    @GetMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved workouts",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = PaginatedResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid parameters",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<PaginatedResponse<WorkoutSO>> searchWorkouts(
        @Parameter(
            description = "Page number (0-based)",
            example = "0",
            required = false
        )
        @RequestParam(defaultValue = "0") Integer page,
        
        @Parameter(
            description = "Number of items per page",
            example = "20",
            required = false
        )
        @RequestParam(defaultValue = "20") Integer size,
        
        @Parameter(
            description = "Sort field and direction (format: field,direction)",
            example = "createdAt,desc",
            required = false
        )
        @RequestParam(defaultValue = "createdAt,desc") String sort,
        
        @Parameter(
            description = "Filter by workout name (case-insensitive search)",
            example = "chest",
            required = false
        )
        @RequestParam(required = false) String name,
        
        @Parameter(
            description = "Filter workouts created from this date (format: yyyy-MM-dd HH:mm:ss)",
            example = "2024-01-01 00:00:00",
            required = false
        )
        @RequestParam(required = false) String createdDateFrom,
        
        @Parameter(
            description = "Filter workouts created to this date (format: yyyy-MM-dd HH:mm:ss)",
            example = "2024-12-31 23:59:59",
            required = false
        )
        @RequestParam(required = false) String createdDateTo
    );
    
    @Operation(
        summary = "Create a new workout",
        description = "Creates a new workout with the provided name and exercises",
        operationId = "createWorkout"
    )
    @PostMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Workout successfully created",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = WorkoutSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid workout data",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<WorkoutSO> createWorkout(
        @Parameter(
            description = "Workout object to be created",
            required = true,
            schema = @Schema(implementation = WorkoutSO.class)
        )
        @Valid
        @RequestBody WorkoutSO workoutSO
    );
    
    @Operation(
        summary = "Update an existing workout",
        description = "Updates an existing workout with the provided ID, name, and exercises",
        operationId = "updateWorkout"
    )
    @PutMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Workout successfully updated",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = WorkoutSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid workout data",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Workout not found",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<WorkoutSO> updateWorkout(
        @Parameter(
            description = "Workout ID to update",
            required = true,
            example = "1"
        )
        @PathVariable Long id,
        @Parameter(
            description = "Updated workout object",
            required = true,
            schema = @Schema(implementation = WorkoutSO.class)
        )
        @Valid
        @RequestBody WorkoutSO workoutSO
    );
    
    @Operation(
        summary = "Get workout by ID",
        description = "Retrieves a specific workout by its unique identifier",
        operationId = "getWorkoutById"
    )
    @GetMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved workout",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = WorkoutSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Workout not found",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<WorkoutSO> getWorkoutById(
        @Parameter(
            description = "Unique identifier of the workout",
            example = "1",
            required = true
        )
        @PathVariable Long id
    );
    
    @Operation(
        summary = "Create workout from template",
        description = "Creates a new workout based on an existing template. " +
                     "All exercises and sets from the template are copied to the new workout.",
        operationId = "createWorkoutFromTemplate"
    )
    @PostMapping("/from-template/{templateId}")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Workout successfully created from template",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = WorkoutSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid parameters",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Template not found",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<WorkoutSO> createWorkoutFromTemplate(
        @Parameter(
            description = "Template ID to create workout from",
            required = true,
            example = "1"
        )
        @PathVariable Long templateId,
        @Parameter(
            description = "Name for the new workout. If not provided, uses template name + ' Workout'",
            required = false,
            example = "My Chest Workout"
        )
        @RequestParam(required = false) String workoutName
    );
}

