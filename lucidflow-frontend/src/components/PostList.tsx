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
    return <span>Loading posts...</span>;
  }

  if (error) {
    return <span>{error}</span>;
  }

  return (
    <section>
      {posts.length === 0 ? (
        <span>No posts available.</span>
      ) : (
        posts.map((post) => {
          const { id } = post;

          return <Post key={id} post={post} onDelete={deletePost}></Post>;
        })
      )}
    </section>
  );
}
