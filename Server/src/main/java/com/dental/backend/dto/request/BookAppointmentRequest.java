package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookAppointmentRequest {
    @NotNull(message = "Vui lòng chọn bác sĩ")
    private Long doctorId;

    @NotNull(message = "Vui lòng chọn dịch vụ")
    private Long serviceId;

    @NotNull(message = "Vui lòng chọn khung giờ")
    private Long scheduleId;

    private String notes;
}
