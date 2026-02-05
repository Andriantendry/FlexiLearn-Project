from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session 
from database import get_db 
from schemas import UserSchema ,UserLoginSchema
from models_db import User
from utils.hashing import hash_password,verify_password, check_email_domain

router=APIRouter(
    prefix="/user", #toutes les routes commences par /user/
    tags=["users"] #section pour regrouper les routes
)

#si Session dehors ne marche pas?
@router.post("/signup")
def create_user(user : UserSchema, db :Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    
    if not check_email_domain(user.email):
        raise HTTPException(status_code=400, detail="Domaine email invalide")
    
    existing_user = db.query(User).filter(User.email == user.email).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    #creer un objet pour l'utilisateur(base pydantic et models)
    db_user = User (
        username = user.username,
        email = user.email,
        password = hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/signin")
def login(data : UserLoginSchema, db:Session=Depends(get_db)): #provient de l'url 
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="utilisateur non trouvé")

    # Vérifier mot de passe
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="mot de passe incorrect") #erreur affiche dans le fichier signin

    return {
        "id" : user.id,
        "username" : user.username,
        "email" : user.email
    }