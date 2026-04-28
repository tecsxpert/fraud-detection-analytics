# AI Service — Fraud Detection Analytics

## Overview

This AI service is a Flask-based backend microservice responsible for:

* Fraud risk analysis
* Recommendation generation
* Report generation
* Document analysis
* Batch fraud processing
* RAG-based contextual retrieval using ChromaDB
* AI-powered reasoning using Groq LLM
* SSE streaming for real-time report generation

The service exposes REST APIs that can later be integrated with:

* Spring Boot backend
* React frontend
* Dashboard systems
* Monitoring services

---

# Tech Stack

| Component         | Technology                     |
| ----------------- | ------------------------------ |
| Backend Framework | Flask                          |
| AI Provider       | Groq                           |
| Embeddings        | sentence-transformers          |
| Vector Database   | ChromaDB                       |
| RAG               | Retrieval-Augmented Generation |
| Streaming         | Server-Sent Events (SSE)       |
| Testing           | pytest                         |

---

# Project Structure

```plaintext
ai-service/
│
├── app.py
├── requirements.txt
├── .env
│
├── prompts/
│   ├── describe_prompt.txt
│   ├── report_stream_prompt.txt
│   └── analyse_document_prompt.txt
│
├── routes/
│   └── describe.py
│
├── services/
│   ├── groq_client.py
│   └── chroma_client.py
│
├── tests/
│   └── test_api.py
│
└── README.md
```

---

# Prerequisites

Before running the service, ensure the following are installed:

* Python 3.10+
* pip
* virtualenv (recommended)
* Git

Optional:

* Postman for API testing
* VS Code

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repository-url>
cd ai-service
```

---

## 2. Create Virtual Environment

### Windows (PowerShell)

```powershell
python -m venv .venv
```

---

## 3. Activate Virtual Environment

### Windows (PowerShell)

```powershell
.\.venv\Scripts\Activate
```

Expected:

```powershell
(.venv)
```

---

## 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file in the root directory.

## Example

```env
GROQ_API_KEY=your_groq_api_key
```

---

# Running the Application

Start Flask server:

```bash
python app.py
```

Expected output:

```plaintext
Running on http://127.0.0.1:5000
```

---

# API Reference

---

# 1. Health Endpoint

## GET `/health`

Checks service availability.

### Response

```json
{
  "status": "ok"
}
```

---

# 2. Describe Endpoint

## POST `/describe`

Performs fraud risk assessment for a given activity.

### Request

```json
{
  "text": "User made multiple transactions from different countries"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "risk_level": "High",
    "explanation": "Multiple international transactions indicate elevated fraud risk.",
    "key_indicators": [
      "Multiple countries",
      "Rapid transaction frequency",
      "Unusual activity"
    ]
  },
  "generated_at": "2026-04-27T11:38:36.696335"
}
```

---

# 3. Recommend Endpoint

## POST `/recommend`

Returns fraud mitigation recommendations.

### Request

```json
{
  "text": "Multiple failed login attempts detected"
}
```

### Response

```json
{
  "status": "success",
  "data": [
    {
      "action_type": "BLOCK_TRANSACTION",
      "description": "Block suspicious activity",
      "priority": "HIGH"
    },
    {
      "action_type": "VERIFY_IDENTITY",
      "description": "Request additional verification",
      "priority": "MEDIUM"
    }
  ]
}
```

---

# 4. Generate Report Endpoint

## POST `/generate-report`

Generates structured fraud analysis reports.

### Request

```json
{
  "text": "User transferred money rapidly across countries"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "title": "Suspicious Transaction Activity",
    "executive_summary": "Multiple rapid international transfers detected.",
    "overview": "The activity shows patterns associated with fraudulent behavior.",
    "top_items": [
      "Rapid transfers",
      "Cross-border activity"
    ],
    "recommendations": [
      "Verify identity",
      "Monitor account"
    ]
  }
}
```

---

# 5. Generate Report Stream Endpoint

## GET `/generate-report-stream`

Streams fraud report content progressively using Server-Sent Events (SSE).

### Request

```http
GET /generate-report-stream?text=User%20made%20multiple%20transactions
```

### Stream Example

```plaintext
data: Fraud Report

data: Executive Summary:

data: Multiple suspicious transactions detected.

data: [DONE]
```

---

# 6. Analyse Document Endpoint

## POST `/analyse-document`

Analyzes larger text documents and extracts fraud-related findings.

### Request

```json
{
  "text": "Large cross-border transactions detected from multiple IP addresses"
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "summary": "Suspicious financial activity detected.",
    "risks": [
      "Money laundering",
      "Unauthorized access"
    ],
    "key_findings": [
      "Rapid international transfers",
      "Multiple IP addresses",
      "High transaction volume"
    ]
  }
}
```

---

# 7. Batch Process Endpoint

## POST `/batch-process`

Processes up to 20 fraud analysis items sequentially.

### Request

```json
{
  "items": [
    "User transferred money rapidly across countries",
    "Multiple failed login attempts detected"
  ]
}
```

### Response

```json
{
  "status": "success",
  "results": [
    {
      "input": "User transferred money rapidly across countries",
      "analysis": {
        "risk_level": "High",
        "explanation": "Potential fraud activity detected.",
        "key_indicators": [
          "Cross-border activity",
          "Rapid transactions"
        ]
      }
    }
  ]
}
```

---

# RAG Pipeline

The service uses Retrieval-Augmented Generation (RAG):

1. Documents are chunked
2. Embeddings are generated using sentence-transformers
3. Embeddings are stored in ChromaDB
4. Relevant context is retrieved before AI generation

This improves:

* fraud context understanding
* response quality
* consistency

---

# Running Tests

Run pytest suite:

```bash
pytest
```

Expected:

```plaintext
10 passed
```

---

# Error Handling

The service includes:

* graceful fallback handling
* structured error responses
* logging support
* invalid input validation

### Example Error Response

```json
{
  "status": "error",
  "message": "text field is required"
}
```

---

# Notes

* Responses are returned in structured JSON format
* SSE streaming is frontend-compatible using EventSource
* API contracts are designed to remain stable for future integration
* Groq failures are handled gracefully with fallback responses

---

# Future Integration

The AI service is designed for integration with:

* Spring Boot backend services
* React frontend dashboards
* Async job processing systems
* Monitoring pipelines

---

# Author

AI Developer 1 — Fraud Detection Analytics Project
