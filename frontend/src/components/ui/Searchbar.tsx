import { Search } from "lucide-react";

interface SearchbarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholderText: string;
}

export default function Searchbar({
  onChange,
  className,
  placeholderText,
}: SearchbarProps) {
  return (
    <div
      className={`border border-gray-400 rounded-lg flex items-center pr-2 ${className}`}
    >
      <Search size={20} className="mx-2" />
      <input
        className="resize-none w-full focus:outline-none"
        placeholder={placeholderText}
        onChange={onChange}
      ></input>
    </div>
  );
}
