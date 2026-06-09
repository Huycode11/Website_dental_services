package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DoctorRequest {
    @NotNull(message = "Vui lòng chọn tài khoản người dùng")
    private Long userId;

    @NotBlank(message = "Chuyên khoa không được để trống")
    private String specialty;

    private String description;
    private String experience;
    private String avatarUrl;
}
