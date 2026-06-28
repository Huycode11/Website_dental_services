package com.dental.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalAppointmentsToday;
    private long pendingAppointments;
    private long confirmedAppointments;
    private long completedAppointmentsToday;
    private double revenueThisMonth;
    private long totalPatients;
    private List<ChartData> revenueChart;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChartData {
        private String date;
        private double revenue;
        private long appointments;
    }
}
