package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.api.models.requests.ImageRequest;
import com.amchisa.lucidflow.data.entities.Image;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {
    public Image mapRequestToEntity(ImageRequest imageRequest, Image image) {
        image.setImageUrl(imageRequest.getImageUrl());
        image.setDisplayIndex(imageRequest.getDisplayIndex());

        return image;
    }
}
