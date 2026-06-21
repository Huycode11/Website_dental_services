package com.dental.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DentalServiceRequest {
    
    @NotBlank(message = "Mã dịch vụ không được để trống")
    private String serviceCode;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String name;
    
    @NotBlank(message = "Danh mục dịch vụ không được để trống")
    private String category;

    private String description;
    private String detailedProcess;

    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá không được âm")
    private Double price;
    
    private Double maxPrice;

    private Integer durationMinutes = 30;
    private Integer expectedAppointments = 1;
    
    private String doctorSpecialty;
    private String imageUrl;
    private String preTreatmentNotes;
    private String postTreatmentNotes;
    
    private Boolean active = true;
}
