import type { Image } from "../types/models";

interface ImageGalleryProps {
  images: Image[];
  className?: string;
}

export default function ImageGallery({ images, className }: ImageGalleryProps) {
  return (
    <div
      className={`rounded-lg bg-gray-100 p-4 h-70 flex space-x-2 ${className}`}
    >
      {images.map((image) => {
        const { id, url } = image;

        return (
          <div key={id} className="w-full h-full overflow-hidden rounded-lg">
            <img
              className="object-cover"
              src={url}
              alt="No alt text for this image."
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
}
