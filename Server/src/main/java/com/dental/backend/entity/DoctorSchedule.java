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
public class DoctorSchedule {

    private String id;
    private String doctorId;
    private String workDate;
    private String startTime;
    private String endTime;
    private Boolean isBooked = false;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("doctor_id")
    public String getDoctorId() {
        return doctorId;
    }

    @DynamoDbAttribute("work_date")
    public String getWorkDate() {
        return workDate;
    }

    @DynamoDbAttribute("start_time")
    public String getStartTime() {
        return startTime;
    }

    @DynamoDbAttribute("end_time")
    public String getEndTime() {
        return endTime;
    }

    @DynamoDbAttribute("is_booked")
    public Boolean getIsBooked() {
        return isBooked;
    }
}
