import type { PostResponse, Post } from "../../types/post";

export const PostMapper = {
  /**
   * Converts a PostResponse to a Post.
   * @param postResponse The PostResponse to be converted
   * @returns The converted Post object
   */
  responseToModel: (postResponse: PostResponse): Post => {
    return {
      ...postResponse,
      timeCreated: new Date(postResponse.timeCreated),
      timeModified: new Date(postResponse.timeModified),
    };
  },
};
