package com.ecommerce.controller;

import com.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send-confirmation")
    public ResponseEntity<Map<String, String>> sendConfirmation(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");

        emailService.sendConfirmationEmail(email, firstName, lastName);

        return ResponseEntity.ok(Map.of("message", "Confirmation email sent to " + email));
    }
}
