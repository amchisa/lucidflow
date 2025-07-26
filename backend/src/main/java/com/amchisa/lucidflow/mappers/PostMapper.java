package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.dtos.requests.PostRequest;
import com.amchisa.lucidflow.dtos.responses.PostResponse;
import com.amchisa.lucidflow.entities.Post;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
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
            .images(new ArrayList<>())
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
