package com.gymtracker.component;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;
import java.util.concurrent.TimeUnit;

@Aspect
@Component
@Slf4j
public class MethodLoggingAspect {

    // Track total request time at controller level
    @Around("execution(* com.gymtracker.controller.*.*(..))")
    public Object logRequestTiming(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        String methodName = pjp.getSignature().toShortString();

        if (log.isTraceEnabled()) {
            log.trace("→ REQUEST START: {}", methodName);
        }

        try {
            return pjp.proceed();
        } finally {
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

            if (log.isTraceEnabled()) {
                log.trace("← REQUEST COMPLETE: {} with total time: {} ms", methodName, durationMs);
            }
        }
    }

    // Track individual service method times
    @Around("execution(* com.gymtracker.service.*.*(..))")
    public Object logServiceTiming(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        String methodName = pjp.getSignature().toShortString();

        if (log.isTraceEnabled()) {
            log.trace("→ SERVICE: {}", methodName);
        }

        try {
            return pjp.proceed();
        } finally {
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

            if (log.isTraceEnabled()) {
                log.trace("← SERVICE: {} with total time: {} ms", methodName, durationMs);
            }
        }
    }

    // track Repository method times
    @Around("target(org.springframework.data.repository.CrudRepository)")
    public Object logJpaRepositoryTiming(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        
        String methodName = pjp.getSignature().toShortString();
        if (log.isTraceEnabled()) {
            log.trace("→ REPOSITORY: {}", methodName);
        }

        try {
            return pjp.proceed();
        } finally {
            long durationMs = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);

            if (log.isTraceEnabled()) {
                log.trace("← REPOSITORY: {} with total time: {} ms", methodName, durationMs);
            }
        }
    }
}