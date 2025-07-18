package com.amchisa.lucidflow.data.repositories;

import com.amchisa.lucidflow.data.entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {}