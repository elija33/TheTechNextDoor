package com.ecommerce.controller;

import com.ecommerce.entity.ContactMessage;
import com.ecommerce.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contact-messages")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageRepository repository;

    @GetMapping
    public List<ContactMessage> getAll() {
        return repository.findAll().stream()
                .sorted((a, b) -> Long.compare(
                        b.getTimestamp() != null ? b.getTimestamp() : 0,
                        a.getTimestamp() != null ? a.getTimestamp() : 0))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ContactMessage save(@RequestBody ContactMessage message) {
        return repository.save(message);
    }

    @PutMapping("/{id}/read")
    public ContactMessage markAsRead(@PathVariable String id) {
        ContactMessage message = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found: " + id));
        message.setUnread(false);
        return repository.save(message);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
