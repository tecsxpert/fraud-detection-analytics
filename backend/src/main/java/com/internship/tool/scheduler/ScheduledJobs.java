package com.internship.tool.scheduler;

import com.internship.tool.entity.Transaction;
import com.internship.tool.repository.TransactionRepository;
import com.internship.tool.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledJobs {
    
    private final TransactionRepository transactionRepository;
    private final EmailService emailService;
    
    // Daily at 9 AM - Reminder for overdue transactions
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyReminder() {
        log.info("Running daily reminder job...");
        
        List<Transaction> overdueTransactions = transactionRepository.findAll()
                .stream()
                .filter(t -> "PENDING".equals(t.getStatus()))
                .filter(t -> t.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7)))
                .toList();
        
        overdueTransactions.forEach(t -> {
            try {
                emailService.sendReminderEmail(t);
                log.info("Reminder sent for transaction: {}", t.getTransactionId());
            } catch (Exception e) {
                log.error("Failed to send reminder for {}: {}", 
                        t.getTransactionId(), e.getMessage());
            }
        });
    }
    
    // Weekly summary every Monday at 10 AM
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendWeeklySummary() {
        log.info("Running weekly summary job...");
        
        long pendingCount = transactionRepository.countByStatus("PENDING");
        long flaggedCount = transactionRepository.findFlaggedTransactions().size();
        
        try {
            emailService.sendWeeklySummary(pendingCount, flaggedCount);
            log.info("Weekly summary sent");
        } catch (Exception e) {
            log.error("Failed to send weekly summary: {}", e.getMessage());
        }
    }
    
    // 7-day advance deadline alert
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendDeadlineAlert() {
        log.info("Running 7-day deadline alert job...");
        
        LocalDateTime sevenDaysFromNow = LocalDateTime.now().plusDays(7);
        LocalDateTime sixDaysFromNow = LocalDateTime.now().plusDays(6);
        
        List<Transaction> upcomingDeadlines = transactionRepository.findAll()
                .stream()
                .filter(t -> "PENDING".equals(t.getStatus()))
                .filter(t -> t.getCreatedAt() != null && 
                           (t.getCreatedAt().isAfter(sixDaysFromNow) || 
                            t.getCreatedAt().isBefore(sevenDaysFromNow)))
                .toList();
        
        upcomingDeadlines.forEach(t -> {
            try {
                emailService.sendDeadlineAlert(t);
                log.info("Deadline alert sent for transaction: {}", t.getTransactionId());
            } catch (Exception e) {
                log.error("Failed to send deadline alert: {}", e.getMessage());
            }
        });
    }
}