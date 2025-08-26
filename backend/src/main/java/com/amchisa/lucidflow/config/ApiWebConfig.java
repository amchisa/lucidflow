package com.amchisa.lucidflow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO) // Stabilize page response JSON to avoid warnings
public class ApiWebConfig implements WebMvcConfigurer {
    private final Path uploadPath;

    public ApiWebConfig(@Value("${file.upload.base-dir}") String uploadDirectory) {
        this.uploadPath = Path.of(uploadDirectory).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the upload directory to the web
        registry.addResourceHandler("/uploads/**") // Allow files from all subdirectories to be served
            .addResourceLocations("file:" + this.uploadPath + "/"); // Alias true upload path
    }
}