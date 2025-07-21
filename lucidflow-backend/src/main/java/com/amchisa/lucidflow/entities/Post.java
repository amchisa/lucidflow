package com.amchisa.lucidflow.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String body;

    @OneToMany(
        mappedBy = "post",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    @OrderBy("displayIndex ASC")
    @JsonManagedReference // This field will be serialized when expressed as JSON
    private List<Image> images = new ArrayList<>();

    @Column(
        name = "time_created",
        nullable = false, // Redundant (kept for readability)
        insertable = false,
        updatable = false
    )
    @CreationTimestamp
    private LocalDateTime timeCreated;

    @Column(
        name = "time_modified",
        nullable = false,
        insertable = false
    )
    @UpdateTimestamp
    private LocalDateTime timeModified;
}
