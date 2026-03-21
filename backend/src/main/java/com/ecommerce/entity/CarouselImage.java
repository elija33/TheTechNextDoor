package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "carousel_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarouselImage {
    @Id
    private String id;

    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String data;
}
