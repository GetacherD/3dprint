package com.getacher.threedprint.config;

import com.getacher.threedprint.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new RuntimeException("Not used");
        };
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(request -> {
                    var c = new org.springframework.web.cors.CorsConfiguration();
                    c.setAllowedOrigins(List.of(allowedOrigins));
                    c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    c.setAllowedHeaders(List.of("*"));
                    c.setAllowCredentials(true);
                    return c;
                }))
                .authorizeHttpRequests(auth -> auth

                        // 🌍 PUBLIC
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/users",
                                "/api/health",
                                "/uploads/**",
                                "/api/products/**"
                        ).permitAll()
                        // 🌍 PUBLIC - ONLY GET reviews
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/reviews/**").authenticated()
                        // 🔐 AUTH REQUIRED - create review
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/reviews/**").authenticated()

                        // 🔐 ADMIN ONLY
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🔐 EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                .addFilterBefore(jwtFilter, AnonymousAuthenticationFilter.class);

        return http.build();
    }
}
