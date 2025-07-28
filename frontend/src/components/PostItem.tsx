import type { Post } from "../types/models";
import ImageGallery from "./ImageGallery";
import { Ellipsis } from "lucide-react";

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
}

export default function PostItem({
  post,
  onEdit: handleEdit,
  onDelete: deletePost,
}: PostItemProps) {
  const { id, title, body, images, timeCreated } = post;

  return (
    <div className="border p-3 rounded-xl mb-5 shadow-xl">
      <div className="flex justify-end mb-2 text-gray-800">
        <Ellipsis size={22}></Ellipsis>
      </div>
      {images.length > 0 && <ImageGallery images={images}></ImageGallery>}
      <div>
        <div className="mb-2 text-gray-800">
          {timeCreated.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div>
          <h2 className="text-xl">{title}</h2>
          <p className="mb-5 mt-2">{body}</p>
        </div>
        <button
          className="py-2 px-3 text-white text-sm font-bold bg-green-600 hover:bg-green-700 rounded-lg"
          onClick={() => handleEdit(post)}
        >
          Edit Post
        </button>
        <button
          className="py-2 px-3 text-white text-sm font-bold bg-red-600 hover:bg-red-700 rounded-lg"
          onClick={() => deletePost(id)}
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}
