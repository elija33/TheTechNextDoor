package com.ecommerce.repository;

import com.ecommerce.entity.AppSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppSettingRepository extends JpaRepository<AppSetting, String> {}
