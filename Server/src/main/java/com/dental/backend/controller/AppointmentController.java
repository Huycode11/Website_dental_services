package com.dental.backend.controller;

import com.dental.backend.dto.request.AppointmentRequest;
import com.dental.backend.dto.response.AppointmentResponse;
import com.dental.backend.dto.response.PageResponse;
import com.dental.backend.entity.Doctor;
import com.dental.backend.entity.User;
import com.dental.backend.repository.DoctorRepository;
import com.dental.backend.repository.UserRepository;
import com.dental.backend.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest request, Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            request.setPatientId(email);
        }
        return new ResponseEntity<>(appointmentService.createAppointment(request), HttpStatus.CREATED);
    }

    @GetMapping("/appointments/my-appointments")
    public ResponseEntity<java.util.List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            return ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(email));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/appointments/my-appointments/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelMyAppointment(
            @PathVariable String id,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            return ResponseEntity.ok(appointmentService.cancelAppointmentByPatient(id, email, reason));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // --- Admin Endpoints ---

    @GetMapping("/admin/appointments")
    public ResponseEntity<PageResponse<AppointmentResponse>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsPage(page, size, status, null));
    }

    @PutMapping("/admin/appointments/{id}/assign")
    public ResponseEntity<AppointmentResponse> assignDoctor(@PathVariable String id, @RequestParam String doctorId) {
        return ResponseEntity.ok(appointmentService.assignDoctor(id, doctorId));
    }

    // --- Doctor Endpoints ---

    @GetMapping("/doctor/appointments")
    public ResponseEntity<PageResponse<AppointmentResponse>> getDoctorAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        String doctorId = getDoctorIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.getAppointmentsPage(page, size, status, doctorId));
    }

    @PutMapping("/doctor/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable String id, 
            @RequestParam String status, 
            @RequestParam(required = false) String cancelReason,
            Authentication authentication) {
        
        // (In a real scenario, you'd add a check here to verify ownership)
        String doctorId = getDoctorIdFromAuth(authentication);
        
        return ResponseEntity.ok(appointmentService.updateStatus(id, status, cancelReason, doctorId));
    }

    private String getDoctorIdFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) authentication.getPrincipal()).getUsername();
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Doctor doctor = doctorRepository.findByUserId(user.getId()).orElseThrow(() -> new RuntimeException("Doctor not found for user"));
            return doctor.getId();
        }
        throw new RuntimeException("Unauthorized");
    }
}
