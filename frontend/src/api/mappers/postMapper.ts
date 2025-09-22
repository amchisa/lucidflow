import type { PostResponse } from "../../types/responses.types";
import type { Post } from "../../types/models.types";

/**
 * Type mapper for conversion between post data types.
 */
export const postMapper = {
  /**
   * Converts a PostResponse to a Post.
   * @param postResponse The PostResponse to be converted.
   * @returns The converted Post object.
   */
  responseToModel: (postResponse: PostResponse): Post => ({
    ...postResponse,
    createdAt: new Date(postResponse.createdAt),
    lastModifiedAt: new Date(postResponse.lastModifiedAt),
  }),
};
