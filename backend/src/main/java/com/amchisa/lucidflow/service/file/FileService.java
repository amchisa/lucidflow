package com.amchisa.lucidflow.service.file;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.function.Predicate;

public interface FileService {
    /**
     * Uploads a file to a specified destination.
     *
     * @param file The multipart file to be uploaded.
     * @param uploadLocation The path where the file will be stored, relative to the base upload directory.
     * @return The unique filename of the stored file.
     */
    String uploadFile(MultipartFile file, Path uploadLocation);

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
     * @param targetPath The new path for the file, relative to the base directory.
     */
    void moveFile(Path sourcePath, Path targetPath);

    /**
     * Deletes files in a directory based on the provided filter.
     *
     * @param targetDirectory The directory to clean.
     * @param filter A predicate that returns true for files to delete.
     * @return The number of files successfully deleted.
     */
    int cleanupFiles(Path targetDirectory, Predicate<Path> filter);
}