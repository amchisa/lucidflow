import React, { useEffect, useState, useRef } from "react";
import type { Image, Post } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import { X } from "lucide-react";
import DOMPurify from "dompurify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { htmlToPlainText } from "../../utils/textUtils";
import { Tooltip } from "react-tooltip";
import EditorToolbar from "./EditorToolbar";
import ImageUploader from "./ImageUploader";

interface PostEditorProps {
  onClose: () => void;
  post: Post | null;
  onSave: (postData: PostRequest) => Promise<void>;
  className?: string;
}

export default function PostEditor({ onClose, post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState<string>(() => post?.title || "");
  const [body, setBody] = useState<string>(() => post?.body || "");
  const [images, setImages] = useState<Image[]>(() => post?.images || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isBodyEditorFocused, setIsBodyEditorFocused] =
    useState<boolean>(false);

  const initialPostRef = useRef({
    title: post?.title || "",
    body: post?.body || "",
    images: post?.images || [],
  });

  // Tiptap editor integration
  const bodyEditor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: "whenNotEditable",
        },
      }),
      Placeholder.configure({
        placeholder: "Write about your day",
      }),
    ],
    content: body,
    onUpdate: ({ editor }) => setBody(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "focus:outline-none h-55 resize-none overflow-y-auto whitespace-pre-wrap",
      },
    },
  });

  const saveButtonText = post ? "Save Changes" : "Create Post";
  const canSave = hasUnsavedChanges && title && htmlToPlainText(body);
  const titleCharCount = title.length;

  const bodyWordCount = bodyEditor
    .getText()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length; // Remove any empty strings

  const formattedDateTimeModified = post?.timeModified // e.g., Jul 28, 2025, 2:27 pm
    ? post.timeModified
        .toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
        .replace(/\.m\./gi, "m") // Remove dots from a.m. and p.m.
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedBody = DOMPurify.sanitize(body, {
      ADD_ATTR: ["target", "rel"],
    });

    onSave({
      title: title.trim(),
      body: sanitizedBody,
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

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable background scrolling

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const initialPost = initialPostRef.current;

    const changesDetected =
      title.trim() !== initialPost.title.trim() ||
      body !== initialPost.body ||
      JSON.stringify(images) !== JSON.stringify(initialPost.images);

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
          data-tooltip-id="editor-tooltip"
          data-tooltip-content="Exit"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
        <div className="mb-2">
          <label
            htmlFor="title-input"
            className="block select-none mb-2 font-bold"
          >
            Title{!title.trim() && <span className="text-red-600">*</span>}
          </label>
          <input
            id="title-input"
            className="border border-gray-400 resize-none py-1 px-2 rounded-lg w-full focus:outline-2 focus:outline-blue-700 focus:outline-solid"
            value={title}
            placeholder="Give your post a title"
            autoComplete="off"
            type="text"
            maxLength={100}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <span className="text-sm text-gray-800">{titleCharCount}/100</span>
        </div>
        <div className="mb-3">
          <label
            htmlFor="body-input"
            className="block select-none mb-2 font-bold"
          >
            Description
            {!htmlToPlainText(body) && <span className="text-red-600">*</span>}
          </label>
          <div
            id="body-input"
            className="rich-text border border-gray-400 resize-none py-1 px-2 rounded-lg focus-within:outline-2 focus-within:outline-blue-700 focus-within:outline-solid"
            tabIndex={-1}
            onFocus={() => setIsBodyEditorFocused(true)}
            onBlur={() => setIsBodyEditorFocused(false)}
          >
            <EditorToolbar
              editor={bodyEditor}
              isEditorFocused={isBodyEditorFocused}
            />
            <EditorContent editor={bodyEditor} />
          </div>
          <span className="text-gray-800 text-sm">Words: {bodyWordCount}</span>
        </div>
        <ImageUploader images={images} setImages={setImages} />
        <div className="text-sm flex justify-between items-end mt-4">
          <span className="flex gap-2">
            <button
              className={`py-2 px-3 text-white font-bold rounded-md ${canSave ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700" : "bg-gray-500"}`}
              type="submit"
              disabled={!canSave}
            >
              {saveButtonText}
            </button>
            <button
              type="button"
              className="py-2 px-3 text-white font-bold rounded-md bg-gray-500 hover:bg-gray-600 active:bg-gray-700"
              onClick={handleCloseWithConfirmation}
            >
              Close
            </button>
          </span>
          {post && <span>Last Saved: {formattedDateTimeModified}</span>}
        </div>
      </form>
      <Tooltip
        id="editor-tooltip"
        className="!bg-gray-800 !p-1.5 !rounded-md !shadow-lg !text-sm"
        opacity={100}
        place="bottom"
      />
    </div>
  );
}
