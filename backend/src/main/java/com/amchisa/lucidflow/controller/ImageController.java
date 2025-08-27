package com.amchisa.lucidflow.controller;

import com.amchisa.lucidflow.dto.image.ImageResponse;
import com.amchisa.lucidflow.mapper.ImageMapper;
import com.amchisa.lucidflow.model.Image;
import com.amchisa.lucidflow.repository.ImageRepository;
import com.amchisa.lucidflow.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin
public class ImageController {
    private final ImageService imageService;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    public ImageController(ImageService imageService, ImageRepository imageRepository, ImageMapper imageMapper) {
        this.imageService = imageService;
        this.imageRepository = imageRepository;
        this.imageMapper = imageMapper;
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.OK)
    public ImageResponse uploadImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File selected is empty or has no content.");
        }

        String generatedFilename = imageService.uploadImageFile(file);
        String imageUrl = String.format(
            "%s://%s:%d/uploads/images/%s",
            request.getScheme(),
            request.getServerName(),
            request.getServerPort(),
            generatedFilename
        );

        return imageMapper.entityToResponse(
            imageRepository.save(Image.builder().url(imageUrl).build())
        );
    }
}
