package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.dtos.PostRequest;
import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.repositories.PostRepository;
import com.amchisa.lucidflow.mappers.PostMapper;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Validated
public class PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public PostService(PostRepository postRepository, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.postMapper = postMapper;
    }

    public long postCount() {
        return postRepository.count();
    }

    public Page<Post> getPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Post getPost(Long id) {
        return postRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Post with ID %d could not be found", id))
        );
    }

    public Post createPost(PostRequest postRequest) {
        return postRepository.save(postMapper.applyRequestToEntity(postRequest, new Post()));
    }

    /**
     * Creates posts in bulk from a list of postRequests.
     * This method will create new posts without overwriting existing ones,
     * which could lead to duplicates. Use with caution!
     */
    @Transactional
    public void createPosts(@Valid List<PostRequest> postRequests) {
        List<Post> posts = postRequests
            .stream()
            .map(postRequest -> postMapper.applyRequestToEntity(postRequest, new Post()))
            .toList();

        postRepository.saveAll(posts);
    }

    public Post updatePost(Long id, PostRequest postRequest) {
        return postRepository.save(postMapper.applyRequestToEntity(postRequest, getPost(id)));
    }

    public void deletePost(Long id) {
        postRepository.delete(getPost(id));
    }

    /**
     * Deletes posts in bulk from a list of ids.
     */
    @Transactional
    public void deletePosts(List<Long> ids) {
        if (ids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "List of IDs cannot be empty.");
        }

        ids.forEach(this::deletePost);
    }
}
