import { useState, type ReactNode } from "react";

interface DropdownMenuProps {
  triggerIcon: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function DropdownMenu({
  triggerIcon,
  children,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdownMenu = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const closeDropdownMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative flex pb-1" onMouseLeave={closeDropdownMenu}>
      <button
        className={`rounded-full px-1 ${isOpen ? "bg-gray-200" : "hover:bg-gray-100 active:bg-gray-200"}`}
        onClick={toggleDropdownMenu}
      >
        {triggerIcon}
      </button>
      {isOpen && (
        <div className="bg-white p-1 rounded-xl border border-gray-300 drop-shadow-lg z-10 min-w-max absolute right-0 top-full">
          {children}
        </div>
      )}
    </div>
  );
}
