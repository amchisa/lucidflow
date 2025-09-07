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
public class WebConfig implements WebMvcConfigurer {
    private final Path baseUploadPath;

    public WebConfig(@Value("${file.base-upload-path}") String baseUploadPath) {
        this.baseUploadPath = Path.of(baseUploadPath).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the upload directory to the web
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + this.baseUploadPath + "/");
    }
}