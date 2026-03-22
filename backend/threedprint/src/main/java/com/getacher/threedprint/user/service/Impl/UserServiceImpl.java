package com.getacher.threedprint.user.service.Impl;

import com.getacher.threedprint.common.exception.AppException;
import com.getacher.threedprint.user.dto.UserRequest;
import com.getacher.threedprint.user.dto.UserResponse;
import com.getacher.threedprint.user.entity.Role;
import com.getacher.threedprint.user.entity.User;
import com.getacher.threedprint.user.repository.UserRepository;
import com.getacher.threedprint.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl  implements UserService {
    private  final UserRepository userRepository;
    private  final PasswordEncoder passwordEncoder;
    @Override
    public UserResponse createUser(UserRequest userRequest) {
        String email = userRequest.getEmail().trim();
        String password = userRequest.getPassword().trim();

        if(userRepository.findByEmail(email).isPresent()){
            throw  new AppException(HttpStatus.BAD_REQUEST, "Email Already Exists");

        }
        User user = User.builder()
                .name(userRequest.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(userRequest.getPassword().trim()))
                .enabled(true)
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();
    User savedUser = userRepository.save(user);
    return  UserResponse.builder()
            .id(savedUser.getId())
            .name(savedUser.getName())
            .email(savedUser.getEmail())
            .build();
    }
}
