package com.amchisa.lucidflow.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "images")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonBackReference // This field will not be serialized when expressed as JSON
    private Post post;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "display_index", nullable = false)
    private Integer displayIndex;
}
