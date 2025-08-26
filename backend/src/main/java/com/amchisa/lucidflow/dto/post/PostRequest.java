package com.amchisa.lucidflow.dto.post;

import com.amchisa.lucidflow.dto.image.ImageRequest;
import com.amchisa.lucidflow.validation.constraint.NullOrNotBlank;
import com.amchisa.lucidflow.validation.group.Create;
import com.amchisa.lucidflow.validation.group.Update;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class PostRequest {
    @NotBlank(groups = Create.class, message = "Post title cannot be null or blank")
    @NullOrNotBlank(groups = Update.class, message = "Post title cannot be blank")
    @Size(max = 100, message = "Post title cannot exceed 100 characters")
    private String title;

    @NotBlank(groups = Create.class, message = "Post body cannot be null or blank")
    @NullOrNotBlank(groups = Update.class, message = "Post body cannot be blank")
    private String body;

    @NotNull(groups = Create.class, message = "Images cannot be null")
    @Valid
    private List<ImageRequest> images;
}
