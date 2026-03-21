package com.ecommerce.controller;

import com.ecommerce.entity.ServiceCard;
import com.ecommerce.repository.ServiceCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-cards")
@RequiredArgsConstructor
public class ServiceCardController {

    private final ServiceCardRepository repository;

    @GetMapping
    public List<ServiceCard> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ServiceCard save(@RequestBody ServiceCard card) {
        return repository.save(card);
    }

    @PutMapping("/{id}")
    public ServiceCard update(@PathVariable String id, @RequestBody ServiceCard card) {
        card.setId(id);
        return repository.save(card);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        repository.deleteAll();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/batch")
    public List<ServiceCard> saveAll(@RequestBody List<ServiceCard> cards) {
        repository.deleteAll();
        return repository.saveAll(cards);
    }
}
