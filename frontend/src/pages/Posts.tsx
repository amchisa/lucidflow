import usePosts from "../hooks/usePosts";
import { useEffect, useCallback } from "react";
import PostList from "../components/post/PostList";
import PostEditor from "../components/post/PostEditor";
import { ListRestart, NotebookPen } from "lucide-react";
import usePostEditor from "../hooks/usePostEditor";
import useDebounce from "../hooks/useDebounce";
import Searchbar from "../components/ui/Searchbar";

const MIN_REFRESH_DURATION = 500;
const DEBOUNCE_DELAY = 400;

export default function Posts() {
  const {
    posts,
    isLoading,
    hasMore,
    hasError,
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
    onCreate: async (postRequest) => {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top for improved user experience
      createPost(postRequest);
    },
    onUpdate: updatePost,
  });

  const [debouncedSearchInput, setSearchInput] = useDebounce<string>(
    "",
    DEBOUNCE_DELAY,
  );

  /**
   * Handles refreshing of the post list. Maintains the current search input.
   */
  const refreshPosts = useCallback(() => {
    fetchPosts({
      refresh: true,
      search: debouncedSearchInput,
      loadDelay: MIN_REFRESH_DURATION,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [debouncedSearchInput, fetchPosts]);

  /**
   * Helper function to help handle setting the search query based on an input change.
   * @param e The change event associated with the text modification.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.trim());
  };

  /**
   * Helper function for loading more posts. Calls fetch posts with refresh = false (implicit) and
   * maintains the search query.
   */
  const handleLoadMore = useCallback(() => {
    fetchPosts({ search: debouncedSearchInput });
  }, [debouncedSearchInput, fetchPosts]);

  // Trigger refresh on component mount and search query change
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return (
    <div className="flex min-h-screen min-w-screen flex-col">
      <header className="fixed z-20 flex w-full justify-between border-b border-gray-300 bg-white px-8 py-4">
        <span className="flex">
          <h1 className="mr-8 text-2xl font-medium">LucidFlow</h1>
          <Searchbar
            onChange={handleSearchChange}
            placeholder="Search by title"
          />
        </span>
        <span className="flex gap-2">
          <button
            className="flex gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-bold text-white hover:bg-blue-600 active:bg-blue-700"
            onClick={openCreateEditor}
          >
            <NotebookPen size={20} />
            <span>Create Post</span>
          </button>
          <button
            className="flex gap-2 rounded-md bg-gray-500 px-3 py-2 text-sm font-bold text-white hover:bg-gray-600 active:bg-gray-700"
            onClick={refreshPosts}
          >
            <ListRestart size={20} />
            <span>Refresh Posts</span>
          </button>
        </span>
      </header>
      <main className="text-md mx-auto w-225 flex-grow pt-30 pb-4">
        {isEditorOpen && (
          <PostEditor
            post={postToEdit}
            onSave={savePost}
            onClose={closeEditor}
          />
        )}
        <PostList
          posts={posts}
          isLoading={isLoading}
          hasError={hasError}
          hasMore={hasMore}
          searchQuery={debouncedSearchInput}
          onPostEdit={openUpdateEditor}
          onPostDelete={deletePost}
          onLoadMore={handleLoadMore}
        />
      </main>
      <footer className="border-t border-gray-300 bg-white py-1 text-center text-sm text-gray-800">
        &copy; Alex Chisa 2025 &middot;{" "}
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
