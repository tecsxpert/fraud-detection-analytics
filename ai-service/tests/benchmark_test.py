import requests
import time

BASE_URL = "http://127.0.0.1:5000"

# 🔥 All Endpoints
endpoints = [
    # Core endpoints
    {
        "name": "analyse",
        "method": "POST",
        "url": f"{BASE_URL}/analyse",
        "payload": {"text": "Suspicious login attempt from unknown device"}
    },
    {
        "name": "batch",
        "method": "POST",
        "url": f"{BASE_URL}/batch",
        "payload": {
            "documents": [
                "Multiple failed login attempts",
                "Unusual high-value transaction"
            ]
        }
    },
    {
        "name": "categorise",
        "method": "POST",
        "url": f"{BASE_URL}/categorise",
        "payload": {"text": "Multiple transactions from different countries"}
    },
    {
        "name": "describe",
        "method": "POST",
        "url": f"{BASE_URL}/describe",
        "payload": {"text": "Transaction flagged due to unusual pattern"}
    },
    {
        "name": "recommend",
        "method": "POST",
        "url": f"{BASE_URL}/recommend",
        "payload": {"text": "User account shows suspicious activity"}
    },
    {
        "name": "query",
        "method": "POST",
        "url": f"{BASE_URL}/query",
        "payload": {"question": "What is fraud detection?"}
    },

    # Async + status
    {
        "name": "generate-report",
        "method": "POST",
        "url": f"{BASE_URL}/generate-report",
        "payload": {"text": "Unauthorized credit card transaction detected"}
    },
    {
        "name": "job-status",
        "method": "GET",
        "url": f"{BASE_URL}/job-status/123",  # ⚠️ Replace with real job_id
        "payload": None
    },

    # System
    {
        "name": "health",
        "method": "GET",
        "url": f"{BASE_URL}/health",
        "payload": None
    },

    # Optional / advanced
    {
        "name": "webhook",
        "method": "POST",
        "url": f"{BASE_URL}/webhook",
        "payload": {
            "job_id": "123",
            "status": "completed",
            "result": "Fraud report generated"
        }
    }
]

# Measure latency
def measure(endpoint, runs=50):
    times = []

    for i in range(runs):
        start = time.time()

        try:
            if endpoint["method"] == "POST":
                requests.post(endpoint["url"], json=endpoint["payload"], timeout=10)
            else:
                requests.get(endpoint["url"], timeout=10)

        except Exception as e:
            print(f"Error in {endpoint['name']}: {e}")
            continue

        end = time.time()
        times.append((end - start) * 1000)  # ms

    if not times:
        return None

    times.sort()

    p50 = times[len(times)//2]
    p95 = times[int(len(times)*0.95)]
    p99 = times[int(len(times)*0.99)]

    return p50, p95, p99


# Run Benchmark
print("\nRunning Benchmark...\n")

for ep in endpoints:
    print(f"🔍 Testing {ep['name']}...")

    result = measure(ep)

    if result:
        p50, p95, p99 = result
        print(f"✅ p50: {round(p50,2)} ms")
        print(f"✅ p95: {round(p95,2)} ms")
        print(f"✅ p99: {round(p99,2)} ms\n")
    else:
        print("Failed to collect data\n")