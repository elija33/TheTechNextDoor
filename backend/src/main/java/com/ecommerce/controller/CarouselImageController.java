package com.ecommerce.controller;

import com.ecommerce.entity.CarouselImage;
import com.ecommerce.repository.CarouselImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carousel-images")
@RequiredArgsConstructor
public class CarouselImageController {

    private final CarouselImageRepository repository;

    @GetMapping
    public List<CarouselImage> getAll() {
        return repository.findAll();
    }

    @PostMapping("/batch")
    public List<CarouselImage> saveAll(@RequestBody List<CarouselImage> images) {
        repository.deleteAll();
        return repository.saveAll(images);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        repository.deleteAll();
        return ResponseEntity.ok().build();
    }
}
