package com.ecommerce.controller;

import com.ecommerce.dto.SmsRequest;
import com.ecommerce.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/send-confirmation")
    public ResponseEntity<Map<String, Object>> sendConfirmationSms(@RequestBody SmsRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            smsService.sendConfirmationSms(
                request.getPhoneNumber(),
                request.getCustomerName(),
                request.getService(),
                request.getDate(),
                request.getTime()
            );

            response.put("success", true);
            response.put("message", "SMS sent successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send SMS: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/send-status-update")
    public ResponseEntity<Map<String, Object>> sendStatusUpdateSms(@RequestBody SmsRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            smsService.sendStatusUpdateSms(
                request.getPhoneNumber(),
                request.getCustomerName(),
                request.getModel(),
                request.getService(),
                request.getDate(),
                request.getTime(),
                request.getStatus()
            );

            response.put("success", true);
            response.put("message", "SMS sent successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send SMS: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
