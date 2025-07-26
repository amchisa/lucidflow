/**
 * Generic interface for paginated API responses with a nested 'page' object.
 * T represents the type of the content items in the array.
 */
export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
