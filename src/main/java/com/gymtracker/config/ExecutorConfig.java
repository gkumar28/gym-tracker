package com.gymtracker.config;

import java.util.Map;

import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class ExecutorConfig {
    
    @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setMaxPoolSize(16);
        executor.setCorePoolSize(0);
        executor.setQueueCapacity(1024);
        executor.setThreadNamePrefix("async-executor-");
        executor.setTaskDecorator(runnable -> {
            Map<String, String> context = MDC.getCopyOfContextMap();
            return () -> {
                MDC.setContextMap(context);
                try {
                    runnable.run();
                } finally {
                    MDC.clear();
                }
            };
        });
        return executor;
    }
}
