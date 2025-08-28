package com.amchisa.lucidflow.controller;

import com.amchisa.lucidflow.dto.post.PostFilterCriteria;
import com.amchisa.lucidflow.dto.post.PostRequest;
import com.amchisa.lucidflow.dto.post.PostResponse;
import com.amchisa.lucidflow.service.PostService;
import com.amchisa.lucidflow.validation.groups.Create;
import com.amchisa.lucidflow.validation.groups.Update;
import jakarta.validation.groups.Default;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
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

    @GetMapping
    public Page<PostResponse> getPosts(
        @ModelAttribute PostFilterCriteria filters,
        @PageableDefault(sort = {"createdAt", "id"}, direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return postService.getPosts(filters, pageable);
    }

    @GetMapping("/{id}")
    public PostResponse getPost(@PathVariable Long id) {
        return postService.getPost(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(@Validated({Create.class, Default.class}) @RequestBody PostRequest postRequest) {
        return postService.createPost(postRequest);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PostResponse updatePost(@PathVariable Long id, @Validated({Update.class, Default.class}) @RequestBody PostRequest postRequest) {
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
