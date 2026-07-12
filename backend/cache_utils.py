import json
from functools import wraps
from flask import current_app, request, jsonify
import redis

_redis_client = None

def get_redis_client():
    global _redis_client
    if _redis_client is None:
        try:
            redis_url = current_app.config.get("REDIS_URL", "redis://localhost:6379/0")
            _redis_client = redis.Redis.from_url(redis_url, decode_responses=True, socket_timeout=1, socket_connect_timeout=1)
            _redis_client.ping()
        except Exception:
            _redis_client = None
    return _redis_client

def cache_response(ttl_seconds):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                r = get_redis_client()
                if not r:
                    return f(*args, **kwargs)
                
                cache_key = f"cache:{request.path}?{request.query_string.decode('utf-8')}"
                cached = r.get(cache_key)
                if cached:
                    return current_app.response_class(
                        response=cached,
                        status=200,
                        mimetype='application/json'
                    )

                response = f(*args, **kwargs)
                if isinstance(response, tuple) and response[1] == 200:
                    r.setex(cache_key, ttl_seconds, json.dumps(response[0].get_json()))
                
                return response
            except Exception as e:
                return f(*args, **kwargs)
        return decorated_function
    return decorator
