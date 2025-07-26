import { useState, useEffect, useCallback } from "react";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";

import { delay } from "../utils/timeUtils";
import { postService } from "../api/services/postService";

const MIN_LOADING_DURATION = 500; // To avoid flickering loading states
let tempIDCounter = -1; // For generating temporary client-side IDs for optimistic updates

/**
 * Custom hook for managing Post-related data and UI state.
 * It provides functions for fetching, creating, updating, and deleting posts.
 * This hook implements optimistic UI updates to provide immediate feedback to the user,
 * managing loading states, and handling errors with rollback capabilities.
 */
export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Fetches all posts from the API. Posts are typically retrieved in a sorted order (e.g., newest first)
   * as determined by the API. Manages loading and error states during the data retrieval process.
   */
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [result] = await Promise.allSettled([
        postService.getPosts(), // Call service to get posts
        delay(MIN_LOADING_DURATION), // Avoid UI flickering
      ]);

      if (result.status === "fulfilled") {
        // Update UI with API response
        const fetchedPosts: Post[] = result.value;
        setPosts(fetchedPosts);
      } else {
        console.error("Failed to load posts: ", result.reason); // Log error for debugging
        setErrorMessage("Failed to load posts. Please try again later."); // User-friendly error message
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new post with an optimistic UI update.
   * A temporary post is immediately added to the UI. If the API call succeeds,
   * this temporary post is replaced with the server-confirmed post.
   * If the API call fails, the UI is rolled back to its state prior to the optimistic update.
   * @param postRequest The data required to create the new post.
   */
  const createPost = useCallback(
    async (postRequest: PostRequest) => {
      setLoading(true);
      setErrorMessage(null);

      const originalPosts = posts; // Rollback state

      // Optimistically create and display the new post immediately
      const newClientPost = createPostOptimistically(postRequest);
      setPosts((prevPosts) => [newClientPost, ...prevPosts]);

      try {
        const [result] = await Promise.allSettled([
          postService.createPost(postRequest),
          delay(MIN_LOADING_DURATION),
        ]);

        if (result.status === "fulfilled") {
          // Reupdate UI with API response
          const newServerPost: Post = result.value;
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === newClientPost.id ? newServerPost : post
            )
          );
        } else {
          // Roll back UI to original state and display error messages
          setPosts(originalPosts);
          console.error("Failed to create post: ", result.reason);
          setErrorMessage("Failed to create post. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    },
    [posts] // Dependency on posts for capturing originalPosts
  );

  /**
   * Updates an existing post with an optimistic UI update.
   * The post is immediately updated in the UI. If the API call succeeds,
   * the UI state is confirmed. If the API call fails, the UI is rolled back.
   * @param id The ID of the post to be updated.
   * @param postRequest The updated data for the post.
   */
  const updatePost = useCallback(
    async (id: number, postRequest: PostRequest) => {
      setLoading(true);
      setErrorMessage(null);

      const originalPosts = posts; // Rollback state

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? updatePostOptimistically(post, postRequest) : post
        )
      ); // Optimistic UI update

      try {
        const [result] = await Promise.allSettled([
          postService.updatePost(id, postRequest),
          delay(MIN_LOADING_DURATION),
        ]);

        if (result.status === "fulfilled") {
          // Reupdate UI with API response
          const updatedServerPost: Post = result.value;
          setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === id ? updatedServerPost : post))
          );
        } else {
          // Roll back UI to original state and display error messages
          setPosts(originalPosts);
          console.error("Failed to update post: ", result.reason);
          setErrorMessage("Failed to update post. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    },
    [posts] // Dependency on posts for capturing originalPosts
  );

  /**
   * Deletes a post with an optimistic UI update.
   * The post is immediately removed from the UI. If the API call succeeds,
   * the UI state is confirmed. If the API call fails, the UI is rolled back.
   * @param id The ID of the post to be deleted.
   */
  const deletePost = useCallback(
    async (id: number) => {
      setLoading(true);
      setErrorMessage(null);

      const originalPosts = posts; // Rollback state

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); // Optimistic UI update

      try {
        const [result] = await Promise.allSettled([
          postService.deletePost(id),
          delay(MIN_LOADING_DURATION),
        ]);

        if (result.status === "rejected") {
          // Roll back UI to original state and display error messages
          setPosts(originalPosts);
          console.error("Failed to delete post: ", result.reason);
          setErrorMessage("Failed to delete post. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    },
    [posts] // Dependency on posts for capturing originalPosts
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    errorMessage,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}

/**
 * Creates a new temporary local-only Post from an outgoing PostRequest.
 * Generates temporary values for `ID`, `timeCreated`, and `timeModified`.
 * Used for optimistic client-side post creation before an API response.
 * @param request The PostRequest data provided by the client.
 * @returns A new Post object (for local/optimistic display only)
 */
function createPostOptimistically(postRequest: PostRequest): Post {
  const now = new Date();

  return {
    id: tempIDCounter--, // Use a temporary negative ID
    ...postRequest,
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
function updatePostOptimistically(post: Post, postRequest: PostRequest): Post {
  return {
    ...post, // Keep existing ID, timeCreated, etc.
    ...postRequest, // Update overlapping Post fields with PostRequest fields
    timeModified: new Date(), // Update the modification timestamp
  };
}
