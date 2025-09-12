package com.amchisa.lucidflow.dto.request;

import com.amchisa.lucidflow.validation.constraints.NullOrNotBlank;
import com.amchisa.lucidflow.validation.groups.Create;
import com.amchisa.lucidflow.validation.groups.Update;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ImageRequest {
    private Long id;

    @NotBlank(groups = Create.class, message = "Image url cannot be null or blank")
    @NullOrNotBlank(groups = Update.class, message = "Image url cannot be blank")
    @Size(max = 2048, message = "Image url must be 2048 characters or less")
    private String url;

    @NotNull(groups = Create.class, message = "Image display index cannot be null")
    @Min(value = 0, message = "Image display index must be 0 or greater")
    private Integer displayIndex;
}
