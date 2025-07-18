package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.api.payloads.requests.PostRequest;
import com.amchisa.lucidflow.data.entities.Image;
import com.amchisa.lucidflow.data.entities.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {
    private final ImageMapper imageMapper;

    public PostMapper(ImageMapper imageMapper) {
        this.imageMapper = imageMapper;
    }

    public Post mapRequestToEntity(PostRequest postRequest, Post post) {
        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());
        post.setImages(postRequest.getImages() // Temporary (implement properly later)
            .stream()
            .map(imageRequest -> {
                Image image = imageMapper.mapRequestToEntity(imageRequest, new Image());
                image.setPost(post);
                return image;
            })
            .toList()
        );

        return post;
    }
}
