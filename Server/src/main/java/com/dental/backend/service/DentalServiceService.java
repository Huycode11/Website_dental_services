package com.dental.backend.service;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.Duration;

import com.dental.backend.dto.request.DentalServiceRequest;
import com.dental.backend.dto.response.DentalServiceResponse;
import com.dental.backend.entity.DentalService;
import com.dental.backend.exception.ResourceNotFoundException;
import com.dental.backend.repository.DentalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DentalServiceService {

    private final DentalServiceRepository dentalServiceRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.cloudfront.domain:}")
    private String cloudFrontDomain;

    public List<DentalServiceResponse> getAllServices() {
        return dentalServiceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DentalServiceResponse> getActiveServices() {
        return dentalServiceRepository.findByActive(true).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DentalServiceResponse getServiceById(String id) {
        DentalService service = dentalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return mapToResponse(service);
    }

    public DentalServiceResponse createService(DentalServiceRequest request) {
        DentalService service = DentalService.builder()
                .id(UUID.randomUUID().toString())
                .serviceCode(request.getServiceCode())
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .detailedProcess(request.getDetailedProcess())
                .price(request.getPrice())
                .maxPrice(request.getMaxPrice())
                .durationMinutes(request.getDurationMinutes())
                .expectedAppointments(request.getExpectedAppointments())
                .doctorSpecialty(request.getDoctorSpecialty())
                .imageUrl(request.getImageUrl())
                .preTreatmentNotes(request.getPreTreatmentNotes())
                .postTreatmentNotes(request.getPostTreatmentNotes())
                .active(request.getActive() != null ? request.getActive() : true)
                .createdAt(Instant.now().toString())
                .build();

        dentalServiceRepository.save(service);
        return mapToResponse(service);
    }

    public DentalServiceResponse updateService(String id, DentalServiceRequest request) {
        DentalService service = dentalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setServiceCode(request.getServiceCode());
        service.setName(request.getName());
        service.setCategory(request.getCategory());
        service.setDescription(request.getDescription());
        service.setDetailedProcess(request.getDetailedProcess());
        service.setPrice(request.getPrice());
        service.setMaxPrice(request.getMaxPrice());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setExpectedAppointments(request.getExpectedAppointments());
        service.setDoctorSpecialty(request.getDoctorSpecialty());
        // Only update imageUrl if the request provides one, otherwise keep the existing S3 key
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            service.setImageUrl(request.getImageUrl());
        }
        service.setPreTreatmentNotes(request.getPreTreatmentNotes());
        service.setPostTreatmentNotes(request.getPostTreatmentNotes());
        service.setActive(request.getActive());
        service.setUpdatedAt(Instant.now().toString());

        dentalServiceRepository.save(service);
        return mapToResponse(service);
    }

    public void deleteService(String id) {
        DentalService service = dentalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
                
        // Delete image from S3 if exists
        if (service.getImageUrl() != null && !service.getImageUrl().isBlank() && !service.getImageUrl().startsWith("http")) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(service.getImageUrl())
                        .build());
            } catch (Exception ignored) {}
        }
        
        dentalServiceRepository.deleteById(id);
    }

    public DentalServiceResponse uploadImage(String id, MultipartFile file) throws IOException {
        DentalService service = dentalServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        // Delete old image from S3 if exists
        if (service.getImageUrl() != null && !service.getImageUrl().isBlank() && !service.getImageUrl().startsWith("http")) {
            try {
                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(service.getImageUrl())
                        .build());
            } catch (Exception ignored) {}
        }

        String extension = "jpg";
        if (file.getOriginalFilename() != null && file.getOriginalFilename().contains(".")) {
            extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1).toLowerCase();
        }
        
        String key = "services/" + id + "/" + UUID.randomUUID() + "." + extension;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        service.setImageUrl(key);
        service.setUpdatedAt(Instant.now().toString());
        dentalServiceRepository.save(service);

        return mapToResponse(service);
    }

    private DentalServiceResponse mapToResponse(DentalService service) {
        String presignedUrl = service.getImageUrl();
        if (presignedUrl != null && !presignedUrl.isBlank() && !presignedUrl.startsWith("http")) {
            if (cloudFrontDomain != null && !cloudFrontDomain.isBlank()) {
                String domain = cloudFrontDomain.trim();
                if (!domain.startsWith("http")) {
                    domain = "https://" + domain;
                }
                if (domain.endsWith("/")) {
                    domain = domain.substring(0, domain.length() - 1);
                }
                presignedUrl = domain + "/" + presignedUrl;
            } else {
                try {
                    GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofHours(1))
                            .getObjectRequest(GetObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(presignedUrl)
                                    .build())
                            .build();
                    presignedUrl = s3Presigner.presignGetObject(presignRequest).url().toString();
                } catch (Exception ignored) {}
            }
        }

        return DentalServiceResponse.builder()
                .id(service.getId())
                .serviceCode(service.getServiceCode())
                .name(service.getName())
                .category(service.getCategory())
                .description(service.getDescription())
                .detailedProcess(service.getDetailedProcess())
                .price(service.getPrice())
                .maxPrice(service.getMaxPrice())
                .durationMinutes(service.getDurationMinutes())
                .expectedAppointments(service.getExpectedAppointments())
                .doctorSpecialty(service.getDoctorSpecialty())
                .imageUrl(presignedUrl)
                .preTreatmentNotes(service.getPreTreatmentNotes())
                .postTreatmentNotes(service.getPostTreatmentNotes())
                .active(service.getActive())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .build();
    }
}
