package com.amchisa.lucidflow.data.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Data
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonBackReference // This field will not be serialized when expressed as JSON
    private Post post;

    @Lob
    @Column(name = "imageData", nullable = false)
    private String imageData;

    @Column(name = "display_index", nullable = false)
    private Integer displayIndex;
}
