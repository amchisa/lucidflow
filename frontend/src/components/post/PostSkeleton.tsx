import { Ellipsis } from "lucide-react";

export default function PostSkeleton() {
  return (
    <div className="mb-5 animate-pulse rounded-xl border border-gray-300 bg-white p-3 shadow-lg">
      <div className="mb-1.5 flex justify-between">
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <Ellipsis size={24} className="text-gray-200" />
      </div>
      <div className="aspect-w-16 aspect-h-9 mb-2 rounded bg-gray-200"></div>
      <div>
        <div className="mb-3 h-6 w-3/4 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
