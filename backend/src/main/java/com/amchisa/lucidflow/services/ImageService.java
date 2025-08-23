package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.dtos.requests.ImageRequest;
import com.amchisa.lucidflow.entities.Image;
import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.exceptions.InvalidFiletypeException;
import com.amchisa.lucidflow.mappers.ImageMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private final ImageMapper imageMapper;
    private final FileService fileService;

    public ImageService(ImageMapper imageMapper, FileService fileService)  {
        this.imageMapper = imageMapper;
        this.fileService = fileService;
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

        // Ensure that images are indexed properly and contiguously
        validateRequestDisplayIndices(imageRequests);

        // Stage 1: Process existing images (delete and keep)
        Set<Long> incomingImageIDs = imageRequests.stream()
            .map(ImageRequest::getId) // Ids may be non-valid (safely ignored)
            .filter(Objects::nonNull) // Some image requests may not include ids
            .collect(Collectors.toSet());

        images.removeIf(image -> {
            if (!incomingImageIDs.contains(image.getId())) {
                deleteImageFile(image.getUrl());
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
            ));

        for (ImageRequest imageRequest : imageRequests) {
            Long imageID = imageRequest.getId();

            if (imageID != null && existingImages.containsKey(imageID)) { // Update image
                boolean changesMade = updateImageEntity(existingImages.get(imageID), imageRequest);
                imagesModified.set(changesMade || imagesModified.get());
            }
            else { // Add new image
                Image newImage = createImageEntity(imageRequest, post);
                post.getImages().add(newImage);

                imagesModified.set(true);
            }
        }

        return imagesModified.get();
    }

    public String uploadImageFile(MultipartFile file) {
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw new InvalidFiletypeException("File uploaded does not have type image.");
        }

        return fileService.uploadFile(file, "images");
    }

    private void deleteImageFile(String url) {
        fileService.deleteFile(fileService.parseFilename(url), "images");
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

    private Image createImageEntity(ImageRequest imageRequest, Post post) {
        Image image = imageMapper.requestToEntity(imageRequest);
        image.setPost(post);

        return image;
    }

    private boolean updateImageEntity(Image image, ImageRequest imageRequest) {
        boolean urlModified = !imageRequest.getUrl().equals(image.getUrl());

        if (urlModified) {
            deleteImageFile(image.getUrl());
        }

        boolean imagesModified = urlModified
            || !imageRequest.getDisplayIndex().equals(image.getDisplayIndex());

        image.setUrl(imageRequest.getUrl());
        image.setDisplayIndex(imageRequest.getDisplayIndex());

        return imagesModified;
    }
}
