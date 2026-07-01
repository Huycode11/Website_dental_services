package com.dental.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentResponse {
    private String id;
    private String clinicId;
    private String patientId;
    private String doctorId;
    private String serviceId;
    private String scheduleId;
    private String status;
    private String notes;
    private String cancelReason;
    private String createdAt;
    
    // Additional fields for displaying in frontend
    private String date;
    private String time;
    private String patientName;
    private String patientAvatar;
    private String doctorName;
    private String clinicName;
}
