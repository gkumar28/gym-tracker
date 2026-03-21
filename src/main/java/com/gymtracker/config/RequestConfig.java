package com.gymtracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.gymtracker.component.TransactionIdRequestFilter;

@Configuration
public class RequestConfig {
    
    @Bean
    TransactionIdRequestFilter transactionIdRequestFilter() {
        return new TransactionIdRequestFilter();
    }
}
