package com.dental.backend.entity;

import com.dental.backend.enums.Role;
import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class User {

    private String id;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private String role;
    private Boolean active = true;
    private String createdAt;
    private String updatedAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("email")
    public String getEmail() {
        return email;
    }

    @DynamoDbAttribute("password")
    public String getPassword() {
        return password;
    }

    @DynamoDbAttribute("full_name")
    public String getFullName() {
        return fullName;
    }

    @DynamoDbAttribute("phone")
    public String getPhone() {
        return phone;
    }

    @DynamoDbAttribute("avatar_url")
    public String getAvatarUrl() {
        return avatarUrl;
    }

    @DynamoDbAttribute("role")
    public String getRole() {
        return role;
    }

    @DynamoDbAttribute("active")
    public Boolean getActive() {
        return active;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }

    @DynamoDbAttribute("updated_at")
    public String getUpdatedAt() {
        return updatedAt;
    }
}
