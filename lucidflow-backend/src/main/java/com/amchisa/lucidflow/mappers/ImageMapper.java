package com.amchisa.lucidflow.mappers;

import com.amchisa.lucidflow.api.payloads.requests.ImageRequest;
import com.amchisa.lucidflow.data.entities.Image;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {
    public Image mapRequestToEntity(ImageRequest imageRequest, Image image) {
        image.setImageData(imageRequest.getImageData());
        image.setDisplayIndex(imageRequest.getDisplayIndex());

        return image;
    }
}
