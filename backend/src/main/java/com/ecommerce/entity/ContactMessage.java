package com.ecommerce.entity;

import com.ecommerce.config.StringListConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "contact_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {
    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String contactMethod;

    @Column(length = 5000)
    private String message;

    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "LONGTEXT")
    private List<String> images;

    private Long timestamp;
    private Boolean unread;
}
