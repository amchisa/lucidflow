import type { Image } from "../../../types/models.types";

interface ImageGalleryProps {
  images: Image[];
  className?: string;
}

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  return (
    <div
      className={`flex h-55 w-fit max-w-full snap-x flex-nowrap space-x-2 overflow-x-auto rounded-lg ${className}`}
    >
      {images.map((image) => (
        <img
          key={image.id}
          className="h-full w-auto flex-shrink-0 snap-start overflow-hidden rounded-lg object-contain text-sm"
          src={image.url}
          alt="No alt text for this image."
          loading="lazy"
        />
      ))}
    </div>
  );
}
