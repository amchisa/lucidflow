package com.amchisa.lucidflow.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.nio.file.Path;

public interface UploadService {
    /**
     * Uploads a file to a specified destination.
     *
     * @param file The multipart file to be uploaded.
     * @param destinationPath The path where the file will be stored, relative to the base upload directory.
     * @return The unique filename of the stored file.
     */
    String uploadFile(MultipartFile file, Path destinationPath);

    /**
     * Deletes a file from the storage system.
     *
     * @param filePath The path of the file to be deleted, relative to the base upload directory.
     */
    void deleteFile(Path filePath);

    /**
     * Moves a file from one location to another within the storage system.
     *
     * @param sourcePath The original path of the file to be moved, relative to the base directory.
     * @param destinationPath The new path for the file, relative to the base directory.
     */
    void moveFile(Path sourcePath, Path destinationPath);
}