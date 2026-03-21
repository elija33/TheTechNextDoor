package com.ecommerce.controller;

import com.ecommerce.entity.RepairService;
import com.ecommerce.repository.RepairServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repair-services")
@RequiredArgsConstructor
public class RepairServiceController {

    private final RepairServiceRepository repository;

    @GetMapping
    public List<RepairService> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public RepairService save(@RequestBody RepairService service) {
        return repository.save(service);
    }

    @PutMapping("/{id}")
    public RepairService update(@PathVariable String id, @RequestBody RepairService service) {
        service.setId(id);
        return repository.save(service);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
