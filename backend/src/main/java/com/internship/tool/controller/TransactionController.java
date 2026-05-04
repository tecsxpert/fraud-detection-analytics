package com.internship.tool.controller;

import com.internship.tool.entity.Transaction;
import com.internship.tool.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {
    
    private final TransactionService transactionService;
    
    // GET /all - List all transactions with pagination
    @GetMapping("/all")
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Transaction> transactions = transactionService.getAllTransactions(pageable);
        return ResponseEntity.ok(transactions);
    }
    
    // GET /{id} - Get transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // GET /search - Search transactions with filters
    @GetMapping("/search")
    public ResponseEntity<Page<Transaction>> searchTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactions = transactionService.searchTransactions(
                status, minAmount, maxAmount, startDate, endDate, pageable);
        
        return ResponseEntity.ok(transactions);
    }
    
    // GET /stats - Dashboard KPIs
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", transactionService.getTotalCount());
        stats.put("pendingCount", transactionService.getPendingCount());
        stats.put("flaggedCount", transactionService.getFlaggedCount());
        stats.put("totalAmount", transactionService.getTotalAmount());
        stats.put("completedCount", transactionService.countByStatus("COMPLETED"));
        stats.put("rejectedCount", transactionService.countByStatus("REJECTED"));
        
        return ResponseEntity.ok(stats);
    }
    
    // POST /create - Create new transaction
    @PostMapping("/create")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    // PUT /{id} - Update transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        
        Transaction updated = transactionService.updateTransaction(id, transaction);
        return ResponseEntity.ok(updated);
    }
    
    // DELETE /{id} - Soft delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
    
    // GET /export - Export to CSV
    @GetMapping("/export")
    public ResponseEntity<String> exportTransactions() {
        Page<Transaction> transactions = transactionService.getAllTransactions(
                PageRequest.of(0, Integer.MAX_VALUE));
        
        StringBuilder csv = new StringBuilder();
        csv.append("Transaction ID,Amount,Currency,Status,Risk Score,Merchant,Customer,Created At\n");
        
        transactions.getContent().forEach(t -> {
            csv.append(String.format("%s,%.2f,%s,%s,%.2f,%s,%s,%s\n",
                    t.getTransactionId(),
                    t.getAmount(),
                    t.getCurrency(),
                    t.getStatus(),
                    t.getRiskScore(),
                    t.getMerchantName(),
                    t.getCustomerEmail(),
                    t.getCreatedAt()));
        });
        
        return ResponseEntity.ok()
                .header("Content-Type", "text/csv")
                .header("Content-Disposition", "attachment; filename=transactions.csv")
                .body(csv.toString());
    }
}