package com.ecommerce.repository;

import com.ecommerce.entity.QuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, String> {}
