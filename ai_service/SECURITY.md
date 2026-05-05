# SECURITY.md — Fraud Detection Analytics

## 🔐 Overview

This document outlines the security measures implemented in the AI service to prevent common vulnerabilities and attacks.

---

## 🚨 1. Input Injection (Prompt Injection / XSS)

### Attack Example:

User enters:

<script>alert('hack')</script>

### Risk:

* Malicious scripts execution
* Prompt manipulation

### Mitigation:

* All inputs are sanitized using `sanitize.py`
* HTML tags and suspicious patterns are removed

### Status:

✔ Fixed

---

## 🚨 2. Malicious Input (Keyword Attacks)

### Attack Example:

"hacker bypass system"

### Risk:

* AI manipulation
* Unauthorized actions

### Mitigation:

* Keywords like "hack", "bypass" are blocked
* Request is rejected with HTTP 400

### Status:

✔ Fixed

---

## 🚨 3. Rate Limiting (DoS Protection)

### Attack Example:

Sending 100+ requests per second

### Risk:

* Server overload
* API crash

### Mitigation:

* Flask-Limiter implemented
* Limits:

  * 30 req/min (default)
  * 20 req/min (/analyze)
  * 10 req/min (/generate-report)

### Status:

✔ Fixed

---

## 🚨 4. Invalid JSON Input

### Attack Example:

Sending empty or malformed JSON

### Risk:

* Server crash
* Unexpected behavior

### Mitigation:

* Validation using:
  if not data:
  return error

### Status:

✔ Fixed

---

## 🚨 5. Unauthorized Access

### Attack Example:

Access API without authentication

### Risk:

* Unauthorized usage

### Mitigation:

* (Planned) JWT authentication in backend

### Status:

⚠️ Partially handled

---

## 🔒 Security Headers

Added headers:

* X-Content-Type-Options: nosniff
* X-Frame-Options: DENY

---

## 🧪 Security Testing

Performed:

* Injection tests ✔
* Rate limit tests ✔
* Invalid input tests ✔

---

## 📊 Final Status

All major vulnerabilities are mitigated.
System is safe for demo usage.

---


## 🧪 Security Testing Results

| Test Case        | Input         | Output     | Status |
| ---------------- | ------------- | ---------- | ------ |
| Normal Input     | amount=1000   | safe       | PASS   |
| High Amount      | amount=100000 | suspicious | PASS   |
| Malicious Text   | "hack system" | blocked    | PASS   |
| Unusual Location | Brazil        | suspicious | PASS   |

All test cases passed successfully.


## 🔒 Security Testing (OWASP ZAP)

We performed automated security testing using OWASP ZAP.

### Scan Results
![ZAP Scan](docs/security/zap_scan_result.png)

### Findings
- Server version disclosure
- Missing CSP header

### Fixes Implemented
- Added Content-Security-Policy
- Added X-Frame-Options, X-Content-Type-Options
- Hid server header