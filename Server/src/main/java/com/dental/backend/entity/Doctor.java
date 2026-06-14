package com.dental.backend.entity;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class Doctor {

    private String id;
    private String userId;
    private String specialty;
    private String description;
    private String experience;
    private String avatarUrl;
    private Boolean active = true;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("user_id")
    public String getUserId() {
        return userId;
    }

    @DynamoDbAttribute("specialty")
    public String getSpecialty() {
        return specialty;
    }

    @DynamoDbAttribute("description")
    public String getDescription() {
        return description;
    }

    @DynamoDbAttribute("experience")
    public String getExperience() {
        return experience;
    }

    @DynamoDbAttribute("avatar_url")
    public String getAvatarUrl() {
        return avatarUrl;
    }

    @DynamoDbAttribute("active")
    public Boolean getActive() {
        return active;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }
}
