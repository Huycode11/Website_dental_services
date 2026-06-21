package com.dental.backend.controller;

import com.dental.backend.dto.request.DentalServiceRequest;
import com.dental.backend.dto.response.DentalServiceResponse;
import com.dental.backend.service.DentalServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServiceController {

    private final DentalServiceService dentalServiceService;

    // Public endpoints
    @GetMapping("/services")
    public ResponseEntity<List<DentalServiceResponse>> getActiveServices() {
        return ResponseEntity.ok(dentalServiceService.getActiveServices());
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<DentalServiceResponse> getServiceById(@PathVariable String id) {
        return ResponseEntity.ok(dentalServiceService.getServiceById(id));
    }

    // Admin endpoints
    @GetMapping("/admin/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DentalServiceResponse>> getAllServices() {
        return ResponseEntity.ok(dentalServiceService.getAllServices());
    }

    @PostMapping("/admin/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DentalServiceResponse> createService(@Valid @RequestBody DentalServiceRequest request) {
        return new ResponseEntity<>(dentalServiceService.createService(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/services/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DentalServiceResponse> updateService(
            @PathVariable String id,
            @Valid @RequestBody DentalServiceRequest request) {
        return ResponseEntity.ok(dentalServiceService.updateService(id, request));
    }

    @DeleteMapping("/admin/services/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        dentalServiceService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/services/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DentalServiceResponse> uploadImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(dentalServiceService.uploadImage(id, file));
    }
}
