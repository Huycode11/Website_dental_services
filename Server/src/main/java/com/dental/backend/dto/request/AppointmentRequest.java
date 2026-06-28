package com.dental.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentRequest {
    @NotBlank(message = "Clinic ID is required")
    private String clinicId;
    
    private String patientId; // Can be empty if guest
    
    @NotBlank(message = "Specialty ID is required")
    private String specialtyId;
    
    @NotBlank(message = "Service ID is required")
    private String serviceId;
    
    private String doctorId; // Optional if they don't select a doctor
    
    @NotBlank(message = "Date is required")
    private String date; // Format: YYYY-MM-DD
    
    @NotBlank(message = "Time is required")
    private String time; // Format: HH:mm
    
    private String notes;
}
