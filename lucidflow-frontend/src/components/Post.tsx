import { type Post } from "../types/post";
import ImageCollage from "./ImageCollage";

interface PostProps {
  post: Post;
  onDelete: (id: number) => Promise<void>;
}

export default function Post({ post, onDelete: deletePost }: PostProps) {
  const { id, title, body, images, timeCreated } = post;

  return (
    <article className="border p-3 rounded-xl shadow-xl">
      {images.length > 0 && <ImageCollage images={images}></ImageCollage>}
      <time className="block mb-3">
        {timeCreated.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}{" "}
        at {timeCreated.toLocaleTimeString()}
      </time>
      <div>
        <h2 className="text-xl">{title}</h2>
        <p className="mb-5 mt-2">{body}</p>
      </div>
      <button
        className="py-0.5 px-3 text-white text-sm font-bold bg-red-600 hover:bg-red-700 rounded-md"
        onClick={() => deletePost(id)}
      >
        Delete Post
      </button>
    </article>
  );
}
