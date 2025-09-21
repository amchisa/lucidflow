package com.amchisa.lucidflow.service.image;

import com.amchisa.lucidflow.dto.request.ImageRequest;
import com.amchisa.lucidflow.exception.types.FileOperationException;
import com.amchisa.lucidflow.model.Image;
import com.amchisa.lucidflow.model.Post;
import com.amchisa.lucidflow.exception.types.InvalidFiletypeException;
import com.amchisa.lucidflow.mapper.ImageMapper;
import com.amchisa.lucidflow.service.file.FileService;
import com.amchisa.lucidflow.util.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private static final Path TEMP_IMAGE_UPLOAD_DIRECTORY = Path.of("images/temp");
    private static final Path IMAGE_UPLOAD_DIRECTORY = Path.of("images");
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    private final ImageMapper imageMapper;
    private final FileService fileService;
    private final long tempFileExpirationDuration;

    public ImageService(
        ImageMapper imageMapper,
        FileService fileService,
        @Value("${file.temp-expiration-time-ms:1800000}") long tempFileExpirationDuration // Default is 30 min
    ) {
        this.imageMapper = imageMapper;
        this.fileService = fileService;
        this.tempFileExpirationDuration = tempFileExpirationDuration;
    }

    public String uploadImage(MultipartFile file) {
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new InvalidFiletypeException("File uploaded is not an image.");
        }

        return fileService.uploadFile(file, TEMP_IMAGE_UPLOAD_DIRECTORY);
    }

    /**
     * Synchronizes the list of Image entities associated with a Post to that provided by a list of ImageRequests.
     * This method handles adding new images, updating existing ones, and removing missing ones.
     * @param post The Post entity whose images are to be synchronized.
     * @param imageRequests The list of incoming ImageRequest DTOs to synchronize with.
     * @return A boolean describing whether any modifications were made to the list of existing images.
     */
    @Transactional
    public boolean syncImages(Post post, List<ImageRequest> imageRequests) {
        List<Image> images = post.getImages();
        AtomicBoolean imagesModified = new AtomicBoolean(false);

        sortAndValidateDisplayIndices(imageRequests);

        Set<Long> imageRequestIDs = imageRequests.stream()
            .map(ImageRequest::getId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        // Remove images missing in request
        images.removeIf(image -> {
            if (!imageRequestIDs.contains(image.getId())) {
                imagesModified.set(true);
                fileService.deleteFile(IMAGE_UPLOAD_DIRECTORY.resolve(FileUtils.extractFilename(image.getUrl())));
                return true;
            }
            return false;
        });

        Map<Long, Image> existingImages = images.stream()
            .collect(Collectors.toMap(
                Image::getId,
                Function.identity()
            ));

        for (ImageRequest imageRequest : imageRequests) {
            Long imageRequestID = imageRequest.getId();

            if (imageRequestID != null && existingImages.containsKey(imageRequestID)) { // Update image
                boolean changesMade = imageMapper.updateEntityFromRequest(existingImages.get(imageRequestID), imageRequest);
                imagesModified.set(changesMade || imagesModified.get());
            }
            else { // Add image
                Image image = imageMapper.requestToEntity(imageRequest);
                String imageFilename = FileUtils.extractFilename(image.getUrl());

                Path tempPath = TEMP_IMAGE_UPLOAD_DIRECTORY.resolve(imageFilename);
                Path targetPath = IMAGE_UPLOAD_DIRECTORY.resolve(imageFilename);


                try {
                    // Try to move temp image file to permanent storage
                    fileService.moveFile(tempPath, targetPath);

                    // Update image url
                    image.setUrl(image.getUrl()
                        .replace(
                            // Replace backward slashes with forward slashes for cross-platform compatibility
                            TEMP_IMAGE_UPLOAD_DIRECTORY.toString().replace("\\", "/"),
                            IMAGE_UPLOAD_DIRECTORY.toString().replace("\\", "/")
                        )
                    );

                    post.addImage(image);
                    imagesModified.set(true);
                }
                catch (FileOperationException e) {
                    logger.warn("Invalid temp image url. Skipping image file persistence for: {}", imageFilename);
                }
            }
        }

        return imagesModified.get();
    }

    @Scheduled(fixedRateString = "${file.temp-cleanup-delay-ms:3600000}") // Default is 1 hour
    public void cleanupTempImages() {
        long now = System.currentTimeMillis();

        int deletedCount = fileService.cleanupFiles(TEMP_IMAGE_UPLOAD_DIRECTORY, filePath -> {
            try {
                long lastModified = Files.getLastModifiedTime(filePath).toMillis();
                return now - lastModified > this.tempFileExpirationDuration;
            } catch (IOException e) {
                logger.warn("Unable to read last modified time for file: {} " +
                    "while cleaning up expired image files. Skipped.",
                    filePath, e);
                return false;
            }
        });

        logger.info("Cleaned up {} expired image temp file(s) from {}.", deletedCount, TEMP_IMAGE_UPLOAD_DIRECTORY);
    }

    /**
     * Sorts a list of ImageRequest objects by their display index and validates that
     * the indices are contiguous, starting from 0. This method modifies the incoming
     * list by sorting it in ascending order of display indices, ensuring that images
     * provided in non-sequential order are correctly aligned before further processing.
     *
     * @param imageRequests The list of ImageRequest objects to sort and validate
     * @throws ResponseStatusException When indices are not sequential and contiguous
     */
    private void sortAndValidateDisplayIndices(List<ImageRequest> imageRequests) {
        // Explicitly sort the list by display index
        imageRequests.sort(Comparator.comparingInt(ImageRequest::getDisplayIndex));

        int expectedIndex = 0;

        for (ImageRequest imageRequest : imageRequests) {
            if (imageRequest.getDisplayIndex() != expectedIndex++) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Image display indices must be sequential and contiguous starting from 0"
                );
            }
        }
    }

}
