package com.getacher.threedprint.user.controller;

import com.getacher.threedprint.common.response.ApiResponse;
import com.getacher.threedprint.user.dto.UserRequest;
import com.getacher.threedprint.user.dto.UserResponse;
import com.getacher.threedprint.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private  final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> ceateUser (@Valid @RequestBody UserRequest userRequest) {
        UserResponse userResponse = userService.createUser(userRequest);
        return  ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User created successfully")
                        .data(userResponse)
                        .build()
        );
    }
}
