package com.ecommerce.controller;

import com.ecommerce.entity.PageView;
import com.ecommerce.repository.PageViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final PageViewRepository repository;

    @PostMapping("/track")
    public ResponseEntity<Void> track(@RequestBody Map<String, String> body) {
        String page = body.get("page");
        if (page == null || page.isBlank()) return ResponseEntity.badRequest().build();
        String city = body.get("city");
        PageView view = new PageView();
        view.setPage(page);
        view.setVisitedAt(LocalDateTime.now());
        view.setCity(city);
        repository.save(view);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);

        long totalVisits = repository.count();
        long todayVisits = repository.countByVisitedAtAfter(startOfDay);
        long weekVisits = repository.countByVisitedAtAfter(startOfWeek);

        List<Object[]> pageCounts = repository.findPageCounts();
        List<Map<String, Object>> topPages = new ArrayList<>();
        for (Object[] row : pageCounts) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("page", row[0]);
            entry.put("count", row[1]);
            topPages.add(entry);
        }

        List<Object[]> locationRows = repository.findLocationCountsAfter(startOfDay);
        List<Map<String, Object>> todayLocations = new ArrayList<>();
        for (Object[] row : locationRows) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("city", row[0]);
            entry.put("count", row[1]);
            todayLocations.add(entry);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalVisits", totalVisits);
        result.put("todayVisits", todayVisits);
        result.put("weekVisits", weekVisits);
        result.put("topPages", topPages);
        result.put("todayLocations", todayLocations);

        return ResponseEntity.ok(result);
    }
}
