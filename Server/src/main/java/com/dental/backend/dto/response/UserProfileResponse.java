package com.dental.backend.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private String id;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String role;
    private String createdAt;

    // Doctor specific fields
    private String specialty;
    private String experience;
    private String description;
    private String facebookLink;
    private String twitterLink;
    private String linkedinLink;
}
