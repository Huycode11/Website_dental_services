package com.dental.backend.service;

import com.dental.backend.dto.request.AppointmentRequest;
import com.dental.backend.dto.response.AppointmentResponse;
import com.dental.backend.dto.response.PageResponse;
import com.dental.backend.entity.Appointment;
import com.dental.backend.entity.Clinic;
import com.dental.backend.entity.Doctor;
import com.dental.backend.entity.User;
import com.dental.backend.repository.AppointmentRepository;
import com.dental.backend.repository.ClinicRepository;
import com.dental.backend.repository.DoctorRepository;
import com.dental.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final ClinicRepository clinicRepository;
    private final UserService userService;
    private final EmailService emailService;

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        String id = UUID.randomUUID().toString();
        String createdAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        
        // Parse startTime and endTime from request.getTime() (e.g. "09:00 - 10:00")
        String startTime = request.getTime();
        String endTime = "";
        if (request.getTime() != null && request.getTime().contains(" - ")) {
            String[] times = request.getTime().split(" - ");
            if (times.length == 2) {
                startTime = times[0].trim();
                endTime = times[1].trim();
            }
        } else if (request.getTime() != null && !request.getTime().isEmpty()) {
            try {
                endTime = java.time.LocalTime.parse(request.getTime()).plusHours(1).toString();
            } catch (Exception e) {
                endTime = request.getTime();
            }
        }
        
        // Use scheduleId to store Date and Time for backward compatibility
        String scheduleStr = request.getDate() + "|" + request.getTime();

        Appointment appointment = Appointment.builder()
                .id(id)
                .clinicId(request.getClinicId())
                .patientId(request.getPatientId() != null && !request.getPatientId().isEmpty() ? request.getPatientId() : "GUEST")
                .doctorId(request.getDoctorId() != null ? request.getDoctorId() : "UNASSIGNED")
                .serviceId(request.getServiceId())
                .scheduleId(scheduleStr)
                .appointmentDate(request.getDate())
                .startTime(startTime)
                .endTime(endTime)
                .status("PENDING")
                .notes(request.getNotes())
                .createdAt(createdAt)
                .build();

        appointmentRepository.save(appointment);

        // Create effectively final variable for lambda
        final String finalStartTime = startTime;

        // Send booking confirmation email if patientId is an email
        if (request.getPatientId() != null && request.getPatientId().contains("@")) {
            // Run asynchronously to not block the response
            new Thread(() -> {
                try {
                    emailService.sendBookingConfirmationEmail(request.getPatientId(), request.getDate(), finalStartTime);
                } catch (Exception e) {
                    // Logged in EmailService
                }
            }).start();
        }

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .sorted((a1, a2) -> {
                    String d1 = a1.getCreatedAt() != null ? a1.getCreatedAt() : "";
                    String d2 = a2.getCreatedAt() != null ? a2.getCreatedAt() : "";
                    return d2.compareTo(d1);
                })
                .collect(Collectors.toList());
    }

    public PageResponse<AppointmentResponse> getAppointmentsPage(int page, int size, String status, String doctorId) {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        // Filter by doctorId if provided
        if (doctorId != null) {
            allAppointments = allAppointments.stream()
                    .filter(a -> doctorId.equals(a.getDoctorId()))
                    .collect(Collectors.toList());
        }
        
        // Filter by status if provided (can be comma-separated list like "ASSIGNED,CONFIRMED")
        if (status != null && !status.isEmpty()) {
            List<String> statuses = List.of(status.split(","));
            allAppointments = allAppointments.stream()
                    .filter(a -> statuses.contains(a.getStatus()))
                    .collect(Collectors.toList());
        }

        // Sort descending by created at
        allAppointments.sort((a1, a2) -> {
            String d1 = a1.getCreatedAt() != null ? a1.getCreatedAt() : "";
            String d2 = a2.getCreatedAt() != null ? a2.getCreatedAt() : "";
            return d2.compareTo(d1);
        });

        int totalElements = allAppointments.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);
        
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalElements);
        
        List<AppointmentResponse> content = (fromIndex < totalElements) 
                ? allAppointments.subList(fromIndex, toIndex).stream().map(this::mapToResponse).collect(Collectors.toList()) 
                : List.of();

        return PageResponse.<AppointmentResponse>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .build();
    }

    public List<AppointmentResponse> getDoctorAppointments(String doctorId) {
        return appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::mapToResponse)
                .sorted((a1, a2) -> {
                    String d1 = a1.getCreatedAt() != null ? a1.getCreatedAt() : "";
                    String d2 = a2.getCreatedAt() != null ? a2.getCreatedAt() : "";
                    return d2.compareTo(d1);
                })
                .collect(Collectors.toList());
    }

    public AppointmentResponse assignDoctor(String id, String doctorId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        // Extract or fallback for date/times
        String appDate = appointment.getAppointmentDate();
        String sTime = appointment.getStartTime();
        String eTime = appointment.getEndTime();
        if (appDate == null || sTime == null || eTime == null) {
            String[] parsed = parseScheduleId(appointment.getScheduleId());
            appDate = parsed[0];
            sTime = parsed[1];
            eTime = parsed[2];
        }

        if (hasDoctorScheduleConflict(doctorId, appDate, sTime, eTime, appointment.getId())) {
            throw new RuntimeException("Bác sĩ đã có lịch khám trùng trong khung giờ này.");
        }

        appointment.setDoctorId(doctorId);
        appointment.setStatus("ASSIGNED");
        appointmentRepository.save(appointment);

        // Send email notification to doctor asynchronously
        final String finalAppDate = appDate;
        final String finalSTime = sTime;
        new Thread(() -> {
            try {
                doctorRepository.findById(doctorId).ifPresent(doctor -> {
                    userRepository.findById(doctor.getUserId()).ifPresent(user -> {
                        String doctorEmail = user.getEmail();
                        if (doctorEmail != null && doctorEmail.contains("@")) {
                            String patientName = appointment.getPatientId();
                            if (patientName != null && patientName.contains("@")) {
                                // Attempt to find patient's name if they exist
                                userRepository.findByEmail(patientName).ifPresent(patient -> {
                                    emailService.sendDoctorNotificationEmail(doctorEmail, patient.getFullName(), finalAppDate, finalSTime);
                                });
                            } else {
                                emailService.sendDoctorNotificationEmail(doctorEmail, patientName != null ? patientName : "Khách", finalAppDate, finalSTime);
                            }
                        }
                    });
                });
            } catch (Exception e) {
                // Ignore background task exceptions
            }
        }).start();

        return mapToResponse(appointment);
    }
    public List<AppointmentResponse> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateStatus(String id, String status, String cancelReason, String expectedDoctorId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (expectedDoctorId != null && !expectedDoctorId.equals(appointment.getDoctorId())) {
             throw new RuntimeException("Bạn không có quyền cập nhật lịch hẹn này");
        }
        
        if ("CONFIRMED".equals(status) && !"UNASSIGNED".equals(appointment.getDoctorId())) {
            String appDate = appointment.getAppointmentDate();
            String sTime = appointment.getStartTime();
            String eTime = appointment.getEndTime();
            if (appDate == null || sTime == null || eTime == null) {
                String[] parsed = parseScheduleId(appointment.getScheduleId());
                appDate = parsed[0];
                sTime = parsed[1];
                eTime = parsed[2];
            }
            if (hasDoctorScheduleConflict(appointment.getDoctorId(), appDate, sTime, eTime, appointment.getId())) {
                throw new RuntimeException("Không thể nhận lịch vì bác sĩ đã có lịch khám trùng thời gian.");
            }
        }

        appointment.setStatus(status);
        if (cancelReason != null && !cancelReason.trim().isEmpty()) {
            appointment.setCancelReason(cancelReason);
        }

        appointmentRepository.save(appointment);
        return mapToResponse(appointment);
    }

    private String[] parseScheduleId(String scheduleId) {
        String date = "";
        String sTime = "";
        String eTime = "";
        if (scheduleId != null && scheduleId.contains("|")) {
            String[] parts = scheduleId.split("\\|");
            if (parts.length == 2) {
                date = parts[0];
                String timeStr = parts[1];
                if (timeStr.contains(" - ")) {
                    String[] times = timeStr.split(" - ");
                    sTime = times[0].trim();
                    eTime = times[1].trim();
                } else {
                    sTime = timeStr;
                    try {
                        eTime = java.time.LocalTime.parse(timeStr).plusHours(1).toString();
                    } catch (Exception e) {
                        eTime = timeStr;
                    }
                }
            }
        }
        return new String[]{date, sTime, eTime};
    }

    public boolean hasDoctorScheduleConflict(String doctorId, String appointmentDate, String startTimeStr, String endTimeStr, String currentAppointmentId) {
        if (appointmentDate == null || startTimeStr == null || startTimeStr.isEmpty()) {
            return false;
        }
        
        if (endTimeStr == null || endTimeStr.isEmpty() || endTimeStr.equals(startTimeStr)) {
            try {
                endTimeStr = java.time.LocalTime.parse(startTimeStr).plusHours(1).toString();
            } catch (Exception e) {
                endTimeStr = startTimeStr;
            }
        }
        
        java.time.LocalTime newStart;
        java.time.LocalTime newEnd;
        try {
            newStart = java.time.LocalTime.parse(startTimeStr);
            newEnd = java.time.LocalTime.parse(endTimeStr);
        } catch (Exception e) {
            return false;
        }

        List<Appointment> doctorAppointments = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        
        for (Appointment a : doctorAppointments) {
            if (a.getId().equals(currentAppointmentId)) continue;
            
            if (!"ASSIGNED".equals(a.getStatus()) && !"CONFIRMED".equals(a.getStatus())) {
                continue;
            }

            String existDate = a.getAppointmentDate();
            String existStartStr = a.getStartTime();
            String existEndStr = a.getEndTime();
            
            if (existDate == null || existStartStr == null || existEndStr == null) {
                String[] parsed = parseScheduleId(a.getScheduleId());
                existDate = parsed[0];
                existStartStr = parsed[1];
                existEndStr = parsed[2];
            }
            
            if (!appointmentDate.equals(existDate)) continue;
            
            try {
                LocalTime existStart = LocalTime.parse(existStartStr);
                LocalTime existEnd = LocalTime.parse(existEndStr);
                
                // newStart < existingEnd && newEnd > existingStart
                if (newStart.isBefore(existEnd) && newEnd.isAfter(existStart)) {
                    return true;
                }
            } catch (Exception e) {
                // skip if parsing fails
            }
        }
        return false;
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        String date = appointment.getAppointmentDate();
        String sTime = appointment.getStartTime();
        String eTime = appointment.getEndTime();
        String time = "";

        if (date == null || sTime == null || eTime == null) {
            if (appointment.getScheduleId() != null && appointment.getScheduleId().contains("|")) {
                String[] parts = appointment.getScheduleId().split("\\|");
                if (parts.length == 2) {
                    date = parts[0];
                    time = parts[1];
                }
            }
        } else {
            time = sTime + " - " + eTime;
        }
        
        String patientName = null;
        String patientAvatar = null;
        if (appointment.getPatientId() != null && !appointment.getPatientId().equals("GUEST")) {
            try {
                User user = userRepository.findByEmail(appointment.getPatientId()).orElse(null);
                if (user != null) {
                    patientName = user.getFullName();
                    if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
                        String key = userService.extractKeyFromS3Key(user.getAvatarUrl());
                        patientAvatar = userService.generatePresignedUrl(key.isEmpty() ? user.getAvatarUrl() : key);
                    }
                }
            } catch (Exception e) {
                // Ignore lookup errors
            }
        }
        
        String clinicName = null;
        if (appointment.getClinicId() != null && !appointment.getClinicId().isBlank()) {
            try {
                Clinic clinic = clinicRepository.findById(appointment.getClinicId()).orElse(null);
                if (clinic != null) {
                    clinicName = clinic.getName();
                }
            } catch (Exception e) {
                // Ignore lookup errors
            }
        }

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .doctorId(appointment.getDoctorId())
                .serviceId(appointment.getServiceId())
                .scheduleId(appointment.getScheduleId())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .cancelReason(appointment.getCancelReason())
                .createdAt(appointment.getCreatedAt())
                .date(date)
                .time(time)
                .patientName(patientName)
                .patientAvatar(patientAvatar)
                .clinicId(appointment.getClinicId())
                .clinicName(clinicName)
                .build();
    }
}
