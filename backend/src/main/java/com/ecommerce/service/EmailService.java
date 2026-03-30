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

    public void sendScheduleNotification(String customerName, String email, String phone,
                                          String brand, String grouping, String model,
                                          String service, String date, String time,
                                          String notes, String amount,
                                          String streetAddress, String city, String zip) {
        if (!isConfigured()) {
            System.out.println("Email not sent - mail not configured. New schedule from: " + customerName);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("thetechnextdoors@gmail.com");
        message.setSubject("New Service Request - " + customerName);
        message.setText(
            "A new service appointment has been scheduled.\n\n" +
            "--- Customer ---\n" +
            "Name:    " + customerName + "\n" +
            "Email:   " + email + "\n" +
            "Phone:   " + phone + "\n\n" +
            "--- Device & Service ---\n" +
            "Brand:   " + brand + "\n" +
            "Series:  " + grouping + "\n" +
            "Model:   " + model + "\n" +
            "Service: " + service + "\n" +
            "Amount:  " + amount + "\n\n" +
            "--- Appointment ---\n" +
            "Date:    " + date + "\n" +
            "Time:    " + time + "\n\n" +
            "--- Address ---\n" +
            streetAddress + ", " + city + " " + zip + "\n\n" +
            (notes != null && !notes.isBlank() ? "--- Notes ---\n" + notes + "\n\n" : "") +
            "Log in to the dashboard to view and manage this request."
        );
        mailSender.send(message);
    }

    public void sendContactNotification(String customerName, String email, String phone,
                                         String contactMethod, String message) {
        if (!isConfigured()) {
            System.out.println("Email not sent - mail not configured. New contact from: " + customerName);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("thetechnextdoors@gmail.com");
        msg.setSubject("New Contact Message - " + customerName);
        msg.setText(
            "A new contact message has been submitted.\n\n" +
            "--- Customer ---\n" +
            "Name:             " + customerName + "\n" +
            "Email:            " + email + "\n" +
            "Phone:            " + phone + "\n" +
            "Preferred Contact: " + contactMethod + "\n\n" +
            "--- Message ---\n" + message + "\n\n" +
            "Log in to the dashboard to view and respond to this message."
        );
        mailSender.send(msg);
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
