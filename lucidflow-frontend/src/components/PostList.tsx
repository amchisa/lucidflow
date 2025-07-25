import { type Post as PostType } from "../types/post";
import Post from "./Post";

interface PostListProps {
  posts: PostType[];
  isLoading: boolean;
  errorMessage: string | null;
  onPostDelete: (id: number) => Promise<void>;
}

export default function PostList({
  posts,
  isLoading: loading,
  errorMessage: errorMessage,
  onPostDelete: deletePost,
}: PostListProps) {
  return (
    <>
      {loading && <div className="text-center mb-10">Loading posts...</div>}
      {errorMessage && (
        <div className="text-red-500 bg-red-200 text-center mb-10">
          {errorMessage}
        </div>
      )}
      {!loading && posts.length === 0 ? (
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
