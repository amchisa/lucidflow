import { Ellipsis } from "lucide-react";

export default function PostSkeleton() {
  return (
    <div className="bg-white p-3 rounded-xl mb-5 shadow-lg border border-gray-300 animate-pulse">
      <div className="flex justify-between mb-1.5">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <Ellipsis size={24} className="text-gray-200" />
      </div>
      <div className="aspect-w-16 aspect-h-9 mb-2 bg-gray-200 rounded"></div>
      <div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}
