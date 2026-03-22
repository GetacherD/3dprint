package com.getacher.threedprint.product.repository;

import com.getacher.threedprint.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}