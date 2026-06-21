package com.dental.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DentalServiceResponse {
    private String id;
    private String serviceCode;
    private String name;
    private String category;
    private String description;
    private String detailedProcess;
    private Double price;
    private Double maxPrice;
    private Integer durationMinutes;
    private Integer expectedAppointments;
    private String doctorSpecialty;
    private String imageUrl;
    private String preTreatmentNotes;
    private String postTreatmentNotes;
    private Boolean active;
    private String createdAt;
    private String updatedAt;
}
