package com.gymtracker.component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

public class TransactionIdRequestFilter extends OncePerRequestFilter {

    private static final String TXN_ID = "transactionId";
    private static final String HEADER = "X-Transaction-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Get from header or generate new
        String txnId = request.getHeader(HEADER);
        if (txnId == null || txnId.isEmpty()) {
            txnId = UUID.randomUUID().toString().substring(0, 8);
        }

        try {
            // Put txnId in MDC (for logging)
            MDC.put(TXN_ID, txnId);

            // Add txnId to response header
            response.setHeader(HEADER, txnId);

            // Continue filter chain
            filterChain.doFilter(request, response);

        } finally {
            // Clean up to avoid leakage across threads
            MDC.clear();
        }
    }
}