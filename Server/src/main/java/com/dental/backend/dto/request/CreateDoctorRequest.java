package com.dental.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateDoctorRequest {
    
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải dài ít nhất 8 ký tự")
    @Pattern(regexp = ".*[A-Z].*", message = "Mật khẩu phải chứa ít nhất một chữ hoa")
    @Pattern(regexp = ".*[0-9].*", message = "Mật khẩu phải chứa ít nhất một chữ số")
    @Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*", message = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt")
    private String password;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Chuyên khoa không được để trống")
    private String specialty;

    private String experience;
    private String description;
    private String avatarUrl;
    
    private String facebookLink;
    private String twitterLink;
    private String linkedinLink;
}
