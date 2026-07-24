package com.ecommerce.entity;

import com.ecommerce.config.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String age;
    private String gender;

    private boolean mustChangePassword;

    private Long createdAt;

    /**
     * Dashboard sections (e.g. "orders", "messages") this admin can access, beyond the always-
     * available Dashboard overview. The super-admin (Elija Amponsah) bypasses this entirely and
     * always has full access, enforced client-side.
     */
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "LONGTEXT")
    private List<String> allowedSections;
}
