package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.dtos.ImageRequest;
import com.amchisa.lucidflow.entities.Image;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {
    public Image requestToEntity(ImageRequest imageRequest) {
        return Image.builder()
            .url(imageRequest.getUrl())
            .displayIndex(imageRequest.getDisplayIndex())
            .build();
    }
}
