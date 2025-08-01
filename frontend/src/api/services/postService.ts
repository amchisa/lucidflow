import type { Post } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import type { PageResponse, PostResponse } from "../../types/responses";
import { postMapper } from "../mappers/postMapper";
import { api } from "../client/axios";

export const postService = {
  /**
   * Gets a paginated list of posts from the API.
   * @returns A promise that resolves to an array of Post objects.
   * @throws An error if the API call fails.
   */
  async getPosts(): Promise<Post[]> {
    const response = await api.get<PageResponse<PostResponse>>("/posts");
    return response.data.content.map(postMapper.responseToModel);
  },

  /**
   * Creates a new post via the API.
   * @param postRequest The PostRequest object containing data for the new post.
   * @returns A promise that resolves to the created Post object from the API.
   * @throws An error if the API call fails.
   */
  async createPost(postRequest: PostRequest): Promise<Post> {
    const response = await api.post<PostResponse>("/posts", postRequest);
    return postMapper.responseToModel(response.data);
  },

  /**
   * Updates an existing post via the API.
   * @param id The ID of the post to update.
   * @param postRequest The PostRequest object containing updated data.
   * @returns A promise that resolves to the updated Post object from the API.
   * @throws An error if the API call fails.
   */
  async updatePost(id: number, postRequest: PostRequest): Promise<Post> {
    const response = await api.put<PostResponse>(`/posts/${id}`, postRequest);
    return postMapper.responseToModel(response.data);
  },

  /**
   * Deletes a post via the API.
   * @param id The ID of the post to delete.
   * @returns A promise that resolves when the delete operation is complete.
   * @throws An error if the API call fails.
   */
  async deletePost(id: number): Promise<void> {
    await api.delete<void>(`/posts/${id}`);
  },
};
