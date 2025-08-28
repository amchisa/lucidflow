package com.amchisa.lucidflow.service;

import com.amchisa.lucidflow.dto.image.ImageRequest;
import com.amchisa.lucidflow.model.Image;
import com.amchisa.lucidflow.model.Post;
import com.amchisa.lucidflow.exception.types.InvalidFiletypeException;
import com.amchisa.lucidflow.mapper.ImageMapper;
import com.amchisa.lucidflow.repository.image.ImageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    private final LocalUploadService uploadService;

    public ImageService(
        ImageMapper imageMapper,
        ImageRepository imageRepository,
        LocalUploadService fileService
    ) {
        this.imageMapper = imageMapper;
        this.imageRepository = imageRepository;
        this.uploadService = fileService;
    }

    public String uploadImage(MultipartFile file) {
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new InvalidFiletypeException("File uploaded is not an image.");
        }

        return uploadService.uploadFile(file, Path.of("images/temp"));
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

        validateRequestDisplayIndices(imageRequests);

        Set<Long> requestIds = imageRequests.stream()
            .map(ImageRequest::getId)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

        images.removeIf(image -> {
            if (!requestIds.contains(image.getId())) {
                imagesModified.set(true);
                return true;
            }
            return false;
        });

        // Stage 2: Process incoming images (update and add)
        Map<Long, Image> existingImages = images.stream()
            .collect(Collectors.toMap(
                Image::getId,
                Function.identity()
            )
        );

        for (ImageRequest imageRequest : imageRequests) {
            Long imageId = imageRequest.getId();

            if (imageId != null && existingImages.containsKey(imageId)) { // Update image
                boolean changesMade = imageMapper.updateEntityFromRequest(existingImages.get(imageId), imageRequest);

                imagesModified.set(changesMade || imagesModified.get());
            }
            else { // Add new image
                Image image = imageMapper.requestToEntity(imageRequest);
                post.addImage(image);

                imagesModified.set(true);
            }
        }

        return imagesModified.get();
    }

    @Scheduled(fixedRate = 60000)
    public void cleanupOrphanedImages() {
        List<Image> orphanedImages = imageRepository.findByPostIdIsNull();

        orphanedImages.forEach(image -> {
            uploadService.deleteFile(Paths.get(image.getUrl()));
            imageRepository.deleteById(image.getId());
        });
    }

    /**
     * Validates that the display indices in a list of ImageRequest objects
     * are contiguous, starting from 0. Sorts incoming ImageRequests by their display index
     * to allow for non-sequential ordering when making an API request.
     * @param imageRequests The list of ImageRequest objects to validate.
     * @throws ResponseStatusException if indices are not sequential and contiguous.
     */
    private void validateRequestDisplayIndices(List<ImageRequest> imageRequests) {
        // Sort image requests to accommodate for requests with an unordered list of images
        imageRequests.sort(Comparator.comparingInt(ImageRequest::getDisplayIndex));

        int index = 0;

        for (ImageRequest imageRequest : imageRequests) {
            if (imageRequest.getDisplayIndex() != index++) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image display indices must be sequential and contiguous starting from 0");
            }
        }
    }
}
