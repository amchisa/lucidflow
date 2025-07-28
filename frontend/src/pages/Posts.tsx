import usePosts from "../hooks/usePosts";
import { useState } from "react";
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
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleOpenCreateEditor = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditEditor = (post: Post) => {
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  const handleSavePost = (postData: PostRequest) => {
    if (editingPost) {
      updatePost(editingPost.id, postData);
    } else {
      createPost(postData);
    }
  };

  return (
    <>
      <header className="px-8 py-4 fixed w-full bg-white border-b border-gray-400 flex justify-between">
        <h1 className="text-3xl">LucidFlow</h1>
        <span>
          <button
            className="mr-5 py-2 px-3 text-white font-bold text-sm bg-blue-500 hover:bg-blue-600 rounded-md"
            onClick={handleOpenCreateEditor}
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
          onClose={handleCloseEditor}
          postToEdit={editingPost}
          onSave={handleSavePost}
        ></PostEditor>
        <PostList
          posts={posts}
          isLoading={loading}
          errorMessage={errorMessage}
          onPostEdit={handleOpenEditEditor}
          onPostDelete={deletePost}
        ></PostList>
      </main>
    </>
  );
}
