import os
from fastapi import APIRouter, HTTPException, Query
from livekit import api

router = APIRouter(prefix="/api/v1/live", tags=["Live Streaming"])

# Read LiveKit API Key and Secret
# Use placeholders if not provided so the server boots successfully
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "devkey")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "secret")

@router.get("/token")
async def get_livekit_token(
    room_name: str = Query(..., description="The name of the LiveKit room"),
    participant_name: str = Query(..., description="The participant's name/handle"),
    is_creator: bool = Query(False, description="Set to true if this participant is the broadcasting creator")
):
    """
    Generates an access token for LiveKit. 
    Creators have permission to publish (broadcast) to the room.
    Fans only have permission to subscribe (watch).
    """
    try:
        # Define permissions based on role
        grant = api.VideoGrant(
            room_join=True,
            room=room_name,
            can_publish=is_creator,
            can_subscribe=True,
            can_publish_data=True # For chat messages
        )

        # Create the token
        access_token = api.AccessToken(
            LIVEKIT_API_KEY, 
            LIVEKIT_API_SECRET
        )
        access_token.with_identity(participant_name)
        access_token.with_name(participant_name)
        access_token.with_grant(grant)
        
        jwt_token = access_token.to_jwt()
        
        return {
            "token": jwt_token,
            "room_name": room_name,
            "participant": participant_name,
            "role": "creator" if is_creator else "fan"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate LiveKit token: {str(e)}")
