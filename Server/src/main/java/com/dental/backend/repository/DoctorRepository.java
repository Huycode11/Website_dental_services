package com.dental.backend.repository;

import com.dental.backend.entity.Doctor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class DoctorRepository {

    private final DynamoDbTable<Doctor> doctorTable;

    public DoctorRepository(DynamoDbEnhancedClient enhancedClient) {
        this.doctorTable = enhancedClient.table("doctors", TableSchema.fromBean(Doctor.class));
    }

    public void save(Doctor doctor) {
        doctorTable.putItem(doctor);
    }

    public Optional<Doctor> findById(String id) {
        return Optional.ofNullable(doctorTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Doctor> findAll() {
        return doctorTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        doctorTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<Doctor> findByActive(Boolean active) {
        return doctorTable.scan().items().stream()
                .filter(d -> active.equals(d.getActive()))
                .collect(Collectors.toList());
    }

    public Optional<Doctor> findByUserId(String userId) {
        return doctorTable.scan().items().stream()
                .filter(d -> userId.equals(d.getUserId()))
                .findFirst();
    }

    public List<Doctor> findAllActiveWithUser() {
        // JOIN is not supported in DynamoDB natively. This method will fetch active doctors.
        // User fetching needs to be done in the Service layer.
        return findByActive(true);
    }
}
