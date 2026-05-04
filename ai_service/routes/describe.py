from flask import Blueprint, request, jsonify
from flask import Response, stream_with_context

from datetime import datetime

import json
import logging
import time

# 🔹 Services
from ai_service.services.chroma_client import query_documents
from ai_service.services.groq_client import generate_response

describe_bp = Blueprint("describe", __name__)


# =========================================================
# 🔹 Utility: Load Prompt
# =========================================================
def load_prompt():
    with open("prompts/describe_prompt.txt", "r") as file:
        return file.read()


# =========================================================
# 🔹 Utility: Load Stream Prompt
# =========================================================
def load_stream_prompt():
    with open("prompts/report_stream_prompt.txt", "r") as file:
        return file.read()
    
# =========================================================
# 🔹 Utility: Load Analyse Document Prompt
# =========================================================
def load_analyse_prompt():
    with open("prompts/analyse_document_prompt.txt", "r") as file:
        return file.read()


# =========================================================
# 🔹 Endpoint 1: /describe
# =========================================================
@describe_bp.route("/describe", methods=["POST"])
def describe():

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "status": "error",
            "message": "text field is required"
        }), 400

    text = data["text"]

    logging.info(f"/describe called with input: {text}")

    # 🔹 Load prompt
    base_prompt = load_prompt().replace("{text}", text)

    # 🔹 RAG context
    context_docs = query_documents(text)

    context = ""

    if context_docs and len(context_docs) > 0:
        context = "\n".join(context_docs[0])

    # 🔹 Final prompt
    final_prompt = f"""
You are a fraud detection expert.

Context:
{context}

{base_prompt}
"""

    try:

        ai_output = generate_response(final_prompt)

        parsed_output = json.loads(ai_output)

    except Exception as e:

        logging.error(f"/describe error: {str(e)}")

        parsed_output = {
            "risk_level": "Unknown",
            "explanation": "Error generating response",
            "key_indicators": []
        }

    return jsonify({
        "status": "success",
        "data": parsed_output,
        "generated_at": datetime.utcnow().isoformat()
    })


# =========================================================
# 🔹 Endpoint 2: /recommend
# =========================================================
@describe_bp.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "status": "error",
            "message": "text field is required"
        }), 400

    text = data["text"]

    logging.info(f"/recommend called with input: {text}")

    recommendations = [
        {
            "action_type": "BLOCK_TRANSACTION",
            "description": f"Block suspicious activity related to: {text}",
            "priority": "HIGH"
        },
        {
            "action_type": "VERIFY_IDENTITY",
            "description": "Request additional user verification",
            "priority": "MEDIUM"
        },
        {
            "action_type": "MONITOR_ACCOUNT",
            "description": "Monitor account for further unusual activity",
            "priority": "LOW"
        }
    ]

    return jsonify({
        "status": "success",
        "data": recommendations
    })


# =========================================================
# 🔹 Endpoint 3: /generate-report
# =========================================================
@describe_bp.route("/generate-report", methods=["POST"])
def generate_report():

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "status": "error",
            "message": "text field is required"
        }), 400

    text = data["text"]

    logging.info(f"/generate-report called with input: {text}")

    # 🔹 RAG context
    context_docs = query_documents(text)

    context = ""

    if context_docs and len(context_docs) > 0:
        context = "\n".join(context_docs[0])

    # 🔹 Prompt
    prompt = f"""
You are a fraud analysis expert.

Context:
{context}

User Input:
{text}

Return JSON ONLY in this exact format:

{{
  "title": "",
  "executive_summary": "",
  "overview": "",
  "top_items": ["item1", "item2"],
  "recommendations": ["rec1", "rec2"]
}}
"""

    try:

        ai_output = generate_response(prompt)

        parsed_output = json.loads(ai_output)

    except Exception as e:

        logging.error(f"/generate-report error: {str(e)}")

        parsed_output = {
            "error": "Failed to generate report"
        }

    return jsonify({
        "status": "success",
        "data": parsed_output
    })


