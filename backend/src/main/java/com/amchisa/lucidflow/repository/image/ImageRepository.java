package com.amchisa.lucidflow.repository.image;

import com.amchisa.lucidflow.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByPostIdIsNull();
}
