import { type Post as PostType } from "../types/postTypes";
import Post from "./Post";

interface PostListProps {
  posts: PostType[];
  isLoading: boolean;
  errorMessage: string | null;
  onPostDelete: (id: number) => Promise<void>;
}

export default function PostList({
  posts,
  isLoading,
  errorMessage,
  onPostDelete: deletePost,
}: PostListProps) {
  return (
    <>
      {isLoading && <div className="text-center mb-10">Loading posts...</div>}
      {errorMessage && (
        <div className="text-red-500 bg-red-200 text-center mb-10">
          {errorMessage}
        </div>
      )}
      {!isLoading && posts.length === 0 ? (
        <div className="text-center">No posts available.</div>
      ) : (
        posts.map((post) => {
          const { id } = post;

          return <Post key={id} post={post} onDelete={deletePost}></Post>;
        })
      )}
    </>
  );
}
