import { type PostResponse, type Post } from "../../types/post";

export function responseToPost(postResponse: PostResponse): Post {
  return {
    ...postResponse,
    timeCreated: new Date(postResponse.timeCreated),
    timeModified: new Date(postResponse.timeModified),
  };
}
