package com.dental.backend.controller;

import com.dental.backend.dto.request.ClinicRequest;
import com.dental.backend.dto.response.ClinicResponse;
import com.dental.backend.service.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/clinics")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    @GetMapping
    public ResponseEntity<List<ClinicResponse>> getAllClinics() {
        return ResponseEntity.ok(clinicService.getAllClinics());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClinicResponse> getClinicById(@PathVariable String id) {
        return ResponseEntity.ok(clinicService.getClinicById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClinicResponse> createClinic(@RequestBody ClinicRequest request) {
        return ResponseEntity.ok(clinicService.createClinic(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClinicResponse> updateClinic(@PathVariable String id, @RequestBody ClinicRequest request) {
        return ResponseEntity.ok(clinicService.updateClinic(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClinic(@PathVariable String id) {
        clinicService.deleteClinic(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClinicResponse> uploadImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(clinicService.uploadImage(id, file));
    }
}
