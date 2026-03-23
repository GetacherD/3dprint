package com.getacher.threedprint.content.controller;

import com.getacher.threedprint.common.response.ApiRespones;
import com.getacher.threedprint.content.service.AppContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class AppContentController {

    private final AppContentService service;

    // 🌍 PUBLIC
    @GetMapping("/{key}")
    public ResponseEntity<ApiRespones<String>> get(@PathVariable String key) {
        return ResponseEntity.ok(
                ApiRespones.<String>builder()
                        .success(true)
                        .data(service.getValue(key))
                        .build()
        );
    }

    // 🔐 ADMIN
    @PutMapping("/{key}")
    public ResponseEntity<ApiRespones<Void>> update(
            @PathVariable String key,
            @RequestBody Map<String, String> body
    ) {
        String value = body.get("value");

        service.update(key, value);

        return ResponseEntity.ok(
                ApiRespones.<Void>builder()
                        .success(true)
                        .message("Updated")
                        .build()
        );
    }
}