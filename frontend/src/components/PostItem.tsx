import type { Post } from "../types/models";
import ImageGallery from "./ImageGallery";

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
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
    <div className="border p-3 rounded-xl mb-5 shadow-xl">
      {images.length > 0 && <ImageGallery images={images}></ImageGallery>}
      <div>
        <div className="mb-2 text-gray-800">{formattedDateTimeCreated}</div>
        <div>
          <h2 className="text-xl">{title}</h2>
          <p className="mb-5 mt-2">{body}</p>
        </div>
        <button
          className="py-2 px-3 text-white text-sm font-bold bg-green-600 hover:bg-green-700 rounded-lg mr-2"
          onClick={() => handleEdit(post)}
        >
          Edit Post
        </button>
        <button
          className="py-2 px-3 text-white text-sm font-bold bg-red-600 hover:bg-red-700 rounded-lg"
          onClick={handleDeleteWithConfirmation}
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}
