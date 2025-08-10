import type { ReactNode } from "react";

interface ToolbarButtonProps {
  icon: ReactNode;
  onClick: () => void;
  isActive: boolean;
  tooltip?: string; // For future use
  className?: string;
}

export default function ToolbarButton({
  icon,
  onClick,
  isActive,
  className,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1 rounded-md  ${isActive ? "bg-gray-200" : "hover:bg-gray-100 active:bg-gray-200"} ${className}`}
    >
      {icon}
    </button>
  );
}
