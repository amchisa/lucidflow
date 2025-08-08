import usePosts from "../hooks/usePosts";
import { useEffect, useCallback } from "react";
import PostList from "../components/post/PostList";
import PostEditor from "../components/post/PostEditor";
import { CircleAlert, ListRestart, SquarePen } from "lucide-react";
import usePostEditor from "../hooks/usePostEditor";
import useDebounce from "../hooks/useDebounce";
import Searchbar from "../components/ui/Searchbar";

const MIN_REFRESH_DURATION = 500;
const DEBOUNCE_DELAY = 300;

export default function Posts() {
  const {
    posts,
    isLoading,
    hasMore,
    errorMessage,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  } = usePosts();

  const {
    isEditorOpen,
    postToEdit,
    openCreateEditor,
    openUpdateEditor,
    savePost,
    closeEditor,
  } = usePostEditor({
    onCreate: (postRequest) => {
      createPost(postRequest);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top for improved user experience
    },
    onUpdate: updatePost,
  });

  const [searchQuery, setSearchQuery] = useDebounce<string | null>(
    null,
    DEBOUNCE_DELAY
  );

  /**
   * Handles refreshing of the post list. Maintains the current search input.
   */
  const refreshPosts = useCallback(() => {
    fetchPosts({
      refresh: true,
      search: searchQuery,
      loadDelay: MIN_REFRESH_DURATION,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchQuery, fetchPosts]);

  /**
   * Helper function to help handle setting the search query based on an input change.
   * @param e The change event associated with the text modification.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.trim());
  };

  /**
   * Helper function for loading more posts. Calls fetch posts with refresh = false (implicit) and
   * maintains the search query.
   */
  const handleLoadMore = useCallback(() => {
    fetchPosts({ search: searchQuery });
  }, [searchQuery, fetchPosts]);

  // Trigger refresh on component mount and search query change
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      <header className="px-8 py-4 fixed z-20 w-full bg-white border-b border-gray-300 flex justify-between">
        <span className="flex">
          <h1 className="text-2xl font-medium mr-8">LucidFlow</h1>
          <Searchbar
            onChange={handleSearchChange}
            placeholder="Search by title"
          />
        </span>
        <span className="flex gap-2">
          <button
            className="flex gap-2 py-2 px-3 text-white font-bold text-sm bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md"
            onClick={openCreateEditor}
          >
            <SquarePen size={20} />
            <span>Create Post</span>
          </button>
          <button
            className="flex gap-2 py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 active:bg-gray-700 rounded-md"
            onClick={refreshPosts}
          >
            <ListRestart size={20} />
            <span>Refresh Posts</span>
          </button>
        </span>
      </header>
      <main className="mx-auto w-225 pt-30 pb-8 flex-grow text-md">
        {isEditorOpen && (
          <PostEditor
            post={postToEdit}
            onSave={savePost}
            onClose={closeEditor}
          />
        )}
        <PostList
          posts={posts}
          loading={isLoading}
          hasMore={hasMore}
          searchQuery={searchQuery}
          onPostEdit={openUpdateEditor}
          onPostDelete={deletePost}
          onLoadMore={handleLoadMore}
        />
        {errorMessage && (
          <div className="fixed flex gap-2 left-5 bottom-7 z-40 text-sm p-4 rounded-xl border border-red-600 bg-red-300/75 text-red-600 text-center">
            <CircleAlert size={20} />
            <span>{errorMessage}</span>
          </div>
        )}
      </main>
      <footer className="text-center py-1 text-sm bg-white border-t border-gray-300 text-gray-800">
        Alex Chisa &copy; 2025 &middot;{" "}
        <a href="https://github.com/amchisa" target="_blank">
          GitHub
        </a>{" "}
        &middot;{" "}
        <a href="https://www.linkedin.com/in/alexchisa/" target="_blank">
          LinkedIn
        </a>{" "}
        &middot; Built using Spring Boot, React, Tailwind CSS, and Vite.
      </footer>
    </div>
  );
}
