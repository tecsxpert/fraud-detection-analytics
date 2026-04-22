from flask import Flask
from flask_cors import CORS

# Import blueprints
from routes.describe import describe_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register all blueprints here
    app.register_blueprint(describe_bp)

    # Health check endpoint (required)
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)