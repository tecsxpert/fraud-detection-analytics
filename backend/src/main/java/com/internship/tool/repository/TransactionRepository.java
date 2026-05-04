package com.internship.tool.repository;

import com.internship.tool.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    Page<Transaction> findByStatus(String status, Pageable pageable);
    
    Page<Transaction> findByRiskScoreGreaterThan(BigDecimal riskScore, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:minAmount IS NULL OR t.amount >= :minAmount) AND " +
           "(:maxAmount IS NULL OR t.amount <= :maxAmount) AND " +
           "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.createdAt <= :endDate) AND " +
           "t.deletedAt IS NULL")
    Page<Transaction> searchTransactions(
            @Param("status") String status,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status AND t.deletedAt IS NULL")
    Long countByStatus(@Param("status") String status);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.status = :status AND t.deletedAt IS NULL")
    BigDecimal sumAmountByStatus(@Param("status") String status);
    
    @Query("SELECT t FROM Transaction t WHERE t.isFlagged = true AND t.deletedAt IS NULL")
    List<Transaction> findFlaggedTransactions();
    
    @Query("SELECT t FROM Transaction t WHERE t.deletedAt IS NULL ORDER BY t.createdAt DESC")
    Page<Transaction> findAllActive(Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.deletedAt IS NULL")
    long countActive();
}