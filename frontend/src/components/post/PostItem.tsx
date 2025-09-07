import type { Post } from "../../types/models";
import DropdownMenu from "../ui/DropdownMenu";
import ImageGallery from "./ImageGallery";
import { Ellipsis, Edit2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
  className?: string;
}

const MAX_UNTRUNCATED_LINES = 10;

export default function PostItem({
  post,
  onEdit: handleEdit,
  onDelete: handleDelete,
}: PostItemProps) {
  const { id, title, body, images, createdAt } = post;

  const [truncateBody, setTruncateBody] = useState<boolean>(true);
  const [isBodyOverflowing, setIsBodyOverflowing] = useState<boolean>(false);

  const postContainerRef = useRef<HTMLDivElement>(null!);
  const bodyContainerRef = useRef<HTMLDivElement>(null!);

  const formattedDateTimeCreated = createdAt // e.g., Monday, July 28, 2025 at 2:26 pm
    .toLocaleString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(/\.m\./gi, "m"); // Remove dots from a.m. and p.m.

  const handleDeleteWithConfirmation = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
    );

    if (!confirmDelete) {
      return; // User does not wish to delete the post
    }

    await handleDelete(id); // User does wish to delete the post
  };

  const handleToggleTruncate = () => {
    if (!truncateBody) {
      // Body is being collapsed, scroll post into view for a better UX
      postContainerRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }

    setTruncateBody((prev) => !prev);
  };

  // Determine whether to show the see more/less button
  useEffect(() => {
    const element = bodyContainerRef.current;

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const truncatedHeight = lineHeight * MAX_UNTRUNCATED_LINES;

    element.style.setProperty("--truncated-height", `${truncatedHeight}px`);

    setIsBodyOverflowing(element.scrollHeight > truncatedHeight);
  }, []);

  return (
    <article
      ref={postContainerRef}
      className="mb-5 scroll-mt-30 rounded-xl border border-gray-300 bg-white p-3 shadow-lg"
    >
      <div className="mb-1.5 flex justify-between">
        <span className="text-sm text-gray-800">
          {formattedDateTimeCreated}
        </span>
        <DropdownMenu
          triggerIcon={<Ellipsis size={24} className="text-gray-800" />}
        >
          <ul className="flex flex-col text-gray-800">
            <li>
              <button
                className="flex w-full gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-green-600 hover:text-white active:bg-green-700"
                onClick={() => handleEdit(post)}
              >
                <Edit2 size={20} />
                <span>Edit Post</span>
              </button>
            </li>
            <li>
              <button
                className="flex w-full gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-red-600 hover:text-white active:bg-red-700"
                onClick={handleDeleteWithConfirmation}
              >
                <Trash2 size={20} />
                <span>Delete Post</span>
              </button>
            </li>
          </ul>
        </DropdownMenu>
      </div>
      {images.length > 0 && <ImageGallery className="mb-2" images={images} />}
      <div>
        <h2 className="mb-3 truncate text-lg font-bold">{title}</h2>
        <div
          ref={bodyContainerRef}
          className={`rich-text whitespace-pre-wrap ${isBodyOverflowing && truncateBody ? `truncate-content line-clamp-10` : ""}`}
          dangerouslySetInnerHTML={{ __html: body }}
        ></div>
        {isBodyOverflowing && (
          <button
            className="mt-2 text-sm text-gray-800 hover:underline"
            onClick={handleToggleTruncate}
          >
            {truncateBody ? "Show more" : "Show less"}
          </button>
        )}
      </div>
    </article>
  );
}
