package com.getacher.threedprint.review.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private int rating;
    private String comment;
    private String userName;
    private LocalDateTime createdAt;
}