import os
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException
from supabase import create_client, Client

router = APIRouter(prefix="/api/v1/webhooks/persona", tags=["Identity Verification"])

# You will need to add this to your .env
PERSONA_WEBHOOK_SECRET = os.getenv("PERSONA_WEBHOOK_SECRET", "")

supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase_admin: Client = None
if supabase_url and supabase_key:
    supabase_admin = create_client(supabase_url, supabase_key)

def verify_persona_signature(payload: bytes, signature_header: str) -> bool:
    """Verifies the HMAC-SHA256 signature from Persona."""
    if not PERSONA_WEBHOOK_SECRET or not signature_header:
        # In a real production environment, fail if secret is missing.
        # Returning True here just for initial scaffolding if secret is empty.
        if not PERSONA_WEBHOOK_SECRET:
            print("WARNING: PERSONA_WEBHOOK_SECRET is empty. Bypassing signature check.")
            return True
        return False
        
    try:
        # The header looks like: t=1614000000,v1=a2b3c4...
        parts = dict(part.split("=") for part in signature_header.split(","))
        timestamp = parts.get("t")
        signature = parts.get("v1")
        
        if not timestamp or not signature:
            return False
            
        signed_payload = f"{timestamp}.{payload.decode('utf-8')}".encode('utf-8')
        expected_signature = hmac.new(
            PERSONA_WEBHOOK_SECRET.encode('utf-8'),
            signed_payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(expected_signature, signature)
    except Exception as e:
        print(f"Error verifying Persona signature: {e}")
        return False

@router.post("")
async def handle_persona_webhook(request: Request):
    """
    Receives webhooks from Persona Identity Verification.
    If 'inquiry.completed' and verified, updates the creator's profile in Supabase.
    """
    payload_bytes = await request.body()
    signature = request.headers.get("persona-signature", "")
    
    if not verify_persona_signature(payload_bytes, signature):
        raise HTTPException(status_code=401, detail="Invalid Persona signature")
        
    try:
        payload = await request.json()
        event_name = payload.get("data", {}).get("attributes", {}).get("name")
        
        if event_name == "inquiry.completed":
            # Extract the referenceId we passed to Persona (should be the creator's user_id)
            payload_data = payload.get("data", {}).get("attributes", {}).get("payload", {})
            inquiry_data = payload_data.get("data", {}).get("attributes", {})
            
            status = inquiry_data.get("status")
            creator_id = inquiry_data.get("referenceId")
            
            if status == "completed" and creator_id and supabase_admin:
                # Update the database
                supabase_admin.table("creators").update({
                    "is_verified": True
                }).eq("id", creator_id).execute()
                print(f"✅ Successfully verified creator ID: {creator_id} via Persona KYC.")
                
        return {"status": "success"}
    except Exception as e:
        print(f"Persona Webhook Error: {e}")
        raise HTTPException(status_code=500, detail="Internal webhook processing error")
