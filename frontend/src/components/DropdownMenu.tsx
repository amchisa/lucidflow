import { useState, type ReactNode } from "react";

interface DropdownMenuProps {
  triggerIcon: ReactNode;
  children: ReactNode;
}

export default function DropdownMenu({
  triggerIcon,
  children,
}: DropdownMenuProps) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <button className="pl-10" onClick={toggleDropdown}>
        {triggerIcon}
      </button>
      {isOpen && (
        <div className="bg-white p-2 border rounded-lg shadow-xl z-10 absolute min-w-max right-0">
          {children}
        </div>
      )}
    </div>
  );
}
