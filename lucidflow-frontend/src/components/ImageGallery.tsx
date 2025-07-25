import { type Image as ImageType } from "../types/image";

interface CollageProps {
  images: ImageType[];
}

export default function ImageCollage({ images }: CollageProps) {
  return (
    <div className="rounded-t-xl bg-white pd-4">
      {images.map((image) => {
        const { id, url } = image;

        return (
          <img
            key={id}
            src={url}
            alt="No alt text for this image."
            loading="lazy"
          />
        );
      })}
    </div>
  );
}
