package com.internship.tool.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Transaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "transaction_id", unique = true, nullable = false, length = 50)
    private String transactionId;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 3)
    private String currency = "USD";
    
    @Column(name = "transaction_type", length = 50)
    private String transactionType;
    
    @Column(length = 20)
    private String status = "PENDING";
    
    @Column(name = "risk_score", precision = 5, scale = 2)
    private BigDecimal riskScore = BigDecimal.ZERO;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "merchant_name", length = 100)
    private String merchantName;
    
    @Column(name = "merchant_category", length = 50)
    private String merchantCategory;
    
    @Column(name = "customer_id", length = 50)
    private String customerId;
    
    @Column(name = "customer_email", length = 100)
    private String customerEmail;
    
    @Column(length = 100)
    private String location;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "device_info", length = 255)
    private String deviceInfo;
    
    @Column(name = "ai_description", columnDefinition = "TEXT")
    private String aiDescription;
    
    @Column(name = "ai_category", length = 50)
    private String aiCategory;
    
    @Column(name = "ai_confidence", precision = 5, scale = 2)
    private BigDecimal aiConfidence;
    
    @Column(name = "ai_recommendations", columnDefinition = "TEXT")
    private String aiRecommendations;
    
    @Column(name = "is_flagged")
    private Boolean isFlagged = false;
    
    @Column(name = "flagged_reason", columnDefinition = "TEXT")
    private String flaggedReason;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "assigned_to")
    private Long assignedTo;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @PrePersist
    public void prePersist() {
        if (transactionId == null) {
            transactionId = "TXN-" + System.currentTimeMillis();
        }
    }
}