package com.getacher.threedprint.product.service;

import com.getacher.threedprint.product.dto.ProductRequest;
import com.getacher.threedprint.product.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);
    List<ProductResponse> getAllProducts();
    Page<ProductResponse> getProducts(int page, int size);
    ProductResponse getProductById(Long id);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    public String uploadImage(MultipartFile file);
    void deleteProductImage(Long productId, String imageUrl);
}