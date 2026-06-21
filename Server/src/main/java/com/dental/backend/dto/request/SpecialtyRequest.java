package com.dental.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpecialtyRequest {
    @NotBlank(message = "Tên chuyên môn không được để trống")
    private String name;
    private String description;
}
