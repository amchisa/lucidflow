import type { Image } from "./models";

/**
 * Represents the structure of a Post object sent to the API (e.g., for creating or updating a post).
 * Excludes fields like `id`, `timeCreated` and `timeModified` which are managed by the API
 */
export interface PostRequest {
  title: string;
  body: string;
  images: Image[];
}
