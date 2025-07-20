package com.amchisa.lucidflow.utils;

import com.amchisa.lucidflow.services.PostService;
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
        if (postService.postCount() == 0) { // Essential to avoid duplicate posts
            try (InputStream inputStream = TypeReference.class.getResourceAsStream("/data/sample_data.json")) {
                if (inputStream == null) {
                    System.err.println("Data file not found at /data/sample_data.json. Skipping data load.");
                    return;
                }

                postService.createPosts(objectMapper.readValue(inputStream, new TypeReference<>(){}));
                System.out.println("Data load completed successfully.");
            }
            catch (Exception e){
                System.err.println("Data load failed: " + e.getMessage());
            }
        }
    }
}
