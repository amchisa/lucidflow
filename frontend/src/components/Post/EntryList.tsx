import type { Post } from "../../types/models";
import Entry from "./Entry";

interface EntryListProps {
  posts: Post[];
  loading: boolean;
  onPostEdit: (post: Post) => void;
  onPostDelete: (id: number) => Promise<void>;
  className?: string;
}

export default function EntryList({
  posts,
  loading,
  onPostEdit: handlePostEdit,
  onPostDelete: handlePostDelete,
}: EntryListProps) {
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
            <Entry
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
