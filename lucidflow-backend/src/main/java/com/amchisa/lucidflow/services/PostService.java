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

import java.time.LocalDateTime;
import java.util.List;

@Service
@Validated
public class PostService {
    private final PostRepository postRepository;
    private final ImageService imageService;
    private final PostMapper postMapper;

    public PostService(PostRepository postRepository, ImageService imageService, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.imageService = imageService;
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

    @Transactional
    public Post createPost(PostRequest postRequest) {
        return postRepository.save(initializePost(postRequest));
    }

    /**
     * Creates posts in bulk from a list of postRequests.
     * This method will create new posts without overwriting existing ones,
     * which could lead to duplicates. Use with caution!
     */
    @Transactional
    public void createPosts(@Valid List<PostRequest> postRequests) {
        List<Post> posts = postRequests.stream()
            .map(this::initializePost)
            .toList();

        postRepository.saveAll(posts);
    }

    @Transactional
    public Post updatePost(Long id, PostRequest postRequest) {
        Post post = getPost(id);

        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());

        boolean imagesModified = imageService.updateImages(post, postRequest.getImages());

        if (imagesModified) { // Update timeModified if images have been modified (DB doesn't handle this)
            post.setTimeModified(LocalDateTime.now());
        }

        return postRepository.save(post);
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

    private Post initializePost(PostRequest postRequest) {
        Post post = postMapper.requestToEntity(postRequest);
        imageService.updateImages(post, postRequest.getImages());

        return post;
    }
}
