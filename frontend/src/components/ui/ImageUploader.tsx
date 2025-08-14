import type { Image } from "../../types/models";
import { type Dispatch, type SetStateAction, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploaderProps {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
}

export default function ImageUploader({
  images,
  setImages,
}: ImageUploaderProps) {
  const tempIDCounter = useRef(-1);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFiles = e.target?.files;

    if (!imageFiles) {
      return;
    }

    const newImages = Array.from(imageFiles).map((imageFile, index) => ({
      id: tempIDCounter.current--, // TEMP: This is broken. Please fix!
      url: URL.createObjectURL(imageFile),
      displayIndex: images.length + index,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDelete = (idToRemove: number) => {
    setImages((prevImages) => {
      return prevImages
        .filter((image) => image.id !== idToRemove) // Remove image with desired ID
        .map((image, index) => ({ ...image, displayIndex: index })); // Reindex images
    });
  };

  return (
    <div className="mb-2 flex gap-2 items-center overflow-x-scroll rounded-xl">
      {images?.map((image) => (
        <div className="relative flex-shrink-0">
          <img
            key={image.id}
            src={image.url}
            className="h-35 w-35 rounded-xl object-cover"
            loading="lazy"
          />
          <span className="flex gap-1 absolute top-2 right-2">
            {/* Image edit/modify button (temporarily disabled) */}
            {/* <button onClick={() => toast("You edited an image!")} type="button">
              <Edit2
                size={20}
                className="text-gray-800 rounded-full p-1 bg-white"
              />
            </button> */}
            <button
              onClick={() => handleDelete(image.id)}
              type="button"
              className="text-gray-800 rounded-full p-1 bg-white flex justify-center"
            >
              <X size={15} strokeWidth={2.5} />
            </button>
          </span>
        </div>
      ))}
      <div className="h-35 w-35 flex justify-center items-center rounded-xl border-gray-400 border-2 border-dashed flex-shrink-0">
        <label
          htmlFor="image-upload"
          className="rounded-full hover:bg-gray-100 active:bg-gray-200 p-2"
          data-tooltip-id="editor-tooltip"
          data-tooltip-content="Attach images"
        >
          <ImagePlus size={20} />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          hidden
        />
      </div>
    </div>
  );
}
