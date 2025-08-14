import type { ReactNode } from "react";

interface ToolbarButtonProps {
  icon: ReactNode;
  onClick: () => void;
  isActive: boolean;
  tooltipText?: string;
  className?: string;
}

export default function ToolbarButton({
  icon,
  onClick,
  isActive,
  tooltipText,
  className,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md p-1 ${isActive ? "bg-gray-200" : "hover:bg-gray-100 active:bg-gray-200"} ${className}`}
      data-tooltip-id="editor-tooltip"
      data-tooltip-content={tooltipText}
    >
      {icon}
    </button>
  );
}
