package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.dtos.requests.ImageRequest;
import com.amchisa.lucidflow.entities.Image;
import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.mappers.ImageMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ImageService {
    private final ImageMapper imageMapper;

    public ImageService(ImageMapper imageMapper)  {
        this.imageMapper = imageMapper;
    }

    /**
     * Updates the list of Image entities associated with a Post to that provided by a list of ImageRequests.
     * This method handles adding new images, updating existing ones, and removing missing ones.
     *
     * @param post The Post entity whose images are to be synchronized.
     * @param imageRequests The list of incoming ImageRequest DTOs.
     * @return A boolean describing whether any modifications were made to the list of existing images.
     */
    @Transactional
    public boolean updateImages(Post post, List<ImageRequest> imageRequests) {
        List<Image> images = post.getImages();
        AtomicBoolean imagesModified = new AtomicBoolean(false);

        // Ensure that images are indexed properly and contiguously
        validateDisplayIndices(imageRequests);

        // Stage 1: Process existing images (delete and keep)
        Set<Long> incomingImageIDs = imageRequests.stream()
            .map(ImageRequest::getId) // Ids may be non-valid (safely ignored)
            .filter(Objects::nonNull) // Some image requests may not include ids
            .collect(Collectors.toSet());

        images.removeIf(image -> {
            if (!incomingImageIDs.contains(image.getId())) {
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
                imagesModified.set(updateImageFromRequest(existingImages.get(imageID), imageRequest) || imagesModified.get());
            }
            else { // Add image
                addImageToPost(post, imageMapper.requestToEntity(imageRequest));
                imagesModified.set(true);
            }
        }

        return imagesModified.get();
    }

    /**
     * Validates that the display indices in a list of ImageRequest objects
     * are contiguous, starting from 0. Sorts incoming ImageRequests by their display index
     * to allow for non-sequential ordering when making an API request.
     *
     * @param imageRequests The list of ImageRequest objects to validate.
     * @throws ResponseStatusException if indices are not sequential and contiguous.
     */
    private void validateDisplayIndices(List<ImageRequest> imageRequests) {
        // Sort image requests to accommodate for requests with an unordered list of images
        imageRequests.sort(Comparator.comparingInt(ImageRequest::getDisplayIndex));

        int index = 0;

        for (ImageRequest imageRequest : imageRequests) {
            if (imageRequest.getDisplayIndex() != index++) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image display indices must be sequential and contiguous starting from 0");
            }
        }
    }

    private void addImageToPost(Post post, Image image) {
        image.setPost(post);
        post.getImages().add(image);
    }

    private boolean updateImageFromRequest(Image image, ImageRequest imageRequest) {
        boolean imagesModified = !imageRequest.getUrl().equals(image.getUrl())
                || !imageRequest.getDisplayIndex().equals(image.getDisplayIndex());

        image.setUrl(imageRequest.getUrl());
        image.setDisplayIndex(imageRequest.getDisplayIndex());

        return imagesModified;
    }
}
