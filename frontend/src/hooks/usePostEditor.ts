import type { PostRequest } from "../types/requests";
import type { Post } from "../types/models";
import { useState } from "react";

interface UsePostEditorParams {
  onCreate: (postRequest: PostRequest) => void;
  onUpdate: (id: number, postRequest: PostRequest) => void;
}

/**
 * Custom hook to manage the creation and updating of posts via the PostEditor.
 * @param onCreate The method to invoke when creating a new post.
 * @param onUpdate The method to invoke when updating an existing post.
 */
export default function usePostEditor({
  onCreate,
  onUpdate,
}: UsePostEditorParams) {
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
   * Handles saving a post that the user has created or edited to the database.
   * @param postRequest The PostRequest object containing the new/updated post information.
   */
  const savePost = (postRequest: PostRequest) => {
    if (postToEdit) {
      onUpdate(postToEdit.id, postRequest);
    } else {
      onCreate(postRequest);
    }
  };

  /**
   * Handles closing the editor upon the user's request.
   */
  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  return {
    isEditorOpen,
    postToEdit,
    openCreateEditor,
    openUpdateEditor,
    savePost,
    closeEditor,
  };
}
