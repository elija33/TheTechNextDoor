package com.ecommerce.repository;

import com.ecommerce.entity.RepairOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepairOrderRepository extends JpaRepository<RepairOrder, String> {
    List<RepairOrder> findByDate(String date);
}
