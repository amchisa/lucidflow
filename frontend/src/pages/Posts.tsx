import usePosts from "../hooks/usePosts";
import { useState, useEffect, useRef, useCallback } from "react";
import EntryList from "../components/Post/EntryList";
import Editor from "../components/Post/Editor";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";
import { RotateCcw, Search, SquarePen } from "lucide-react";

export default function Posts() {
  const {
    posts,
    hasMore,
    loading,
    errorMessage,
    fetchPosts,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
  } = usePosts();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [search, setSearch] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /**
   * Handles opening the editor after clicking to create a new post.
   */
  const openCreateEditor = () => {
    setPostToEdit(null);
    setIsEditorOpen(true);
  };

  /**
   * Handles opening the editor after clicking to edit an existing post.
   * @param post The post to be edited.
   */
  const openUpdateEditor = (post: Post) => {
    setPostToEdit(post);
    setIsEditorOpen(true);
  };

  /**
   * Handles closing the editor upon the user's request.
   */
  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  /**
   * Handles saving a post that the user has created or edited to the database.
   * @param postRequest The PostRequest object containing the updated/new post information.
   */
  const savePost = (postRequest: PostRequest) => {
    if (postToEdit) {
      updatePost(postToEdit.id, postRequest);
    } else {
      createPost(postRequest);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scrolls to the top for better user feedback
    }
  };

  /**
   * Handles refresh of the page.
   */
  const handleRefresh = useCallback(() => {
    if (search) {
      refreshPosts(search);
    } else {
      refreshPosts();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [refreshPosts, search]);

  // Load posts on startup
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh, search]);

  // Fetch more posts when bottom is reached
  useEffect(() => {
    const handleFetch = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        fetchPosts();
      }
    };

    const observer = new IntersectionObserver(handleFetch, {
      rootMargin: "50px", // Triggers fetch before the div enters the viewport
    });

    const target = loadMoreRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [fetchPosts]);

  return (
    <div className="flex flex-col min-h-screen min-w-screen">
      <header className="px-8 py-4 fixed z-20 w-full bg-white border-b border-gray-300 flex justify-between">
        <span className="flex">
          <h1 className="text-2xl font-medium mr-8">LucidFlow</h1>
          <div className="border border-gray-400 rounded-lg flex items-center pr-2 mr-2">
            <Search size={20} className="mx-2" />
            <input
              className="resize-none w-full focus:outline-none"
              placeholder="Search by title"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            ></input>
          </div>
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
            onClick={handleRefresh}
          >
            <RotateCcw size={20} />
            <span>Refresh Posts</span>
          </button>
        </span>
      </header>
      <main className="mx-auto w-225 pt-30 pb-8 flex-grow text-md">
        {isEditorOpen && (
          <Editor onClose={closeEditor} post={postToEdit} onSave={savePost} />
        )}
        <EntryList
          posts={posts}
          loading={loading}
          onPostEdit={openUpdateEditor}
          onPostDelete={deletePost}
        />
        {hasMore && (
          <div ref={loadMoreRef} className="text-center text-sm mt-10">
            Loading more posts...
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
      {errorMessage && (
        <span className="absolute right-5 bottom-7 z-40 text-sm p-4 rounded-xl bg-red-300 text-red-600 text-center">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
