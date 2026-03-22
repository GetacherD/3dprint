package com.getacher.threedprint.product.service.Impl;

import com.getacher.threedprint.common.exception.AppException;
import com.getacher.threedprint.product.dto.ProductRequest;
import com.getacher.threedprint.product.dto.ProductResponse;
import com.getacher.threedprint.product.entity.Product;
import com.getacher.threedprint.product.repository.ProductRepository;
import com.getacher.threedprint.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;



    @Override
    public ProductResponse createProduct(ProductRequest request) {

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .createdAt(LocalDateTime.now())
                .imageUrls(request.getImageUrls())
                .build();

        Product saved = productRepository.save(product);

        return ProductResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .price(saved.getPrice())
                .stockQuantity(saved.getStockQuantity())
                .imageUrl(saved.getImageUrl())
                .build();
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Page<ProductResponse> getProducts(int page, int size) {

        Page<Product> products = productRepository.findAll(
                PageRequest.of(page, size)
        );

        return products.map(this::mapToResponse);
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            String fileName = java.util.UUID.randomUUID() + "_" + file.getOriginalFilename();

            java.nio.file.Path path = java.nio.file.Paths.get("uploads/" + fileName);

            java.nio.file.Files.createDirectories(path.getParent());
            java.nio.file.Files.write(path, file.getBytes());

            return "/uploads/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("File upload failed");
        }
    }
    @Override
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found"));

        return mapToResponse(product);
    }


    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setImageUrls(request.getImageUrls());
        Product updated = productRepository.save(product);

        return mapToResponse(updated);
    }
    @Override
    public void deleteProductImage(Long productId, String imageUrl) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new AppException(HttpStatus.NOT_FOUND, "Product not found")
                );

        List<String> images = product.getImageUrls();

        if (images == null || !images.contains(imageUrl)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Image not found");
        }

        images.remove(imageUrl);

        // 🔥 update main image if needed
        if (imageUrl.equals(product.getImageUrl())) {
            if (!images.isEmpty()) {
                product.setImageUrl(images.get(0));
            } else {
                product.setImageUrl(null);
            }
        }

        product.setImageUrls(images);

        productRepository.save(product);
    }
    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Product not found"));

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .imageUrls(product.getImageUrls())
                .build();
    }
}