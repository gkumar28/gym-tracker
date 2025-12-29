package com.gymtracker.api;

import com.gymtracker.schemaobject.PaginatedResponse;
import com.gymtracker.schemaobject.ExerciseSO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
    name = "Exercise API",
    description = "API endpoints for managing and searching exercises"
)
@RequestMapping("/api/exercise")
public interface ExerciseApi {
    
    @Operation(
        summary = "Search exercises with filters",
        description = "Searches for exercises with optional filters for category, muscle group, equipment, and difficulty. " +
                     "Supports pagination with limit and offset parameters.",
        operationId = "searchExercises"
    )
    @GetMapping("/search")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved exercises",
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
    ResponseEntity<PaginatedResponse<ExerciseSO>> searchExercises(
        @Parameter(
            description = "Search term to match exercise names or descriptions (case-insensitive)",
            example = "bench",
            required = false
        )
        @RequestParam(required = false) String search,
        
        @Parameter(
            description = "Filter by exercise category",
            example = "Strength",
            required = false
        )
        @RequestParam(required = false) String category,
        
        @Parameter(
            description = "Filter by muscle group",
            example = "Chest",
            required = false
        )
        @RequestParam(required = false) String muscle,
        
        @Parameter(
            description = "Filter by equipment type",
            example = "Barbell",
            required = false
        )
        @RequestParam(required = false) String equipment,
        
        @Parameter(
            description = "Filter by difficulty level",
            example = "intermediate",
            required = false,
            schema = @Schema(allowableValues = {"beginner", "intermediate", "advanced"})
        )
        @RequestParam(required = false) String difficulty,
        
        @Parameter(
            description = "Maximum number of exercises to return",
            example = "10",
            required = false
        )
        @RequestParam(required = false, defaultValue = "10") Integer limit,
        
        @Parameter(
            description = "Number of exercises to skip for pagination",
            example = "0",
            required = false
        )
        @RequestParam(required = false, defaultValue = "0") Integer offset
    );
    
    @Operation(
        summary = "Get exercise by ID",
        description = "Retrieves a specific exercise by its unique identifier",
        operationId = "getExerciseById"
    )
    @GetMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved exercise",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ExerciseSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Exercise not found",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<ExerciseSO> getExerciseById(
        @Parameter(
            description = "Unique identifier of the exercise",
            example = "1",
            required = true
        )
        @PathVariable Long id
    );
    
    @Operation(
        summary = "Get all exercise categories",
        description = "Retrieves a list of all available exercise categories",
        operationId = "getCategories"
    )
    @GetMapping("/categories")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved categories",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = List.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<List<String>> getCategories();
    
    @Operation(
        summary = "Create a new exercise",
        description = "Creates a new exercise with the provided details",
        operationId = "createExercise"
    )
    @PostMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Exercise successfully created",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ExerciseSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid exercise data",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "409",
            description = "Conflict - exercise with this name already exists",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<ExerciseSO> createExercise(
        @Parameter(
            description = "Exercise object to be created",
            required = true,
            schema = @Schema(implementation = ExerciseSO.class)
        )
        @Valid
        @RequestBody ExerciseSO exerciseSO
    );
}
