package com.amchisa.lucidflow.controller;

import com.amchisa.lucidflow.service.ImageService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/images")
@CrossOrigin
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        String generatedFilename = imageService.uploadImage(file);
        String apiUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

        return apiUrl + "/uploads/images/temp/" + generatedFilename;
    }
}
