package com.dental.backend.service;

import com.dental.backend.dto.request.CreateDoctorRequest;
import com.dental.backend.dto.request.UpdateDoctorAdminRequest;
import com.dental.backend.dto.response.DoctorPublicResponse;
import com.dental.backend.dto.response.AdminDoctorResponse;
import com.dental.backend.entity.Doctor;
import com.dental.backend.entity.User;
import com.dental.backend.repository.DoctorRepository;
import com.dental.backend.repository.UserRepository;
import com.dental.backend.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final S3Presigner s3Presigner;
    private final PasswordEncoder passwordEncoder;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.cloudfront.domain:}")
    private String cloudFrontDomain;

    public List<DoctorPublicResponse> getAllActiveDoctors() {
        return doctorRepository.findAllActiveWithUser().stream().map(doctor -> {
            User user = userRepository.findById(doctor.getUserId()).orElse(null);
            
            String fullName = user != null ? user.getFullName() : "Unknown Doctor";
            String avatarKey = user != null ? user.getAvatarUrl() : null;
            
            String presignedUrl = null;
            if (avatarKey != null && !avatarKey.isBlank()) {
                String key = extractKeyFromS3Key(avatarKey);
                presignedUrl = generatePresignedUrl(key.isEmpty() ? avatarKey : key);
            }
            
            return DoctorPublicResponse.builder()
                    .id(doctor.getId())
                    .userId(doctor.getUserId())
                    .fullName(fullName)
                    .specialty(doctor.getSpecialty())
                    .description(doctor.getDescription())
                    .experience(doctor.getExperience())
                    .avatarUrl(presignedUrl)
                    .facebookLink(doctor.getFacebookLink())
                    .twitterLink(doctor.getTwitterLink())
                    .linkedinLink(doctor.getLinkedinLink())
                    .build();
        }).collect(Collectors.toList());
    }

    public List<AdminDoctorResponse> getAllDoctorsForAdmin() {
        return doctorRepository.findAll().stream().map(doctor -> {
            User user = userRepository.findById(doctor.getUserId()).orElse(null);
            
            String fullName = user != null ? user.getFullName() : "Unknown";
            String phone = user != null ? user.getPhone() : "";
            String email = user != null ? user.getEmail() : "";
            String role = user != null ? user.getRole() : "DOCTOR";
            Boolean active = user != null ? user.getActive() : false;
            String avatarKey = user != null ? user.getAvatarUrl() : null;
            
            String presignedUrl = null;
            if (avatarKey != null && !avatarKey.isBlank()) {
                String key = extractKeyFromS3Key(avatarKey);
                presignedUrl = generatePresignedUrl(key.isEmpty() ? avatarKey : key);
            }
            
            long patientsServed = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctor.getId())
                    .stream()
                    .filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus()))
                    .count();

            return AdminDoctorResponse.builder()
                    .id(doctor.getId())
                    .userId(doctor.getUserId())
                    .fullName(fullName)
                    .phone(phone)
                    .email(email)
                    .specialty(doctor.getSpecialty())
                    .experience(doctor.getExperience())
                    .description(doctor.getDescription())
                    .facebookLink(doctor.getFacebookLink())
                    .twitterLink(doctor.getTwitterLink())
                    .linkedinLink(doctor.getLinkedinLink())
                    .avatarUrl(presignedUrl)
                    .role(role)
                    .active(active)
                    .createdAt(doctor.getCreatedAt())
                    .patientsServed(patientsServed)
                    .build();
        }).collect(Collectors.toList());
    }

    public AdminDoctorResponse createDoctor(CreateDoctorRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role("DOCTOR")
                .active(true)
                .createdAt(Instant.now().toString())
                .updatedAt(Instant.now().toString())
                .build();
        userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .id(UUID.randomUUID().toString())
                .userId(user.getId())
                .specialty(request.getSpecialty())
                .experience(request.getExperience())
                .description(request.getDescription())
                .avatarUrl(request.getAvatarUrl())
                .facebookLink(request.getFacebookLink())
                .twitterLink(request.getTwitterLink())
                .linkedinLink(request.getLinkedinLink())
                .active(true)
                .createdAt(Instant.now().toString())
                .build();
        doctorRepository.save(doctor);

        return AdminDoctorResponse.builder()
                .id(doctor.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .specialty(doctor.getSpecialty())
                .experience(doctor.getExperience())
                .description(doctor.getDescription())
                .facebookLink(doctor.getFacebookLink())
                .twitterLink(doctor.getTwitterLink())
                .linkedinLink(doctor.getLinkedinLink())
                .avatarUrl(doctor.getAvatarUrl())
                .role(user.getRole())
                .active(doctor.getActive())
                .createdAt(doctor.getCreatedAt())
                .build();
    }

    public AdminDoctorResponse updateDoctor(String id, UpdateDoctorAdminRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        
        User user = userRepository.findById(doctor.getUserId()).orElse(null);
        if (user != null) {
            user.setFullName(request.getFullName());
            user.setPhone(request.getPhone());
            user.setUpdatedAt(Instant.now().toString());
            userRepository.save(user);
        }

        doctor.setSpecialty(request.getSpecialty());
        doctor.setExperience(request.getExperience());
        doctor.setDescription(request.getDescription());
        doctor.setAvatarUrl(request.getAvatarUrl());
        doctor.setFacebookLink(request.getFacebookLink());
        doctor.setTwitterLink(request.getTwitterLink());
        doctor.setLinkedinLink(request.getLinkedinLink());
        doctorRepository.save(doctor);

        return AdminDoctorResponse.builder()
                .id(doctor.getId())
                .userId(doctor.getUserId())
                .fullName(user != null ? user.getFullName() : "Unknown")
                .phone(user != null ? user.getPhone() : "")
                .email(user != null ? user.getEmail() : "")
                .specialty(doctor.getSpecialty())
                .experience(doctor.getExperience())
                .description(doctor.getDescription())
                .facebookLink(doctor.getFacebookLink())
                .twitterLink(doctor.getTwitterLink())
                .linkedinLink(doctor.getLinkedinLink())
                .avatarUrl(doctor.getAvatarUrl())
                .role(user != null ? user.getRole() : "DOCTOR")
                .active(doctor.getActive())
                .createdAt(doctor.getCreatedAt())
                .build();
    }

    public void deleteDoctor(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        
        User user = userRepository.findById(doctor.getUserId()).orElse(null);
        if (user != null) {
            user.setRole("PATIENT");
            user.setUpdatedAt(Instant.now().toString());
            userRepository.save(user);
        }
        
        doctorRepository.deleteById(id);
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

    private String extractKeyFromS3Key(String value) {
        if (value == null) return "";
        if (value.startsWith("http")) {
            int idx = value.indexOf(".amazonaws.com/");
            if (idx == -1) return "";
            return value.substring(idx + ".amazonaws.com/".length());
        }
        return value;
    }
}
