package com.dental.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDoctorResponse {
    private String id;
    private String userId;
    private String fullName;
    private String phone;
    private String email;
    private String specialty;
    private String experience;
    private String description;
    private String avatarUrl;
    private String facebookLink;
    private String twitterLink;
    private String linkedinLink;
    private String role;
    private Boolean active;
    private String createdAt;
    private long patientsServed;
}
