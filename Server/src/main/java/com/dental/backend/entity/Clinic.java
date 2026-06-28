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
public class Clinic {

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

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("name")
    public String getName() {
        return name;
    }

    @DynamoDbAttribute("address")
    public String getAddress() {
        return address;
    }

    @DynamoDbAttribute("hotline")
    public String getHotline() {
        return hotline;
    }

    @DynamoDbAttribute("email")
    public String getEmail() {
        return email;
    }

    @DynamoDbAttribute("working_hours")
    public String getWorkingHours() {
        return workingHours;
    }

    @DynamoDbAttribute("google_maps_url")
    public String getGoogleMapsUrl() {
        return googleMapsUrl;
    }

    @DynamoDbAttribute("image_url")
    public String getImageUrl() {
        return imageUrl;
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
