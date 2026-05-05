package com.internship.tool.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Transaction ID cannot be empty")
    @Size(max = 50)
    @Column(name = "transaction_id", unique = true, nullable = false, length = 50)
    private String transactionId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Pattern(regexp = "^[A-Z]{3}$", message = "Currency must be a valid 3-letter code")
    @Column(length = 3)
    private String currency = "USD";

    @Size(max = 50)
    @Column(name = "transaction_type", length = 50)
    private String transactionType;

    @Size(max = 20)
    @Column(length = 20)
    private String status = "PENDING";

    @DecimalMin(value = "0.0", message = "Risk score must be >= 0")
    @DecimalMax(value = "100.0", message = "Risk score must be <= 100")
    @Column(name = "risk_score", precision = 5, scale = 2)
    private BigDecimal riskScore = BigDecimal.ZERO;

    @Size(max = 1000)
    @Column(columnDefinition = "TEXT")
    private String description;

    @Size(max = 100)
    @Column(name = "merchant_name", length = 100)
    private String merchantName;

    @Size(max = 50)
    @Column(name = "merchant_category", length = 50)
    private String merchantCategory;

    @NotBlank(message = "Customer ID is required")
    @Size(max = 50)
    @Column(name = "customer_id", length = 50)
    private String customerId;

    @Email(message = "Invalid email format")
    @Size(max = 100)
    @Column(name = "customer_email", length = 100)
    private String customerEmail;

    @Size(max = 100)
    @Column(length = 100)
    private String location;

    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Size(max = 255)
    @Column(name = "device_info", length = 255)
    private String deviceInfo;

    @Column(name = "ai_description", columnDefinition = "TEXT")
    private String aiDescription;

    @Size(max = 50)
    @Column(name = "ai_category", length = 50)
    private String aiCategory;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "1.0")
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