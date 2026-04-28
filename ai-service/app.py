from flask import Flask

from routes.categorise import categorise_bp
from routes.query import query_bp
from routes.health import health_bp
from services.data_loader import load_data_to_chroma
from routes.report import report_bp


app = Flask(__name__)

# ✅ Load dataset
load_data_to_chroma()

# ✅ Register routes
app.register_blueprint(categorise_bp)
app.register_blueprint(query_bp)
app.register_blueprint(health_bp)
app.register_blueprint(report_bp)

if __name__ == "__main__":
    app.run(debug=True)