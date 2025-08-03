package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.dtos.requests.PostRequest;
import com.amchisa.lucidflow.dtos.responses.PostResponse;
import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.repositories.PostRepository;
import com.amchisa.lucidflow.mappers.PostMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Validated
public class PostService {
    private final PostRepository postRepository;
    private final ImageService imageService;
    private final PostMapper postMapper;

    @PersistenceContext
    private final EntityManager entityManager;

    public PostService(PostRepository postRepository, ImageService imageService, PostMapper postMapper, EntityManager entityManager) {
        this.postRepository = postRepository;
        this.imageService = imageService;
        this.postMapper = postMapper;
        this.entityManager = entityManager;
    }

    public long postCount() {
        return postRepository.count();
    }

    public Page<PostResponse> getPosts(String search, Pageable pageable) {
        if (search == null || search.isBlank()) {
            return postRepository.findAll(pageable).map(postMapper::entityToResponse);
        }

        return postRepository.findAllByTitleContainingIgnoreCase(search, pageable).map(postMapper::entityToResponse);
    }

    public PostResponse getPost(Long id) {
        return postMapper.entityToResponse(findPostById(id));
    }

    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
        return postMapper.entityToResponse(postRepository.save(createPostEntity(postRequest)));
    }

    /**
     * Creates posts in bulk from a list of postRequests.
     * This method will create new posts without overwriting existing ones,
     * which could lead to duplicates. Use with caution!
     */
    @Transactional
    public void createPosts(@Valid List<PostRequest> postRequests) {
        List<Post> posts = postRequests.stream()
            .map(this::createPostEntity)
            .toList();

        postRepository.saveAll(posts);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest postRequest) {
        Post updatedPost = updatePostEntity(findPostById(id), postRequest);
        postRepository.save(updatedPost);

        // Ensure the entity is synchronized with the database to prevent stale responses
        entityManager.flush();
        entityManager.refresh(updatedPost);

        return postMapper.entityToResponse(updatedPost);
    }

    public void deletePost(Long id) {
        postRepository.delete(findPostById(id));
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

    private Post createPostEntity(PostRequest postRequest) {
        Post post = postMapper.requestToEntity(postRequest);
        imageService.synchronizeImages(post, postRequest.getImages());

        return post;
    }

    private Post updatePostEntity(Post post, PostRequest postRequest) {
        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());

        boolean imagesModified = imageService.synchronizeImages(post, postRequest.getImages());

        if (imagesModified) { // Update timeModified (DB doesn't handle this)
            post.setTimeModified(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS)); // Truncate to 6 decimal places to match DB
        }

        return post;
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Post with ID %d could not be found", id))
        );
    }
}
