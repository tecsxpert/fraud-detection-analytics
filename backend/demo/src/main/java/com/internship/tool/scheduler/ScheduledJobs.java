package com.internship.tool.scheduler;

import com.internship.tool.entity.Transaction;
import com.internship.tool.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledJobs {

    private final TransactionRepository transactionRepository;

    // Daily at 9 AM - Reminder for overdue transactions
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyReminder() {
        log.info("Running daily reminder job...");

        List<Transaction> overdueTransactions = transactionRepository.findAll()
                .stream()
                .filter(t -> "PENDING".equals(t.getStatus()))
                .filter(t -> t.getCreatedAt() != null &&
                        t.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7)))
                .toList();

        overdueTransactions.forEach(t ->
                log.info("Reminder (log only) for transaction: {}", t.getTransactionId())
        );
    }

    // Weekly summary every Monday at 10 AM
    @Scheduled(cron = "0 0 10 * * MON")
    public void sendWeeklySummary() {
        log.info("Running weekly summary job...");

        long pendingCount = transactionRepository.countByStatus("PENDING");
        long flaggedCount = transactionRepository.findFlaggedTransactions().size();

        log.info("Weekly Summary -> Pending: {}, Flagged: {}", pendingCount, flaggedCount);
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

        upcomingDeadlines.forEach(t ->
                log.info("Deadline alert (log only) for transaction: {}", t.getTransactionId())
        );
    }
}