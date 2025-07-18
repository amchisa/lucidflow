package com.amchisa.lucidflow.api.payloads.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostRequest {
    @NotBlank(message = "Title is mandatory and cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @NotBlank(message = "Body is mandatory and cannot be blank")
    private String body;

    private List<ImageRequest> images;
}
