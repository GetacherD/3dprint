package com.getacher.threedprint.product.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000)
    private String description;

    private BigDecimal price;


    private Integer stockQuantity;

    private String imageUrl;

    private LocalDateTime createdAt;
    @ElementCollection
    private List<String> imageUrls;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}