# =========================================================
# 🔹 Endpoint 4: /generate-report-stream
# =========================================================
@describe_bp.route("/generate-report-stream", methods=["GET"])
def generate_report_stream():

    text = request.args.get("text")

    if not text:
        return jsonify({
            "status": "error",
            "message": "text query parameter is required"
        }), 400

    logging.info(f"/generate-report-stream called with input: {text}")

    # 🔹 Load stream prompt
    base_prompt = load_stream_prompt().replace("{text}", text)

    # 🔹 RAG context
    context_docs = query_documents(text)

    context = ""

    if context_docs and len(context_docs) > 0:
        context = "\n".join(context_docs[0])

    # 🔹 Final prompt
    final_prompt = f"""
Context:
{context}

{base_prompt}
"""

    try:

        ai_output = generate_response(final_prompt)

        # 🔹 Stream line-by-line
        def generate():

            lines = ai_output.split("\n")

            for line in lines:

                yield f"data: {line}\n\n"

                time.sleep(0.1)

            yield "data: [DONE]\n\n"

        return Response(
            stream_with_context(generate()),
            content_type="text/event-stream"
        )

    except Exception as e:

        logging.error(f"/generate-report-stream error: {str(e)}")

        return jsonify({
            "status": "error",
            "message": "Streaming failed"
        }), 500
    

# =========================================================
# 🔹 Endpoint 5: /analyse-document
# =========================================================
@describe_bp.route("/analyse-document", methods=["POST"])
def analyse_document():

    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({
            "status": "error",
            "message": "text field is required"
        }), 400

    text = data["text"]

    logging.info(f"/analyse-document called with input: {text}")

    # 🔹 Load prompt
    base_prompt = load_analyse_prompt().replace("{text}", text)

    # 🔹 RAG context
    context_docs = query_documents(text)

    context = ""

    if context_docs and len(context_docs) > 0:
        context = "\n".join(context_docs[0])

    # 🔹 Final prompt
    final_prompt = f"""
Context:
{context}

{base_prompt}
"""

    try:

        ai_output = generate_response(final_prompt)

        parsed_output = json.loads(ai_output)

    except Exception as e:

        logging.error(f"/analyse-document error: {str(e)}")

        parsed_output = {
            "summary": "Unable to analyse document",
            "risks": [],
            "key_findings": []
        }

    return jsonify({
        "status": "success",
        "data": parsed_output
    })

# =========================================================
# 🔹 Endpoint 6: /batch-process
# =========================================================
@describe_bp.route("/batch-process", methods=["POST"])
def batch_process():

    data = request.get_json()

    # 🔹 Validate request
    if not data or "items" not in data:
        return jsonify({
            "status": "error",
            "message": "items field is required"
        }), 400

    items = data["items"]

    # 🔹 Validate type
    if not isinstance(items, list):
        return jsonify({
            "status": "error",
            "message": "items must be an array"
        }), 400

    # 🔹 Max 20 items
    if len(items) > 20:
        return jsonify({
            "status": "error",
            "message": "Maximum 20 items allowed"
        }), 400

    logging.info(f"/batch-process called with {len(items)} items")

    results = []

    for item in items:

        try:

            # 🔹 Delay 100ms
            time.sleep(0.1)

            # 🔹 RAG context
            context_docs = query_documents(item)

            context = ""

            if context_docs and len(context_docs) > 0:
                context = "\n".join(context_docs[0])

            # 🔹 Prompt
            base_prompt = load_prompt().replace("{text}", item)

            final_prompt = f"""
Context:
{context}

{base_prompt}
"""

            ai_output = generate_response(final_prompt)

            parsed_output = json.loads(ai_output)

        except Exception as e:

            logging.error(f"/batch-process item error: {str(e)}")

            parsed_output = {
                "risk_level": "Unknown",
                "explanation": "Error processing item",
                "key_indicators": []
            }

        results.append({
            "input": item,
            "analysis": parsed_output
        })

    return jsonify({
        "status": "success",
        "results": results
    })