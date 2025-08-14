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
      className={`flex items-center rounded-lg border border-gray-400 pr-2 focus-within:outline-2 focus-within:outline-blue-600 focus-within:outline-solid ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <Search size={20} className="mx-2" />
      <input
        className="w-full resize-none focus:outline-none"
        placeholder={placeholder}
        onChange={onChange}
      />
    </search>
  );
}
