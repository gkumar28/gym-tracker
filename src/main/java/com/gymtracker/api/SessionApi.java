package com.gymtracker.api;

import com.gymtracker.schemaobject.SessionSO;
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
    name = "Session API",
    description = "API endpoints for managing workout sessions"
)
@RequestMapping("/api/sessions")
public interface SessionApi {
    
    @Operation(
        summary = "Create a new session",
        description = "Creates a new workout session with actual performance data. " +
                     "The session can optionally be linked to a workout.",
        operationId = "createSession"
    )
    @PostMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Session successfully created",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = SessionSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid session data",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Workout not found (if workoutId is provided)",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<SessionSO> createSession(
        @Parameter(
            description = "Session object to be created with actual performance data",
            required = true,
            schema = @Schema(implementation = SessionSO.class)
        )
        @Valid
        @RequestBody SessionSO sessionSO
    );
    
    @Operation(
        summary = "Get last session for a workout",
        description = "Retrieves the most recent session for a specific workout, ordered by session date",
        operationId = "getLastSessionByWorkoutId"
    )
    @GetMapping("/workout/{workoutId}/last")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved last session",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = SessionSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "No session found for the workout",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<SessionSO> getLastSessionByWorkoutId(
        @Parameter(
            description = "Workout ID to get the last session for",
            required = true,
            example = "1"
        )
        @PathVariable Long workoutId
    );
    
    @Operation(
        summary = "Get all sessions for a workout",
        description = "Retrieves all sessions for a specific workout, ordered by session date (most recent first)",
        operationId = "getAllSessionsByWorkoutId"
    )
    @GetMapping("/workout/{workoutId}")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved sessions",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = SessionSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<List<SessionSO>> getAllSessionsByWorkoutId(
        @Parameter(
            description = "Workout ID to get sessions for",
            required = true,
            example = "1"
        )
        @PathVariable Long workoutId
    );
}

