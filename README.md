# gym-tracker
Gym Workout tracking application for tracking and storing individual workouts, sessions and comparing data between them

## Tech Stack
- Spring Boot 3.2.0
- Java 17
- Gradle
- Spring Data JPA
- PostgreSQL

## Prerequisites
- Java 17 or higher
- Gradle 8.0 or higher (or use Gradle Wrapper)
- PostgreSQL 12 or higher

## Getting Started

### Build the Project
```bash
./gradlew build
```

### Run the Application
```bash
./gradlew bootRun
```

Or run the main class directly:
```bash
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### Database Setup
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE gymtracker;
   ```
2. Update database credentials in `src/main/resources/application.yml` if needed:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/gymtracker
       username: postgres
       password: postgres
   ```

### Access the Application
- Application: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/api-docs

### Actuator Endpoints
- Health: http://localhost:8080/actuator/health
- Info: http://localhost:8080/actuator/info
- Loggers: http://localhost:8080/actuator/loggers
  - View all loggers: GET /actuator/loggers
  - View specific logger: GET /actuator/loggers/{loggerName}
  - Update logger level: POST /actuator/loggers/{loggerName} with body: `{"configuredLevel": "DEBUG"}`

### Run Tests
```bash
./gradlew test
```

### Gradle Wrapper
If the Gradle Wrapper scripts are not present, generate them locally (you must have Gradle installed for this step):
```cmd
gradle wrapper --gradle-version 8.4.1 --distribution-type all
```
After generating wrapper files, you can run the wrapper directly in Windows:
```cmd
gradlew.bat --version
gradlew.bat tasks --all
```

### Tests & Local DB
Tests are configured to use an in-memory H2 database (test runtime only) by the Gradle `test` task system properties, so you do not need a local PostgreSQL instance to run unit/integration tests.

## Project Structure
```
src/
├── main/
│   ├── java/com/gymtracker/
│   │   └── GymTrackerApplication.java
│   └── resources/
│       └── application.yml
└── test/
    └── java/com/gymtracker/
        └── GymTrackerApplicationTests.java
```