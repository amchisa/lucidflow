package com.amchisa.lucidflow.controllers;

import com.amchisa.lucidflow.dtos.PostRequest;
import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.services.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * Retrieves all posts sorted by newest first by default.
     * @param pageable Contains pagination (page, size) and sorting (sort, direction) information.
     * @return A Page object containing a list of posts and pagination metadata.
     */
    @GetMapping
    public Page<Post> getPosts(@PageableDefault(sort = "timeCreated", direction = Sort.Direction.DESC) Pageable pageable) {
        return postService.getPosts(pageable);
    }

    @GetMapping("/{id}")
    public Post getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Post createPost(@Valid @RequestBody PostRequest postRequest) {
        return postService.createPost(postRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Post updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest postRequest) {
        return postService.updatePost(id, postRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePosts(@RequestBody List<Long> ids) {
        postService.deletePosts(ids);
    }
}
