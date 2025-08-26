package com.amchisa.lucidflow.mapper;

import com.amchisa.lucidflow.dto.post.PostRequest;
import com.amchisa.lucidflow.dto.post.PostResponse;
import com.amchisa.lucidflow.model.Post;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

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
            .images(new ArrayList<>()) // Avoid null checks
            .build();
    }

    public PostResponse entityToResponse(Post post) {
        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getBody(),
            post.getImages().stream()
                .map(imageMapper::entityToResponse)
                .toList(),
            post.getTimeCreated().toString(),
            post.getTimeModified().toString()
        );
    }
}
