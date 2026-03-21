package com.ecommerce.controller;

import com.ecommerce.entity.RepairOrder;
import com.ecommerce.repository.RepairOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/repair-orders")
@RequiredArgsConstructor
public class RepairOrderController {

    private final RepairOrderRepository repository;

    @GetMapping
    public List<RepairOrder> getAll() {
        return repository.findAll().stream()
                .sorted((a, b) -> Long.compare(
                        b.getTimestamp() != null ? b.getTimestamp() : 0,
                        a.getTimestamp() != null ? a.getTimestamp() : 0))
                .collect(Collectors.toList());
    }

    @PostMapping
    public RepairOrder save(@RequestBody RepairOrder order) {
        return repository.save(order);
    }

    @PutMapping("/{id}/status")
    public RepairOrder updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        RepairOrder order = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
        order.setStatus(body.get("status"));
        return repository.save(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/booked-times")
    public List<String> getBookedTimes(@RequestParam String date) {
        return repository.findByDate(date).stream()
                .map(RepairOrder::getTime)
                .collect(Collectors.toList());
    }
}
