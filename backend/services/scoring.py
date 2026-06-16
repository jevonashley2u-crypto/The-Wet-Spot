import math
from models import ContentScoringRequest, ShareabilityRequest, PredictionResult

def calculate_momentum_score(request: ContentScoringRequest) -> float:
    """
    Calculates a dynamic momentum score based on engagement velocity.
    Weights: Shares > Comments > Likes > Views
    """
    weights = {
        "views": 0.1,
        "likes": 1.5,
        "comments": 3.0,
        "shares": 5.0
    }
    
    raw_score = (
        (request.views_per_hour * weights["views"]) +
        (request.likes_per_hour * weights["likes"]) +
        (request.comments_per_hour * weights["comments"]) +
        (request.shares_per_hour * weights["shares"])
    )
    
    # Normalize score using a logarithmic curve to prevent unbounded scores (max ~100)
    if raw_score <= 0:
        return 0.0
    normalized = min(100.0, math.log(raw_score + 1) * 15)
    return round(normalized, 2)

def predict_shareability(request: ShareabilityRequest) -> PredictionResult:
    """
    Predicts the likelihood of a piece of content being shared.
    Simulates an ML model by using heavy heuristics on retention and tags.
    """
    # Base probability driven heavily by initial retention (0.0 to 1.0)
    base_prob = request.initial_retention_rate * 0.5
    
    # High-shareability tags bump the score
    viral_tags = {"meme", "controversial", "tutorial", "hack", "news", "exclusive"}
    tag_match = len(set(request.tags).intersection(viral_tags))
    tag_boost = min(0.3, tag_match * 0.1)
    
    # Length optimization: shorter videos (< 15s) generally share better on vertical platforms
    length_boost = 0.0
    if request.video_length_seconds > 0:
        if request.video_length_seconds <= 15:
            length_boost = 0.2
        elif request.video_length_seconds <= 60:
            length_boost = 0.1
            
    final_prob = min(0.99, base_prob + tag_boost + length_boost)
    confidence = min(0.95, (request.initial_retention_rate * 0.7) + 0.2)
    
    return PredictionResult(
        score=round(final_prob, 4),
        confidence=round(confidence, 4),
        features_used=["initial_retention_rate", "tags_match_count", "video_length_seconds"]
    )
