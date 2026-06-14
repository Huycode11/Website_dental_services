package com.dental.backend.repository;

import com.dental.backend.entity.DoctorSchedule;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class DoctorScheduleRepository {

    private final DynamoDbTable<DoctorSchedule> scheduleTable;

    public DoctorScheduleRepository(DynamoDbEnhancedClient enhancedClient) {
        this.scheduleTable = enhancedClient.table("doctor_schedules", TableSchema.fromBean(DoctorSchedule.class));
    }

    public void save(DoctorSchedule schedule) {
        scheduleTable.putItem(schedule);
    }

    public Optional<DoctorSchedule> findById(String id) {
        return Optional.ofNullable(scheduleTable.getItem(Key.builder().partitionValue(id).build()));
    }

    public List<DoctorSchedule> findAll() {
        return scheduleTable.scan().items().stream().collect(Collectors.toList());
    }

    public void deleteById(String id) {
        scheduleTable.deleteItem(Key.builder().partitionValue(id).build());
    }

    public List<DoctorSchedule> findAvailableSlots(String doctorId, String date) {
        return scheduleTable.scan().items().stream()
                .filter(s -> doctorId.equals(s.getDoctorId()) && date.equals(s.getWorkDate()) && !s.getIsBooked())
                .sorted((s1, s2) -> s1.getStartTime().compareTo(s2.getStartTime()))
                .collect(Collectors.toList());
    }

    public List<DoctorSchedule> findByDoctorIdAndWorkDate(String doctorId, String workDate) {
        return scheduleTable.scan().items().stream()
                .filter(s -> doctorId.equals(s.getDoctorId()) && workDate.equals(s.getWorkDate()))
                .collect(Collectors.toList());
    }

    public boolean existsByDoctorIdAndWorkDateAndStartTime(String doctorId, String workDate, String startTime) {
        return scheduleTable.scan().items().stream()
                .anyMatch(s -> doctorId.equals(s.getDoctorId()) 
                        && workDate.equals(s.getWorkDate()) 
                        && startTime.equals(s.getStartTime()));
    }
}
