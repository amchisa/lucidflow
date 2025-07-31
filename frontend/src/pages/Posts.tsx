import usePosts from "../hooks/usePosts";
import { useState, useEffect } from "react";
import PostList from "../components/PostList";
import PostEditor from "../components/PostEditor";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";

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
    setPostToEdit(null);
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
      <header className="px-8 py-4 fixed z-20 w-full bg-white border-b border-gray-400 flex justify-between">
        <h1 className="text-2xl font-medium">LucidFlow</h1>
        <span>
          <button
            className="mr-2 py-2 px-3 text-white font-bold text-sm bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md"
            onClick={openCreateEditor}
          >
            Create Post
          </button>
          <button
            className="py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 active:bg-gray-700 rounded-md"
            onClick={handleRefresh}
          >
            Refresh Posts
          </button>
        </span>
      </header>
      <main className="mx-auto w-225 pt-30 pb-8 flex-grow text-md">
        <PostEditor
          isOpen={isEditorOpen}
          onClose={closeEditor}
          post={postToEdit}
          onSave={savePost}
        ></PostEditor>
        <PostList
          posts={posts}
          loading={loading}
          errorMessage={errorMessage}
          onPostEdit={openUpdateEditor}
          onPostDelete={deletePost}
        ></PostList>
      </main>
      <footer className="text-center pb-7 text-sm">
        Alex Chisa &copy; 2025
      </footer>
    </>
  );
}
