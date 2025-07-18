package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.api.payloads.requests.PostRequest;
import com.amchisa.lucidflow.data.entities.Post;
import com.amchisa.lucidflow.data.repositories.PostRepository;
import com.amchisa.lucidflow.mappers.PostMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public PostService(PostRepository postRepository, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.postMapper = postMapper;
    }

    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Post with id %d could not be found", id))
        );
    }

    public void createPost(@Valid PostRequest postRequest) {
        postRepository.save(postMapper.mapRequestToEntity(postRequest, new Post()));
    }

    public void updatePost(Long id, @Valid PostRequest postRequest) {
        postRepository.save(postMapper.mapRequestToEntity(postRequest, getPostById(id)));
    }

    public void deletePost(Long id) {
        postRepository.delete(getPostById(id));
    }
}
