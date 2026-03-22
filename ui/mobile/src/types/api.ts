export interface PaginatedResponse<SubType> {
    items: SubType[];
    total: number;
    hasMore: boolean;
    offset: number;
    limit: number;
  }