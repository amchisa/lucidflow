import { useEffect, useState, useRef } from "react";
import type { Image, Post } from "../../types/models";
import type { PostRequest } from "../../types/requests";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  SquareCode,
  Strikethrough,
  Underline,
  X,
} from "lucide-react";
import DOMPurify from "dompurify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { htmlToPlainText } from "../../utils/textUtils";
import ToolbarButton from "../ui/ToolbarButton";

interface PostEditorProps {
  onClose: () => void;
  post: Post | null;
  onSave: (postData: PostRequest) => Promise<void>;
  className?: string;
}

export default function PostEditor({ onClose, post, onSave }: PostEditorProps) {
  const [title, setTitle] = useState<string>(() => post?.title || "");
  const [body, setBody] = useState<string>(() => post?.body || "");
  const [images] = useState<Image[]>(() => post?.images || []);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [, setRerenderToggle] = useState<boolean>(false);
  const [isBodyEditorFocused, setIsBodyEditorFocused] = useState<boolean>(true);

  const initialPostRef = useRef({
    title: post?.title || "",
    body: post?.body || "",
    images: post?.images || [],
  });

  // Tiptap editor integration
  const bodyEditor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false, // Disable default link implementation
      }),
      Placeholder.configure({
        placeholder: "Write about your day",
      }),
      Link.configure({
        autolink: true,
        openOnClick: "whenNotEditable",
        // HTMLAttributes: {
        //   target: "_blank",
        // },
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

  const formattedDateTimeModified = post?.timeModified
    ? post.timeModified.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }) // e.g., Jul 28, 2025, 2:27 p.m.
    : null;

  const toolbarButtons = [
    {
      icon: <Bold size={18} />,
      onClick: () => bodyEditor.chain().focus().toggleBold().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("bold"),
      tooltip: "Bold text",
    },
    {
      icon: <Italic size={18} />,
      onClick: () => bodyEditor.chain().focus().toggleItalic().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("italic"),
      tooltip: "Italicize text",
    },
    {
      icon: <Underline size={18} />,
      onClick: () => bodyEditor.chain().focus().toggleUnderline().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("underline"),
      tooltip: "Underline text",
    },
    {
      icon: <Strikethrough size={18} />,
      onClick: () => bodyEditor.chain().focus().toggleStrike().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("strike"),
      tootip: "Strikethrough text",
    },
    {
      icon: <Code size={18} />,
      onClick: () => bodyEditor.chain().focus().toggleCode().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("code"),
      tooltop: "Create inline code",
    },
    {
      icon: <SquareCode size={21} />,
      onClick: () => bodyEditor.chain().focus().setCodeBlock().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("codeBlock"),
      tooltop: "Create a code block",
    },
    {
      icon: <List size={21} />,
      onClick: () => bodyEditor.chain().focus().toggleBulletList().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("bulletList"),
      tooltop: "Create a bullet list",
    },
    {
      icon: <ListOrdered size={21} />,
      onClick: () => bodyEditor.chain().focus().toggleOrderedList().run(),
      isActive: () => isBodyEditorFocused && bodyEditor.isActive("orderedList"),
      tooltop: "Create an ordered list",
    },
  ];

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
        >
          <X size={24}></X>
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
            maxLength={100}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          ></input>
          <span className="text-sm text-gray-800">{titleCharCount}/100</span>
        </div>
        <div className="mb-2">
          <label
            htmlFor="body-input"
            className="block select-none mb-2 font-bold"
          >
            Description
            {!htmlToPlainText(body) && <span className="text-red-600">*</span>}
          </label>
          <div
            id="body-input"
            className="rich-text border border-gray-400 resize-none py-1 px-2 rounded-lg focus:outline-2 focus:outline-blue-700 focus:outline-solid"
            tabIndex={-1}
            onFocus={() => setIsBodyEditorFocused(true)}
            onBlur={() => setIsBodyEditorFocused(false)}
            onClick={() => setRerenderToggle((prev) => !prev)}
          >
            <div className="border-b border-gray-400 mb-2 pb-1 flex">
              {toolbarButtons.map((btn, index) => (
                <ToolbarButton
                  key={index}
                  icon={btn.icon}
                  onClick={btn.onClick}
                  isActive={btn.isActive()}
                  tooltip={btn.tooltip}
                  className={"h-7 w-7 flex items-center justify-center"}
                ></ToolbarButton>
              ))}
            </div>
            <EditorContent editor={bodyEditor}></EditorContent>
          </div>
        </div>
        <div className="mb-2"></div>
        <div className="mb-2 flex justify-between text-sm text-gray-800">
          <span>Words: {bodyWordCount}</span>
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
