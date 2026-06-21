package com.dental.backend.repository;

import com.dental.backend.entity.Category;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class CategoryRepository {

    private final DynamoDbTable<Category> categoryTable;

    public CategoryRepository(DynamoDbEnhancedClient enhancedClient) {
        this.categoryTable = enhancedClient.table("categories", TableSchema.fromBean(Category.class));
    }

    public Category save(Category category) {
        categoryTable.putItem(category);
        return category;
    }

    public Optional<Category> findById(String id) {
        return Optional.ofNullable(categoryTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Category> findAll() {
        return categoryTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        categoryTable.deleteItem(Key.builder().partitionValue(id).build());
    }
}
