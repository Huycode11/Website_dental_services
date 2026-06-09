package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BlogRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private String thumbnailUrl;
    private Boolean published = false;
}
