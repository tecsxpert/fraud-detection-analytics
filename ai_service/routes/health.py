from flask import Blueprint, jsonify
import time

from ai_service.services.metrics import start_time
from ai_service.services.shared import groq_client as groq
from ai_service.services.shared import cache_client as cache
from ai_service.services.shared import chroma_client as chroma

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health():
    uptime = int(time.time() - start_time)

    return jsonify({
        "status": "healthy",
        "model": groq.model,
        "avg_response_time_ms": round(groq.get_avg_response_time(), 2),
        "chroma_doc_count": chroma.collection.count(),
        "uptime_seconds": uptime,
        "cache": cache.get_stats()
    })