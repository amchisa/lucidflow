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
import EditorToolbar from "../ui/EditorToolbar";
import ImageUploader from "../ui/ImageUploader";
import ImageModal from "../ui/ImageModal";

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

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

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
  const imagesUploading = images.some((image) => image?.uploading);
  const canSave =
    hasUnsavedChanges && title && htmlToPlainText(body) && !imagesUploading;
  const titleCharCount = title.length;

  const bodyWordCount = bodyEditor
    .getText()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length; // Remove any empty strings

  const formattedDateTimeModified = post?.lastModifiedAt // e.g., Jul 28, 2025, 2:27 pm
    ? post.lastModifiedAt
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
        "You have unsaved changes. Are you sure you want to discard them?",
      );

      if (!confirmDiscard) {
        return; // User does not wish to discard their changes
      }
    }

    onClose(); // User wishes to discard their changes
  };

  const openImageModal = (image: Image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
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
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/50"
      onClick={handleCloseWithConfirmation}
    >
      <form
        className="relative w-250 rounded-xl bg-white p-4 opacity-100"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()} // Prevent editor close when interacting with the form
      >
        <button
          onClick={handleCloseWithConfirmation}
          type="button"
          className="absolute top-1.5 right-1.5 rounded-md bg-red-500 p-1 text-sm font-bold text-white hover:bg-red-600 active:bg-red-700"
          data-tooltip-id="editor-tooltip"
          data-tooltip-content="Exit"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
        <div className="mb-2">
          <label
            htmlFor="title-input"
            className="mb-2 block font-bold select-none"
          >
            Title{!title.trim() && <span className="text-red-600">*</span>}
          </label>
          <input
            id="title-input"
            className="w-full resize-none rounded-lg border border-gray-400 px-2 py-1 focus:outline-2 focus:outline-blue-600 focus:outline-solid"
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
            className="mb-2 block font-bold select-none"
          >
            Description
            {!htmlToPlainText(body) && <span className="text-red-600">*</span>}
          </label>
          <div
            id="body-input"
            className="rich-text resize-none rounded-lg border border-gray-400 px-2 py-1 focus-within:outline-2 focus-within:outline-blue-600 focus-within:outline-solid"
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
          <span className="text-sm text-gray-800">Words: {bodyWordCount}</span>
        </div>
        <div>
          <h3 className="mb-2 font-bold select-none">Images</h3>
          <ImageUploader
            images={images}
            setImages={setImages}
            onClickImage={openImageModal}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div>{post && <>Last Saved: {formattedDateTimeModified}</>}</div>
          <div className="flex gap-2">
            <button
              className={`rounded-md px-3 py-2 font-bold text-white ${canSave ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700" : "bg-gray-500"}`}
              type="submit"
              disabled={!canSave}
            >
              {saveButtonText}
            </button>
            <button
              type="button"
              className="rounded-md bg-gray-500 px-3 py-2 font-bold text-white hover:bg-gray-600 active:bg-gray-700"
              onClick={handleCloseWithConfirmation}
            >
              Close
            </button>
          </div>
        </div>
      </form>
      <Tooltip
        id="editor-tooltip"
        className="!rounded-md !bg-gray-800 !p-1.5 !text-sm !shadow-lg"
        opacity={100}
        place="bottom"
      />
      {isImageModalOpen && (
        <ImageModal image={selectedImage} onClose={closeImageModal} />
      )}
    </div>
  );
}
