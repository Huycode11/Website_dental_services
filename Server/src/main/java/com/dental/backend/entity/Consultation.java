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
public class Consultation {

    private String id;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String question;
    private String reply;
    private String repliedAt;
    private String repliedById;
    private Boolean isReplied = false;
    private String createdAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("customer_name")
    public String getCustomerName() {
        return customerName;
    }

    @DynamoDbAttribute("customer_email")
    public String getCustomerEmail() {
        return customerEmail;
    }

    @DynamoDbAttribute("customer_phone")
    public String getCustomerPhone() {
        return customerPhone;
    }

    @DynamoDbAttribute("question")
    public String getQuestion() {
        return question;
    }

    @DynamoDbAttribute("reply")
    public String getReply() {
        return reply;
    }

    @DynamoDbAttribute("replied_at")
    public String getRepliedAt() {
        return repliedAt;
    }

    @DynamoDbAttribute("replied_by_id")
    public String getRepliedById() {
        return repliedById;
    }

    @DynamoDbAttribute("is_replied")
    public Boolean getIsReplied() {
        return isReplied;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }
}
