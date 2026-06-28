package com.dental.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClinicResponse {
    private String id;
    private String name;
    private String address;
    private String hotline;
    private String email;
    private String workingHours;
    private String googleMapsUrl;
    private String imageUrl;
    private String createdAt;
    private String updatedAt;
}
