package com.amchisa.lucidflow.specifications;

import com.amchisa.lucidflow.dtos.filters.PostFilter;
import com.amchisa.lucidflow.entities.Post;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class PostSpecification {
    public Specification<Post> withFilters(PostFilter filters) {
        return (root, _, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters.getSearchQuery() != null && !filters.getSearchQuery().isBlank()) {
                String likePattern = "%" + filters.getSearchQuery().toLowerCase() + "%";

                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern);
                Predicate bodyMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("body").as(String.class)), likePattern);

                predicates.add(criteriaBuilder.or(titleMatch, bodyMatch));
            }

            if (filters.getHasImages() != null) {
                if (filters.getHasImages()) {
                    predicates.add(criteriaBuilder.isNotEmpty(root.get("images")));
                }
                else {
                    predicates.add(criteriaBuilder.isEmpty(root.get("images")));
                }
            }

            if (filters.getCreatedAfter() != null) {
                LocalDateTime createdAfterDateTime = filters.getCreatedAfter().atStartOfDay();
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("timeCreated"), createdAfterDateTime));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
