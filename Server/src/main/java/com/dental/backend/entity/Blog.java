package com.dental.backend.entity;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class Blog {

    private String id;
    private String title;
    private String slug;
    private String content;
    private String thumbnailUrl;
    private String authorId;
    private Boolean published = false;
    private String createdAt;
    private String updatedAt;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }

    @DynamoDbAttribute("title")
    public String getTitle() {
        return title;
    }

    @DynamoDbAttribute("slug")
    public String getSlug() {
        return slug;
    }

    @DynamoDbAttribute("content")
    public String getContent() {
        return content;
    }

    @DynamoDbAttribute("thumbnail_url")
    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    @DynamoDbAttribute("author_id")
    public String getAuthorId() {
        return authorId;
    }

    @DynamoDbAttribute("published")
    public Boolean getPublished() {
        return published;
    }

    @DynamoDbAttribute("created_at")
    public String getCreatedAt() {
        return createdAt;
    }

    @DynamoDbAttribute("updated_at")
    public String getUpdatedAt() {
        return updatedAt;
    }
}
