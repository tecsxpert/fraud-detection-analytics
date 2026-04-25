# SECURITY.md

## Fraud Detection Analytics Security Report

### 1. SQL Injection
Risk: Malicious SQL queries can access database data.

Mitigation:
- Use prepared statements
- Use JPA queries
- Validate input

### 2. Cross Site Scripting (XSS)
Risk: JavaScript injection in forms.

Mitigation:
- Sanitize user input
- Escape frontend output

### 3. Prompt Injection
Risk: User manipulates AI prompt.

Mitigation:
- Filter suspicious text
- Limit prompt size
- Use fixed templates

### 4. Rate Limiting Abuse
Risk: Too many requests crash server.

Mitigation:
- Use flask-limiter
- 30 req/min max

### 5. Authentication Bypass
Risk: Unauthorized access.

Mitigation:
- JWT token required
- Role based access

## Summary
System secured using validation, auth, and rate limiting.

## Day 2 Security Threat Analysis

### 1. Fake Transaction Flooding
Attack Vector:
Attacker sends thousands of fake transactions.

Damage:
Model confusion, storage overload, slower analytics.

Mitigation:
Rate limiting, CAPTCHA, request validation.

### 2. Prompt Manipulation
Attack Vector:
User sends malicious text to alter AI output.

Damage:
Wrong fraud reports, unsafe responses.

Mitigation:
Prompt filters, template prompts, keyword blocking.

### 3. Unauthorized Dashboard Access
Attack Vector:
User bypasses login or steals token.

Damage:
Sensitive analytics exposed.

Mitigation:
JWT expiry, secure login, RBAC roles.

### 4. File Upload Malware
Attack Vector:
Malicious file uploaded as attachment.

Damage:
Server compromise.

Mitigation:
File type checks, antivirus scan, size limit.

### 5. Data Leakage in Logs
Attack Vector:
Sensitive user data stored in logs.

Damage:
Privacy breach.

Mitigation:
Mask logs, avoid PII storage, secure monitoring.

## Day 5 Security Test Results

| Test Case | Input | Expected Result | Status |
|----------|-------|----------------|--------|
| Empty JSON | {} | 400 Invalid JSON | PASS |
| Normal Input | {"text":"hello"} | Accepted | PASS |
| Prompt Injection | Ignore previous instructions | 400 Blocked | PASS |
| HTML Script | <script>alert(1)</script> | Sanitized | PASS |
| Rate Limit Abuse | 35 requests/min | 429 Too Many Requests | PASS |

## Summary
All Week 1 protections validated successfully.