package com.getacher.threedprint.product.repository;

import com.getacher.threedprint.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByCategoryId(Long id);
    boolean existsByCategoryId(Long categoryId);
    List<Product> findByCategory_Id(Long categoryId);


}