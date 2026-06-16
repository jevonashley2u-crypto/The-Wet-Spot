from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "engine": "Growth Intelligence V1"}

def test_content_score():
    response = client.post(
        "/api/v1/content/score",
        json={
            "post_id": "test_post_1",
            "views_per_hour": 1000,
            "likes_per_hour": 200,
            "comments_per_hour": 50,
            "shares_per_hour": 10
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "momentum_score" in data
    assert data["momentum_score"] > 0

def test_predict_shareability():
    response = client.post(
        "/api/v1/content/predict-shareability",
        json={
            "post_id": "test_post_2",
            "tags": ["meme", "funny"],
            "video_length_seconds": 12,
            "initial_retention_rate": 0.8
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "confidence" in data
    assert data["score"] > 0.5  # Should be highly shareable due to tags, length, and retention

def test_predict_ltv():
    response = client.post(
        "/api/v1/analytics/predict-ltv",
        json={
            "user_id": "user_492",
            "historical_spend_array": [15.0, 15.0, 15.0],
            "engagement_streak": 14,
            "days_since_last_purchase": 5
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "predicted_12m_ltv" in data
    assert data["predicted_12m_ltv"] > 50.0  # (15 avg * 6 annual freq * multiplier)

def test_propensity_subscribe():
    response = client.post(
        "/api/v1/analytics/propensity/subscribe",
        json={
            "user_id": "user_1",
            "watch_time_hours": 85.0,
            "messages_sent": 100,
            "likes_given": 200
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert data["score"] > 0.0

def test_propensity_invalid_target():
    response = client.post(
        "/api/v1/analytics/propensity/invalid_target",
        json={
            "user_id": "user_1",
            "watch_time_hours": 85.0,
            "messages_sent": 100,
            "likes_given": 200
        }
    )
    assert response.status_code == 400
