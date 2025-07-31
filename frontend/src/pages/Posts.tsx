import usePosts from "../hooks/usePosts";
import { useState, useEffect } from "react";
import EntryList from "../components/Post/EntryList";
import Editor from "../components/Post/Editor";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";
import { RotateCcw, SquarePen } from "lucide-react";

export default function Posts() {
  const {
    posts,
    loading,
    errorMessage,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  } = usePosts();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

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
    }
  };

  /**
   * Handles refreshing the page. Fetches posts and scrolls to the top.
   */
  const handleRefresh = () => {
    fetchPosts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchPosts(); // Load posts on startup
  }, [fetchPosts]);

  return (
    <>
      <header className="px-8 py-4 fixed z-20 w-full bg-white border-b border-gray-300 flex justify-between">
        <h1 className="text-2xl font-medium">LucidFlow</h1>
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
            <RotateCcw size={20}></RotateCcw>
            <span>Refresh Posts</span>
          </button>
        </span>
      </header>
      <main className="mx-auto w-225 pt-30 pb-8 flex-grow text-md">
        {isEditorOpen && (
          <Editor
            onClose={closeEditor}
            post={postToEdit}
            onSave={savePost}
          ></Editor>
        )}
        <EntryList
          posts={posts}
          loading={loading}
          errorMessage={errorMessage}
          onPostEdit={openUpdateEditor}
          onPostDelete={deletePost}
        ></EntryList>
      </main>
      <footer className="text-center pb-7 text-sm">
        Alex Chisa &copy; 2025
      </footer>
    </>
  );
}
