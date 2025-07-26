import { type Image } from "./image";

/**
 * Represents the structure of a Post object received directly from the API.
 */
export interface PostResponse {
  id: number;
  title: string;
  body: string;
  images: Image[];
  timeCreated: string;
  timeModified: string;
}

/**
 * Represents the internal application model for a Post.
 * This is the hydrated version of PostResponse, with string dates converted to Date objects.
 */
export interface Post {
  id: number;
  title: string;
  body: string;
  images: Image[];
  timeCreated: Date;
  timeModified: Date;
}

/**
 * Represents the structure of a Post object sent to the API (e.g., for creating or updating a post).
 * Excludes fields like `id`, `timeCreated` and `timeModified` which are managed by the API
 */
export interface PostRequest {
  title: string;
  body: string;
  images: Image[];
}
