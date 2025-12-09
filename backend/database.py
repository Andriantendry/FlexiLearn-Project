# database.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

POSTGRES_USER="admin"
POSTGRES_PASSWORD="admin"
POSTGRES_DB="flexilearn"

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5432/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
     
def get_db():
    #injecter la session dans les routes
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close()
        
def test_connection():
    try:
        with engine.connect() as conn:
            print("=> Connexion PostgreSQL OK ")
    except Exception as e:
        print("Connexion échouée :", e)
