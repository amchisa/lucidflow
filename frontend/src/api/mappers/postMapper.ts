import type { PostResponse } from "../../types/responses";
import type { Post } from "../../types/models";

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
    timeCreated: new Date(postResponse.timeCreated),
    timeModified: new Date(postResponse.timeModified),
  }),
};
