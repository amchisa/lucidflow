package com.amchisa.lucidflow.repositories;

import com.amchisa.lucidflow.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    public Page<Post> findAllByTitleContainingIgnoreCase(String search, Pageable pageable);
}