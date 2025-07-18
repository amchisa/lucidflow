package com.amchisa.lucidflow.api.payloads.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ImageRequest {
    @NotBlank(message = "Image data cannot be null")
    private String imageData;

    @NotNull
    @Min(value = 0, message = "Display index must be at least 0")
    private Integer displayIndex;
}
