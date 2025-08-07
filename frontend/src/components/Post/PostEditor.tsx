import { useEffect, useState } from "react";
import type { Image, Post } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import { X } from "lucide-react";
import DOMPurify from "dompurify";

interface PostEditorProps {
  onClose: () => void;
  post: Post | null;
  onSave: (postData: PostRequest) => void;
  className?: string;
}

export default function PostEditor({ onClose, post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState<string>(() => post?.title || "");
  const [body, setBody] = useState<string>(() => post?.body || "");
  const [images, setImages] = useState<Image[]>(() => post?.images || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const saveButtonText = post ? "Save Changes" : "Create Post";
  const canSave = hasUnsavedChanges && title && body;
  const wordCount = body
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length; // Remove any empty strings from the count
  const formattedDateTimeModified = post?.timeModified
    ? post.timeModified.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null; // e.g., Jul 28, 2025, 2:27 p.m.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      title: title.trim(),
      body: body.trim(),
      images: images,
    });
    onClose();
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

    onClose(); // User wishes to discard their changes
  };

  // Editor setup
  useEffect(() => {
    // Disable background scrolling
    document.body.style.overflow = "hidden";

    // Cleanup after state change or component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [post]);

  // Unsaved changes tracker
  useEffect(() => {
    const initialTitle = post?.title || "";
    const initialBody = post?.body || "";
    const initialImages = post?.images || [];

    const changesDetected =
      title.trim() !== initialTitle.trim() ||
      body.trim() !== initialBody.trim() ||
      JSON.stringify(images) !== JSON.stringify(initialImages);

    setHasUnsavedChanges(changesDetected);
  }, [title, body, images, post]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-30"
      onClick={handleCloseWithConfirmation}
    >
      <form
        className="bg-white opacity-100 p-4 rounded-xl w-250 relative"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} // Prevent editor close when interacting with the form
      >
        <button
          onClick={handleCloseWithConfirmation}
          type="button"
          className="p-1 absolute right-1.5 top-1.5 text-white font-bold text-sm bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md"
        >
          <X size={24}></X>
        </button>
        <div className="mb-2">
          <label
            htmlFor="title_input"
            className="block select-none mb-2 font-bold"
          >
            Title
          </label>
          <input
            id="title_input"
            className="border border-gray-400 resize-none py-1 px-2 rounded-lg w-full"
            value={title}
            placeholder="Give your post a title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>
        </div>
        <div className="mb-2">
          <label
            htmlFor="body_input"
            className="block select-none mb-2 font-bold"
          >
            Description
          </label>
          <textarea
            id="body_input"
            className="border border-gray-400 resize-none py-1 px-2 rounded-lg w-full"
            rows={10}
            value={body}
            placeholder="Write about your day"
            onChange={(e) => {
              setBody(e.target.value);
            }}
          ></textarea>
          {/* <div
            id="body_input"
            contentEditable="plaintext-only"
            className="border border-gray-400 resize-none py-1 px-2 rounded-lg w-full min-h-65"
            onInput={(e) => {
              setBody(e.currentTarget.innerHTML);
            }}
            dangerouslySetInnerHTML={{ __html: body }}
          ></div> */}
        </div>
        <div className="mb-2"></div>
        <div className="mb-2 flex justify-between text-sm text-gray-800">
          <span>Words: {wordCount}</span>
          {post && <span>Last Modified: {formattedDateTimeModified}</span>}
        </div>
        <button
          className={`py-2 px-3 text-white font-bold text-sm ${canSave ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700" : "bg-gray-500"} rounded-md`}
          type="submit"
          disabled={!canSave}
        >
          {saveButtonText}
        </button>
      </form>
    </div>
  );
}
