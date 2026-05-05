# Fraud Detection Analytics — AI Demo Script

## Demo Objective

Demonstrate:
- AI-powered fraud analysis
- actionable fraud recommendations
- Retrieval-Augmented Generation (RAG)
- real-time SSE streaming
- scalable AI service architecture

---

# Demo Flow Overview

| Step | Feature | Presenter | Duration |
|---|---|---|---|
| 1 | AI Service Introduction | AI Developer 1 | 30 sec |
| 2 | Fraud Analysis Demo | AI Developer 1 | 1 min |
| 3 | Recommendation Demo | AI Developer 1 | 45 sec |
| 4 | Fraud Reasoning Explanation | AI Developer 2 | 1 min |
| 5 | Streaming Report Demo | AI Developer 1 | 1 min |
| 6 | AI Architecture & Scalability | AI Developer 3 | 1 min |
| 7 | Final Workflow Summary | Team | 1 min |

---

# AI Developer 1 — Demo Flow

## 1. AI Service Introduction

### What To Say

“I worked on the AI service layer of the Fraud Detection Analytics platform. The AI service is built using Flask APIs integrated with Groq LLM, ChromaDB-based Retrieval-Augmented Generation, and SSE streaming support.”

---

# 2. Fraud Analysis Demo

## Endpoint

POST /describe

## Input

```json
{
  "text": "User transferred money rapidly across multiple countries using VPN access"
}
```

## Expected Output

```json
{
  "risk_level": "High",
  "explanation": "Rapid cross-border transfers using VPN access indicate potentially suspicious activity.",
  "key_indicators": [
    "VPN usage",
    "Rapid transaction activity",
    "Cross-border transfers"
  ]
}
```

## What To Say

“This endpoint performs structured fraud analysis and returns the risk level, explanation, and important fraud indicators.”

---

# 3. RAG Explanation

## What To Say

“To improve contextual fraud reasoning, we implemented Retrieval-Augmented Generation using ChromaDB. Fraud-domain documents are embedded using sentence-transformers and retrieved before the LLM generates the response.”

---

# 4. Recommendation Demo

## Endpoint

POST /recommend

## Input

```json
{
  "text": "Multiple failed login attempts followed by large withdrawal"
}
```

## Expected Output

```json
[
  {
    "action_type": "BLOCK_TRANSACTION",
    "priority": "HIGH"
  },
  {
    "action_type": "VERIFY_IDENTITY",
    "priority": "MEDIUM"
  },
  {
    "action_type": "MONITOR_ACCOUNT",
    "priority": "LOW"
  }
]
```

## What To Say

“The AI also generates actionable recommendations such as transaction blocking, identity verification, and account monitoring.”

---

# 5. Streaming Report Demo

## Endpoint

GET /generate-report-stream

## URL

http://localhost:5000/generate-report-stream?text=Rapid international money transfers detected from different devices

## Expected Behaviour

- Response streams gradually
- Fraud report appears line-by-line
- `[DONE]` appears at end

## What To Say

“This endpoint demonstrates real-time AI streaming using Server-Sent Events. The frontend consumes streamed responses incrementally using EventSource.”

---

# 6. Performance Optimization

## What To Say

“To improve performance, we preloaded embedding models at startup, optimized prompts for concise outputs, and implemented Redis-ready caching with graceful fallback handling.”

---

# AI Developer 2 — Demo Flow

## Introduction

### What To Say

“I worked on fraud reasoning workflows and anomaly interpretation logic.”

---

# Fraud Pattern Demo

## Input

```json
{
  "text": "Repeated declined card transactions before successful payment"
}
```

## Expected AI Understanding

- card testing fraud
- suspicious retry behavior
- possible stolen card usage

## What To Say

“The AI identifies suspicious behavioral patterns such as repeated failed transactions, abnormal retry sequences, and unusual transaction activity.”

---

# Hallucination Reduction

## What To Say

“We improved consistency by grounding responses using fraud-domain context and structured prompt engineering.”

---

# AI Developer 3 — Demo Flow

## Introduction

### What To Say

“I worked on AI workflow coordination and scalable service architecture.”

---

# Architecture Explanation

## What To Say

“The AI architecture separates inference, vector retrieval, streaming, and fraud reasoning into modular services for easier scalability and maintenance.”

---

# Scalability & Stability

## What To Say

“We also prepared the system for future scaling using Redis caching, Dockerized deployment, and graceful fallback handling for infrastructure failures.”

---

# Final Team Closing

## What To Say

“Our platform combines AI reasoning, contextual retrieval, and real-time fraud analysis workflows to support faster and more explainable fraud investigation.”

---

# Backup Demo Inputs

## Input 1

```json
{
  "text": "Password reset followed by high-value transfer"
}
```

Expected:
- account compromise indicators
- identity theft risk

---

## Input 2

```json
{
  "text": "Several geographically distant logins occurred within minutes"
}
```

Expected:
- impossible travel detection
- suspicious authentication pattern

---

# Demo Safety Notes

- Start Flask server before presentation
- Keep all requests pre-copied
- Keep browser tabs pre-opened
- Avoid typing long prompts manually
- Do not modify code during demo
- Keep ChromaDB seeded before demo

---

# Pre-Demo Commands

```bash
python seed_data.py
python app.py
```