import type { Post, PostRequest } from "../types/post";

let tempIDCounter = -1; // For generating temporary client-side IDs for optimistic updates

/**
 * Builds a new Post from an incoming PostRequest.
 * This function generates temporary values for ID, timeCreated, and timeModified.
 * Typically used for optimistic client-side post creation before an API response.
 * @param request The PostRequest data provided by the client.
 * @returns A new Post object with generated metadata.
 */
export function buildModelFromRequest(postRequest: PostRequest): Post {
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
 * Applies fields from a PostRequest to an existing internal Post model.
 * This function updates specified fields and sets timeModified to the current time.
 * Typically used for optimistic client-side updates of *existing* posts.
 * @param existingPost The original Post object to update.
 * @param postRequest The PostRequest containing the updated data.
 * @returns The POst
 */
export function updateModelFromRequest(
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
