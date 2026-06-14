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
public class Appointment {

    private String id;
    private String patientId;
    private String doctorId;
    private String serviceId;
    private String scheduleId;
    private String status = "PENDING";
    private String notes;
    private String cancelReason;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("patient_id")
    public String getPatientId() {
        return patientId;
    }

    @DynamoDbAttribute("doctor_id")
    public String getDoctorId() {
        return doctorId;
    }

    @DynamoDbAttribute("service_id")
    public String getServiceId() {
        return serviceId;
    }

    @DynamoDbAttribute("schedule_id")
    public String getScheduleId() {
        return scheduleId;
    }

    @DynamoDbAttribute("status")
    public String getStatus() {
        return status;
    }

    @DynamoDbAttribute("notes")
    public String getNotes() {
        return notes;
    }

    @DynamoDbAttribute("cancel_reason")
    public String getCancelReason() {
        return cancelReason;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }
}
