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
public class InvoiceDetail {

    private String id;
    private String invoiceId;
    private String serviceId;
    private Integer quantity = 1;
    private Double unitPrice;
    private Double subtotal;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("invoice_id")
    public String getInvoiceId() {
        return invoiceId;
    }

    @DynamoDbAttribute("service_id")
    public String getServiceId() {
        return serviceId;
    }

    @DynamoDbAttribute("quantity")
    public Integer getQuantity() {
        return quantity;
    }

    @DynamoDbAttribute("unit_price")
    public Double getUnitPrice() {
        return unitPrice;
    }

    @DynamoDbAttribute("subtotal")
    public Double getSubtotal() {
        return subtotal;
    }
}
