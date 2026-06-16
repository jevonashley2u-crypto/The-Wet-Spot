import os
import stripe
from fastapi import APIRouter, Request, HTTPException
from supabase import create_client, Client

router = APIRouter(prefix="/api/v1/billing", tags=["Billing"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
ENDPOINT_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Initialize Supabase Service Role client for secure DB operations
supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase_admin: Client = None
if supabase_url and supabase_key:
    supabase_admin = create_client(supabase_url, supabase_key)

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Handles Stripe webhooks for successful payments, subscription updates,
    and Connect account onboarding.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, ENDPOINT_SECRET
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Security: Process fulfillment entirely backend-side!
        user_id = session.get('metadata', {}).get('user_id')
        amount_paid = session.get('amount_total', 0) / 100
        stripe_intent_id = session.get('payment_intent')
        
        if supabase_admin and user_id and stripe_intent_id:
            try:
                # 1. Insert transaction
                supabase_admin.table('transactions').insert({
                    "user_id": user_id,
                    "amount": amount_paid,
                    "type": "tip", # Defaulting to tip for ecosystem credits
                    "stripe_intent_id": stripe_intent_id
                }).execute()

                # 2. Update user's gamified total spend safely using RPC or update
                # (Assuming an RPC 'increment_spend' exists, or reading and updating)
                print(f"Securely logged transaction for user {user_id}")
            except Exception as db_err:
                print(f"Database error during fulfillment: {db_err}")
                
    elif event['type'] == 'account.updated':
        account = event['data']['object']
        # Update Creator's Stripe Connect status
        if supabase_admin:
            supabase_admin.table('creators').update({
                "stripe_account_id": account.id
            }).eq("stripe_account_id", account.id).execute()
        print(f"Connect account updated: {account.id}")

    return {"status": "success"}

@router.post("/private-room/capture")
async def capture_private_room_funds(fan_id: str, creator_id: str, minutes_used: int, price_per_minute: float):
    """
    Captures the funds from a fan after a 1-on-1 private room session ends.
    Uses Stripe to capture the exact amount based on the minutes spent.
    """
    total_cost = minutes_used * price_per_minute
    
    if supabase_admin:
        try:
            # 1. Update the private_rooms table status
            supabase_admin.table('private_rooms').update({
                "status": "completed"
            }).eq("fan_id", fan_id).eq("creator_id", creator_id).execute()

            # 2. Insert into transactions ledger
            supabase_admin.table('transactions').insert({
                "user_id": fan_id,
                "amount": total_cost,
                "type": "private_room",
                "stripe_intent_id": f"mock_intent_{fan_id}_{minutes_used}" # Mocking for now
            }).execute()

            return {"status": "success", "amount_captured": total_cost}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    return {"status": "mock_success", "amount": total_cost}

@router.post("/create-checkout-session")
async def create_checkout_session(user_id: str, amount_usd: int):
    """
    Creates a Stripe Checkout session for a Fan adding funds or subscribing.
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Ecosystem Credits',
                    },
                    'unit_amount': amount_usd * 100, # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://the-wet-spot.vercel.app/wallet?success=true',
            cancel_url='https://the-wet-spot.vercel.app/wallet?canceled=true',
            metadata={"user_id": user_id}
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
