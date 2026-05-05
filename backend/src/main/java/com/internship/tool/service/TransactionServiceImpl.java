package com.internship.tool.service;

import com.internship.tool.entity.Transaction;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    
    @Override
    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        log.info("Creating new transaction: {}", transaction.getTransactionId());
        return transactionRepository.save(transaction);
    }
    
    @Override
    public Optional<Transaction> getTransactionById(Long id) {
        log.debug("Fetching transaction by id: {}", id);
        return transactionRepository.findById(id);
    }
    
    @Override
    public Optional<Transaction> getTransactionByTransactionId(String transactionId) {
        return transactionRepository.findByTransactionId(transactionId);
    }
    
    @Override
    @Transactional
    public Transaction updateTransaction(Long id, Transaction transaction) {
        log.info("Updating transaction id: {}", id);
        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        
        existing.setAmount(transaction.getAmount());
        existing.setStatus(transaction.getStatus());
        existing.setRiskScore(transaction.getRiskScore());
        existing.setDescription(transaction.getDescription());
        existing.setMerchantName(transaction.getMerchantName());
        existing.setMerchantCategory(transaction.getMerchantCategory());
        existing.setLocation(transaction.getLocation());
        existing.setIsFlagged(transaction.getIsFlagged());
        existing.setFlaggedReason(transaction.getFlaggedReason());
        existing.setAssignedTo(transaction.getAssignedTo());
        
        return transactionRepository.save(existing);
    }
    
    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        log.info("Soft deleting transaction id: {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
        transaction.setDeletedAt(LocalDateTime.now());
        transactionRepository.save(transaction);
    }
    
    @Override
    public Page<Transaction> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAllActive(pageable);
    }
    
    @Override
    public Page<Transaction> getTransactionsByStatus(String status, Pageable pageable) {
        return transactionRepository.findByStatus(status, pageable);
    }
    
    @Override
    public Page<Transaction> searchTransactions(String status, BigDecimal minAmount,
                                                 BigDecimal maxAmount, LocalDateTime startDate,
                                                 LocalDateTime endDate, Pageable pageable) {
        return transactionRepository.searchTransactions(
                status, minAmount, maxAmount, startDate, endDate, pageable);
    }
    
    @Override
    public List<Transaction> getFlaggedTransactions() {
        return transactionRepository.findFlaggedTransactions();
    }
    
    @Override
    public Long countByStatus(String status) {
        return transactionRepository.countByStatus(status);
    }
    
    @Override
    public BigDecimal sumAmountByStatus(String status) {
        return transactionRepository.sumAmountByStatus(status);
    }
    
    @Override
    public long getTotalCount() {
        return transactionRepository.count();
    }
    
    @Override
    public long getPendingCount() {
        return countByStatus("PENDING");
    }
    
    @Override
    public long getFlaggedCount() {
        return getFlaggedTransactions().size();
    }
    
    @Override
    public BigDecimal getTotalAmount() {
        BigDecimal total = transactionRepository.sumAmountByStatus("COMPLETED");
        return total != null ? total : BigDecimal.ZERO;
    }
}