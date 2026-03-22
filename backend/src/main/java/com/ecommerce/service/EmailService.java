package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    private boolean isConfigured() {
        return mailUsername != null && !mailUsername.isEmpty();
    }

    public void sendConfirmationEmail(String to, String firstName, String lastName) {
        if (!isConfigured()) {
            System.out.println("Email not sent - mail not configured. Would send to: " + to);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Confirm Your Account - The Tech Next Door");
        message.setText(
            "Hello " + firstName + " " + lastName + ",\n\n" +
            "Can you please confirm your account at The Tech Next Door.\n\n" +
            "Thank you for registering with us!\n\n" +
            "Best regards,\n" +
            "The Tech Next Door Team"
        );

        mailSender.send(message);
    }

    public void sendStatusUpdateEmail(String to, String customerName, String model, String service, String date, String time, String status) {
        if (!isConfigured()) {
            System.out.println("Email not sent - mail not configured. Would send to: " + to);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);

        String capitalizedStatus = status.substring(0, 1).toUpperCase() + status.substring(1);
        message.setSubject("Appointment " + capitalizedStatus + " - The Tech Next Door");

        String body = "Hello " + customerName + ", your " + model + " " + service +
            " appointment at " + date + " " + time + " is " + capitalizedStatus + ".";
        if (status.equalsIgnoreCase("confirmed")) {
            body += " See you!";
        }
        body += "\n\nBest regards,\nThe Tech Next Door Team";

        message.setText(body);
        mailSender.send(message);
    }
}
