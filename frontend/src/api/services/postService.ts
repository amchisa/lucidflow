import type { Post } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import type { PageResponse, PostResponse } from "../../types/responses";
import { postMapper } from "../mappers/postMapper";
import { api } from "../client/axios";

export const postService = {
  /**
   * Gets a paginated list of posts from the API.
   * @param search The string to match in the title of retrived posts.
   * @param page The page to retrieve (0-indexed). API returns page 0 by default if not specified.
   * @param size The number of posts per page. Default is defined in API.
   * @returns A promise that resolves to a page response containing an array of Post objects.
   * @throws An error if the API call fails.
   */
  async getPosts(
    search?: string,
    page?: number,
    size?: number
  ): Promise<PageResponse<Post>> {
    const params = new URLSearchParams();

    if (search !== undefined) {
      params.append("search", search);
    }

    if (page !== undefined) {
      params.append("page", page.toString());
    }

    if (size !== undefined) {
      params.append("size", size.toString());
    }

    const queryString = params.toString();

    const response = await api.get<PageResponse<PostResponse>>(
      `/posts${queryString ? `?${queryString}` : ""}`
    );
    const mappedContent = response.data.content.map(postMapper.responseToModel);

    return {
      ...response.data,
      content: mappedContent,
    };
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
