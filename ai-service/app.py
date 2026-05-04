from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from sanitize import sanitize_input
import sqlite3

app = Flask(__name__)

@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response

# -----------------------------
# Database Connection
# -----------------------------
def get_db():
    return sqlite3.connect("transactions.db")


def create_table():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount INTEGER,
            location TEXT,
            text TEXT,
            status TEXT,
            reason TEXT,
            risk_score INTEGER
        )
    """)

    conn.commit()
    conn.close()


# -----------------------------
# Save transaction (DB)
# -----------------------------
def save_transaction(amount, location, text, result):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO transactions (amount, location, text, status, reason, risk_score)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        amount,
        location,
        text,
        result["status"],
        result["reason"],
        result["risk_score"]
    ))

    conn.commit()
    conn.close()


# -----------------------------
# Rate limiter
# -----------------------------
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["30 per minute"]
)
limiter.init_app(app)


# -----------------------------
# Input sanitization
# -----------------------------
@app.before_request
def before():
    if request.method == "POST":
        result = sanitize_input()
        if result:
            return result


# -----------------------------
# Test API
# -----------------------------
@app.route("/test", methods=["POST"])
def test():
    return jsonify({
        "message": "Input accepted",
        "data": request.get_json()
    })


# -----------------------------
# Fraud Detection API
# -----------------------------
@app.route("/analyze", methods=["POST"])
@limiter.limit("20 per minute")
def analyze():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    amount = data.get("amount", 0)
    location = data.get("location", "")
    text = data.get("text", "")

    risk_score = 0
    reason = "Normal transaction"
    status = "safe"

    if amount > 50000:
        risk_score += 50
        status = "suspicious"
        reason = "High transaction amount"

    if "hack" in text.lower() or "bypass" in text.lower():
        risk_score += 40
        status = "blocked"
        reason = "Malicious input detected"

    if location.lower() not in ["india", "us"]:
        risk_score += 20
        status = "suspicious"
        reason = "Unusual location"

    result = {
        "status": status,
        "reason": reason,
        "risk_score": min(risk_score, 100)
    }

    # ✅ Save only in DB
    save_transaction(amount, location, text, result)

    return jsonify(result)


# -----------------------------
# Report API
# -----------------------------
@app.route("/generate-report", methods=["GET"])
def report():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM transactions")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM transactions WHERE status != 'safe'")
    suspicious = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        "total_transactions": total,
        "suspicious_transactions": suspicious
    })


# -----------------------------
# Run server
# -----------------------------
create_table()

if __name__ == "__main__":
    app.run(debug=True)