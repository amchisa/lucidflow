import type { Image } from "../../types/models";
import { type Dispatch, type SetStateAction, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { imageService } from "../../api/services/imageService";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

interface ImageUploaderProps {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
  onClickImage: (image: Image) => void;
}

export default function ImageUploader({
  images,
  setImages,
  onClickImage,
}: ImageUploaderProps) {
  const tempIDCounter = useRef(-1);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFiles = e.target?.files;

    if (!imageFiles) {
      return;
    }

    // Display preview images immediately
    const previewImages = Array.from(imageFiles).map((imageFile, index) => ({
      id: tempIDCounter.current--,
      url: URL.createObjectURL(imageFile),
      displayIndex: images.length + index,
      uploading: true,
    }));

    setImages((prevImages) => [...prevImages, ...previewImages]);

    // Upload image files and replace previews with uploaded API images
    try {
      await Promise.all(
        Array.from(imageFiles).map(async (imageFile, index) => {
          const url = await imageService.upload(imageFile);
          setImages((prevImages) =>
            prevImages.map((image) =>
              image.id === previewImages[index].id
                ? { ...image, url, uploading: false }
                : image,
            ),
          );

          // Garbage collect preview URL
          URL.revokeObjectURL(previewImages[index].url);
        }),
      );
    } catch (err) {
      console.error("Error uploading image(s): ", err);
      toast.error("Error uploading image(s)");
    }
  };

  const handleDelete = (idToRemove: number) => {
    setImages((prevImages) => {
      return prevImages
        .filter((image) => image.id !== idToRemove) // Remove image with desired ID
        .map((image, index) => ({ ...image, displayIndex: index })); // Reindex images
    });
  };

  return (
    <div className="mb-2 flex items-center gap-2 overflow-x-scroll rounded-xl">
      {images?.map((image) => (
        <div
          className="relative h-35 w-35 flex-shrink-0 overflow-hidden rounded-xl"
          key={image.id}
        >
          <img
            src={image.url}
            className="h-full w-full object-cover"
            loading="lazy"
            onClick={() => onClickImage(image)}
          />
          {image?.uploading ? (
            <div className="absolute inset-0 z-35 flex items-center justify-center bg-black/50">
              <LoadingSpinner size={20} className="text-white" />
            </div>
          ) : (
            <span className="absolute top-2 right-2 flex gap-1">
              {/* <button onClick={() => toast("You edited an image!")} type="button">
              <Edit2
                size={20}
                className="text-gray-800 rounded-full p-1 bg-white"
              />
            </button> */}
              <button
                onClick={() => handleDelete(image.id)}
                type="button"
                className="flex justify-center rounded-full bg-white p-1 text-gray-800"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            </span>
          )}
        </div>
      ))}
      <div className="flex h-35 w-35 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-400">
        <label
          htmlFor="image-upload"
          className="rounded-full p-2 hover:bg-gray-100 active:bg-gray-200"
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
