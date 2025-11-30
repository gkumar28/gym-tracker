package com.gymtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ComponentScan(basePackages = "com.gymtracker")
@EntityScan(basePackages = "com.gymtracker.entity")
@EnableJpaRepositories(basePackages = "com.gymtracker.repository")
public class GymTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GymTrackerApplication.class, args);
    }
}

