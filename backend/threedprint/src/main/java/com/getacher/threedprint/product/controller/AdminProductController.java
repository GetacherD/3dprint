package com.getacher.threedprint.product.controller;


import com.getacher.threedprint.common.response.ApiRespones;
import com.getacher.threedprint.product.dto.ProductRequest;
import com.getacher.threedprint.product.dto.ProductResponse;
import com.getacher.threedprint.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/products")

public class AdminProductController {

    private final ProductService productService;

    // 🔐 ADMIN
    @PostMapping
    public ResponseEntity<ApiRespones<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(
                ApiRespones.<ProductResponse>builder()
                        .success(true)
                        .message("Product created")
                        .data(productService.createProduct(request))
                        .build()
        );
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiRespones<String>> uploadImage(
            @RequestParam("file") MultipartFile file
    ) {
        String imageUrl = productService.uploadImage(file);

        return ResponseEntity.ok(
                ApiRespones.<String>builder()
                        .success(true)
                        .message("Image uploaded")
                        .data(imageUrl)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiRespones<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(
                ApiRespones.<ProductResponse>builder()
                        .success(true)
                        .message("Product updated")
                        .data(productService.updateProduct(id, request))
                        .build()
        );
    }
    @DeleteMapping("/{id}/image")
    public ResponseEntity<ApiRespones<Void>> deleteImage(
            @PathVariable Long id,
            @RequestParam String imageUrl
    ) {
        productService.deleteProductImage(id, imageUrl);

        return ResponseEntity.ok(
                ApiRespones.<Void>builder()
                        .success(true)
                        .message("Image removed")
                        .build()
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiRespones<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiRespones.<Void>builder()
                        .success(true)
                        .message("Product deleted")
                        .build()
        );
    }

}

