import type { Image } from "./models";

/**
 * Generic interface for paginated API responses with a nested page object.
 * @template T represents the type of the items in the embedded content array.
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

/**
 * Represents the structure of a Post object received directly from the API.
 */
export interface PostResponse {
  id: number;
  title: string;
  body: string;
  images: Image[]; // Not ImageResponse since this type is not currently needed
  createdAt: string;
  lastModifiedAt: string;
}
