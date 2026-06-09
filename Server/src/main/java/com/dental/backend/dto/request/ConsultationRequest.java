package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ConsultationRequest {
    @NotBlank(message = "Tên không được để trống")
    private String customerName;

    @Email @NotBlank
    private String customerEmail;

    private String customerPhone;

    @NotBlank(message = "Câu hỏi không được để trống")
    private String question;
}
