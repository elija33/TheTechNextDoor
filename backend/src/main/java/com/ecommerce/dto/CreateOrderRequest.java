package com.ecommerce.dto;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String shippingAddress;
    private String shippingCity;
    private String shippingState;
    private String shippingZipCode;
}
