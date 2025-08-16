package com.amchisa.lucidflow.specifications;

import com.amchisa.lucidflow.dtos.filters.PostFilter;
import com.amchisa.lucidflow.entities.Post;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PostSpecification {
    public Specification<Post> withFilters(PostFilter filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters.getSearchQuery() != null && !filters.getSearchQuery().isBlank()) {
                String likePattern = "%" + filters.getSearchQuery().toLowerCase() + "%";

                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern);
                Predicate bodyMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("body").as(String.class)), likePattern);

                predicates.add(criteriaBuilder.or(titleMatch, bodyMatch));
            }



            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
