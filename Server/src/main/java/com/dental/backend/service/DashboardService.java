package com.dental.backend.service;

import com.dental.backend.dto.response.AdminDashboardResponse;
import com.dental.backend.dto.response.AdminDashboardResponse.ChartData;
import com.dental.backend.entity.Appointment;
import com.dental.backend.entity.DentalService;
import com.dental.backend.entity.User;
import com.dental.backend.repository.AppointmentRepository;
import com.dental.backend.repository.DentalServiceRepository;
import com.dental.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DentalServiceRepository dentalServiceRepository;

    public AdminDashboardResponse getDashboardStats() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        List<User> allUsers = userRepository.findAll();
        List<DentalService> allServices = dentalServiceRepository.findAll();

        Map<String, Double> servicePriceMap = allServices.stream()
                .collect(Collectors.toMap(DentalService::getId, s -> s.getPrice() != null ? s.getPrice() : 0.0));

        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.now();
        String todayStr = today.format(DateTimeFormatter.ISO_LOCAL_DATE);

        long totalAppointmentsToday = 0;
        long pendingAppointments = 0;
        long confirmedAppointments = 0;
        long completedAppointmentsToday = 0;
        double revenueThisMonth = 0.0;

        // Group data by date for the last 7 days
        Map<String, Double> dailyRevenue = new TreeMap<>();
        Map<String, Long> dailyAppointments = new TreeMap<>();
        
        for (int i = 6; i >= 0; i--) {
            String dateStr = today.minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE);
            dailyRevenue.put(dateStr, 0.0);
            dailyAppointments.put(dateStr, 0L);
        }

        for (Appointment appt : allAppointments) {
            String status = appt.getStatus();
            String date = appt.getAppointmentDate(); // format: YYYY-MM-DD
            
            // Pending / Confirmed
            if ("PENDING".equalsIgnoreCase(status)) pendingAppointments++;
            if ("CONFIRMED".equalsIgnoreCase(status)) confirmedAppointments++;
            
            if (date != null) {
                // Today stats
                if (date.equals(todayStr)) {
                    totalAppointmentsToday++;
                    if ("COMPLETED".equalsIgnoreCase(status)) {
                        completedAppointmentsToday++;
                    }
                }
                
                // Revenue for this month
                if ("COMPLETED".equalsIgnoreCase(status)) {
                    try {
                        LocalDate apptDate = LocalDate.parse(date, DateTimeFormatter.ISO_LOCAL_DATE);
                        if (YearMonth.from(apptDate).equals(thisMonth)) {
                            revenueThisMonth += servicePriceMap.getOrDefault(appt.getServiceId(), 0.0);
                        }
                    } catch (Exception ignored) {}
                }
                
                // Chart Data for last 7 days
                if (dailyAppointments.containsKey(date)) {
                    dailyAppointments.put(date, dailyAppointments.get(date) + 1);
                    if ("COMPLETED".equalsIgnoreCase(status)) {
                        double price = servicePriceMap.getOrDefault(appt.getServiceId(), 0.0);
                        dailyRevenue.put(date, dailyRevenue.get(date) + price);
                    }
                }
            }
        }

        long totalPatients = allUsers.stream()
                .filter(u -> "USER".equals(u.getRole()) || "ROLE_USER".equals(u.getRole()))
                .count();

        List<ChartData> chartDataList = new ArrayList<>();
        for (String date : dailyAppointments.keySet()) {
            chartDataList.add(new ChartData(date, dailyRevenue.get(date), dailyAppointments.get(date)));
        }

        return AdminDashboardResponse.builder()
                .totalAppointmentsToday(totalAppointmentsToday)
                .pendingAppointments(pendingAppointments)
                .confirmedAppointments(confirmedAppointments)
                .completedAppointmentsToday(completedAppointmentsToday)
                .revenueThisMonth(revenueThisMonth)
                .totalPatients(totalPatients)
                .revenueChart(chartDataList)
                .build();
    }
}
