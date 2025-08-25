package com.amchisa.lucidflow.dtos.image;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageResponse {
    private Long id;
    private String url;
    private Integer displayIndex;
}
