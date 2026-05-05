package com.internship.tool.controller;

import com.internship.tool.dto.LoginRequest;
import com.internship.tool.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        String role;

        // 🔴 TEMP USERS (replace with DB later)
        if ("admin".equals(request.getUsername()) && "password".equals(request.getPassword())) {
            role = "ROLE_ADMIN";
        } 
        else if ("user".equals(request.getUsername()) && "password".equals(request.getPassword())) {
            role = "ROLE_USER";
        } 
        else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // ✅ Generate token with role
        String token = jwtUtil.generateToken(request.getUsername(), role);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", request.getUsername());
        response.put("role", role);

        return ResponseEntity.ok(response);
    }
}