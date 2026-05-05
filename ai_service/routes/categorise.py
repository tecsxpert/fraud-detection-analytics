from flask import Blueprint, request, jsonify
import json
import re
import time
import hashlib

from ai_service.services.shared import groq_client as client
from ai_service.services.shared import cache_client as cache

categorise_bp = Blueprint("categorise", __name__)


def load_prompt():
    with open("prompts/categorise_prompt.txt", "r") as file:
        return file.read()


def generate_cache_key(text):
    return hashlib.sha256(text.encode()).hexdigest()


# ✅ Fallback response
def fallback_response(text):
    return {
        "data": {
            "category": "Other",
            "confidence": 0.5,
            "reasoning": "Fallback triggered due to AI service failure"
        },
        "meta": {
            "model_used": client.model,
            "response_time_ms": 0,
            "cached": False,
            "is_fallback": True
        }
    }


@categorise_bp.route("/categorise", methods=["POST"])
def categorise():
    try:
        data = request.get_json()

        if not data or "text" not in data:
            return jsonify({"error": "Missing 'text' field"}), 400

        input_text = data["text"]

        # 🔥 Cache check
        key = generate_cache_key(input_text)
        cached = cache.get(key)
        if cached:
            return jsonify(json.loads(cached))

        prompt = load_prompt().format(input_text=input_text)

        start = time.time()

        try:
            response = client.generate(prompt)  # 🔥 AI call

        except Exception:
            return jsonify(fallback_response(input_text))  # ✅ fallback

        end = time.time()

        # 🔥 Parse JSON
        try:
            json_match = re.search(r'\{[\s\S]*?\}', response)
            parsed = json.loads(json_match.group()) if json_match else None
            if not parsed:
                raise ValueError()

        except Exception:
            return jsonify(fallback_response(input_text))  # ✅ fallback

        result = {
            "data": parsed,
            "meta": {
                "confidence": parsed.get("confidence", 0.0),
                "model_used": client.model,
                "tokens_used": len(prompt.split()),
                "response_time_ms": int((end - start) * 1000),
                "cached": False,
                "is_fallback": False
            }
        }

        cache.set(key, json.dumps(result))

        return jsonify(result)

    except Exception:
        return jsonify(fallback_response(""))  # ultimate safety