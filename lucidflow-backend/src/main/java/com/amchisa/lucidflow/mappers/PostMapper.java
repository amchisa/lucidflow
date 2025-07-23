package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.dtos.PostRequest;
import com.amchisa.lucidflow.entities.Post;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class PostMapper {
    public Post requestToEntity(PostRequest postRequest) {
        return Post.builder()
            .title(postRequest.getTitle())
            .body(postRequest.getBody())
            .images(new ArrayList<>())
            .build();
    }
}
