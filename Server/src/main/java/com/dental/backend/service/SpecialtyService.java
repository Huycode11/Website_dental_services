package com.dental.backend.service;

import com.dental.backend.dto.request.SpecialtyRequest;
import com.dental.backend.dto.response.SpecialtyResponse;
import com.dental.backend.entity.Specialty;
import com.dental.backend.exception.ResourceNotFoundException;
import com.dental.backend.repository.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpecialtyService {

    private final SpecialtyRepository specialtyRepository;

    public List<SpecialtyResponse> getAllSpecialties() {
        return specialtyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SpecialtyResponse getSpecialtyById(String id) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));
        return mapToResponse(specialty);
    }

    public SpecialtyResponse createSpecialty(SpecialtyRequest request) {
        Specialty specialty = Specialty.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .build();
        specialtyRepository.save(specialty);
        return mapToResponse(specialty);
    }

    public SpecialtyResponse updateSpecialty(String id, SpecialtyRequest request) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));
        specialty.setName(request.getName());
        specialty.setDescription(request.getDescription());
        specialtyRepository.save(specialty);
        return mapToResponse(specialty);
    }

    public void deleteSpecialty(String id) {
        specialtyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialty not found"));
        specialtyRepository.deleteById(id);
    }

    private SpecialtyResponse mapToResponse(Specialty specialty) {
        return SpecialtyResponse.builder()
                .id(specialty.getId())
                .name(specialty.getName())
                .description(specialty.getDescription())
                .build();
    }
}
