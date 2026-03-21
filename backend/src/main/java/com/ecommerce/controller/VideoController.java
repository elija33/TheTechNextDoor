package com.ecommerce.controller;

import com.ecommerce.entity.AppSetting;
import com.ecommerce.repository.AppSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {

    private final AppSettingRepository repository;

    @GetMapping
    public ResponseEntity<String> get() {
        return repository.findById("videoUrl")
                .map(s -> ResponseEntity.ok(s.getValue()))
                .orElse(ResponseEntity.ok(""));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String mimeType = file.getContentType() != null ? file.getContentType() : "video/mp4";
            String dataUrl = "data:" + mimeType + ";base64," + base64;
            repository.save(new AppSetting("videoUrl", dataUrl));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> delete() {
        repository.save(new AppSetting("videoUrl", ""));
        return ResponseEntity.ok().build();
    }
}
