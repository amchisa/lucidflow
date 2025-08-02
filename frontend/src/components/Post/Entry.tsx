import type { Post } from "../../types/models";
import Dropdown from "./Dropdown";
import Gallery from "./Gallery";
import { Ellipsis, Edit2, Trash2 } from "lucide-react";

interface EntryProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
  className?: string;
}

export default function Entry({
  post,
  onEdit: handleEdit,
  onDelete: handleDelete,
}: EntryProps) {
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
    <div className="bg-white p-3 rounded-xl mb-5 shadow-lg border border-gray-300">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-800">
          {formattedDateTimeCreated}
        </span>
        <Dropdown trigger={<Ellipsis size={24} />}>
          <ul className="flex flex-col">
            <li>
              <button
                className="w-full flex gap-2 py-2 px-3 text-sm font-bold hover:bg-green-600 hover:text-white active:bg-green-700 rounded-lg"
                onClick={() => handleEdit(post)}
              >
                <Edit2 size={20} />
                <span>Edit Post</span>
              </button>
            </li>
            <li>
              <button
                className="w-full flex gap-2 py-2 px-3 text-sm font-bold hover:bg-red-600 hover:text-white active:bg-red-700 rounded-lg"
                onClick={handleDeleteWithConfirmation}
              >
                <Trash2 size={20} />
                <span>Delete Post</span>
              </button>
            </li>
          </ul>
        </Dropdown>
      </div>
      {images.length > 0 && <Gallery className="mb-2" images={images} />}
      <div>
        <h2 className="text-lg font-bold mb-3 truncate">{title}</h2>
        <p className="whitespace-pre-wrap">{body}</p>
      </div>
    </div>
  );
}
