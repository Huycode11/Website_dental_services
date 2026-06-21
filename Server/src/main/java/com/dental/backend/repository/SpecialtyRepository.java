package com.dental.backend.repository;

import com.dental.backend.entity.Specialty;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class SpecialtyRepository {

    private final DynamoDbTable<Specialty> specialtyTable;

    public SpecialtyRepository(DynamoDbEnhancedClient enhancedClient) {
        this.specialtyTable = enhancedClient.table("specialties", TableSchema.fromBean(Specialty.class));
    }

    public Specialty save(Specialty specialty) {
        specialtyTable.putItem(specialty);
        return specialty;
    }

    public Optional<Specialty> findById(String id) {
        return Optional.ofNullable(specialtyTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Specialty> findAll() {
        return specialtyTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        specialtyTable.deleteItem(Key.builder().partitionValue(id).build());
    }
}
