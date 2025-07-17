package com.amchisa.lucidflow.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "images")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @NotNull(message = "Image must be associated with a Post")
    @JsonBackReference // This field will not be serialized when expressed as JSON
    private Post post;

    @Lob
    @Column(nullable = false)
    @NotNull(message = "Image data cannot be null")
    private byte[] image;

    @Column(name = "display_index", nullable = false)
    @NotNull
    @Min(value = 0, message = "Display index must be at least 0")
    private Integer displayIndex;
}
