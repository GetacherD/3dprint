package com.getacher.threedprint.review.controller;

import com.getacher.threedprint.common.response.ApiRespones;
import com.getacher.threedprint.review.dto.ReviewRequest;
import com.getacher.threedprint.review.dto.ReviewResponse;
import com.getacher.threedprint.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 🔥 CREATE REVIEW (AUTH REQUIRED)
    @PostMapping
    public ResponseEntity<ApiRespones<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(
                ApiRespones.<ReviewResponse>builder()
                        .success(true)
                        .message("Review created")
                        .data(reviewService.createReview(request))
                        .build()
        );
    }

    // 🌍 PUBLIC - GET REVIEWS BY PRODUCT
    @GetMapping("/{productId}")
    public ResponseEntity<ApiRespones<List<ReviewResponse>>> getReviews(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                ApiRespones.<List<ReviewResponse>>builder()
                        .success(true)
                        .data(reviewService.getReviewsByProduct(productId))
                        .build()
        );
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiRespones<ReviewResponse>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request
    ) {
        return ResponseEntity.ok(
                ApiRespones.<ReviewResponse>builder()
                        .success(true)
                        .message("Review updated")
                        .data(reviewService.updateReview(id, request))
                        .build()
        );
    }
}