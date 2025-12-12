from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models_db import User
from pydantic import BaseModel
from typing import Dict, Optional
from schemas import UserUpdate
router = APIRouter(
    prefix="/user",
    tags=["update_users"]
)

@router.post("/enregistrement des résultats")

def update_user(data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user:
        user = User(username=data.username)
        db.add(user)
    
    if data.answers:
        user.answers = data.answers
    if data.profile:
        user.profile = data.profile
    if data.statistiques:
        user.statistiques = data.statistiques

    db.commit()
    db.refresh(user)
    return user