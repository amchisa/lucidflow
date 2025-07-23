package com.amchisa.lucidflow.dtos.responses;

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
