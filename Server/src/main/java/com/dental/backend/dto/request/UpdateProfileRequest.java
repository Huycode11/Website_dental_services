package com.dental.backend.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    
    // Doctor specific fields
    private String specialty;
    private String experience;
    private String description;
    private String facebookLink;
    private String twitterLink;
    private String linkedinLink;
}
