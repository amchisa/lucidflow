import { type Image as ImageType } from "../types/image";

interface ImageCollageProps {
  images: ImageType[];
}

export default function ImageCollage({ images }: ImageCollageProps) {
  return (
    <div className="rounded-t-xl bg-white pd-4">
      {images.map((image) => {
        const { id, url } = image;

        return <img key={id} src={url} alt={url} loading="lazy" />;
      })}
    </div>
  );
}
