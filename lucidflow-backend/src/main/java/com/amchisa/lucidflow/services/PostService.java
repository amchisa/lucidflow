package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.api.models.requests.PostRequest;
import com.amchisa.lucidflow.data.entities.Post;
import com.amchisa.lucidflow.data.repositories.PostRepository;
import com.amchisa.lucidflow.mappers.PostMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
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

    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Post with id %d could not be found", id))
        );
    }

    public void createPost(PostRequest postRequest) {
        postRepository.save(postMapper.mapRequestToEntity(postRequest, new Post()));
    }

    /**
     * Creates posts in bulk from a list of postRequests.
     * This method will create new posts without overwriting existing ones,
     * which could lead to duplicates. Use with caution!
     */
    public void createPosts(List<PostRequest> postRequests) {
        List<Post> posts = postRequests
            .stream()
            .map(postRequest -> postMapper.mapRequestToEntity(postRequest, new Post()))
            .toList();

        postRepository.saveAll(posts);
    }

    public void updatePost(Long id, PostRequest postRequest) {
        postRepository.save(postMapper.mapRequestToEntity(postRequest, getPostById(id)));
    }

    public void deletePost(Long id) {
        postRepository.delete(getPostById(id));
    }

    /**
     * Deletes posts in bulk from a list of ids.
     */
    public void deletePosts(List<Long> ids) {
        postRepository.deleteAllById(ids);
    }
}
