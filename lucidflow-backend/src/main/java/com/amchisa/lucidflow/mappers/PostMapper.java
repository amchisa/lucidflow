package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.dtos.ImageRequest;
import com.amchisa.lucidflow.dtos.PostRequest;
import com.amchisa.lucidflow.entities.Image;
import com.amchisa.lucidflow.entities.Post;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PostMapper {
    private final ImageMapper imageMapper;

    public PostMapper(ImageMapper imageMapper) {
        this.imageMapper = imageMapper;
    }

    public Post mapRequestToEntity(PostRequest postRequest, Post post) {
        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());

        List<Image> images = post.getImages();
        List<ImageRequest> imageRequests = postRequest.getImages();
        List<Image> previousImages = images.stream() // Deep copy
            .map(image -> new Image(
                image.getId(),
                image.getPost(),
                image.getUrl(),
                image.getDisplayIndex()
            ))
            .toList();

        // Ensure that images are indexed properly and contiguously
        normalizeImageRequestDisplayIndices(imageRequests);

        // Stage 1: Process existing images (delete and keep)
        Set<Long> incomingImageIds = imageRequests.stream()
            .map(ImageRequest::getId) // Ids may be non-valid (safely ignored)
            .filter(Objects::nonNull) // Some image requests may not include ids
            .collect(Collectors.toSet());

        images.removeIf(image -> !incomingImageIds.contains(image.getId()));

        // Stage 2: Process incoming images (update and add)
        Map<Long, Image> existingImages = images.stream()
            .collect(Collectors.toMap(
                Image::getId,
                Function.identity()
            ));

        for (ImageRequest imageRequest : imageRequests) {
            Long imageRequestId = imageRequest.getId();

            if (imageRequestId != null && existingImages.containsKey(imageRequestId)) { // Update existing image
                imageMapper.mapRequestToEntity(imageRequest, existingImages.get(imageRequestId));
            }
            else { // Add new image
                Image image = imageMapper.mapRequestToEntity(imageRequest, new Image());
                image.setPost(post);
                images.add(image);
            }
        }

        if (!previousImages.equals(images)) { // Update timeModified if images are altered (DB doesn't handle this)
            post.setTimeModified(LocalDateTime.now());
        }

        return post;
    }

    /**
     * Fixes/normalizes non-contiguous display indices provided by the client.
     * Keeps the relative display order of images intact before reindexing the images
     * from 0 up to n-1 (n being the number of images present).
     */
    private void normalizeImageRequestDisplayIndices(List<ImageRequest> imageRequests) {
        imageRequests.sort(Comparator.comparingInt(ImageRequest::getDisplayIndex));

        int index = 0;
        for (ImageRequest image : imageRequests) {
            image.setDisplayIndex(index++);
        }
    }
}
