package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quote_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuoteImage {
    @Id
    private String id;

    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String data;
}
