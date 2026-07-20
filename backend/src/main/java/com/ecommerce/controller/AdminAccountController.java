package com.ecommerce.controller;

import com.ecommerce.entity.Admin;
import com.ecommerce.repository.AdminRepository;
import com.ecommerce.service.AdminAccountService;
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
            Admin admin = adminAccountService.createAdmin(
                request.get("firstName"),
                request.get("lastName"),
                request.get("email"),
                request.get("age"),
                request.get("gender"),
                request.get("password")
            );

            Map<String, Object> response = toSummary(admin);
            if (admin.isMustChangePassword()) {
                response.put("temporaryPassword", admin.getPasswordHash());
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            Admin admin = adminAccountService.login(request.get("identifier"), request.get("password"));
            return ResponseEntity.ok(toSummary(admin));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Admin admin = adminAccountService.changePassword(id, request.get("currentPassword"), request.get("newPassword"));
            return ResponseEntity.ok(toSummary(admin));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
