import type { Image } from "./models.types";

/**
 * Represents the structure of a Post object sent to the API (e.g., for creating or updating a post).
 * Excludes fields like `id`, `createdAt` and `lastModifiedAt` which are managed by the API.
 */
export interface PostRequest {
  title: string;
  body: string;
  images: Image[]; // Not ImageRequest as this type is not currently needed
}

/**
 * Represents the structure of an Image object sent to the API.
 * Allows for the `id` field to be optional.
 */
export interface ImageRequest {
  id?: number;
  url: string;
  displayIndex: number;
}
