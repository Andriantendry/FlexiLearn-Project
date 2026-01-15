from pydantic import BaseModel 
from typing import Dict, Optional

class QuizInput(BaseModel):
    answers: Dict[int, str]
    
class UserSchema(BaseModel):
    username : str 
    email : str 
    password : str
    
class UserLoginSchema(BaseModel):
    email : str
    password : str

class UserUpdate(BaseModel):
    id : int
    answers: Optional[Dict[str, str]] = None
    profile: Optional[str] = None
    statistiques: Optional[Dict[str, float]] = None  