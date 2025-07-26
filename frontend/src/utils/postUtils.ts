import type { Post, PostRequest } from "../types/postTypes";

let tempIDCounter = -1; // For generating temporary client-side IDs for optimistic updates

/**
 * Creates a new temporary local-only Post from an outgoing PostRequest.
 * Generates temporary values for `ID`, `timeCreated`, and `timeModified`.
 * Used for optimistic client-side post creation before an API response.
 * @param request The PostRequest data provided by the client.
 * @returns A new Post object (for local/optimistic display only)
 */
export function createPostOptimistically(postRequest: PostRequest): Post {
  const now = new Date();
  const { title, body, images } = postRequest;

  return {
    id: tempIDCounter--, // Use a temporary negative ID
    title: title,
    body: body,
    images: images,
    timeCreated: now,
    timeModified: now,
  };
}

/**
 * Returns a new temporary local-only Post object respresenting updates to an existing Post from a PostRequest.
 * Generates temporary values for `title`, `body`, `images`, and `timeModified`.
 * Used for optimistic client-side updates of *existing* posts before an API response.
 * @param post The Post object to update.
 * @param postRequest The PostRequest containing the updated data.
 * @returns A new Post object containing updated information (for local/optimistic display only)
 */
export function updatePostOptimistically(
  post: Post,
  postRequest: PostRequest
): Post {
  const {
    title: updatedTitle,
    body: updatedBody,
    images: updatedImages,
  } = postRequest;

  return {
    ...post, // Keep existing ID, timeCreated, etc.
    title: updatedTitle,
    body: updatedBody,
    images: updatedImages,
    timeModified: new Date(), // Update the modification timestamp
  };
}
