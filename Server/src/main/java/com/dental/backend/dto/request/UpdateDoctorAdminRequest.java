package com.dental.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDoctorAdminRequest {
    
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

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
