import type { Post } from "../../types/models";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onPostEdit: (post: Post) => void;
  onPostDelete: (id: number) => Promise<void>;
  className?: string;
}

export default function PostList({
  posts,
  loading,
  onPostEdit: handlePostEdit,
  onPostDelete: handlePostDelete,
}: PostListProps) {
  return (
    <>
      {loading && (
        <div className="text-center mb-10 text-sm">Loading posts...</div>
      )}
      {!loading && posts.length === 0 ? (
        <div className="text-center text-sm">No posts available.</div>
      ) : (
        posts.map((post) => {
          return (
            <PostItem
              key={post.id}
              post={post}
              onEdit={handlePostEdit}
              onDelete={handlePostDelete}
            />
          );
        })
      )}
    </>
  );
}
