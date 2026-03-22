package com.ecommerce.controller;

import com.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send-confirmation")
    public ResponseEntity<Map<String, String>> sendConfirmation(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            emailService.sendConfirmationEmail(email, firstName, lastName);
            return ResponseEntity.ok(Map.of("message", "Confirmation email sent to " + email));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/send-status-update")
    public ResponseEntity<Map<String, String>> sendStatusUpdate(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String customerName = request.get("customerName");
            String model = request.get("model");
            String service = request.get("service");
            String date = request.get("date");
            String time = request.get("time");
            String status = request.get("status");
            emailService.sendStatusUpdateEmail(email, customerName, model, service, date, time, status);
            return ResponseEntity.ok(Map.of("message", "Status update email sent to " + email));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
