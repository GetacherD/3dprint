package com.getacher.threedprint.user.service;


import com.getacher.threedprint.user.dto.UserRequest;
import com.getacher.threedprint.user.dto.UserResponse;

public interface UserService {
UserResponse createUser(UserRequest userRequest);
}
