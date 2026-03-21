package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppSetting {
    @Id
    private String key;

    @Column(columnDefinition = "LONGTEXT")
    private String value;
}
