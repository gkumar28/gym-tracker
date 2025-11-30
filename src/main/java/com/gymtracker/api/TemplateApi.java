package com.gymtracker.api;

import com.gymtracker.schemaobject.TemplateSO;
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

import java.util.List;

@Tag(
    name = "Template API",
    description = "API endpoints for managing and searching workout templates"
)
@RequestMapping("/api/templates")
public interface TemplateApi {
    
    @Operation(
        summary = "Get all templates",
        description = "Retrieves all workout templates",
        operationId = "getAllTemplates"
    )
    @GetMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved templates",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TemplateSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<List<TemplateSO>> getAllTemplates();
    
    @Operation(
        summary = "Search templates by name or description",
        description = "Searches for templates by name or description using case-insensitive LIKE search. " +
                     "Returns all templates if no search term is provided.",
        operationId = "searchTemplates"
    )
    @GetMapping("/search")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved templates",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TemplateSO.class)
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
    ResponseEntity<List<TemplateSO>> searchTemplates(
        @Parameter(
            description = "Search term to match template names or descriptions (case-insensitive). " +
                         "If empty or not provided, returns all templates.",
            example = "chest",
            required = false,
            schema = @Schema(type = "string", example = "chest")
        )
        String searchTerm
    );
    
    @Operation(
        summary = "Create a new template",
        description = "Creates a new workout template with the provided name, description, and exercises",
        operationId = "createTemplate"
    )
    @PostMapping
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "201",
            description = "Template successfully created",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TemplateSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid template data",
            content = @Content
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content
        )
    })
    ResponseEntity<TemplateSO> createTemplate(
        @Parameter(
            description = "Template object to be created",
            required = true,
            schema = @Schema(implementation = TemplateSO.class)
        )
        @Valid
        @RequestBody TemplateSO templateSO
    );
    
    @Operation(
        summary = "Update an existing template",
        description = "Updates an existing workout template with the provided ID, name, description, and exercises",
        operationId = "updateTemplate"
    )
    @PutMapping("/{id}")
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Template successfully updated",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TemplateSO.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Bad request - invalid template data",
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
    ResponseEntity<TemplateSO> updateTemplate(
        @Parameter(
            description = "Template ID to update",
            required = true,
            example = "1"
        )
        @PathVariable Long id,
        @Parameter(
            description = "Updated template object",
            required = true,
            schema = @Schema(implementation = TemplateSO.class)
        )
        @Valid
        @RequestBody TemplateSO templateSO
    );
}

