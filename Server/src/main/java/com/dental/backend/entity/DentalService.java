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
public class DentalService {

    private String id;
    private String name;
    private String description;
    private Double price;
    private Integer durationMinutes = 30;
    private String imageUrl;
    private Boolean active = true;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("name")
    public String getName() {
        return name;
    }

    @DynamoDbAttribute("description")
    public String getDescription() {
        return description;
    }

    @DynamoDbAttribute("price")
    public Double getPrice() {
        return price;
    }

    @DynamoDbAttribute("duration_minutes")
    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    @DynamoDbAttribute("image_url")
    public String getImageUrl() {
        return imageUrl;
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
