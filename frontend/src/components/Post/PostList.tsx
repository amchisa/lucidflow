import type { Post } from "../../types/models";
import LoadingSpinner from "../ui/LoadingSpinner";
import PostItem from "./PostItem";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { useRef } from "react";
import PostSkeleton from "./PostSkeleton";

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  hasMore: boolean;
  searchQuery: string | null;
  onPostEdit: (post: Post) => void;
  onPostDelete: (id: number) => Promise<void>;
  onLoadMore: () => void;
  className?: string;
}

export default function PostList({
  posts,
  loading,
  hasMore,
  searchQuery,
  onPostEdit,
  onPostDelete,
  onLoadMore,
}: PostListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null!);

  const noPostsMessage = searchQuery
    ? `No posts found with title "${searchQuery}".`
    : "No posts available.";

  // Infinite scroll hook for lazy post loading
  useInfiniteScroll({
    triggerRef: loadMoreRef,
    onLoadMore,
    hasMore,
    observerOptions: { rootMargin: "100px" }, // Trigger loading 100px before the div appears
  });

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center mb-10 text-sm gap-2 text-gray-800">
          <LoadingSpinner size={20} />
          <span>Loading posts...</span>
        </div>
      )}
      {posts &&
        (posts.length === 0 && !loading ? (
          <div className="text-center text-sm">{noPostsMessage}</div>
        ) : (
          posts.map((post) => {
            return (
              <PostItem
                key={post.id}
                post={post}
                onEdit={onPostEdit}
                onDelete={onPostDelete}
              />
            );
          })
        ))}
      {hasMore && (
        <div ref={loadMoreRef}>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
    </div>
  );
}
