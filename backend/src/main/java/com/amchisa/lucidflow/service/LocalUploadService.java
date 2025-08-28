package com.amchisa.lucidflow.service;

import com.amchisa.lucidflow.exception.types.FileOperationException;
import com.amchisa.lucidflow.exception.types.ForbiddenFileAccessException;
import com.amchisa.lucidflow.exception.types.InvalidFileOperationException;
import com.amchisa.lucidflow.exception.types.ResourceNotFoundException;
import com.amchisa.lucidflow.util.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalUploadService implements UploadService {
    private final Path absoluteBaseUploadPath;

    public LocalUploadService(@Value("${file.base-upload-path}") String baseUploadPath) {
        try {
            this.absoluteBaseUploadPath = Path.of(baseUploadPath).toAbsolutePath().normalize();
            Files.createDirectories(this.absoluteBaseUploadPath);
        } catch (IOException e) {
            throw new FileOperationException("Unable to create or locate base file upload directory.", e);
        }
    }

    @Override
    public String uploadFile(MultipartFile file, Path destinationPath) {
        if (file.isEmpty()) {
            throw new InvalidFileOperationException("Cannot upload an empty file.");
        }

        String normalizedFilename = FileUtils.normalizeFilename(file.getOriginalFilename());
        String uniqueFilename = UUID.randomUUID() + "_" + normalizedFilename;

        Path safeFilePath = getSafePath(
            destinationPath.resolve(uniqueFilename),
            "Cannot upload outside of the designated upload directory."
        );

        try {
            Files.createDirectories(safeFilePath.getParent());
            Files.copy(file.getInputStream(), safeFilePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileOperationException("Failed to upload file.", e);
        }

        return uniqueFilename;
    }

    @Override
    public void deleteFile(Path filePath) {
        Path safeFilePath = getSafePath(
            filePath,
            "Cannot delete files from an illegal location."
        );

        try {
            Files.deleteIfExists(safeFilePath);
        } catch (IOException e) {
            throw new FileOperationException("Failed to delete file.", e);
        }
    }

    @Override
    public void moveFile(Path sourcePath, Path destinationPath) {
        Path safeSourcePath = getSafePath(
            sourcePath,
            "Cannot move file from an illegal location."
        );

        Path safeDestinationPath = getSafePath(
            destinationPath,
            "Cannot move file to an illegal location."
        );

        try {
            Files.createDirectories(safeDestinationPath.getParent());
            Files.move(safeSourcePath, safeDestinationPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileOperationException("Failed to move file.", e);
        }
    }

    private Path getSafePath(Path path, String errorMessage) {
        Path safePath = this.absoluteBaseUploadPath.resolve(path).normalize();

        if (!safePath.startsWith(this.absoluteBaseUploadPath)) {
            throw new ForbiddenFileAccessException(errorMessage);
        }

        return safePath;
    }
}
