from fastapi import APIRouter, HTTPException, Depends, Header
import os
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client

router = APIRouter(prefix="/api/v1/admin/users", tags=["admin"])

def get_supabase_admin() -> Client:
    url: str = os.getenv("VITE_SUPABASE_URL")
    key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="Supabase Admin credentials not configured on server.")
    return create_client(url, key)

def verify_admin_key(x_admin_key: str = Header(...)):
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not service_key or x_admin_key != service_key:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid Admin Key")
    return True

class UserCreateRequest(BaseModel):
    email: str
    password: str
    username: str

class BulkUserCreateRequest(BaseModel):
    users: List[UserCreateRequest]

@router.get("/")
def list_users(admin: bool = Depends(verify_admin_key)):
    supabase = get_supabase_admin()
    response = supabase.auth.admin.list_users()
    return response.users

@router.post("/create")
def create_user(req: UserCreateRequest, admin: bool = Depends(verify_admin_key)):
    supabase = get_supabase_admin()
    try:
        # Create user via Admin API (bypasses email confirmation)
        user = supabase.auth.admin.create_user({
            "email": req.email,
            "password": req.password,
            "email_confirm": True,
            "user_metadata": {
                "handle": req.username,
                "name": req.username,
                "username": req.username,
                "full_name": req.username
            }
        })
        return {"status": "success", "user_id": user.user.id, "email": req.email}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/bulk-create")
def bulk_create_users(req: BulkUserCreateRequest, admin: bool = Depends(verify_admin_key)):
    supabase = get_supabase_admin()
    results = []
    errors = []
    
    for u in req.users:
        try:
            user = supabase.auth.admin.create_user({
                "email": u.email,
                "password": u.password,
                "email_confirm": True,
                "user_metadata": {
                    "handle": u.username,
                    "name": u.username,
                    "username": u.username,
                    "full_name": u.username
                }
            })
            results.append({"email": u.email, "id": user.user.id})
        except Exception as e:
            errors.append({"email": u.email, "error": str(e)})
            
    return {"status": "completed", "success_count": len(results), "errors_count": len(errors), "results": results, "errors": errors}

@router.delete("/{user_id}")
def delete_user(user_id: str, admin: bool = Depends(verify_admin_key)):
    supabase = get_supabase_admin()
    try:
        supabase.auth.admin.delete_user(user_id)
        return {"status": "success", "message": f"User {user_id} deleted."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

