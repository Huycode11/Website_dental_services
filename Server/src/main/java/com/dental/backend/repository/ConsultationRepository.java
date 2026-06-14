package com.dental.backend.repository;

import com.dental.backend.entity.Consultation;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ConsultationRepository {

    private final DynamoDbTable<Consultation> consultationTable;

    public ConsultationRepository(DynamoDbEnhancedClient enhancedClient) {
        this.consultationTable = enhancedClient.table("consultations", TableSchema.fromBean(Consultation.class));
    }

    public void save(Consultation consultation) {
        consultationTable.putItem(consultation);
    }

    public Optional<Consultation> findById(String id) {
        return Optional.ofNullable(consultationTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Consultation> findAll() {
        return consultationTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        consultationTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<Consultation> findByIsRepliedOrderByCreatedAtDesc(Boolean isReplied) {
        return consultationTable.scan().items().stream()
                .filter(c -> isReplied.equals(c.getIsReplied()))
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Consultation> findAllByOrderByCreatedAtDesc() {
        return consultationTable.scan().items().stream()
                .sorted((c1, c2) -> c2.getCreatedAt().compareTo(c1.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
