package com.getacher.threedprint.user.controller;

import com.getacher.threedprint.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

@GetMapping("/health")
public ResponseEntity<String> checkAdmin() {
    return   ResponseEntity.ok("Admin Role Check Ok!");
}
}
