from flask import request, jsonify
import re

def sanitize_input():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    text = str(data)

    # Remove HTML tags
    clean_text = re.sub(r'<.*?>', '', text)

    # Prompt injection keywords
    blocked_patterns = [
        "ignore previous instructions",
        "reveal system prompt",
        "bypass rules",
        "act as admin"
    ]

    for pattern in blocked_patterns:
        if pattern.lower() in clean_text.lower():
            return jsonify({"error": "Prompt injection detected"}), 400

    return None