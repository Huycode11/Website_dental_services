package com.dental.backend.dto.request;

import lombok.Data;

@Data
public class ClinicRequest {
    private String name;
    private String address;
    private String hotline;
    private String email;
    private String workingHours;
    private String googleMapsUrl;
}
