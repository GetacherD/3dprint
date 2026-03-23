package com.getacher.threedprint.product.controller;

import com.getacher.threedprint.common.response.ApiResponse;
import com.getacher.threedprint.product.entity.Category;
import com.getacher.threedprint.product.entity.Product;
import com.getacher.threedprint.product.repository.CategoryRepository;
import com.getacher.threedprint.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private  final ProductRepository productRepository;

    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        c.setName(req.getName());
        return categoryRepository.save(c);
    }

    // 🔥 THIS IS WHAT YOU ARE MISSING
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        // 🔥 find category
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 🔥 get or create default category
        Category defaultCategory = categoryRepository.findByName("Uncategorized")
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName("Uncategorized");
                    return categoryRepository.save(c);
                });

        // 🔥 get all products in this category
        List<Product> products = productRepository.findByCategory_Id(id);

        // 🔥 move them
        for (Product p : products) {
            p.setCategory(defaultCategory);
        }

        productRepository.saveAll(products);

        // 🔥 now delete category
        categoryRepository.delete(category);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Category deleted. Products moved to 'Uncategorized'")
                        .build()
        );
    }
}