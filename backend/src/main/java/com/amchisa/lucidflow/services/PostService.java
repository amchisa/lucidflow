package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.dtos.filters.PostFilter;
import com.amchisa.lucidflow.dtos.requests.PostRequest;
import com.amchisa.lucidflow.dtos.responses.PostResponse;
import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.repositories.PostRepository;
import com.amchisa.lucidflow.mappers.PostMapper;
import com.amchisa.lucidflow.specifications.PostSpecification;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final ImageService imageService;
    private final PostMapper postMapper;
    private final PostSpecification postSpecification;

    @PersistenceContext
    private final EntityManager entityManager;

    public PostService(
        PostRepository postRepository,
        ImageService imageService,
        PostMapper postMapper,
        PostSpecification postSpecification,
        EntityManager entityManager)
    {
        this.postRepository = postRepository;
        this.imageService = imageService;
        this.postMapper = postMapper;
        this.postSpecification = postSpecification;
        this.entityManager = entityManager;
    }

    public PostResponse getPost(Long id) {
        return postMapper.entityToResponse(findPostById(id));
    }

    /**
     * Retrieves all posts matching the criteria specified in the filters.
     * @param filters The filters to apply to the post query.
     * @param pageable The pageable containing pagination information.
     * @return A page of post responses corresponding to the queried posts.
     */
    public Page<PostResponse> getPosts(PostFilter filters, Pageable pageable) {
        Specification<Post> specification = postSpecification.withFilters(filters);
        return postRepository.findAll(specification, pageable).map(postMapper::entityToResponse);
    }

    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
        return postMapper.entityToResponse(postRepository.save(createPostEntity(postRequest)));
    }

    @Transactional
    public void createPosts(@Valid List<PostRequest> postRequests) {
        List<Post> posts = postRequests.stream()
            .map(this::createPostEntity)
            .toList();

        postRepository.saveAll(posts);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest postRequest) {
        Post updatedPost = postRepository.save(updatePostEntity(findPostById(id), postRequest));

        // Ensure the entity is synchronized with the database to prevent stale responses (bug fix)
        entityManager.flush();
        entityManager.refresh(updatedPost);

        return postMapper.entityToResponse(updatedPost);
    }

    public void deletePost(Long id) {
        postRepository.delete(findPostById(id));
    }

    @Transactional
    public void deletePosts(List<Long> ids) {
        if (ids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "List of IDs cannot be empty.");
        }

        ids.forEach(this::deletePost);
    }

    public long postCount() {
        return postRepository.count();
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Post with ID: %d could not be found", id))
        );
    }

    private Post createPostEntity(PostRequest postRequest) {
        Post post = postMapper.requestToEntity(postRequest);
        imageService.syncImages(post, postRequest.getImages());

        return post;
    }

    private Post updatePostEntity(Post post, PostRequest postRequest) {
        post.setTitle(postRequest.getTitle());
        post.setBody(postRequest.getBody());

        boolean imagesModified = imageService.syncImages(post, postRequest.getImages());

        if (imagesModified) { // Trigger modification timestamp update
           post.touch();
        }

        return post;
    }
}
