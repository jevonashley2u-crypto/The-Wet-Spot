from fastapi import FastAPI, HTTPException, Request
from typing import List, Dict

from models import (
    ContentScoringRequest, ShareabilityRequest, PredictionResult,
    AudienceSegmentRequest, Post, LTVPredictionRequest, PropensityRequest,
    ReferralTrackRequest
)
from services.scoring import calculate_momentum_score, predict_shareability
from services.recommendation import rank_trending_feed, rank_for_you_feed
from services.analytics import predict_ltv, predict_propensity
from services.billing import router as billing_router
from services.live import router as live_router
from services.persona import router as persona_router
import sentry_sdk
import os
from fastapi.middleware.cors import CORSMiddleware

# Initialize Sentry for Error Tracking
sentry_dsn = os.getenv("SENTRY_DSN_BACKEND")
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        traces_sample_rate=1.0,
        profiles_sample_rate=1.0,
    )

app = FastAPI(title="The Wet Spot - Growth Intelligence Engine")

# Security Hardening: CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://the-wet-spot.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Basic Rate Limiting Middleware (Scaffold)
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # TODO: Implement Redis-based rate limiting per IP or API Key
    response = await call_next(request)
    return response

app.include_router(billing_router)
app.include_router(live_router)
app.include_router(persona_router)

# --- MODULE A: Viral Prediction & Content Scoring ---

@app.post("/api/v1/content/score", response_model=Dict[str, float])
async def content_score(request: ContentScoringRequest):
    score = calculate_momentum_score(request)
    return {"momentum_score": score}

@app.post("/api/v1/content/predict-shareability", response_model=PredictionResult)
async def content_shareability(request: ShareabilityRequest):
    return predict_shareability(request)

# --- MODULE B: Recommendation & Feed Ranking ---

@app.post("/api/v1/feed/trending", response_model=List[Post])
async def feed_trending(posts: List[Post]):
    # In a real app, this would fetch from DB, but we pass the array here for mock ranking
    ranked = rank_trending_feed(posts)
    return ranked

@app.post("/api/v1/feed/for-you", response_model=List[Post])
async def feed_for_you(request: AudienceSegmentRequest, posts: List[Post]):
    # Note: Using POST here so we can pass lists in the body easily for prototype
    ranked = rank_for_you_feed(request, posts)
    return ranked

# --- MODULE C: Predictive Analytics & LTV ---

@app.post("/api/v1/analytics/predict-ltv", response_model=Dict[str, float])
async def analytics_ltv(request: LTVPredictionRequest):
    ltv = predict_ltv(request)
    return {"predicted_12m_ltv": ltv}

@app.post("/api/v1/analytics/propensity/{target}", response_model=PredictionResult)
async def analytics_propensity(target: str, request: PropensityRequest):
    if target not in ["subscribe", "tip", "share"]:
        raise HTTPException(status_code=400, detail="Invalid target")
    return predict_propensity(request, target)

# --- MODULE D: Referral Tracking ---

@app.post("/api/v1/referrals/track", response_model=Dict[str, str])
async def referrals_track(request: ReferralTrackRequest):
    # In a real app, write relationship to graph DB and trigger reward contracts
    return {
        "status": "success",
        "message": f"Attributed user {request.invitee_id} to {request.inviter_id} via {request.source}"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok", "engine": "Growth Intelligence V1"}
