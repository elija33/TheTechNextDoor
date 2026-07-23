package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Sends email via the Resend HTTP API rather than SMTP - hosting platforms commonly block
 * outbound SMTP ports, which made direct JavaMail/Gmail SMTP unreliable in production.
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private final RestTemplate restTemplate;

    @Value("${resend.api-key:}")
    private String resendApiKey;

    @Value("${resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    private boolean isConfigured() {
        return resendApiKey != null && !resendApiKey.isEmpty();
    }

    /**
     * Never throws — a failed/unconfigured send must not take down the caller. Returns whether
     * the email actually went out.
     */
    private boolean send(String to, String subject, String text) {
        if (!isConfigured()) {
            System.out.println("Email not sent - Resend not configured. Would send to: " + to);
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(resendApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", List.of(to),
                "subject", subject,
                "text", text
            );

            restTemplate.postForEntity("https://api.resend.com/emails", new HttpEntity<>(body, headers), String.class);
            return true;
        } catch (Exception e) {
            System.out.println("Email not sent - Resend send failed for " + to + ": " + e.getMessage());
            return false;
        }
    }

    public void sendConfirmationEmail(String to, String firstName, String lastName) {
        send(to, "Confirm Your Account - The Tech Next Door",
            "Hello " + firstName + " " + lastName + ",\n\n" +
            "Can you please confirm your account at The Tech Next Door.\n\n" +
            "Thank you for registering with us!\n\n" +
            "Best regards,\n" +
            "The Tech Next Door Team"
        );
    }

    public boolean sendAdminCredentialsEmail(String to, String firstName, String username, String temporaryPassword) {
        return send(to, "Your Admin Account - The Tech Next Door",
            "Hello " + firstName + ",\n\n" +
            "An admin account has been created for you at The Tech Next Door.\n\n" +
            "Username: " + username + "\n" +
            "Temporary password: " + temporaryPassword + "\n\n" +
            "You can log in with either your username or this email address. " +
            "Please change your password after logging in.\n\n" +
            "Best regards,\n" +
            "The Tech Next Door Team"
        );
    }

    public void sendScheduleNotification(String customerName, String email, String phone,
                                          String brand, String grouping, String model,
                                          String service, String date, String time,
                                          String notes, String amount,
                                          String streetAddress, String city, String zip) {
        send("tthetechnextdoors@gmail.com", "New Service Request - " + customerName,
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
    }

    public void sendContactNotification(String customerName, String email, String phone,
                                         String contactMethod, String message) {
        send("tthetechnextdoors@gmail.com", "New Contact Message - " + customerName,
            "A new contact message has been submitted.\n\n" +
            "--- Customer ---\n" +
            "Name:             " + customerName + "\n" +
            "Email:            " + email + "\n" +
            "Phone:            " + phone + "\n" +
            "Preferred Contact: " + contactMethod + "\n\n" +
            "--- Message ---\n" + message + "\n\n" +
            "Log in to the dashboard to view and respond to this message."
        );
    }

    public void sendStatusUpdateEmail(String to, String customerName, String model, String service, String date, String time, String status) {
        String capitalizedStatus = status.substring(0, 1).toUpperCase() + status.substring(1);

        String body = "Hello " + customerName + ", your " + model + " " + service +
            " appointment at " + date + " " + time + " is " + capitalizedStatus + ".";
        if (status.equalsIgnoreCase("confirmed")) {
            body += " See you!";
        }
        body += "\n\nBest regards,\nThe Tech Next Door Team";

        send(to, "Appointment " + capitalizedStatus + " - The Tech Next Door", body);
    }
}
