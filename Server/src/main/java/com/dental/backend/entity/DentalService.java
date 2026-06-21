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
    private String serviceCode;
    private String name;
    private String category;
    private String description;
    private String detailedProcess;
    private Double price;
    private Double maxPrice;
    private Integer durationMinutes = 30;
    private Integer expectedAppointments = 1;
    private String doctorSpecialty;
    private String imageUrl;
    private String preTreatmentNotes;
    private String postTreatmentNotes;
    private Boolean active = true;
    private String createdAt;
    private String updatedAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("service_code")
    public String getServiceCode() { return serviceCode; }

    @DynamoDbAttribute("name")
    public String getName() {
        return name;
    }

    @DynamoDbAttribute("category")
    public String getCategory() { return category; }

    @DynamoDbAttribute("description")
    public String getDescription() {
        return description;
    }

    @DynamoDbAttribute("detailed_process")
    public String getDetailedProcess() { return detailedProcess; }

    @DynamoDbAttribute("price")
    public Double getPrice() {
        return price;
    }

    @DynamoDbAttribute("max_price")
    public Double getMaxPrice() { return maxPrice; }

    @DynamoDbAttribute("duration_minutes")
    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    @DynamoDbAttribute("expected_appointments")
    public Integer getExpectedAppointments() { return expectedAppointments; }

    @DynamoDbAttribute("doctor_specialty")
    public String getDoctorSpecialty() { return doctorSpecialty; }

    @DynamoDbAttribute("image_url")
    public String getImageUrl() {
        return imageUrl;
    }

    @DynamoDbAttribute("pre_treatment_notes")
    public String getPreTreatmentNotes() { return preTreatmentNotes; }

    @DynamoDbAttribute("post_treatment_notes")
    public String getPostTreatmentNotes() { return postTreatmentNotes; }

    @DynamoDbAttribute("active")
    public Boolean getActive() {
        return active;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }

    @DynamoDbAttribute("updated_at")
    public String getUpdatedAt() { return updatedAt; }
}
