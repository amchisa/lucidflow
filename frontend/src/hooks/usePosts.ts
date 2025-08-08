import { useState, useCallback, useRef } from "react";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";
import { postService } from "../api/services/postService";
import { AxiosError } from "axios";
import { delay } from "../utils/timeUtils";

interface FetchPostsParams {
  refresh?: boolean;
  search?: string | null;
  loadDelay?: number;
}

/**
 * Custom hook for managing Post related data and UI state. Provides functions for fetching,
 * creating, updating, and deleting posts. Implements optimistic UI updates to provide immediate
 * feedback to the user, manages loading states, and handles errors with rollback capabilities.
 */
export default function usePosts() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pageNumber = useRef<number>(0);
  const tempIDCounter = useRef(-1); // Generates temporary client-side IDs for optimistic updates
  const isFetching = useRef(false); // Flag to prevent duplicate fetches

  /**
   * Handles errors by logging detailed technical context and updating the user error message.
   * Used across various API/service calls to centralize error handling and UI messaging.
   * @param context - A brief string describing the operation that failed (e.g., "Failed to delete post").
   * @param err - The error object caught from the failed operation.
   * @param userMessage - (Optional) A user-facing message to display in the UI. Defaults to a generic fallback.
   */
  const handleError = useCallback(
    (
      context: string,
      err: unknown,
      userMessage = "Something went wrong. Please try again later."
    ): void => {
      let logMessage = "An unknown error occurred.";

      if (err instanceof Error) {
        logMessage = `${err.name}: ${err.message}`;

        if (err instanceof AxiosError) {
          logMessage += ` (${err.code})`;
        }
      }

      console.error(`${context}:`, logMessage); // Log error for debugging
      setErrorMessage(userMessage); // User-friendly error message
    },
    []
  );

  /**
   * Creates a new temporary local-only Post from an outgoing PostRequest.
   * Generates temporary values for `ID`, `timeCreated`, and `timeModified`.
   * Used for optimistic client-side post creation before an API response.
   * @param request The PostRequest data provided by the client.
   * @returns A new Post object (for local/optimistic display only)
   */
  const createPostOptimistically = (postRequest: PostRequest): Post => {
    const now = new Date();

    return {
      id: tempIDCounter.current--, // Use a new temporary negative ID
      ...postRequest,
      timeCreated: now,
      timeModified: now,
    };
  };

  /**
   * Returns a new temporary local-only Post object respresenting updates to an existing Post from a PostRequest.
   * Generates temporary values for `title`, `body`, `images`, and `timeModified`.
   * Used for optimistic client-side updates of existing posts before an API response.
   * @param post The Post object to update.
   * @param postRequest The PostRequest containing the updated data.
   * @returns A new Post object containing updated information (for local/optimistic display only)
   */
  const updatePostOptimistically = (
    post: Post,
    postRequest: PostRequest
  ): Post => {
    return {
      ...post, // Keep existing ID, timeCreated, etc.
      ...postRequest, // Update overlapping Post fields with PostRequest fields
      timeModified: new Date(), // Update the modification timestamp
    };
  };

  /**
   * Fetches posts. Supports full refresh and infinite scroll functionality.
   * @param refresh A boolean indicating whether or not a full refresh is to be performed.
   * @param search An optional search query on post titles.
   * @param delay A minimum delay (in ms).
   */
  const fetchPosts = useCallback(
    async ({
      refresh = false,
      search,
      loadDelay,
    }: FetchPostsParams): Promise<void> => {
      if (isFetching.current) {
        return;
      }

      if (refresh) {
        setIsLoading(true);
        setErrorMessage(null);
        pageNumber.current = 0;
      }

      isFetching.current = true;

      try {
        const [result] = await Promise.allSettled([
          // Use allSettled to prevent errors from cancelling the loadDelay
          postService.getPosts({
            ...(search && { search }), // Conditionally include the search string if specified
            page: pageNumber.current,
          }),
          delay(loadDelay ?? 0), // Avoid UI flickering
        ]);

        if (result.status != "fulfilled") {
          throw result.reason;
        }

        const paginatedPosts = result.value;
        const fetchedPosts = paginatedPosts.content;

        if (refresh) {
          setPosts(fetchedPosts);
        } else {
          setPosts((prevPosts) => {
            const combinedPosts = [...(prevPosts ?? []), ...fetchedPosts];
            const seenIDs = new Set();

            // Filter to prevent duplicate posts
            const uniquePosts = combinedPosts.filter((post) => {
              if (!seenIDs.has(post.id)) {
                seenIDs.add(post.id);
                return true;
              }

              return false;
            });

            return uniquePosts;
          });
        }

        pageNumber.current++;
        setHasMore(pageNumber.current < paginatedPosts.totalPages); // Set the hasMore state
      } catch (err) {
        handleError("Failed to load posts", err);
      } finally {
        isFetching.current = false;

        if (refresh) {
          setIsLoading(false);
        }
      }
    },
    [handleError]
  );

  /**
   * Creates a new post with an optimistic UI update.
   * A temporary post is immediately added to the UI. If the API call succeeds,
   * this temporary post is replaced with the server-confirmed post.
   * If the API call fails, the UI is rolled back to its state prior to the optimistic update.
   * @param postRequest The data required to create the new post.
   */
  const createPost = useCallback(
    async (postRequest: PostRequest): Promise<void> => {
      let rollbackState: Post[] | null = null;
      const newClientPost = createPostOptimistically(postRequest);

      // Perform optimistic UI update and create rollback state
      setPosts((prevPosts) => {
        rollbackState = prevPosts; // Save rollback state

        return [newClientPost, ...(prevPosts ?? [])];
      });

      setErrorMessage(null);

      try {
        const newServerPost = await postService.createPost(postRequest);

        // Reupdate UI with API response
        setPosts((prevPosts) =>
          (prevPosts ?? []).map((post) =>
            post.id === newClientPost.id ? newServerPost : post
          )
        );
      } catch (err) {
        setPosts(rollbackState); // Roll back UI to original state
        handleError("Failed to create post", err);
      }
    },
    [handleError]
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
      let rollbackState: Post[] | null = null;

      // Perform optimistic UI update and create rollback state
      setPosts((prevPosts) => {
        rollbackState = prevPosts; // Save rollback state

        return (prevPosts ?? []).map((post) =>
          post.id === id ? updatePostOptimistically(post, postRequest) : post
        );
      });

      setErrorMessage(null);

      try {
        const updatedServerPost = await postService.updatePost(id, postRequest);

        // Reupdate UI with API response
        setPosts((prevPosts) =>
          (prevPosts ?? []).map((post) =>
            post.id === id ? updatedServerPost : post
          )
        );
      } catch (err) {
        setPosts(rollbackState); // Roll back UI to original state
        handleError("Failed to update post", err);
      }
    },
    [handleError]
  );

  /**
   * Deletes a post with an optimistic UI update.
   * The post is immediately removed from the UI. If the API call succeeds,
   * the UI state is confirmed. If the API call fails, the UI is rolled back.
   * @param id The ID of the post to be deleted.
   */
  const deletePost = useCallback(
    async (id: number) => {
      let rollbackState: Post[] | null = null;

      // Perform optimistic UI update and create rollback state
      setPosts((prevPosts) => {
        rollbackState = prevPosts; // Save rollback state

        return (prevPosts ?? []).filter((post) => post.id !== id);
      });

      setErrorMessage(null);

      try {
        await postService.deletePost(id);
      } catch (err) {
        setPosts(rollbackState);
        handleError("Failed to delete post", err);
      }
    },
    [handleError]
  );

  return {
    posts,
    isLoading,
    hasMore,
    errorMessage,
    setErrorMessage,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
