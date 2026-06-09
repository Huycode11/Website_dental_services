package com.dental.backend.repository;

import com.dental.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByServiceId(Long serviceId);
    List<Feedback> findByPatientId(Long patientId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.service.id = :serviceId")
    Double avgRatingByService(@Param("serviceId") Long serviceId);
}
