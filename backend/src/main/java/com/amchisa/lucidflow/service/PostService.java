package com.amchisa.lucidflow.service;

import com.amchisa.lucidflow.dto.post.PostFilterCriteria;
import com.amchisa.lucidflow.dto.post.PostRequest;
import com.amchisa.lucidflow.dto.post.PostResponse;
import com.amchisa.lucidflow.exception.ResourceNotFoundException;
import com.amchisa.lucidflow.model.Post;
import com.amchisa.lucidflow.repository.PostRepository;
import com.amchisa.lucidflow.mapper.PostMapper;
import com.amchisa.lucidflow.repository.specification.PostSpecification;
import com.amchisa.lucidflow.validation.group.Create;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final ImageService imageService;
    private final PostMapper postMapper;
    private final PostSpecification postSpecification;

    public PostService(
        PostRepository postRepository,
        ImageService imageService,
        PostMapper postMapper,
        PostSpecification postSpecification
    ) {
        this.postRepository = postRepository;
        this.imageService = imageService;
        this.postMapper = postMapper;
        this.postSpecification = postSpecification;
    }

    public PostResponse getPost(Long id) {
        return postMapper.entityToResponse(findPostById(id));
    }

    public Page<PostResponse> getPosts(PostFilterCriteria filters, Pageable pageable) {
        Specification<Post> specification = postSpecification.withFilters(filters);
        return postRepository.findAll(specification, pageable).map(postMapper::entityToResponse);
    }

    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
        Post post = postMapper.requestToEntity(postRequest);
        imageService.syncImages(post, postRequest.getImages());
        return postMapper.entityToResponse(postRepository.save(post));
    }

    @Transactional
    public void createPosts(@Validated(Create.class) List<PostRequest> postRequests) {
        List<Post> posts = postRequests.stream()
            .map(postRequest -> {
                Post post = postMapper.requestToEntity(postRequest);
                imageService.syncImages(post, postRequest.getImages());
                return post;
            })
            .toList();

        postRepository.saveAll(posts);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest postRequest) {
        Post post = findPostById(id);

        postMapper.updateEntityFromRequest(post, postRequest);

        if (postRequest.getImages() != null) {
            boolean imageChangesMade = imageService.syncImages(post, postRequest.getImages());

            if (imageChangesMade) {
                post.touch();
            }
        }

        return postMapper.entityToResponse(postRepository.saveAndFlush(post));
    }

    public void deletePost(Long id) {
        postRepository.delete(findPostById(id));
    }

    @Transactional
    public void deletePosts(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("List of IDs cannot be null or empty.");
        }

        List<Post> postsToDelete = ids.stream()
            .map(this::findPostById)
            .toList();

        postRepository.deleteAll(postsToDelete);
    }

    public long postCount() {
        return postRepository.count();
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() ->
            new ResourceNotFoundException("Post with ID: " + id + " could not be found.")
        );
    }
}
