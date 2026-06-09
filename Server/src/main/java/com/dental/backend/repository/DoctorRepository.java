package com.dental.backend.repository;

import com.dental.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByActive(Boolean active);
    Optional<Doctor> findByUserId(Long userId);

    @Query("SELECT d FROM Doctor d JOIN FETCH d.user WHERE d.active = true")
    List<Doctor> findAllActiveWithUser();
}
