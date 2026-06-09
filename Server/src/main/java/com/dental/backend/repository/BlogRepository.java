package com.dental.backend.repository;

import com.dental.backend.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByPublishedOrderByCreatedAtDesc(Boolean published);
    Optional<Blog> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
