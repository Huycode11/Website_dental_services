package com.dental.backend.repository;

import com.dental.backend.entity.Blog;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class BlogRepository {

    private final DynamoDbTable<Blog> blogTable;

    public BlogRepository(DynamoDbEnhancedClient enhancedClient) {
        this.blogTable = enhancedClient.table("blogs", TableSchema.fromBean(Blog.class));
    }

    public void save(Blog blog) {
        blogTable.putItem(blog);
    }

    public Optional<Blog> findById(String id) {
        return Optional.ofNullable(blogTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<Blog> findAll() {
        return blogTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        blogTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<Blog> findByPublishedOrderByCreatedAtDesc(Boolean published) {
        return blogTable.scan().items().stream()
                .filter(b -> published.equals(b.getPublished()))
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Optional<Blog> findBySlug(String slug) {
        return blogTable.scan().items().stream()
                .filter(b -> slug.equals(b.getSlug()))
                .findFirst();
    }

    public boolean existsBySlug(String slug) {
        return findBySlug(slug).isPresent();
    }
}
