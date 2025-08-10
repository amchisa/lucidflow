package com.amchisa.lucidflow.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostRequest {
    @NotBlank(message = "Title is mandatory and cannot be blank")
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    @NotBlank(message = "Body is mandatory and cannot be blank")
    private String body;

    @NotNull(message = "List of images must be provided, even if empty")
    @Valid
    private List<ImageRequest> images;
}
