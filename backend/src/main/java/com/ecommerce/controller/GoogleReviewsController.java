package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@RestController
@RequestMapping("/api/google-reviews")
public class GoogleReviewsController {

    @Value("${google.places.api-key:}")
    private String apiKey;

    // Optional: if you already know the Place ID (ChIJ...)
    @Value("${google.places.place-id:}")
    private String configuredPlaceId;

    // Business name used to auto-find the Place ID
    @Value("${google.places.business-name:thetechnextdoors Columbus Ohio}")
    private String businessName;

    private final RestTemplate restTemplate = new RestTemplate();

    private volatile Map<String, Object> cachedResponse = null;
    private volatile long cacheExpiryMs = 0;
    private volatile String resolvedPlaceId = null;

    @GetMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> getReviews() {
        if (apiKey.isBlank()) {
            return ResponseEntity.ok(emptyResponse());
        }

        if (cachedResponse != null && System.currentTimeMillis() < cacheExpiryMs) {
            return ResponseEntity.ok(cachedResponse);
        }

        try {
            // Resolve Place ID if not already known
            String placeId = configuredPlaceId.isBlank() ? resolvedPlaceId : configuredPlaceId;
            if (placeId == null || placeId.isBlank()) {
                placeId = findPlaceId();
                if (placeId == null) return ResponseEntity.ok(emptyResponse());
                resolvedPlaceId = placeId;
            }

            // Fetch reviews using Place Details API
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://maps.googleapis.com/maps/api/place/details/json")
                    .queryParam("place_id", placeId)
                    .queryParam("fields", "name,rating,reviews,user_ratings_total")
                    .queryParam("key", apiKey)
                    .toUriString();

            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            if (raw == null) return ResponseEntity.ok(emptyResponse());

            Map<String, Object> result = (Map<String, Object>) raw.get("result");
            if (result == null) return ResponseEntity.ok(emptyResponse());

            List<Map<String, Object>> reviews = (List<Map<String, Object>>) result.getOrDefault("reviews", List.of());
            double rating = result.get("rating") != null ? ((Number) result.get("rating")).doubleValue() : 0;
            int total = result.get("user_ratings_total") != null ? ((Number) result.get("user_ratings_total")).intValue() : 0;

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviews);
            response.put("rating", rating);
            response.put("totalRatings", total);

            cachedResponse = response;
            cacheExpiryMs = System.currentTimeMillis() + 3_600_000; // 1-hour cache
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.ok(emptyResponse());
        }
    }

    @SuppressWarnings("unchecked")
    private String findPlaceId() {
        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl("https://maps.googleapis.com/maps/api/place/findplacefromtext/json")
                    .queryParam("input", businessName)
                    .queryParam("inputtype", "textquery")
                    .queryParam("fields", "place_id")
                    .queryParam("key", apiKey)
                    .toUriString();

            Map<String, Object> raw = restTemplate.getForObject(url, Map.class);
            if (raw == null) return null;

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) raw.get("candidates");
            if (candidates == null || candidates.isEmpty()) return null;

            return (String) candidates.get(0).get("place_id");
        } catch (Exception e) {
            return null;
        }
    }

    private Map<String, Object> emptyResponse() {
        Map<String, Object> m = new HashMap<>();
        m.put("reviews", List.of());
        m.put("rating", 0);
        m.put("totalRatings", 0);
        return m;
    }
}
