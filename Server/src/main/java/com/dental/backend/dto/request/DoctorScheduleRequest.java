package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class DoctorScheduleRequest {
    @NotNull
    private Long doctorId;

    @NotNull
    private LocalDate workDate;

    @NotNull
    private List<SlotRequest> slots;

    @Data
    public static class SlotRequest {
        @NotNull
        private LocalTime startTime;
        @NotNull
        private LocalTime endTime;
    }
}
