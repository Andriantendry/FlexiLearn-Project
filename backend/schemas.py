from pydantic import BaseModel 
from typing import Dict, List, Optional
from datetime import datetime
class QuizInput(BaseModel):
    responses: List[str] 
    
class UserSchema(BaseModel):
    username : str 
    email : str 
    password : str
    
class UserLoginSchema(BaseModel):
    email : str
    password : str

class UserUpdate(BaseModel):
    id: int
    answers: Dict
    profile_code: str
    profil_dominant: str
    profil_secondaire: str
    profil_tertiaire: str
    statistiques: Dict
    recommendation: Optional[str] 

class VerifyCodeSchema(BaseModel):
    email: str
    code: str

class RecommendationRequest(BaseModel):
    profile: str
    answers: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[str]


class FeedbackOut(BaseModel):
    id_feedback: int
    rating: int
    category: str
    feedback_text: str
    created_at: datetime

    class Config:
        from_attributes = True