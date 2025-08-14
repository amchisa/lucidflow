import ToolbarButton from "./ToolbarButton";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  SquareCode,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor;
  isEditorFocused: boolean;
}

export default function EditorToolbar({
  editor,
  isEditorFocused,
}: EditorToolbarProps) {
  const [toolbarState, setToolbarState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    code_block: false,
    bullet_list: false,
    ordered_list: false,
  });

  const toolbarButtons = [
    {
      icon: <Bold size={18} />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: isEditorFocused && toolbarState.bold,
      tooltipText: "Bold text",
    },
    {
      icon: <Italic size={18} />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: isEditorFocused && toolbarState.italic,
      tooltipText: "Italicize text",
    },
    {
      icon: <Underline size={18} />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: isEditorFocused && toolbarState.underline,
      tooltipText: "Underline text",
    },
    {
      icon: <Strikethrough size={18} />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: isEditorFocused && toolbarState.strikethrough,
      tooltipText: "Strikethrough text",
    },
    {
      icon: <Code size={18} />,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: isEditorFocused && toolbarState.code,
      tooltipText: "Create inline code",
    },
    {
      icon: <SquareCode size={21} />,
      onClick: () => editor.chain().focus().setCodeBlock().run(),
      isActive: isEditorFocused && toolbarState.code_block,
      tooltipText: "Create a code block",
    },
    {
      icon: <List size={21} />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: isEditorFocused && toolbarState.bullet_list,
      tooltipText: "Create a bullet list",
    },
    {
      icon: <ListOrdered size={21} />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: isEditorFocused && toolbarState.ordered_list,
      tooltipText: "Create an ordered list",
    },
  ];

  const updateToolbar = useCallback(() => {
    setToolbarState({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strikethrough: editor.isActive("strikethrough"),
      code: editor.isActive("code"),
      code_block: editor.isActive("codeBlock"),
      bullet_list: editor.isActive("bulletList"),
      ordered_list: editor.isActive("orderedList"),
    });
  }, [editor]);

  useEffect(() => {
    editor.on("selectionUpdate", updateToolbar);
    editor.on("update", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("update", updateToolbar);
    };
  }, [editor, updateToolbar]);

  return (
    <div
      className="mb-2 flex border-b border-gray-400 pb-1"
      onClick={updateToolbar}
    >
      {toolbarButtons.map((btn, index) => (
        <ToolbarButton
          key={index}
          icon={btn.icon}
          onClick={btn.onClick}
          isActive={btn.isActive}
          tooltipText={btn.tooltipText}
          className={"flex h-7 w-7 items-center justify-center"}
        ></ToolbarButton>
      ))}
    </div>
  );
}
