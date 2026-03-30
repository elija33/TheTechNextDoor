package com.ecommerce.repository;

import com.ecommerce.entity.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface PageViewRepository extends JpaRepository<PageView, Long> {
    long countByVisitedAtAfter(LocalDateTime after);

    @Query("SELECT p.page, COUNT(p) FROM PageView p GROUP BY p.page ORDER BY COUNT(p) DESC")
    List<Object[]> findPageCounts();
}
