package com.amchisa.lucidflow.api.models.requests;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ImageRequest {
    private Long id;

    @NotBlank(message = "Image url cannot be blank")
    @Size(max = 2048, message = "Url cannot be longer than 2048 characters")
    private String imageUrl;

    @NotNull
    @Min(value = 0, message = "Display index must be at least 0")
    private Integer displayIndex;
}
