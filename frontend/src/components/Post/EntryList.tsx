import type { Post } from "../../types/models";
import Entry from "./Entry";

interface EntryListProps {
  posts: Post[];
  loading: boolean;
  errorMessage: string | null;
  onPostEdit: (post: Post) => void;
  onPostDelete: (id: number) => Promise<void>;
  className?: string;
}

export default function EntryList({
  posts,
  loading,
  errorMessage,
  onPostEdit: handlePostEdit,
  onPostDelete: handlePostDelete,
}: EntryListProps) {
  return (
    <>
      {errorMessage && (
        <div className="text-red-500 bg-red-200 text-center mb-10 text-sm">
          {errorMessage}
        </div>
      )}
      {loading && (
        <div className="text-center mb-10 text-sm">Loading posts...</div>
      )}
      {!loading && posts.length === 0 ? (
        <div className="text-center text-sm">No posts available.</div>
      ) : (
        posts.map((post) => {
          return (
            <Entry
              key={post.id}
              post={post}
              onEdit={handlePostEdit}
              onDelete={handlePostDelete}
            ></Entry>
          );
        })
      )}
    </>
  );
}
