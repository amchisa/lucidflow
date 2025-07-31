import type { Post } from "../types/models";
import Dropdown from "./Dropdown";
import ImageGallery from "./ImageGallery";
import { Ellipsis, Edit2, Trash2 } from "lucide-react";

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
  className?: string;
}

export default function PostItem({
  post,
  onEdit: handleEdit,
  onDelete: handleDelete,
}: PostItemProps) {
  const { id, title, body, images, timeCreated } = post;

  const formattedDateTimeCreated = timeCreated.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }); // e.g., Monday, July 28, 2025 at 2:26 p.m.

  const handleDeleteWithConfirmation = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`
    );

    if (!confirmDelete) {
      return; // User does not wish to delete the post
    }

    await handleDelete(id); // User does wish to delete the post
  };

  return (
    <div className="border border-gray-400 p-3 rounded-xl mb-5 shadow-lg">
      <div className="flex justify-between">
        <span className="text-sm text-gray-800">
          {formattedDateTimeCreated}
        </span>
        <Dropdown triggerIcon={<Ellipsis size={24} />}>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                className="w-full flex gap-2 justify-start py-2 px-3 text-white text-sm font-bold bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-lg"
                onClick={() => handleEdit(post)}
              >
                <Edit2 size={20} />
                <span>Edit Post</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex gap-2 justify-start py-2 px-3 text-white text-sm font-bold bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg"
                onClick={handleDeleteWithConfirmation}
              >
                <Trash2 size={20} />
                <span>Delete Post</span>
              </button>
            </li>
          </ul>
        </Dropdown>
      </div>
      <div>
        <h2 className="text-lg mb-2 font-bold">{title}</h2>
        <p>{body}</p>
      </div>
      {images.length > 0 && (
        <ImageGallery className="mt-4" images={images}></ImageGallery>
      )}
    </div>
  );
}
