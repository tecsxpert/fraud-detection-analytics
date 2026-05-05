package com.internship.tool.service;

import com.internship.tool.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionService {
    
    Transaction createTransaction(Transaction transaction);
    
    Optional<Transaction> getTransactionById(Long id);
    
    Optional<Transaction> getTransactionByTransactionId(String transactionId);
    
    Transaction updateTransaction(Long id, Transaction transaction);
    
    void deleteTransaction(Long id);
    
    Page<Transaction> getAllTransactions(Pageable pageable);
    
    Page<Transaction> getTransactionsByStatus(String status, Pageable pageable);
    
    Page<Transaction> searchTransactions(String status, BigDecimal minAmount, 
                                         BigDecimal maxAmount, LocalDateTime startDate,
                                         LocalDateTime endDate, Pageable pageable);
    
    List<Transaction> getFlaggedTransactions();
    
    Long countByStatus(String status);
    
    BigDecimal sumAmountByStatus(String status);
    
    // Dashboard stats
    long getTotalCount();
    long getPendingCount();
    long getFlaggedCount();
    BigDecimal getTotalAmount();
}