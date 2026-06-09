package com.dental.backend.repository;

import com.dental.backend.entity.DentalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DentalServiceRepository extends JpaRepository<DentalService, Long> {
    List<DentalService> findByActive(Boolean active);
    List<DentalService> findByNameContainingIgnoreCase(String name);
}
