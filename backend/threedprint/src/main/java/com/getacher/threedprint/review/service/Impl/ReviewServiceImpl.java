package com.getacher.threedprint.review.service.Impl;

import com.getacher.threedprint.common.exception.AppException;
import com.getacher.threedprint.product.entity.Product;
import com.getacher.threedprint.product.repository.ProductRepository;
import com.getacher.threedprint.review.dto.ReviewRequest;
import com.getacher.threedprint.review.dto.ReviewResponse;
import com.getacher.threedprint.review.entity.Review;
import com.getacher.threedprint.review.repository.ReviewRepository;
import com.getacher.threedprint.review.service.ReviewService;
import com.getacher.threedprint.user.entity.User;
import com.getacher.threedprint.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest request) {

        // 🔥 1. Validate product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new AppException(HttpStatus.NOT_FOUND, "Product not found")
                );

        // 🔥 2. Get current user (from SecurityContext)
        User user = (User) org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // 🔥 3. Prevent duplicate review
        reviewRepository.findByProductIdAndUserId(product.getId(), user.getId())
                .ifPresent(r -> {
                    throw new AppException(HttpStatus.BAD_REQUEST, "You already reviewed this product");
                });

        // 🔥 4. Create review
        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .product(product)
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);

        return mapToResponse(saved);
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(Long productId) {

        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // 🔥 MAPPER
    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .userName(review.getUser().getName())
                .createdAt(review.getCreatedAt())
                .build();
    }
    @Override
    public ReviewResponse updateReview(Long id, ReviewRequest request) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() ->
                        new AppException(HttpStatus.NOT_FOUND, "Review not found")
                );

        User user = (User) org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // 🔐 Only owner can edit
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AppException(HttpStatus.FORBIDDEN, "Not allowed");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updated = reviewRepository.save(review);

        return mapToResponse(updated);
    }
}