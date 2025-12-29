package com.gymtracker.schemaobject;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Paginated search response")
public class PaginatedResponse<T> {
    @Schema(description = "List of items matching the search criteria")
    private List<T> items;

    @Schema(description = "Total number of items matching the search criteria", example = "150")
    private Long total;

    @Schema(description = "Whether there are more items available", example = "true")
    private Boolean hasMore;

    @Schema(description = "Current offset for pagination", example = "0")
    private Integer offset;

    @Schema(description = "Number of items returned in this response", example = "10")
    private Integer limit;
}
