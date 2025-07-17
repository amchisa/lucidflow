package com.amchisa.lucidflow.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Title is mandatory and cannot be blank")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;

    @Lob
    @Column(nullable = false)
    @NotBlank(message = "Body is mandatory and cannot be blank")
    private String body;

    @OneToMany(
        mappedBy = "post",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @OrderBy("displayIndex ASC")
    @JsonManagedReference // This field will be serialized when expressed as JSON
    private List<Image> images;

    @Column(
        name = "time_created",
        nullable = false,
        insertable = false,
        updatable = false
    )
    private LocalDateTime timeCreated;

    @Column(name = "time_modified")
    private LocalDateTime timeModified;
}
