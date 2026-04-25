from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from sanitize import sanitize_input

app = Flask(__name__)

# Rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["30 per minute"]
)
limiter.init_app(app)

@app.before_request
def before():
    result = sanitize_input()
    if result:
        return result

@app.route("/test", methods=["POST"])
def test():
    return jsonify({
        "message": "Input accepted",
        "data": request.get_json()
    })

@app.route("/generate-report", methods=["POST"])
@limiter.limit("10 per minute")
def report():
    return jsonify({"message": "Report generated"})

if __name__ == "__main__":
    app.run(debug=True)