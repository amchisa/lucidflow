package com.amchisa.lucidflow.controllers;

import com.amchisa.lucidflow.services.FileService;
import com.amchisa.lucidflow.services.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin
public class ImageController {
    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File selected is empty or has no content.");
        }

        String generatedFilename = imageService.uploadImage(file);

        // Build full URL for accessing the uploaded image
        String imageUrl = String.format(
            "%s://%s:%d/uploads/images/%s",
            request.getScheme(),
            request.getServerName(),
            request.getServerPort(),
            generatedFilename
        );

        return ResponseEntity.ok(imageUrl);
    }
}
