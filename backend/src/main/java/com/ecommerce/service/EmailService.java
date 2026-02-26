package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendConfirmationEmail(String to, String firstName, String lastName) {
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
}
