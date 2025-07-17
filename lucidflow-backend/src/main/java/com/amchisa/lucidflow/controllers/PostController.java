package com.amchisa.lucidflow.controllers;

import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.services.PostService;
import jakarta.validation.Valid;
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
    public List<Post> getAllPostsSortedByMostRecent() {
        return postService.getAllPostsSortedByMostRecent();
    }

    @GetMapping("/oldest")
    public List<Post> getAllPostsSortedByOldest() {
        return postService.getAllPostsSortedByOldest();
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@Valid @RequestBody Post post) {
        postService.createPost(post);
    }
}
