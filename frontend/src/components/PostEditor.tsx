import { useEffect, useState } from "react";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  post?: Post | null;
  onSave: (postData: PostRequest) => void;
}

export default function PostEditor({
  isOpen,
  onClose: handleClose,
  post,
  onSave: handleSave,
}: PostEditorProps) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const wordCount = body
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length; // Remove any empty strings from the count
  const saveButtonText = post ? "Save Changes" : "Create Post";
  const formattedDateTimeModified = post?.timeModified
    ? post.timeModified.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null; // e.g., Jul 28, 2025, 2:27 p.m.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedTitle = title.trim();
    const formattedBody = body.trim();

    if (formattedTitle === "") {
      window.alert("Title cannot be blank");
      return;
    }

    if (formattedBody === "") {
      window.alert("Body cannot be blank");
      return;
    }

    handleClose();
    await handleSave({
      title: formattedTitle,
      body: formattedBody,
      images: [], // Images is set to an empty array as image uploading is not implemented yet
    });
  };

  const handleCloseWithConfirmation = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );

      if (!confirmDiscard) {
        return; // User does not wish to discard their changes
      }
    }

    handleClose(); // User wishes to discard their changes
  };

  // Editor setup
  useEffect(() => {
    if (isOpen) {
      // Disable background scrolling
      document.body.style.overflow = "hidden";

      if (post) {
        // Set states to the existing values of the post being updated
        setTitle(post.title);
        setBody(post.body);
      }
    }

    // Cleanup after state change or component unmount
    return () => {
      document.body.style.overflow = "";
      setTitle("");
      setBody("");
      setHasUnsavedChanges(false);
    };
  }, [isOpen, post]);

  // Unsaved changes tracker
  useEffect(() => {
    if (!isOpen) {
      return; // No need to run
    }

    let changesDetected = false;

    if (post) {
      if (title.trim() !== post.title || body.trim() !== post.body) {
        changesDetected = true;
      }
    } else {
      if (title.trim() !== "" || body.trim() !== "") {
        changesDetected = true;
      }
    }

    setHasUnsavedChanges(changesDetected);
  }, [title, body, post, isOpen]);

  if (!isOpen) {
    return null; // Don't render if not meant to be open
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
      <form
        className="bg-white opacity-100 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-2">
          <label htmlFor="title_input" className="block select-none mb-2">
            Title
          </label>
          <textarea
            id="title_input"
            className="border resize-none p-1 rounded-lg"
            rows={1}
            cols={100}
            value={title}
            placeholder="Give your post a title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="mb-2">
          <label htmlFor="body_input" className="block select-none mb-2">
            Body
          </label>
          <textarea
            id="body_input"
            className="border resize-none p-1 rounded-lg"
            rows={10}
            cols={100}
            value={body}
            placeholder="Write about your day"
            onChange={(e) => {
              setBody(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="mb-2 flex justify-between">
          <span>Words: {wordCount}</span>
          {post && <span>Last Modified: {formattedDateTimeModified}</span>}
        </div>
        <button
          className="py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 rounded-md"
          type="submit"
        >
          {saveButtonText}
        </button>
        <button
          onClick={handleCloseWithConfirmation}
          type="button"
          className="py-2 px-3 ml-2 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 rounded-md"
        >
          Close
        </button>
      </form>
    </div>
  );
}
