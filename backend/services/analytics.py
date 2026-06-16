import math
from models import LTVPredictionRequest, PropensityRequest, PredictionResult

def predict_ltv(request: LTVPredictionRequest) -> float:
    """
    Predicts Fan Lifetime Value (LTV) over the next 12 months.
    Uses historical spend patterns, frequency, and current engagement streaks.
    """
    if not request.historical_spend_array:
        return 0.0
        
    avg_spend = sum(request.historical_spend_array) / len(request.historical_spend_array)
    purchase_frequency = len(request.historical_spend_array)
    
    # Recency, Frequency, Monetary (RFM) style heuristic
    # If they haven't purchased in a long time, projected LTV drops significantly
    recency_decay = max(0.1, 1.0 - (request.days_since_last_purchase * 0.02))
    
    # Engagement streak acts as a retention multiplier
    retention_multiplier = 1.0 + (min(request.engagement_streak, 30) * 0.05)
    
    # Projected 12-month value = (Average spend * Estimated Annual Frequency) * Decays/Multipliers
    estimated_annual_freq = min(50, purchase_frequency * 2) 
    base_ltv = avg_spend * estimated_annual_freq
    
    final_ltv = base_ltv * recency_decay * retention_multiplier
    return round(final_ltv, 2)

def predict_propensity(request: PropensityRequest, target: str) -> PredictionResult:
    """
    Calculates likelihood of a user taking a specific action.
    Targets: "subscribe", "tip", "share"
    """
    # Normalize features
    watch_weight = min(1.0, request.watch_time_hours / 100.0)
    msg_weight = min(1.0, request.messages_sent / 500.0)
    like_weight = min(1.0, request.likes_given / 1000.0)
    
    prob = 0.0
    
    if target == "subscribe":
        # Subscribing correlates highly with watch time and moderate messaging
        prob = (watch_weight * 0.6) + (msg_weight * 0.3) + (like_weight * 0.1)
    elif target == "tip":
        # Tipping correlates highly with active messaging/chatting during lives
        prob = (msg_weight * 0.7) + (watch_weight * 0.2) + (like_weight * 0.1)
    elif target == "share":
        # Sharing correlates with high like volume
        prob = (like_weight * 0.8) + (msg_weight * 0.1) + (watch_weight * 0.1)
    else:
        raise ValueError("Invalid target for propensity scoring.")
        
    # Cap probability to a realistic 0.0 -> 0.98
    prob = min(0.98, prob * 1.5) 
    
    return PredictionResult(
        score=round(prob, 4),
        confidence=round(min(0.99, (watch_weight + msg_weight + like_weight) / 2.0 + 0.1), 4),
        features_used=["watch_time_hours", "messages_sent", "likes_given"]
    )
