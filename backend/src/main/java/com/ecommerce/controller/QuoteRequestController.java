package com.ecommerce.controller;

import com.ecommerce.entity.QuoteRequest;
import com.ecommerce.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quote-requests")
@RequiredArgsConstructor
public class QuoteRequestController {

    private final QuoteRequestRepository repository;

    @GetMapping
    public List<QuoteRequest> getAll() {
        return repository.findAll().stream()
                .sorted((a, b) -> Long.compare(
                        b.getTimestamp() != null ? b.getTimestamp() : 0,
                        a.getTimestamp() != null ? a.getTimestamp() : 0))
                .collect(Collectors.toList());
    }

    @PostMapping
    public QuoteRequest save(@RequestBody QuoteRequest quote) {
        return repository.save(quote);
    }

    @PutMapping("/{id}/status")
    public QuoteRequest updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        QuoteRequest quote = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found: " + id));
        quote.setStatus(body.get("status"));
        return repository.save(quote);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
