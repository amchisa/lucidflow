import { useState, useEffect, useCallback } from "react";
import { type Post, type PostResponse } from "../types/post";

export default function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mapPostResponseToPost = (postResponse: PostResponse): Post => ({
    ...postResponse,
    timeCreated: new Date(postResponse.timeCreated),
    timeModified: new Date(postResponse.timeModified),
  });

  const executeAPICall = async <T>(
    method: string,
    url: string,
    body?: object
  ): Promise<T> => {
    const options: RequestInit = {
      method: method,
    };

    if (body) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    return await response.json();
  };

  const loadPosts = useCallback(async () => {
    try {
      const parsedData = await executeAPICall<{ content: PostResponse[] }>(
        "GET",
        "/api/posts"
      );
      const fetchedPosts: Post[] = parsedData.content.map(
        mapPostResponseToPost
      );

      setPosts(fetchedPosts);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = async (title: string, body: string) => {
    setLoading(true);
    setError(null);

    try {
      const parsedData = await executeAPICall<PostResponse>(
        "POST",
        "/api/posts",
        { title, body }
      );
      const newPost: Post = mapPostResponseToPost(parsedData);

      setPosts((prevPosts) => [...prevPosts, newPost]);
    } catch (err) {
      console.error(err);
      setError("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: number, title: string, body: string) => {
    setLoading(true);
    setError(null);

    try {
      const parsedData = await executeAPICall<PostResponse>(
        "PUT",
        `/api/posts/${id}`,
        { title, body }
      );
      const updatedPost = mapPostResponseToPost(parsedData);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await executeAPICall("DELETE", `/api/posts/${id}`);

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
    updatePost,
    deletePost,
  };
}
