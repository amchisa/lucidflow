package com.amchisa.lucidflow.dto.post;

import com.amchisa.lucidflow.dto.image.ImageResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String body;
    private List<ImageResponse> images;
    private Instant createdAt;
    private Instant lastModifiedAt;
}
