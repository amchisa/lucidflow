import type { Post } from "../types/models";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  errorMessage: string | null;
  onPostEdit: (post: Post) => void;
  onPostDelete: (id: number) => Promise<void>;
}

export default function PostList({
  posts,
  isLoading,
  errorMessage,
  onPostEdit: handlePostEdit,
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

          return (
            <PostItem
              key={id}
              post={post}
              onEdit={handlePostEdit}
              onDelete={deletePost}
            ></PostItem>
          );
        })
      )}
    </>
  );
}
