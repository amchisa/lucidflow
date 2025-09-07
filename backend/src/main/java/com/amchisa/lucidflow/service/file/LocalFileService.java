package com.amchisa.lucidflow.service.file;

import com.amchisa.lucidflow.exception.types.FileOperationException;
import com.amchisa.lucidflow.exception.types.ForbiddenFileAccessException;
import com.amchisa.lucidflow.exception.types.InvalidFileOperationException;
import com.amchisa.lucidflow.util.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Predicate;
import java.util.stream.Stream;

@Service
public class LocalFileService implements FileService {
    private final Path baseUploadPath;

    public LocalFileService(@Value("${file.base-upload-path}") String baseUploadPath) {
        try {
            this.baseUploadPath = Path.of(baseUploadPath).toAbsolutePath().normalize();
            Files.createDirectories(this.baseUploadPath);
        } catch (IOException e) {
            throw new FileOperationException("Unable to create or locate base file upload directory.", e);
        }
    }

    @Override
    public String uploadFile(MultipartFile file, Path uploadLocation) {
        if (file.isEmpty()) {
            throw new InvalidFileOperationException("Cannot upload an empty file.");
        }

        String normalizedFilename = FileUtils.normalizeFilename(file.getOriginalFilename());

        String shortUUID = UUID.randomUUID().toString().substring(0, 8);
        String uniqueFilename = shortUUID + "_" + normalizedFilename;

        Path safeDestination = getSafePath(
            uploadLocation.resolve(uniqueFilename),
            "Cannot upload outside of the designated upload directory."
        );

        try {
            Files.createDirectories(safeDestination.getParent());
            Files.copy(file.getInputStream(), safeDestination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileOperationException("Failed to upload file.", e);
        }

        return uniqueFilename;
    }

    @Override
    public void deleteFile(Path filePath) {
        Path safeSource = getSafePath(
            filePath,
            "Cannot delete files from an illegal location."
        );

        try {
            Files.deleteIfExists(safeSource);
        } catch (IOException e) {
            throw new FileOperationException("Failed to delete file.", e);
        }
    }

    @Override
    public void moveFile(Path sourcePath, Path targetPath) {
        Path safeSource = getSafePath(
            sourcePath,
            "Cannot move file from an illegal location."
        );

        Path safeDestination = getSafePath(
            targetPath,
            "Cannot move file to an illegal location."
        );

        try {
            Files.createDirectories(safeDestination.getParent());
            Files.move(safeSource, safeDestination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileOperationException("Failed to move file.", e);
        }
    }

    @Override
    public int cleanupFiles(Path targetDirectory, Predicate<Path> filter) {
        Path safeTargetDirectory = getSafePath(
            targetDirectory,
            "Cannot clean files outside of the upload directory.");

        if (!Files.exists(safeTargetDirectory)) {
            return 0; // Nothing to clean
        }

        AtomicInteger deletedCount = new AtomicInteger(0);

        try (Stream<Path> files = Files.list(safeTargetDirectory)) {
            files.filter(Files::isRegularFile) // Skip directories or symbolic links
                .filter(filter)
                .forEach(file -> {
                    deleteFile(file);
                    deletedCount.incrementAndGet();
                });
        } catch (IOException e) {
            throw new FileOperationException("Failed to access files in directory: " + safeTargetDirectory, e);
        }

        return deletedCount.get();
    }

    private Path getSafePath(Path path, String errorMessage) {
        Path safePath = this.baseUploadPath.resolve(path).normalize();

        if (!safePath.startsWith(this.baseUploadPath)) {
            throw new ForbiddenFileAccessException(errorMessage);
        }

        return safePath;
    }
}
