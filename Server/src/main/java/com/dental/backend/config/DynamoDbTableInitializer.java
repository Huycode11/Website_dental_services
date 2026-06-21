package com.dental.backend.config;

import com.dental.backend.entity.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.services.dynamodb.model.ResourceInUseException;

@Configuration
public class DynamoDbTableInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DynamoDbTableInitializer.class);
    private final DynamoDbEnhancedClient enhancedClient;

    public DynamoDbTableInitializer(DynamoDbEnhancedClient enhancedClient) {
        this.enhancedClient = enhancedClient;
    }

    @PostConstruct
    public void createTables() {
        logger.info("Checking and creating DynamoDB tables if they do not exist...");
        
        createTableIfNotExists("users", User.class);
        createTableIfNotExists("invoices", Invoice.class);
        createTableIfNotExists("feedbacks", Feedback.class);
        createTableIfNotExists("doctor_schedules", DoctorSchedule.class);
        createTableIfNotExists("doctors", Doctor.class);
        createTableIfNotExists("services", DentalService.class);
        createTableIfNotExists("consultations", Consultation.class);
        createTableIfNotExists("blogs", Blog.class);
        createTableIfNotExists("appointments", Appointment.class);
        createTableIfNotExists("categories", Category.class);
        createTableIfNotExists("specialties", Specialty.class);
        
        logger.info("DynamoDB tables initialization completed.");
    }

    private <T> void createTableIfNotExists(String tableName, Class<T> beanClass) {
        try {
            enhancedClient.table(tableName, TableSchema.fromBean(beanClass)).createTable();
            logger.info("Successfully created table: {}", tableName);
        } catch (ResourceInUseException e) {
            logger.info("Table already exists: {}", tableName);
        } catch (Exception e) {
            logger.error("Error creating table {}: {}", tableName, e.getMessage());
        }
    }
}
