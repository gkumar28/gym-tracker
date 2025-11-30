package com.gymtracker.api;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Tag(
    name = "Exercise API",
    description = "API endpoints for managing and searching exercises"
)
@RequestMapping("/api/exercises")
public interface ExerciseApi {
    
    @Operation(
        summary = "Search exercises by name",
        description = "Searches for exercises by name using case-insensitive LIKE search. " +
                     "Returns all exercises if no search term is provided.",
        operationId = "searchExercises"
    )
    @GetMapping("/search")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved exercises",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ExerciseSO.class)
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
    ResponseEntity<List<ExerciseSO>> searchExercises(
        @Parameter(
            description = "Search term to match exercise names (case-insensitive). " +
                         "If empty or not provided, returns all exercises.",
            example = "bench",
            required = false,
            schema = @Schema(type = "string", example = "bench")
        )
        String searchTerm
    );
    
    @Operation(
        summary = "Create a new exercise",
        description = "Creates a new exercise with the provided name and optional logo",
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
