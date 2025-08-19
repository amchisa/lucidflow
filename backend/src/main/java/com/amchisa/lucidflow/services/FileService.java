package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.exceptions.FileOperationException;
import com.amchisa.lucidflow.exceptions.InvalidFilenameException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileService {
    private final Path uploadPath;

    public FileService(@Value("${file.upload.base-dir}") String uploadDirectory) {
        this.uploadPath = Path.of(uploadDirectory).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new InvalidFilenameException("Unable to create/find file upload directory.", e);
        }
    }

    public String uploadFile(MultipartFile file, String subdirectory) {
        String sanitizedFilename = sanitizeFilename(file.getOriginalFilename());
        String uniqueFilename = UUID.randomUUID() + "_" + sanitizedFilename;

        try {
            // Create/find subdirectory
            Path targetDirectory = this.uploadPath.resolve(subdirectory).normalize();
            Files.createDirectories(targetDirectory);

            // Copy file to target path
            Path targetPath = targetDirectory.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetPath);
        }
        catch (IOException e) {
            throw new FileOperationException("File failed to upload.", e);
        }

        return uniqueFilename;
    }

    public void deleteFile(String filename, String subdirectory) {
        try {
            Path filePath = uploadPath.resolve(subdirectory).resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileOperationException("File failed to delete.", e);
        }
    }

    private static String sanitizeFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            throw new InvalidFilenameException("Filename cannot be blank or null.");
        }

        String sanitizedFilename = filename
            .replaceAll("[^a-zA-Z0-9._\\-]", "_") // Replace any forbidden symbols with underscores
            .replace("..", ""); // Prevent directory traversal attacks by eliminating relative paths

        if (sanitizedFilename.isBlank()) {
            throw new InvalidFilenameException("Filename cannot be blank after sanitization.");
        }

        return sanitizedFilename;
    }
}
