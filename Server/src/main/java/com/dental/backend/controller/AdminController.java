package com.dental.backend.controller;

import com.dental.backend.dto.request.CreateDoctorRequest;
import com.dental.backend.dto.request.UpdateDoctorAdminRequest;
import com.dental.backend.dto.request.UpdateUserAdminRequest;
import com.dental.backend.dto.response.AdminDoctorResponse;
import com.dental.backend.dto.response.AdminDashboardResponse;
import com.dental.backend.dto.response.AdminUserResponse;
import com.dental.backend.dto.response.AppointmentResponse;
import com.dental.backend.service.DoctorService;
import com.dental.backend.service.UserService;
import com.dental.backend.service.AppointmentService;
import com.dental.backend.service.DashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final DoctorService doctorService;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminDoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctorsForAdmin());
    }

    @PostMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDoctorResponse> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
        return ResponseEntity.ok(doctorService.createDoctor(request));
    }

    @PutMapping("/doctors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDoctorResponse> updateDoctor(@PathVariable String id, @Valid @RequestBody UpdateDoctorAdminRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, request));
    }

    @DeleteMapping("/doctors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    // --- User Management Endpoints ---

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsersForAdmin());
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> updateUserStatus(@PathVariable String id, @RequestParam boolean active) {
        return ResponseEntity.ok(userService.updateUserStatusByAdmin(id, active));
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminUserResponse> updateUser(@PathVariable String id, @Valid @RequestBody UpdateUserAdminRequest request) {
        return ResponseEntity.ok(userService.updateUserByAdmin(id, request));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{id}/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> getUserAppointments(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(id));
    }
}
