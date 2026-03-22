package com.ecommerce.controller;

import com.ecommerce.entity.QuoteImage;
import com.ecommerce.repository.QuoteImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quote-images")
@RequiredArgsConstructor
public class QuoteImageController {

    private final QuoteImageRepository repository;

    @GetMapping
    public List<QuoteImage> getAll() {
        return repository.findAll();
    }

    @PostMapping("/batch")
    public List<QuoteImage> saveAll(@RequestBody List<QuoteImage> images) {
        repository.deleteAll();
        return repository.saveAll(images);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        repository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
