package com.dental.backend.controller;

import com.dental.backend.dto.request.SpecialtyRequest;
import com.dental.backend.dto.response.SpecialtyResponse;
import com.dental.backend.service.SpecialtyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpecialtyController {

    private final SpecialtyService specialtyService;

    @GetMapping("/specialties")
    public ResponseEntity<List<SpecialtyResponse>> getAllSpecialtiesPublic() {
        return ResponseEntity.ok(specialtyService.getAllSpecialties());
    }

    @GetMapping("/admin/specialties")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SpecialtyResponse>> getAllSpecialties() {
        return ResponseEntity.ok(specialtyService.getAllSpecialties());
    }

    @GetMapping("/admin/specialties/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecialtyResponse> getSpecialtyById(@PathVariable String id) {
        return ResponseEntity.ok(specialtyService.getSpecialtyById(id));
    }

    @PostMapping("/admin/specialties")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecialtyResponse> createSpecialty(@Valid @RequestBody SpecialtyRequest request) {
        return new ResponseEntity<>(specialtyService.createSpecialty(request), HttpStatus.CREATED);
    }

    @PutMapping("/admin/specialties/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SpecialtyResponse> updateSpecialty(
            @PathVariable String id,
            @Valid @RequestBody SpecialtyRequest request) {
        return ResponseEntity.ok(specialtyService.updateSpecialty(id, request));
    }

    @DeleteMapping("/admin/specialties/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSpecialty(@PathVariable String id) {
        specialtyService.deleteSpecialty(id);
        return ResponseEntity.noContent().build();
    }
}
