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
  const [isEditorOpen, setEditorOpen] = useState<boolean>(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  /**
   * Handles opening the editor after clicking to create a new post.
   */
  const openCreateEditor = () => {
    setPostToEdit(null);
    setEditorOpen(true);
  };

  /**
   * Handles opening the editor after clicking to edit an existing post.
   * @param post The post to be edited.
   */
  const openUpdateEditor = (post: Post) => {
    setPostToEdit(post);
    setEditorOpen(true);
  };

  /**
   * Handles closing the editor upon the user's request.
   */
  const closeEditor = () => {
    setEditorOpen(false);
    setPostToEdit(null);
  };

  /**
   * Handles saving a post that the user has created or edited to the database.
   * @param requestData The PostRequest object containing the updated/new post information.
   */
  const savePost = async (requestData: PostRequest) => {
    if (postToEdit) {
      await updatePost(postToEdit.id, requestData);
    } else {
      await createPost(requestData);
    }
  };

  useEffect(() => {
    fetchPosts(); // Load posts on startup
  }, [fetchPosts]);

  return (
    <>
      <header className="px-8 py-4 fixed w-full bg-white border-b border-gray-400 flex justify-between">
        <h1 className="text-3xl">LucidFlow</h1>
        <span>
          <button
            className="mr-2 py-2 px-3 text-white font-bold text-sm bg-blue-500 hover:bg-blue-600 rounded-md"
            onClick={openCreateEditor}
          >
            Create Post
          </button>
          <button
            className="py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 rounded-md"
            onClick={fetchPosts}
          >
            Refresh Posts
          </button>
        </span>
      </header>
      <main className="mx-auto w-225 pt-30 pb-8">
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
    </>
  );
}
