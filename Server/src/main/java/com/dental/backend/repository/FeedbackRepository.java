package com.dental.backend.repository;

import com.dental.backend.entity.Feedback;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class FeedbackRepository {

    private final DynamoDbTable<Feedback> feedbackTable;

    public FeedbackRepository(DynamoDbEnhancedClient enhancedClient) {
        this.feedbackTable = enhancedClient.table("feedbacks", TableSchema.fromBean(Feedback.class));
    }

    public void save(Feedback feedback) {
        feedbackTable.putItem(feedback);
    }

    public Optional<Feedback> findById(String id) {
        return Optional.ofNullable(feedbackTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Feedback> findAll() {
        return feedbackTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        feedbackTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<Feedback> findByServiceId(String serviceId) {
        return feedbackTable.scan().items().stream()
                .filter(f -> serviceId.equals(f.getServiceId()))
                .collect(Collectors.toList());
    }

    public List<Feedback> findByPatientId(String patientId) {
        return feedbackTable.scan().items().stream()
                .filter(f -> patientId.equals(f.getPatientId()))
                .collect(Collectors.toList());
    }

    public Double avgRatingByService(String serviceId) {
        List<Feedback> feedbacks = findByServiceId(serviceId);
        if (feedbacks.isEmpty()) return 0.0;
        double sum = 0;
        for (Feedback f : feedbacks) {
            sum += f.getRating() != null ? f.getRating() : 0;
        }
        return sum / feedbacks.size();
    }
}
