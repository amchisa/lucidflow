import { api } from "../client/axios";

/**
 * API service to handle image uploads.
 */
export const imageService = {
  /**
   * Uploads an image file to the API.
   * @param imageFile The image file to upload.
   * @returns A promise that resolves to the URL string of the uploaded image.
   */
  async upload(imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await api.post("/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Override default content type
      },
    });
    return response.data;
  },
};
