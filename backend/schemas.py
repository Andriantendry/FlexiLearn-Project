from pydantic import BaseModel 
from typing import Dict

class QuizInput(BaseModel):
    answers: Dict[int, str]
    
class UserSchema(BaseModel):
    username : str 
    email : str 
    password : str 
    
class UserLoginSchema(BaseModel):
    email : str
    password : str