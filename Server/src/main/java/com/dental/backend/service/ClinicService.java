package com.dental.backend.service;

import com.dental.backend.dto.request.ClinicRequest;
import com.dental.backend.dto.response.ClinicResponse;
import com.dental.backend.entity.Clinic;
import com.dental.backend.repository.ClinicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final ClinicRepository clinicRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.cloudfront.domain:}")
    private String cloudFrontDomain;

    public List<ClinicResponse> getAllClinics() {
        return clinicRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ClinicResponse getClinicById(String id) {
        Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new RuntimeException("Clinic not found"));
        return mapToResponse(clinic);
    }

    public ClinicResponse createClinic(ClinicRequest request) {
        Clinic clinic = Clinic.builder()
                .id(UUID.randomUUID().toString())
                .name(request.getName())
                .address(request.getAddress())
                .hotline(request.getHotline())
                .email(request.getEmail())
                .workingHours(request.getWorkingHours())
                .googleMapsUrl(request.getGoogleMapsUrl())
                .createdAt(Instant.now().toString())
                .build();
        
        clinicRepository.save(clinic);
        return mapToResponse(clinic);
    }

    public ClinicResponse updateClinic(String id, ClinicRequest request) {
        Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new RuntimeException("Clinic not found"));
        
        clinic.setName(request.getName());
        clinic.setAddress(request.getAddress());
        clinic.setHotline(request.getHotline());
        clinic.setEmail(request.getEmail());
        clinic.setWorkingHours(request.getWorkingHours());
        clinic.setGoogleMapsUrl(request.getGoogleMapsUrl());
        clinic.setUpdatedAt(Instant.now().toString());
        
        clinicRepository.save(clinic);
        return mapToResponse(clinic);
    }

    public void deleteClinic(String id) {
        Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new RuntimeException("Clinic not found"));
        
        // Delete image from S3 if exists
        if (clinic.getImageUrl() != null && !clinic.getImageUrl().isBlank()) {
            try {
                String oldKey = extractKeyFromS3Key(clinic.getImageUrl());
                if (!oldKey.isEmpty()) {
                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(oldKey)
                            .build());
                }
            } catch (Exception ignored) {}
        }
        
        clinicRepository.deleteById(id);
    }

    public ClinicResponse uploadImage(String id, MultipartFile file) throws IOException {
        Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new RuntimeException("Clinic not found"));

        if (clinic.getImageUrl() != null && !clinic.getImageUrl().isBlank()) {
            try {
                String oldKey = extractKeyFromS3Key(clinic.getImageUrl());
                if (!oldKey.isEmpty()) {
                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(oldKey)
                            .build());
                }
            } catch (Exception ignored) {}
        }

        String extension = getExtension(file.getOriginalFilename());
        String key = "clinics/" + clinic.getId() + "/" + UUID.randomUUID() + "." + extension;

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        clinic.setImageUrl(key);
        clinic.setUpdatedAt(Instant.now().toString());
        clinicRepository.save(clinic);

        return mapToResponse(clinic);
    }

    private ClinicResponse mapToResponse(Clinic clinic) {
        String presignedUrl = null;
        if (clinic.getImageUrl() != null && !clinic.getImageUrl().isBlank()) {
            String key = extractKeyFromS3Key(clinic.getImageUrl());
            presignedUrl = generatePresignedUrl(key.isEmpty() ? clinic.getImageUrl() : key);
        }

        return ClinicResponse.builder()
                .id(clinic.getId())
                .name(clinic.getName())
                .address(clinic.getAddress())
                .hotline(clinic.getHotline())
                .email(clinic.getEmail())
                .workingHours(clinic.getWorkingHours())
                .googleMapsUrl(clinic.getGoogleMapsUrl())
                .imageUrl(presignedUrl)
                .createdAt(clinic.getCreatedAt())
                .updatedAt(clinic.getUpdatedAt())
                .build();
    }

    private String generatePresignedUrl(String key) {
        if (key == null || key.isBlank()) return null;
        if (key.startsWith("http")) return key;
        
        if (cloudFrontDomain != null && !cloudFrontDomain.isBlank()) {
            String domain = cloudFrontDomain.trim();
            if (!domain.startsWith("http")) {
                domain = "https://" + domain;
            }
            if (domain.endsWith("/")) {
                domain = domain.substring(0, domain.length() - 1);
            }
            return domain + "/" + key;
        }

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(1))
                    .getObjectRequest(getObjectRequest)
                    .build();

            return s3Presigner.presignGetObject(presignRequest).url().toString();
        } catch (Exception e) {
            return null;
        }
    }

    private String extractKeyFromS3Key(String s3Key) {
        if (s3Key == null) return "";
        int queryIndex = s3Key.indexOf("?");
        if (queryIndex != -1) {
            s3Key = s3Key.substring(0, queryIndex);
        }
        if (s3Key.startsWith("https://")) {
            int pathStart = s3Key.indexOf('/', 8);
            if (pathStart != -1) {
                return s3Key.substring(pathStart + 1);
            }
        }
        return s3Key;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
