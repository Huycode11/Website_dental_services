package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotNull
    private Long serviceId;
    @NotNull
    private Long appointmentId;

    @NotNull @Min(1) @Max(5)
    private Integer rating;

    private String comment;
}
