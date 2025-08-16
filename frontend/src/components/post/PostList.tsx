import type { Post } from "../../types/models";
import LoadingSpinner from "../ui/LoadingSpinner";
import PostItem from "./PostItem";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { useEffect, useRef, useState } from "react";
import PostSkeleton from "./PostSkeleton";

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  hasError: boolean;
  hasMore: boolean;
  searchQuery: string | null;
  onPostEdit: (post: Post) => void;
  onPostDelete: (id: number) => Promise<void>;
  onLoadMore: () => void;
  className?: string;
}

export default function PostList({
  posts,
  isLoading,
  hasError,
  hasMore,
  searchQuery,
  onPostEdit,
  onPostDelete,
  onLoadMore,
}: PostListProps) {
  const [showBackToTopButton, setShowBackToTopButton] =
    useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement>(null!);
  const postListContainerRef = useRef<HTMLDivElement>(null!);

  const noPostsMessage = searchQuery
    ? `No posts found containing "${searchQuery}".`
    : "No posts available.";

  // Infinite scroll hook for lazy post loading
  useInfiniteScroll({
    triggerRef: loadMoreRef,
    onLoadMore,
    hasMore,
    observerOptions: { rootMargin: "100px" }, // Trigger loading 100px before the div appears
  });

  // Determine whether to show the back to top button
  useEffect(() => {
    const element = postListContainerRef.current;
    setShowBackToTopButton(
      element.scrollHeight > window.innerHeight && (!hasMore || hasError),
    );
  }, [posts, hasMore, hasError]);

  return (
    <div ref={postListContainerRef}>
      {isLoading && (
        <div className="mb-5 flex items-center justify-center gap-2 text-sm text-gray-800">
          <LoadingSpinner size={20} />
          <span>Loading posts...</span>
        </div>
      )}
      {!isLoading && searchQuery && posts.length > 0 && (
        <div className="mb-5 text-center text-sm">
          {posts.length} post{posts.length !== 1 ? "s" : ""} found containing "
          {searchQuery}".
        </div>
      )}
      {!isLoading && posts.length === 0 ? (
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
      )}
      {((hasMore && !hasError) || (isLoading && posts.length === 0)) && (
        <div ref={loadMoreRef}>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {showBackToTopButton && (
        <div className="flex justify-center">
          <button
            className="rounded-md bg-gray-500 px-3 py-2 text-sm font-bold text-white hover:bg-gray-600 active:bg-gray-700"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
          </button>
        </div>
      )}
    </div>
  );
}
