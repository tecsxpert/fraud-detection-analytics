from flask import Blueprint, request, jsonify
from datetime import datetime

# 🔹 Blueprint for AI-related routes
describe_bp = Blueprint("describe", __name__)


def load_prompt():
    """Load prompt template from file"""
    with open("prompts/describe_prompt.txt", "r") as file:
        return file.read()



# 🔹 ENDPOINT 1: /describe (Analysis)


@describe_bp.route("/describe", methods=["POST"])
def describe():
    """
    Purpose:
    Analyze transaction input and return fraud insights
    """

    data = request.get_json()

    # ✅ Step 1: Input validation
    if not data or "text" not in data:
        return jsonify({"error": "text field is required"}), 400

    text = data["text"]

    # ✅ Step 2: Load and prepare prompt
    prompt = load_prompt().replace("{text}", text)

    # ❗ AI call will be added later
    # Currently returning mock analysis

    # ✅ Step 3: Build analysis response
    result = {
        "risk_level": "Medium",
        "explanation": f"Analysis based on input: {text}",
        "key_indicators": [
            "pattern anomaly",
            "frequency spike"
        ],
        "generated_at": datetime.utcnow().isoformat()
    }

    # ✅ Step 4: Return response
    return jsonify(result)


# 🔹 ENDPOINT 2: /recommend (Action Suggestions)

@describe_bp.route("/recommend", methods=["POST"])
def recommend():
    """
    Purpose:
    Provide actionable recommendations based on input
    """

    data = request.get_json()

    # ✅ Step 1: Input validation
    if not data or "text" not in data:
        return jsonify({"error": "text field is required"}), 400

    text = data["text"]

    # ❗ Static recommendations (AI will improve later)

    # ✅ Step 2: Build recommendations
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

    # ✅ Step 3: Return response
    return jsonify({
        "recommendations": recommendations
    })