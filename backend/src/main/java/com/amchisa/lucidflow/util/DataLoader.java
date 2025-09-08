package com.amchisa.lucidflow.util;

import com.amchisa.lucidflow.dto.post.PostRequest;
import com.amchisa.lucidflow.service.post.PostService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    private final PostService postService;
    private final ObjectMapper objectMapper;
    private final String dataFilePath;
    private final boolean enabled;

    public DataLoader(
        PostService postService,
        ObjectMapper objectMapper,
        @Value("${dataloader.datafile-path}") String dataFilePath,
        @Value("${dataloader.enabled:true}") boolean enabled
    ) {
        this.postService = postService;
        this.objectMapper = objectMapper;
        this.dataFilePath = dataFilePath;
        this.enabled = enabled;
    }

    @Override
    public void run(String... args) {
        if (!enabled) {
            return;
        }

        if (dataFilePath == null || dataFilePath.isBlank()) {
            logger.warn("Data file path not provided. Skipping data load.");
            return;
        }

        if (postService.postCount() > 0) {
            logger.info("Database already populated. Skipping data load.");
            return; // Avoid duplicating db entries
        }

        try {
            postService.createPosts(loadDataFromFile(dataFilePath));
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
