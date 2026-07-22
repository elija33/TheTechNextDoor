package com.ecommerce.controller;

import com.ecommerce.entity.Admin;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.service.AdminAccountService;
import com.ecommerce.service.AdminAccountService.AdminCreationResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AdminAccountController {

    private final AdminAccountService adminAccountService;
    private final AdminRepository adminRepository;

    private Map<String, String> errorBody(Exception e) {
        String message = e.getMessage();
        return Map.of("error", message != null ? message : e.getClass().getSimpleName());
    }

    private Map<String, Object> toSummary(Admin admin) {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("id", admin.getId());
        summary.put("firstName", admin.getFirstName());
        summary.put("lastName", admin.getLastName());
        summary.put("username", admin.getUsername());
        summary.put("email", admin.getEmail());
        summary.put("age", admin.getAge());
        summary.put("gender", admin.getGender());
        summary.put("mustChangePassword", admin.isMustChangePassword());
        summary.put("createdAt", admin.getCreatedAt());
        return summary;
    }

    @GetMapping
    public List<Map<String, Object>> getAll() {
        return adminRepository.findAll().stream()
            .map(this::toSummary)
            .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> request) {
        try {
            AdminCreationResult result = adminAccountService.createAdmin(
                request.get("firstName"),
                request.get("lastName"),
                request.get("email"),
                request.get("age"),
                request.get("gender"),
                request.get("password")
            );

            Map<String, Object> response = toSummary(result.admin());
            response.put("emailSent", result.emailSent());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorBody(e));
        }
    }

    @PostMapping("/{id}/resend-credentials")
    public ResponseEntity<?> resendCredentials(@PathVariable Long id) {
        try {
            AdminCreationResult result = adminAccountService.resendCredentials(id);
            Map<String, Object> response = toSummary(result.admin());
            response.put("emailSent", result.emailSent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorBody(e));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            Admin admin = adminAccountService.login(request.get("identifier"), request.get("password"));
            return ResponseEntity.ok(toSummary(admin));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody(e));
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Admin admin = adminAccountService.changePassword(id, request.get("currentPassword"), request.get("newPassword"));
            return ResponseEntity.ok(toSummary(admin));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorBody(e));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Admin admin = adminAccountService.updateProfile(
                id,
                request.get("firstName"),
                request.get("lastName"),
                request.get("age"),
                request.get("gender")
            );
            return ResponseEntity.ok(toSummary(admin));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorBody(e));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            adminRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(errorBody(e));
        }
    }
}
