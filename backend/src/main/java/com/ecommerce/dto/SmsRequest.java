package com.ecommerce.dto;

import lombok.Data;

@Data
public class SmsRequest {
    private String phoneNumber;
    private String customerName;
    private String brand;
    private String model;
    private String service;
    private String date;
    private String time;
    private String status;
}
