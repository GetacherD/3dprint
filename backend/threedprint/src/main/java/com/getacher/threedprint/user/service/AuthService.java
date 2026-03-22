package com.getacher.threedprint.user.service;

import com.getacher.threedprint.user.dto.AuthResponse;
import com.getacher.threedprint.user.dto.LoginRequest;
import com.getacher.threedprint.user.dto.UserRequest;

public interface AuthService {
AuthResponse login(LoginRequest loginRequest);

}
