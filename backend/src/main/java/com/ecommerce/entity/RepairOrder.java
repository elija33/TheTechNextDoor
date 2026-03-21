package com.ecommerce.entity;

import com.ecommerce.config.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "repair_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairOrder {
    @Id
    private String id;

    private String customer;
    private String email;
    private String phone;
    private String brand;
    private String grouping;
    private String model;
    private String service;
    private String date;
    private String time;

    @Column(length = 2000)
    private String notes;

    private String amount;
    private String status;
    private Long timestamp;
    private Boolean textConfirmation;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "LONGTEXT")
    private List<String> images;

    private String streetAddress;
    private String city;
    private String zipPostalCode;
}
