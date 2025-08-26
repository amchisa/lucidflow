package com.amchisa.lucidflow.util;

import com.amchisa.lucidflow.service.PostService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component
public class DataLoader implements CommandLineRunner {
    private final PostService postService;
    private final ObjectMapper objectMapper;

    public DataLoader(PostService postService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        if (postService.postCount() == 0) { // Avoid duplicating posts
            String path = "/data/sample-data.json"; // Change if needed

            try (InputStream inputStream = TypeReference.class.getResourceAsStream(path)) {
                if (inputStream == null) {
                    System.err.printf(String.format("Data file not found at %s. Skipping data load.", path));
                    return;
                }

                postService.createPosts(objectMapper.readValue(inputStream, new TypeReference<>(){}));
                System.out.println("Data load completed successfully.");
            }
            catch (Exception e){
                System.err.printf("Data load failed: %s", e.getMessage());
            }
        }
    }
}
