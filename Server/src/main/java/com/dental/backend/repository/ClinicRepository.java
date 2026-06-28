package com.dental.backend.repository;

import com.dental.backend.entity.Clinic;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ClinicRepository {

    private final DynamoDbTable<Clinic> clinicTable;

    public ClinicRepository(DynamoDbEnhancedClient enhancedClient) {
        this.clinicTable = enhancedClient.table("clinics", TableSchema.fromBean(Clinic.class));
    }

    public void save(Clinic clinic) {
        clinicTable.putItem(clinic);
    }

    public Optional<Clinic> findById(String id) {
        return Optional.ofNullable(clinicTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Clinic> findAll() {
        return clinicTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        clinicTable.deleteItem(Key.builder().partitionValue(id).build());
    }
}
