package com.amchisa.lucidflow.entities;

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
    private Post post;

    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "display_index", nullable = false)
    private Integer displayIndex;
}
