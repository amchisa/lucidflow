package com.amchisa.lucidflow.dtos.filters;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PostFilter {
    private String searchQuery;

    private LocalDate createdAfter;
    private LocalDate createdBefore;

    private LocalDate modifiedAfter;
    private LocalDate modifiedBefore;
}
