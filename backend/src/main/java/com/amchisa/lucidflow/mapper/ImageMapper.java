package com.amchisa.lucidflow.mapper;

import com.amchisa.lucidflow.dto.image.ImageRequest;
import com.amchisa.lucidflow.dto.image.ImageResponse;
import com.amchisa.lucidflow.model.Image;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {
    public Image requestToEntity(ImageRequest imageRequest) {
        return Image.builder()
            .url(imageRequest.getUrl())
            .displayIndex(imageRequest.getDisplayIndex())
            .build();
    }

    public ImageResponse entityToResponse(Image image) {
        return new ImageResponse(image.getId(), image.getUrl(), image.getDisplayIndex());
    }
}
