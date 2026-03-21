package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quote_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuoteRequest {
    @Id
    private String id;

    private String brand;
    private String grouping;
    private String model;
    private String service;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long timestamp;
    private String status;
}
