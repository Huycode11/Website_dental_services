package com.dental.backend.repository;

import com.dental.backend.entity.DentalService;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class DentalServiceRepository {

    private final DynamoDbTable<DentalService> dentalServiceTable;

    public DentalServiceRepository(DynamoDbEnhancedClient enhancedClient) {
        this.dentalServiceTable = enhancedClient.table("services", TableSchema.fromBean(DentalService.class));
    }

    public void save(DentalService service) {
        dentalServiceTable.putItem(service);
    }

    public Optional<DentalService> findById(String id) {
        return Optional.ofNullable(dentalServiceTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<DentalService> findAll() {
        return dentalServiceTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        dentalServiceTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<DentalService> findByActive(Boolean active) {
        return dentalServiceTable.scan().items().stream()
                .filter(s -> active.equals(s.getActive()))
                .collect(Collectors.toList());
    }

    public List<DentalService> findByNameContainingIgnoreCase(String name) {
        if (name == null) return findAll();
        String lowerName = name.toLowerCase();
        return dentalServiceTable.scan().items().stream()
                .filter(s -> s.getName() != null && s.getName().toLowerCase().contains(lowerName))
                .collect(Collectors.toList());
    }
}
