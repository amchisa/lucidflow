import { Search } from "lucide-react";

interface SearchbarProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder: string;
}

export default function Searchbar({
  onChange,
  className,
  placeholder,
}: SearchbarProps) {
  return (
    <search
      className={`border border-gray-400 rounded-lg flex items-center pr-2 ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <Search size={20} className="mx-2" />
      <input
        className="resize-none w-full focus:outline-none"
        placeholder={placeholder}
        onChange={onChange}
      />
    </search>
  );
}
