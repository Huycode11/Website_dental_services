package com.dental.backend.service;

import com.dental.backend.dto.request.UpdateProfileRequest;
import com.dental.backend.dto.response.UserProfileResponse;
import com.dental.backend.entity.User;
import com.dental.backend.entity.Doctor;
import com.dental.backend.repository.UserRepository;
import com.dental.backend.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = null;
        if ("DOCTOR".equals(user.getRole()) || "ROLE_DOCTOR".equals(user.getRole())) {
            doctor = doctorRepository.findByUserId(user.getId()).orElseGet(() -> {
                Doctor newDoc = new Doctor();
                newDoc.setId(UUID.randomUUID().toString());
                newDoc.setUserId(user.getId());
                newDoc.setCreatedAt(Instant.now().toString());
                newDoc.setActive(true);
                doctorRepository.save(newDoc);
                return newDoc;
            });
        }
        
        return mapToResponse(user, doctor);
    }

    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        user.setUpdatedAt(Instant.now().toString());

        userRepository.save(user);
        
        Doctor doctor = null;
        if ("DOCTOR".equals(user.getRole()) || "ROLE_DOCTOR".equals(user.getRole())) {
            doctor = doctorRepository.findByUserId(user.getId()).orElseGet(() -> {
                Doctor newDoc = new Doctor();
                newDoc.setId(UUID.randomUUID().toString());
                newDoc.setUserId(user.getId());
                newDoc.setCreatedAt(Instant.now().toString());
                newDoc.setActive(true);
                return newDoc;
            });
            
            if (request.getSpecialty() != null) doctor.setSpecialty(request.getSpecialty());
            if (request.getExperience() != null) doctor.setExperience(request.getExperience());
            if (request.getDescription() != null) doctor.setDescription(request.getDescription());
            if (request.getFacebookLink() != null) doctor.setFacebookLink(request.getFacebookLink());
            if (request.getTwitterLink() != null) doctor.setTwitterLink(request.getTwitterLink());
            if (request.getLinkedinLink() != null) doctor.setLinkedinLink(request.getLinkedinLink());
            
            doctorRepository.save(doctor);
        }

        return mapToResponse(user, doctor);
    }

    public UserProfileResponse uploadAvatar(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete old avatar from S3 if exists
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
            try {
                String oldKey = extractKeyFromS3Key(user.getAvatarUrl());
                if (!oldKey.isEmpty()) {
                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(oldKey)
                            .build());
                }
            } catch (Exception ignored) {}
        }

        // Build S3 key — store the key directly (not full URL)
        String extension = getExtension(file.getOriginalFilename());
        String key = "avatars/" + user.getId() + "/" + UUID.randomUUID() + "." + extension;

        // Upload to S3
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes())
        );

        // Save the S3 key (not a URL) so we can generate pre-signed URLs later
        user.setAvatarUrl(key);
        user.setUpdatedAt(Instant.now().toString());
        userRepository.save(user);

        Doctor doctor = null;
        if ("DOCTOR".equals(user.getRole()) || "ROLE_DOCTOR".equals(user.getRole())) {
            doctor = doctorRepository.findByUserId(user.getId()).orElse(null);
        }

        return mapToResponse(user, doctor);
    }

    /**
     * Generate a pre-signed URL valid for 1 hour for a given S3 key.
     */
    private String generatePresignedUrl(String key) {
        if (key == null || key.isBlank()) return null;
        try {
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofHours(1))
                    .getObjectRequest(GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .build())
                    .build();
            return s3Presigner.presignGetObject(presignRequest).url().toString();
        } catch (Exception e) {
            return null;
        }
    }

    private UserProfileResponse mapToResponse(User user, Doctor doctor) {
        // avatarUrl field in DB stores the S3 key; generate a pre-signed URL for the response
        String presignedUrl = null;
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
            // Support both legacy full URLs and new key-only format
            String key = extractKeyFromS3Key(user.getAvatarUrl());
            presignedUrl = generatePresignedUrl(key.isEmpty() ? user.getAvatarUrl() : key);
        }

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(presignedUrl)
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
                
        if (doctor != null) {
            response.setSpecialty(doctor.getSpecialty());
            response.setExperience(doctor.getExperience());
            response.setDescription(doctor.getDescription());
            response.setFacebookLink(doctor.getFacebookLink());
            response.setTwitterLink(doctor.getTwitterLink());
            response.setLinkedinLink(doctor.getLinkedinLink());
        }
        
        return response;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    /**
     * If the stored value is a full https URL, extract the S3 key from it.
     * If it's already a key (e.g. "avatars/..."), return as-is.
     */
    private String extractKeyFromS3Key(String value) {
        if (value == null) return "";
        if (value.startsWith("http")) {
            int idx = value.indexOf(".amazonaws.com/");
            if (idx == -1) return "";
            return value.substring(idx + ".amazonaws.com/".length());
        }
        return value; // already a key
    }
}
