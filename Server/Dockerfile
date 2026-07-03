# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-22 AS builder
WORKDIR /app

# Copy the pom.xml file
COPY pom.xml .

# Download dependencies (this step is cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application, skipping tests for faster build
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:22-jre
WORKDIR /app

# Copy the built jar file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose default port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
