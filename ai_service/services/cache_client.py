# ai_service/services/cache_client.py

import time

class CacheClient:
    def __init__(self):
        self.store = {}
        self.expiry = {}
        self.hit = 0
        self.miss = 0

    def get(self, key):
        now = time.time()

        # expire check
        if key in self.expiry and now > self.expiry[key]:
            del self.store[key]
            del self.expiry[key]

        value = self.store.get(key)

        if value is not None:
            self.hit += 1
            print("cache hit")
        else:
            self.miss += 1
            print("cache miss")

        return value

    def set(self, key, value, ttl=900):  # 15 minutes
        self.store[key] = value
        self.expiry[key] = time.time() + ttl

    def get_stats(self):
        return {
            "hits": self.hit,
            "miss": self.miss
        }