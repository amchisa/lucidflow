package com.amchisa.lucidflow.dto.post;

import com.amchisa.lucidflow.dto.image.ImageResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String body;
    private List<ImageResponse> images;
    private String timeCreated;
    private String timeModified;
}
