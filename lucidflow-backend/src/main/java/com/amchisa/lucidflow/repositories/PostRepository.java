package com.amchisa.lucidflow.repositories;

import com.amchisa.lucidflow.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {}
