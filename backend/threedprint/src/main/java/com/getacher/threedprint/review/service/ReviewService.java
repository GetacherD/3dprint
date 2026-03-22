package com.getacher.threedprint.review.service;

import com.getacher.threedprint.review.dto.ReviewRequest;
import com.getacher.threedprint.review.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(ReviewRequest request);
    ReviewResponse updateReview(Long id, ReviewRequest request);
    List<ReviewResponse> getReviewsByProduct(Long productId);
}