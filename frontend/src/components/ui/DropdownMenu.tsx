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
        <div className="absolute top-full right-0 z-10 min-w-max rounded-xl border border-gray-300 bg-white p-1 drop-shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}
