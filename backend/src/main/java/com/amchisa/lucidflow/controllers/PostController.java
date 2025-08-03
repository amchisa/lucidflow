package com.amchisa.lucidflow.controllers;

import com.amchisa.lucidflow.dtos.requests.PostRequest;
import com.amchisa.lucidflow.dtos.responses.PostResponse;
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
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public Page<PostResponse> getPosts(
        @RequestParam(required = false) String search,
        @PageableDefault(sort = {"timeCreated", "id"}, direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return postService.getPosts(search, pageable);
    }

    @GetMapping("/{id}")
    public PostResponse getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(@Valid @RequestBody PostRequest postRequest) {
        return postService.createPost(postRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PostResponse updatePost(@PathVariable Long id, @Valid @RequestBody PostRequest postRequest) {
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
