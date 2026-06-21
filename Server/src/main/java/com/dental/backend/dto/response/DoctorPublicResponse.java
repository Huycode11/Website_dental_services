package com.dental.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorPublicResponse {
    private String id;
    private String userId;
    private String fullName;
    private String specialty;
    private String description;
    private String experience;
    private String avatarUrl;
    private String facebookLink;
    private String twitterLink;
    private String linkedinLink;
}
