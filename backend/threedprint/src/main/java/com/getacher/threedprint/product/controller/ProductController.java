package com.getacher.threedprint.product.controller;

import com.getacher.threedprint.common.response.ApiRespones;
import com.getacher.threedprint.product.dto.ProductRequest;
import com.getacher.threedprint.product.dto.ProductResponse;
import com.getacher.threedprint.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 🌍 PUBLIC
    @GetMapping
    public ResponseEntity<ApiRespones<Page<ProductResponse>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                ApiRespones.<Page<ProductResponse>>builder()
                        .success(true)
                        .data(productService.getProducts(page, size))
                        .build()
        );
    }

    // 🌍 PUBLIC
    @GetMapping("/{id}")
    public ResponseEntity<ApiRespones<ProductResponse>> getProductById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                ApiRespones.<ProductResponse>builder()
                        .success(true)
                        .data(productService.getProductById(id))
                        .build()
        );
}
}