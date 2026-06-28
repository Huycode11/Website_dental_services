package com.dental.backend.repository;

import com.dental.backend.entity.Appointment;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class AppointmentRepository {

    private final DynamoDbTable<Appointment> appointmentTable;

    public AppointmentRepository(DynamoDbEnhancedClient enhancedClient) {
        this.appointmentTable = enhancedClient.table("appointments", TableSchema.fromBean(Appointment.class));
    }

    public void save(Appointment appointment) {
        appointmentTable.putItem(appointment);
    }

    public Optional<Appointment> findById(String id) {
        return Optional.ofNullable(appointmentTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Appointment> findAll() {
        return appointmentTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        appointmentTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<Appointment> findByPatientIdOrderByCreatedAtDesc(String patientId) {
        return appointmentTable.scan().items().stream()
                .filter(a -> patientId.equals(a.getPatientId()))
                .sorted((a1, a2) -> {
                    String d1 = a1.getCreatedAt() != null ? a1.getCreatedAt() : "";
                    String d2 = a2.getCreatedAt() != null ? a2.getCreatedAt() : "";
                    return d2.compareTo(d1);
                })
                .collect(Collectors.toList());
    }

    public List<Appointment> findByDoctorIdOrderByCreatedAtDesc(String doctorId) {
        return appointmentTable.scan().items().stream()
                .filter(a -> doctorId.equals(a.getDoctorId()))
                .sorted((a1, a2) -> {
                    String d1 = a1.getCreatedAt() != null ? a1.getCreatedAt() : "";
                    String d2 = a2.getCreatedAt() != null ? a2.getCreatedAt() : "";
                    return d2.compareTo(d1);
                })
                .collect(Collectors.toList());
    }

    public List<Appointment> findByStatus(String status) {
        return appointmentTable.scan().items().stream()
                .filter(a -> status.equals(a.getStatus()))
                .collect(Collectors.toList());
    }

    public List<Appointment> findByDate(String date) {
        // Warning: This requires manual filtering in service since schedule relation is removed
        return appointmentTable.scan().items().stream().collect(Collectors.toList());
    }

    public Long countByStatus(String status) {
        return appointmentTable.scan().items().stream()
                .filter(a -> status.equals(a.getStatus()))
                .count();
    }

    public Long countByYearAndMonth(int year, int month) {
        String yearStr = String.valueOf(year);
        String monthStr = month < 10 ? "0" + month : String.valueOf(month);
        String prefix = yearStr + "-" + monthStr;
        return appointmentTable.scan().items().stream()
                .filter(a -> a.getCreatedAt() != null && a.getCreatedAt().startsWith(prefix))
                .count();
    }
}
