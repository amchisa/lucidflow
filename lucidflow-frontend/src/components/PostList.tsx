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
  errorMessage: error,
  onPostDelete: deletePost,
}: PostListProps) {
  if (loading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <>
      {error && <div className="text-red-500 text-center">{error}</div>}
      {posts.length === 0 ? (
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
