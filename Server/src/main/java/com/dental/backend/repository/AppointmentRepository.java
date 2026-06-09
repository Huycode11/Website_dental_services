package com.dental.backend.repository;

import com.dental.backend.entity.Appointment;
import com.dental.backend.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    List<Appointment> findByStatus(AppointmentStatus status);

    @Query("SELECT a FROM Appointment a WHERE a.schedule.workDate = :date ORDER BY a.schedule.startTime")
    List<Appointment> findByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    Long countByStatus(@Param("status") AppointmentStatus status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE YEAR(a.createdAt) = :year AND MONTH(a.createdAt) = :month")
    Long countByYearAndMonth(@Param("year") int year, @Param("month") int month);
}
