import type { Image } from "../../types/models.types";

interface ImageModalProps {
  image: Image | null;
  onClose: () => void;
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      {image && (
        <img
          src={image.url}
          onClick={(e) => e.stopPropagation()}
          loading="lazy"
          className="max-h-150"
        ></img>
      )}
    </div>
  );
}
