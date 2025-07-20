package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.dtos.ImageRequest;
import com.amchisa.lucidflow.entities.Image;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {
    public Image mapRequestToEntity(ImageRequest imageRequest, Image image) {
        image.setUrl(imageRequest.getUrl());
        image.setDisplayIndex(imageRequest.getDisplayIndex());

        return image;
    }
}
