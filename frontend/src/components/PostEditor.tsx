import { useEffect, useState } from "react";
import type { Post } from "../types/models";
import type { PostRequest } from "../types/requests";

interface PostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: Post | null;
  onSave: (postData: PostRequest) => void;
}

export default function PostEditor({
  isOpen,
  onClose: handleClose,
  postToEdit,
  onSave: handleSave,
}: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert("Temp: Missing title");
    }
    if (!body) {
      alert("Temp: Missing body");
    }

    if (title && body) {
      handleSave({ title, body, images: [] });
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Disable background scrolling
      document.body.style.overflow = "hidden";

      if (postToEdit) {
        setTitle(postToEdit.title);
        setBody(postToEdit.body);
      } else {
        setTitle("");
        setBody("");
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, postToEdit]);

  if (!isOpen) {
    return null; // Don't render if not open
  }

  const saveButtonText = postToEdit ? "Save Changes" : "Create Post";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        className="bg-white opacity-100 p-4 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-2">
          <label htmlFor="title_input" className="block select-none">
            Title
          </label>
          <textarea
            id="title_input"
            className="border resize-none p-1 rounded-lg"
            rows={1}
            cols={100}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="mb-2">
          <label htmlFor="body_input" className="block select-none">
            Body
          </label>
          <textarea
            id="body_input"
            className="border resize-none p-1 rounded-lg"
            rows={10}
            cols={100}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          ></textarea>
        </div>
        <button
          className="py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 rounded-md"
          type="submit"
        >
          {saveButtonText}
        </button>
        <button
          onClick={handleClose}
          className="py-2 px-3 text-white font-bold text-sm bg-gray-500 hover:bg-gray-600 rounded-md"
        >
          Close
        </button>
      </form>
    </div>
  );
}
