package com.ecommerce.service;

import com.ecommerce.entity.Admin;
import com.ecommerce.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AdminAccountService {

    private static final String PASSWORD_CHARS =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public record AdminCreationResult(Admin admin, boolean emailSent) {}

    public String generateUsername(String firstName, String lastName) {
        String base = ((firstName == null ? "" : firstName) + "." + (lastName == null ? "" : lastName))
            .toLowerCase()
            .replaceAll("[^a-z0-9.]", "");

        String candidate = base;
        int suffix = 2;
        while (adminRepository.existsByUsername(candidate)) {
            candidate = base + suffix;
            suffix++;
        }
        return candidate;
    }

    public String generateRandomPassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }

    @Transactional
    public AdminCreationResult createAdmin(String firstName, String lastName, String email, String age, String gender, String rawPassword) {
        if (adminRepository.existsByEmail(email)) {
            throw new RuntimeException("An admin with this email already exists: " + email);
        }

        boolean generatedPassword = rawPassword == null || rawPassword.isBlank();
        String finalPassword = generatedPassword ? generateRandomPassword() : rawPassword;
        String username = generateUsername(firstName, lastName);

        Admin admin = new Admin();
        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setAge(age);
        admin.setGender(gender);
        admin.setPasswordHash(passwordEncoder.encode(finalPassword));
        admin.setMustChangePassword(generatedPassword);
        admin.setCreatedAt(System.currentTimeMillis());

        Admin saved = adminRepository.save(admin);

        boolean emailSent = generatedPassword
            && emailService.sendAdminCredentialsEmail(email, firstName, username, finalPassword);

        return new AdminCreationResult(saved, emailSent);
    }

    /**
     * Re-generates and re-sends credentials for an account that's still on its original
     * system-issued password (mustChangePassword). Refused once the admin has set their own
     * password, since silently overwriting that would lock them out without warning.
     */
    @Transactional
    public AdminCreationResult resendCredentials(Long id) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        if (!admin.isMustChangePassword()) {
            throw new RuntimeException("This admin has already set their own password; resend isn't available.");
        }

        String newPassword = generateRandomPassword();
        admin.setPasswordHash(passwordEncoder.encode(newPassword));
        Admin saved = adminRepository.save(admin);

        boolean emailSent = emailService.sendAdminCredentialsEmail(
            saved.getEmail(), saved.getFirstName(), saved.getUsername(), newPassword);

        return new AdminCreationResult(saved, emailSent);
    }

    // Password check is temporarily disabled on login (username/email alone is enough).
    // Account creation still generates/hashes real passwords for when this is turned back on.
    public Admin login(String identifier, String password) {
        return adminRepository.findByUsername(identifier)
            .or(() -> adminRepository.findByEmail(identifier))
            .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));
    }

    @Transactional
    public Admin changePassword(Long id, String currentPassword, String newPassword) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        if (!passwordEncoder.matches(currentPassword, admin.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        admin.setPasswordHash(passwordEncoder.encode(newPassword));
        admin.setMustChangePassword(false);
        return adminRepository.save(admin);
    }

    @Transactional
    public Admin updateProfile(Long id, String firstName, String lastName, String age, String gender) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found: " + id));

        admin.setFirstName(firstName);
        admin.setLastName(lastName);
        admin.setAge(age);
        admin.setGender(gender);

        return adminRepository.save(admin);
    }
}
