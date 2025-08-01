import type { Image } from "../../types/models";

interface GalleryProps {
  images: Image[];
  className?: string;
}

export default function Gallery({ images, className }: GalleryProps) {
  return (
    <div
      className={`h-55 w-fit max-w-full flex flex-nowrap space-x-2 overflow-x-auto rounded-lg snap-x ${className}`}
    >
      {images.map((image) => (
        <img
          key={image.id}
          className=" overflow-hidden rounded-lg text-sm flex-shrink-0 object-contain h-full w-auto snap-start"
          src={image.url}
          alt="No alt text for this image."
          loading="lazy"
        />
      ))}
    </div>
  );
}
