import { useEffect, useState, useRef } from "react";
import type { Image, Post } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import {
  Bold,
  Code,
  Italic,
  LinkIcon,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
import DOMPurify from "dompurify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { normalizeHTMLText } from "../../utils/textUtils";

interface PostEditorProps {
  onClose: () => void;
  post: Post | null;
  onSave: (postData: PostRequest) => void;
  className?: string;
}

export default function PostEditor({ onClose, post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState<string>(() => post?.title || "");
  const [body, setBody] = useState<string>(() => post?.body || "");
  const [images] = useState<Image[]>(() => post?.images || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [, toggleRerender] = useState<boolean>(false);
  const [isBodyEditorFocused, setIsBodyEditorFocused] =
    useState<boolean>(false);

  // Tiptap editor integration
  const bodyEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write about your day",
      }),
    ],
    content: body,
    onUpdate: ({ editor }) => setBody(editor.getHTML()),
    onFocus: () => setIsBodyEditorFocused(true),
    onBlur: () => setIsBodyEditorFocused(false),
    editorProps: {
      attributes: {
        class: "focus:outline-none h-55 resize-none overflow-y-auto",
      },
    },
  });

  const initialPostRef = useRef({
    title: post?.title || "",
    body: post?.body || "",
    images: post?.images || [],
  });

  const saveButtonText = post ? "Save Changes" : "Create Post";
  const canSave = hasUnsavedChanges && title && normalizeHTMLText(body);

  const wordCount = bodyEditor
    .getText()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length; // Remove any empty strings

  const formattedDateTimeModified = post?.timeModified
    ? post.timeModified.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }) // e.g., Jul 28, 2025, 2:27 p.m.
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedBody = DOMPurify.sanitize(body);

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

  // Scroll blocking
  useEffect(() => {
    // Disable background scrolling
    document.body.style.overflow = "hidden";

    // Cleanup after component unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Unsaved changes tracker
  useEffect(() => {
    const initialPost = initialPostRef.current;

    const changesDetected =
      title.trim() !== initialPost.title.trim() ||
      normalizeHTMLText(body) !== normalizeHTMLText(initialPost.body) ||
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
        >
          <X size={24}></X>
        </button>
        <div className="mb-2">
          <label
            htmlFor="title-input"
            className="block select-none mb-2 font-bold"
          >
            Title
          </label>
          <input
            id="title-input"
            className="border border-gray-400 resize-none py-1 px-2 rounded-lg w-full focus:outline-none"
            value={title}
            placeholder="Give your post a title"
            autoComplete="off"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>
        </div>
        <div className="mb-2">
          <label
            htmlFor="body-input"
            className="block select-none mb-2 font-bold"
          >
            Description
          </label>
          <div
            id="body-input"
            className="border border-gray-400 resize-none py-1 px-2 rounded-lg"
            onClick={() => toggleRerender((prev) => !prev)}
          >
            <div className="border-b border-gray-400 mb-2">
              <button
                type="button"
                onClick={() => bodyEditor.chain().focus().toggleBold().run()}
                className={`p-1 rounded-md ${bodyEditor.isFocused && bodyEditor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Bold size={18}></Bold>
              </button>
              <button
                type="button"
                onClick={() => bodyEditor.chain().focus().toggleItalic().run()}
                className={`p-1 rounded-md ${isBodyEditorFocused && bodyEditor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Italic size={18}></Italic>
              </button>
              <button
                type="button"
                onClick={() =>
                  bodyEditor.chain().focus().toggleUnderline().run()
                }
                className={`p-1 rounded-md ${isBodyEditorFocused && bodyEditor.isActive("underline") ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Underline size={18}></Underline>
              </button>
              <button
                type="button"
                onClick={() => bodyEditor.chain().focus().toggleStrike().run()}
                className={`p-1 rounded-md ${isBodyEditorFocused && bodyEditor.isActive("strike") ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Strikethrough size={18}></Strikethrough>
              </button>
              <button
                type="button"
                onClick={() => bodyEditor.chain().focus().toggleLink().run()}
                className={`p-1 rounded-md ${isBodyEditorFocused && bodyEditor.isActive("link") ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <LinkIcon size={18}></LinkIcon>
              </button>
              <button
                type="button"
                onClick={() => bodyEditor.chain().focus().toggleCode().run()}
                className={`p-1 rounded-md ${isBodyEditorFocused && bodyEditor.isActive("code") ? "bg-gray-200" : "hover:bg-gray-100"}`}
              >
                <Code size={18}></Code>
              </button>
            </div>
            <EditorContent editor={bodyEditor}></EditorContent>
          </div>
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
