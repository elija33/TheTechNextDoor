package com.ecommerce.controller;

import com.ecommerce.entity.AppSetting;
import com.ecommerce.repository.AppSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class AppSettingController {

    private final AppSettingRepository repository;

    @GetMapping("/{key}")
    public ResponseEntity<String> get(@PathVariable String key) {
        return repository.findById(key)
                .map(s -> ResponseEntity.ok(s.getValue()))
                .orElse(ResponseEntity.ok(""));
    }

    @PutMapping("/{key}")
    public ResponseEntity<Void> save(@PathVariable String key, @RequestBody Map<String, String> body) {
        repository.save(new AppSetting(key, body.get("value")));
        return ResponseEntity.ok().build();
    }
}
