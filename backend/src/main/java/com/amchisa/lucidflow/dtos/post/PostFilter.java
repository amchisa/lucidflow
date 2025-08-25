package com.amchisa.lucidflow.dtos.post;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class PostFilter {
    private String searchQuery;
    private Boolean hasImages;
    private Instant createdAfter;
}
