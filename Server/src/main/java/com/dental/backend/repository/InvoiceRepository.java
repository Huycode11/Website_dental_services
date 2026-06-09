package com.dental.backend.repository;

import com.dental.backend.entity.Invoice;
import com.dental.backend.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByAppointmentId(Long appointmentId);
    List<Invoice> findByStatus(InvoiceStatus status);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'PAID' AND YEAR(i.createdAt) = :year AND MONTH(i.createdAt) = :month")
    BigDecimal sumRevenueByYearAndMonth(@Param("year") int year, @Param("month") int month);

    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'PAID' AND YEAR(i.createdAt) = :year")
    BigDecimal sumRevenueByYear(@Param("year") int year);
}
