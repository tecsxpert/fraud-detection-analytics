from flask import Blueprint, request, jsonify
import hashlib
import json
import time

from ai_service.services.shared import groq_client as groq
from ai_service.services.shared import cache_client as cache
#from ai_service.services.shared import chroma_client as chroma

query_bp = Blueprint("query", __name__)


def load_prompt():
    with open("prompts/query_prompt.txt", "r") as f:
        return f.read()


def generate_cache_key(question):
    return hashlib.sha256(question.encode()).hexdigest()


# ✅ Fallback response
def fallback_response():
    return {
        "data": {
            "answer": "Unable to process the request at the moment. Please try again later.",
            "sources": []
        },
        "meta": {
            "confidence": 0.0,
            "model_used": groq.model,
            "tokens_used": 0,
            "response_time_ms": 0,
            "cached": False,
            "is_fallback": True
        }
    }


@query_bp.route("/query", methods=["POST"])
def query():
    try:
        data = request.get_json()

        if not data or "question" not in data:
            return jsonify({"error": "Missing 'question'"}), 400

        question = data["question"]
        key = generate_cache_key(question)

        # 🔥 Step 1: Cache check
        cached = cache.get(key)
        if cached:
            cached_data = json.loads(cached)
            cached_data["meta"]["cached"] = True
            return jsonify(cached_data)

        # 🔥 Step 2: RAG
        #docs = chroma.query(question)
        sources = docs[0] if docs else []

        context = "\n".join([f"- {doc}" for doc in sources])

        prompt = load_prompt().format(context=context, question=question)

        # 🔥 Step 3: AI call with fallback
        start = time.time()

        try:
            answer = groq.generate(prompt)
            if not answer:
                raise ValueError("Empty response")

        except Exception:
            return jsonify(fallback_response())

        end = time.time()

        response_time = int((end - start) * 1000)

        response = {
            "data": {
                "answer": answer,
                "sources": sources
            },
            "meta": {
                "confidence": round(len(sources) / 3, 2),
                "model_used": groq.model,
                "tokens_used": len(prompt.split()),
                "response_time_ms": response_time,
                "cached": False,
                "is_fallback": False
            }
        }

        # 🔥 Step 4: Cache store
        cache.set(key, json.dumps(response))

        return jsonify(response)

    except Exception:
        return jsonify(fallback_response())  # ultimate safety