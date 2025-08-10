import type { Post, Page } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import type { PageResponse, PostResponse } from "../../types/responses";
import { postMapper } from "../mappers/postMapper";
import { pageMapper } from "../mappers/pageMapper";
import { api } from "../client/axios";

interface getPostsParams {
  search?: string;
  page?: number;
  size?: number;
}

/**
 * API service to consolodate and simplify API calls to post endpoints.
 */
export const postService = {
  /**
   * Gets a page containing a list of posts from the API.
   * @param params An object containing the query parameters for the request.
   * @returns A promise that resolves to a page containing an array of Post objects.
   * @throws An error if the API call fails.
   */
  async getPosts(params: getPostsParams = {}): Promise<Page<Post>> {
    const urlParams = new URLSearchParams();

    // Convert params into urlParams
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        urlParams.append(key, String(value));
      }
    }

    const apiResponse = await api.get<PageResponse<PostResponse>>("/posts", {
      params: urlParams,
    });

    return pageMapper.responseToModel({
      ...apiResponse.data,
      content: apiResponse.data.content.map(postMapper.responseToModel),
    });
  },

  /**
   * Creates a new post via the API.
   * @param postRequest The PostRequest object containing data for the new post.
   * @returns A promise that resolves to the created Post object from the API.
   * @throws An error if the API call fails.
   */
  async createPost(postRequest: PostRequest): Promise<Post> {
    const apiResponse = await api.post<PostResponse>("/posts", postRequest);
    return postMapper.responseToModel(apiResponse.data);
  },

  /**
   * Updates an existing post via the API.
   * @param id The ID of the post to update.
   * @param postRequest The PostRequest object containing updated data.
   * @returns A promise that resolves to the updated Post object from the API.
   * @throws An error if the API call fails.
   */
  async updatePost(id: number, postRequest: PostRequest): Promise<Post> {
    const apiResponse = await api.put<PostResponse>(
      `/posts/${id}`,
      postRequest
    );
    return postMapper.responseToModel(apiResponse.data);
  },

  /**
   * Deletes a post via the API.
   * @param id The ID of the post to delete.
   * @throws An error if the API call fails.
   */
  async deletePost(id: number): Promise<void> {
    await api.delete<void>(`/posts/${id}`);
  },
};
