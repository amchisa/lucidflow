package com.amchisa.lucidflow.repositories;

import com.amchisa.lucidflow.entities.PostEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<PostEntity, Long> {

}
