package com.dental.backend.controller;

import com.dental.backend.dto.response.DoctorPublicResponse;
import com.dental.backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorPublicResponse>> getAllActiveDoctors() {
        return ResponseEntity.ok(doctorService.getAllActiveDoctors());
    }
}
