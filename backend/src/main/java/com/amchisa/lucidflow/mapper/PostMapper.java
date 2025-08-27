package com.amchisa.lucidflow.mapper;

import com.amchisa.lucidflow.dto.post.PostRequest;
import com.amchisa.lucidflow.dto.post.PostResponse;
import com.amchisa.lucidflow.model.Image;
import com.amchisa.lucidflow.model.Post;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;

@Component
public class PostMapper {
    private final ImageMapper imageMapper;

    public PostMapper(ImageMapper imageMapper) {
        this.imageMapper = imageMapper;
    }

    public Post requestToEntity(PostRequest postRequest) {
        return Post.builder()
            .title(postRequest.getTitle())
            .body(postRequest.getBody())
            .images(new ArrayList<>()) // Images must be handled separately
            .build();
    }

    public PostResponse entityToResponse(Post post) {
        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getBody(),
            post.getImages().stream()
                .sorted(Comparator.comparingInt(Image::getDisplayIndex))
                .map(imageMapper::entityToResponse)
                .toList(),
            // Round instead of truncate timestamps to match DB behavior
            post.getCreatedAt().plus(500, ChronoUnit.MICROS).truncatedTo(ChronoUnit.MILLIS),
            post.getLastModifiedAt().plus(500, ChronoUnit.MICROS).truncatedTo(ChronoUnit.MILLIS)
        );
    }

    public void updateEntityFromRequest(Post post, PostRequest postRequest) {
        if (postRequest.getTitle() != null) {
            post.setTitle(postRequest.getTitle());
        }

        if (postRequest.getBody() != null) {
            post.setBody(postRequest.getBody());
        }
    }
}
