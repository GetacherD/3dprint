package com.getacher.threedprint.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    private boolean enabled;
    @Enumerated(EnumType.STRING)
    private Role role;
    private LocalDateTime createdAt;
}
