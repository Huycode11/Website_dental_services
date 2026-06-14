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
public class Feedback {

    private String id;
    private String patientId;
    private String serviceId;
    private String appointmentId;
    private Integer rating;
    private String comment;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("patient_id")
    public String getPatientId() {
        return patientId;
    }

    @DynamoDbAttribute("service_id")
    public String getServiceId() {
        return serviceId;
    }

    @DynamoDbAttribute("appointment_id")
    public String getAppointmentId() {
        return appointmentId;
    }

    @DynamoDbAttribute("rating")
    public Integer getRating() {
        return rating;
    }

    @DynamoDbAttribute("comment")
    public String getComment() {
        return comment;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }
}
