from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, test_connection
from models_db import Base,User
from schemas import UserSchema
from utils.hashing import hash_password
from routes import users
from routes import predict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #lié back et front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#  Crée les tables au démarrage(create_table_if_not_exist)
Base.metadata.create_all(bind=engine)

#a chaque fois qu'un truc se passe
@app.on_event("startup")
def startup_event(): 
    test_connection()

@app.get("/")
def root():
    return {"message": "FastAPI tourne bien"}

#**********ROUTE USER***************
app.include_router(users.router)
app.include_router(predict.router, prefix="/api")


#Au debut (tsy mety)
"""
@app.post("/signup")
async def signup(user:UserSchema):
    #data = await request.json()  #si donnée brute ,request en parametre
    print("Reçu :", user.password)
    mdp = hash_password(user.password)
    return {"status": "ok", "received": mdp }
"""
