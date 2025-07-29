import { useState, type ReactNode } from "react";

interface DropdownMenuProps {
  trigger: (props: { onMouseDown: (e: React.MouseEvent) => void }) => ReactNode;
  children: ReactNode;
}

export default function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div className="flex justify-end" onMouseLeave={handleMouseLeave}>
      {trigger({ onMouseDown: handleMouseDown })}
      {isOpen && (
        <div className="bg-white fixed p-2 border rounded-lg mt-6 shadow z-10">
          {children}
        </div>
      )}
    </div>
  );
}
