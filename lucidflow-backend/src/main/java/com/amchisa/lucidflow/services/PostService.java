package com.amchisa.lucidflow.services;

import com.amchisa.lucidflow.entities.Post;
import com.amchisa.lucidflow.exceptions.NotFoundException;
import com.amchisa.lucidflow.repositories.PostRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPostsSortedByMostRecent() {
        return postRepository.findAll(Sort.by(Sort.Order.desc("timeCreated")));
    }

    public List<Post> getAllPostsSortedByOldest() {
        return postRepository.findAll(Sort.by(Sort.Order.asc("timeCreated")));
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("The post with id %d was not found", id)));
    }

    public void createPost(@Valid Post post) {
        postRepository.save(post);
    }
}
