import type { Image } from "../types/models";

interface ImageGalleryProps {
  images: Image[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  return (
    <div className="rounded-lg bg-gray-100 p-4 h-70 mb-2 flex space-x-2">
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
