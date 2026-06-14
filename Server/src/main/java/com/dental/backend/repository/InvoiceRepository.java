package com.dental.backend.repository;

import com.dental.backend.entity.Invoice;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class InvoiceRepository {

    private final DynamoDbTable<Invoice> invoiceTable;

    public InvoiceRepository(DynamoDbEnhancedClient enhancedClient) {
        this.invoiceTable = enhancedClient.table("invoices", TableSchema.fromBean(Invoice.class));
    }

    public void save(Invoice invoice) {
        invoiceTable.putItem(invoice);
    }

    public Optional<Invoice> findById(String id) {
        return Optional.ofNullable(invoiceTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Invoice> findAll() {
        return invoiceTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        invoiceTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public Optional<Invoice> findByAppointmentId(String appointmentId) {
        return invoiceTable.scan().items().stream()
                .filter(i -> appointmentId.equals(i.getAppointmentId()))
                .findFirst();
    }

    public List<Invoice> findByStatus(String status) {
        return invoiceTable.scan().items().stream()
                .filter(i -> status.equals(i.getStatus()))
                .collect(Collectors.toList());
    }

    public Double sumRevenueByYearAndMonth(int year, int month) {
        String yearStr = String.valueOf(year);
        String monthStr = month < 10 ? "0" + month : String.valueOf(month);
        String prefix = yearStr + "-" + monthStr;
        return invoiceTable.scan().items().stream()
                .filter(i -> "PAID".equals(i.getStatus()) && i.getCreatedAt() != null && i.getCreatedAt().startsWith(prefix))
                .mapToDouble(i -> i.getTotalAmount() != null ? i.getTotalAmount() : 0.0)
                .sum();
    }

    public Double sumRevenueByYear(int year) {
        String prefix = String.valueOf(year) + "-";
        return invoiceTable.scan().items().stream()
                .filter(i -> "PAID".equals(i.getStatus()) && i.getCreatedAt() != null && i.getCreatedAt().startsWith(prefix))
                .mapToDouble(i -> i.getTotalAmount() != null ? i.getTotalAmount() : 0.0)
                .sum();
    }
}
