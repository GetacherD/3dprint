package com.getacher.threedprint.user.service.Impl;

import com.getacher.threedprint.common.exception.AppException;
import com.getacher.threedprint.security.JwtService;
import com.getacher.threedprint.user.dto.AuthResponse;
import com.getacher.threedprint.user.dto.LoginRequest;
import com.getacher.threedprint.user.entity.User;
import com.getacher.threedprint.user.repository.UserRepository;
import com.getacher.threedprint.user.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private  final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail().trim())
                .orElseThrow(
                        ()-> new AppException(HttpStatus.UNAUTHORIZED, "Invalid email or password")
                );
        if(!passwordEncoder.matches(loginRequest.getPassword().trim(), user.getPassword())) {
            throw  new AppException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        String token = jwtService.generateToken(loginRequest.getEmail().trim(),user.getRole().toString());
        return AuthResponse.builder()
                .token(token)
                .build();
    }
}
