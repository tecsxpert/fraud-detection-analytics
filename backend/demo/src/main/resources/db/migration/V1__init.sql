-- V1: Create core tables for Fraud Detection System

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions/Fraud cases table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING',
    risk_score DECIMAL(5, 2) DEFAULT 0.00,
    description TEXT,
    merchant_name VARCHAR(100),
    merchant_category VARCHAR(50),
    customer_id VARCHAR(50),
    customer_email VARCHAR(100),
    location VARCHAR(100),
    ip_address VARCHAR(45),
    device_info VARCHAR(255),
    ai_description TEXT,
    ai_category VARCHAR(50),
    ai_confidence DECIMAL(5, 2),
    ai_recommendations TEXT,
    is_flagged BOOLEAN DEFAULT false,
    flagged_reason TEXT,
    created_by BIGINT,
    assigned_to BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_risk_score ON transactions(risk_score);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX idx_transactions_ai_category ON transactions(ai_category);

-- Create users table index
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);