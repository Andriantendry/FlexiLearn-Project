from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from utils.hashing import verify_password
from utils.auth import create_access_token
from database import get_db
from models_db import User
from schemas import UserLoginSchema

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(data: UserLoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return {"access_token": token, "user_id": user.id}
