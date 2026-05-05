package com.internship.tool.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.entity.AuditLog;
import com.internship.tool.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
// import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

// @Aspect
// @Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Around("execution(* com.internship.tool.service..*(..)) && " +
            "(execution(* *create*(..)) || " +
            "execution(* *update*(..)) || " +
            "execution(* *delete*(..)))")
    public Object auditServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {

        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String entityType = className.replace("ServiceImpl", "").replace("Service", "");

        Object[] args = joinPoint.getArgs();
        Object result = null;
        String oldValues = null;
        String newValues = null;

        try {
            result = joinPoint.proceed();

            // Capture new values
            if (result != null) {
                newValues = objectMapper.writeValueAsString(result);
            }

            // For update operations, capture old values
            if (methodName.contains("update") && args.length > 1) {
                oldValues = objectMapper.writeValueAsString(args[1]);
            }

            // Determine action type
            String action = "CREATE";
            if (methodName.contains("update")) action = "UPDATE";
            if (methodName.contains("delete")) action = "DELETE";

            // Save audit log
            saveAuditLog(entityType, action, oldValues, newValues);

        } catch (Exception e) {
            log.error("Error in audit aspect: {}", e.getMessage());
            throw e;
        }

        return result;
    }

    private void saveAuditLog(String entityType, String action,
                             String oldValues, String newValues) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Long userId = 1L; // Default user ID if not authenticated

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                // Extract user ID from authentication (to be implemented later)
            }

            AuditLog auditLog = new AuditLog();
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(1L);
            auditLog.setAction(action);
            auditLog.setOldValues(oldValues);
            auditLog.setNewValues(newValues);
            auditLog.setChangedBy(userId);
            auditLog.setChangedAt(LocalDateTime.now());

            auditLogRepository.save(auditLog);
            log.debug("Audit log saved for {} operation on {}", action, entityType);

        } catch (Exception e) {
            log.error("Failed to save audit log: {}", e.getMessage());
        }
    }
}