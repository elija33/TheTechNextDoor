package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "repair_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairService {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private String price;
}
