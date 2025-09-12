package com.amchisa.lucidflow.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class PostFilterCriteria {
    private String searchQuery;
    private Boolean hasImages;
    private Instant createdAfter;
}
