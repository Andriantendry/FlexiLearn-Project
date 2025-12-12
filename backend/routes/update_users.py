from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models_db import User, Profile
from pydantic import BaseModel
from typing import Dict, Optional
from schemas import UserUpdate
router = APIRouter(
    prefix="/user",
    tags=["update_users"]
)

@router.post("/enregistrement des résultats")

def update_user(data: UserUpdate, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.id == data.id).first()
    if not profile:
        profile = Profile(
            id = data.id,
            answers = data.answers,
            profile = data.profile,
            statistiques = data.statistiques
            )
        db.add(profile)

    else:
        profile.answers = data.answers
        profile.profile = data.profile
        profile.statistiques = data.statistiques

    db.commit()
    db.refresh(profile)
    return {"message" : "Profile enregistré avec succès", "data": profile}