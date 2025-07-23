package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.dtos.requests.ImageRequest;
import com.amchisa.lucidflow.dtos.responses.ImageResponse;
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

    public ImageResponse entityToResponse(Image image) {
        return new ImageResponse(image.getId(), image.getUrl(), image.getDisplayIndex());
    }
}
