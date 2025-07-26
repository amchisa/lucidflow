import { useState, useEffect, useCallback } from "react";
import type { Post, PostRequest, PostResponse } from "../types/postTypes";
import { api } from "../api/clients/axios";
import type { PageResponse } from "../types/apiTypes";
import { PostMapper } from "../api/mappers/postMapper";
import {
  createPostOptimistically,
  updatePostOptimistically,
} from "../utils/postUtils";

const MIN_LOADING_DURATION = 500; // Helps avoid flickering

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [response] = await Promise.all([
        api.get<PageResponse<PostResponse>>("/posts"),
        delay(MIN_LOADING_DURATION), // Wait for at least the minimum duration
      ]);
      const fetchedPosts = response.data.content.map(
        PostMapper.responseToModel
      );

      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Failed to load posts: ", err);
      setErrorMessage("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(
    async (postRequest: PostRequest) => {
      setLoading(true);
      setErrorMessage(null);

      // Save original posts state for rollback in case of failure
      const originalPosts = posts;

      // Create post ahead of time for optimistic updates
      const newClientPost = createPostOptimistically(postRequest);

      // Append new post to the start
      setPosts((prevPosts) => [newClientPost, ...prevPosts]); // Prevents stale closures

      // Make an API call to update and retrieve updated data from database
      try {
        const [response] = await Promise.all([
          api.post<PostResponse>("/posts", postRequest),
          delay(MIN_LOADING_DURATION), // Wait for at least the minimum duration
        ]);
        const newServerPost: Post = PostMapper.responseToModel(response.data);

        // On success: Replace the temporary post with the one from the API
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === newClientPost.id ? newServerPost : post
          )
        );
      } catch (err) {
        // On failure: Roll back posts to its original state
        setPosts(originalPosts);
        console.error("Failed to create post: ", err);
        setErrorMessage("Failed to create post. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [posts]
  );

  const updatePost = useCallback(
    async (id: number, postRequest: PostRequest) => {
      setLoading(true);
      setErrorMessage(null);

      // Save original posts state for rollback in case of failure
      const originalPosts = posts;

      // Update post ahead of time for optimistic updates
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? updatePostOptimistically(post, postRequest) : post
        )
      );

      // Make an API call to update and retrieve updated data from database
      try {
        const [response] = await Promise.all([
          api.put<PostResponse>(`/posts/${id}`, postRequest),
          delay(MIN_LOADING_DURATION), // Wait for at least the minimum duration
        ]);
        const updatedServerPost = PostMapper.responseToModel(response.data);

        // On success: Replace the temporary post with the one from the API
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === id ? updatedServerPost : post))
        );
      } catch (err) {
        // On failure: Roll back posts to its original state
        setPosts(originalPosts);
        console.error("Failed to update post: ", err);
        setErrorMessage("Failed to update post. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [posts]
  );

  const deletePost = useCallback(
    async (id: number) => {
      setLoading(true);
      setErrorMessage(null);

      // Save original posts state for rollback in case of failure
      const originalPosts = posts;

      // Delete post ahead of time for optimistic updates
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));

      // Make an API call to update the database
      try {
        await Promise.all([
          api.delete<void>(`/posts/${id}`),
          delay(MIN_LOADING_DURATION), // Wait for at least the minimum duration
        ]);
      } catch (err) {
        // On failure: Roll back posts to its original state
        setPosts(originalPosts);
        console.error("Failed to delete post: ", err);
        setErrorMessage("Failed to delete post. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [posts]
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    errorMessage,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
