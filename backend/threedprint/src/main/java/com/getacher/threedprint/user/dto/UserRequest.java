package com.getacher.threedprint.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "Name is Required!")
    private String name;
    @NotBlank(message = "Password is Required!")
    private String password;
    @NotBlank(message = "Email is required!")
    @Email(message = "Invalid email")
    private String email;
}
