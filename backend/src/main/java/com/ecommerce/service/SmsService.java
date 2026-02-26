package com.ecommerce.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;

    private boolean isConfigured = false;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty()
            && !accountSid.startsWith("YOUR_")
            && authToken != null && !authToken.isEmpty()
            && !authToken.startsWith("YOUR_")) {
            try {
                Twilio.init(accountSid, authToken);
                isConfigured = true;
                System.out.println("Twilio SMS service initialized successfully");
            } catch (Exception e) {
                System.err.println("Failed to initialize Twilio: " + e.getMessage());
                isConfigured = false;
            }
        } else {
            System.out.println("Twilio SMS service not configured - SMS notifications disabled");
        }
    }

    public void sendConfirmationSms(String toPhoneNumber, String customerName, String service, String date, String time) {
        if (!isConfigured) {
            System.out.println("SMS not sent - Twilio not configured. Would send to: " + toPhoneNumber);
            System.out.println("Message: Appointment confirmed for " + customerName + " - " + service + " on " + date + " at " + time);
            return;
        }

        String messageBody = String.format(
            "Hi %s! Your appointment at TheTechNextDoor has been confirmed.\n\n" +
            "Service: %s\n" +
            "Date: %s\n" +
            "Time: %s\n\n" +
            "We look forward to seeing you!",
            customerName, service, date, time
        );

        Message message = Message.creator(
            new PhoneNumber(toPhoneNumber),
            new PhoneNumber(twilioPhoneNumber),
            messageBody
        ).create();

        System.out.println("SMS sent with SID: " + message.getSid());
    }
}
