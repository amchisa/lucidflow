import usePosts from "../hooks/post/usePosts";
import { useEffect, useCallback, useState } from "react";
import PostList from "../components/post/PostList";
import PostEditor from "../components/post/PostEditor";
import { ListRestart, NotebookPen } from "lucide-react";
import usePostEditor from "../hooks/post/usePostEditor";
import useDebounce from "../hooks/shared/useDebounce";
import Searchbar from "../components/ui/Searchbar";
import Footer from "../components/layout/Footer";
import { subHours, subDays, subYears } from "date-fns";

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

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [filters, setFilters] = useState({
    hasImages: null as boolean | null,
    createdAfter: null as Date | null,
  });

  /**
   * Handles refreshing of the post list. Maintains the current search input and filter parameters.
   */
  const refreshPosts = useCallback(() => {
    fetchPosts({
      refresh: true,
      searchQuery: debouncedSearchInput,
      loadDelay: MIN_REFRESH_DURATION,
      ...filters,
      sortOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [debouncedSearchInput, fetchPosts, filters, sortOrder]);

  /**
   * Helper function to help handle setting the search query based on an input change.
   * @param e The change event associated with the text modification.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value.trim());
  };

  /**
   * Helper function for loading more posts. Calls fetch posts with refresh = false (implicit).
   * Maintains the search query, selected filters and sort order.
   */
  const handleLoadMore = useCallback(() => {
    fetchPosts({ searchQuery: debouncedSearchInput, ...filters, sortOrder });
  }, [debouncedSearchInput, fetchPosts, filters, sortOrder]);

  const handleImagesFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;

    setFilters((prevFilters) => ({
      ...prevFilters,
      hasImages: value === "true" ? true : value === "false" ? false : null,
    }));
  };

  const handleCreatedAfterFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    let newValue;

    const now = new Date();

    switch (value) {
      case "1h":
        newValue = subHours(now, 1);
        break;
      case "24h":
        newValue = subDays(now, 1);
        break;
      case "7d":
        newValue = subDays(now, 7);
        break;
      case "30d":
        newValue = subDays(now, 30);
        break;
      case "1y":
        newValue = subYears(now, 1);
        break;
      default:
        newValue = null;
        break;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      createdAfter: newValue,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
  };

  // Trigger refresh on component mount and search query change
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return (
    <div className="flex min-h-screen min-w-screen flex-col">
      <header className="fixed z-20 flex w-full justify-between border-b border-gray-300 bg-white px-8 py-4">
        <span className="flex gap-8">
          <h1 className="text-2xl font-medium">LucidFlow</h1>
          <span className="flex gap-4">
            <Searchbar
              onChange={handleSearchChange}
              placeholder="Search posts"
              className="h-full"
            />
            <span className="flex items-center gap-2 text-sm">
              <label htmlFor="has-images-filter-select">Images:</label>
              <select
                id="has-images-filter-select"
                name="hasImages"
                onChange={handleImagesFilterChange}
                value={
                  filters.hasImages === null ? "" : filters.hasImages.toString()
                }
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              <label htmlFor="created-after-filter-select">
                Creation Date:
              </label>
              <select
                id="created-after-filter-select"
                name="createdAfter"
                onChange={handleCreatedAfterFilterChange}
                // `value` left out as it brings unneeded complexity
              >
                <option value="">Any time</option>
                <option value="1h">Past hour</option>
                <option value="24h">Past 24 hours</option>
                <option value="7d">Past week</option>
                <option value="30d">Past month</option>
                <option value="1y">Past year</option>
              </select>

              <label htmlFor="sort-order-select">Sort:</label>
              <select
                id="sort-order-select"
                onChange={handleSortChange}
                value={sortOrder}
              >
                <option value="desc">Newest</option>
                <option value="asc">Oldest</option>
              </select>
            </span>
          </span>
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
      <Footer />
    </div>
  );
}
