package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "service_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCard {
    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private String icon;
}
