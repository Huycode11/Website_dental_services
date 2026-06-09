package com.dental.backend.repository;

import com.dental.backend.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByIsRepliedOrderByCreatedAtDesc(Boolean isReplied);
    List<Consultation> findAllByOrderByCreatedAtDesc();
}
