package com.amchisa.lucidflow.util;

import com.amchisa.lucidflow.dto.post.PostRequest;
import com.amchisa.lucidflow.service.post.PostService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private static final String DATA_FILE_PATH = "/sample-data.json"; // Change if needed
    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final PostService postService;
    private final ObjectMapper objectMapper;

    public DataLoader(PostService postService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(String... args) {
        if (postService.postCount() > 0) { // Avoid duplicating db entries
            logger.info("Database already populated. Skipping data load.");
            return;
        }

        try {
            postService.createPosts(loadDataFromFile(DATA_FILE_PATH));
            logger.info("Data load completed successfully.");
        }
        catch (IOException e) {
            logger.error("Failed to complete data load.", e);
        }
    }

    private List<PostRequest> loadDataFromFile(String path) throws IOException {
        try (InputStream inputStream = TypeReference.class.getResourceAsStream(path)) {
            if (inputStream == null) {
                throw new IOException("Data file not found at " + path + ".");
            }

            return objectMapper.readValue(inputStream, new TypeReference<>() {});
        }
    }
}
