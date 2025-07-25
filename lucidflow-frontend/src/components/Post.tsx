import { type Post } from "../types/post";
import ImageGallery from "./ImageGallery";

interface PostProps {
  post: Post;
  onDelete: (id: number) => Promise<void>;
}

export default function Post({ post, onDelete: deletePost }: PostProps) {
  const { id, title, body, images, timeCreated } = post;

  return (
    <div className="border p-3 rounded-xl mb-5 shadow-xl">
      {images.length > 0 && <ImageGallery images={images}></ImageGallery>}
      <div>
        <div className="mb-3 text-gray-700">
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
          className="py-2 px-3 text-white text-sm font-bold bg-red-600 hover:bg-red-700 rounded-md"
          onClick={() => deletePost(id)}
        >
          Delete Post
        </button>
      </div>
    </div>
  );
}
