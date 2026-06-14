package com.dental.backend.repository;

import com.dental.backend.entity.User;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.ScanEnhancedRequest;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class UserRepository {

    private final DynamoDbTable<User> userTable;

    public UserRepository(DynamoDbEnhancedClient enhancedClient) {
        this.userTable = enhancedClient.table("users", TableSchema.fromBean(User.class));
    }

    public void save(User user) {
        userTable.putItem(user);
    }

    public Optional<User> findById(String id) {
        return Optional.ofNullable(userTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<User> findAll() {
        return userTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        userTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public Optional<User> findByEmail(String email) {
        return userTable.scan().items().stream()
                .filter(u -> email.equals(u.getEmail()))
                .findFirst();
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    public List<User> findByRole(String role) {
        return userTable.scan().items().stream()
                .filter(u -> role.equals(u.getRole()))
                .collect(Collectors.toList());
    }

    public List<User> findByRoleAndActive(String role, Boolean active) {
        return userTable.scan().items().stream()
                .filter(u -> role.equals(u.getRole()) && active.equals(u.getActive()))
                .collect(Collectors.toList());
    }
}
