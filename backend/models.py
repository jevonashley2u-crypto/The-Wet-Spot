from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Creator(BaseModel):
    id: str
    name: str
    subscribers_count: int
    monthly_earnings: float
    momentum_score: float = 0.0
    streak_count: int = 0
    tags: List[str] = []

class Post(BaseModel):
    id: str
    creator_id: str
    content: str
    likes: int
    comments_count: int
    time_posted: datetime
    tags: List[str] = []
    video_length_seconds: Optional[int] = None
    average_watch_time_seconds: Optional[float] = None
    momentum_score: float = 0.0

class User(BaseModel):
    id: str
    total_spend: float = 0.0
    days_active: int = 0
    engagement_streak: int = 0
    watch_streak: int = 0
    preferred_tags: List[str] = []
    invited_by: Optional[str] = None

class ContentScoringRequest(BaseModel):
    post_id: str
    views_per_hour: float
    likes_per_hour: float
    comments_per_hour: float
    shares_per_hour: float

class ShareabilityRequest(BaseModel):
    post_id: str
    tags: List[str]
    video_length_seconds: int
    initial_retention_rate: float  # Percentage 0.0 to 1.0

class AudienceSegmentRequest(BaseModel):
    user_id: str
    preferred_tags: List[str]

class PredictionResult(BaseModel):
    score: float
    confidence: float
    features_used: List[str]

class LTVPredictionRequest(BaseModel):
    user_id: str
    historical_spend_array: List[float]
    engagement_streak: int
    days_since_last_purchase: int

class PropensityRequest(BaseModel):
    user_id: str
    watch_time_hours: float
    messages_sent: int
    likes_given: int

class ReferralTrackRequest(BaseModel):
    inviter_id: str
    invitee_id: str
    source: str  # e.g., 'tiktok', 'twitter', 'direct'
