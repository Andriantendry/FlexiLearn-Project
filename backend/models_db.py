from sqlalchemy import Integer, Column, Boolean,String, DateTime, JSON, ForeignKey
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

#posiposinleh table
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    create_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship(
        "Profile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)


class Profile(Base):
    __tablename__ = "profiles"

    id_profile = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # 🔹 Quiz / ML (enregistré après le quiz)
    answers = Column(JSON)
    profile_code = Column(String)           # ex: "VA"
    profil_dominant = Column(String)        # "Visuel"
    profil_secondaire = Column(String)      # "Auditif"
    profil_tertiaire = Column(String)       # "Kinesthésique"
    statistiques = Column(JSON)             # {"Visuel": 45.2, ...}

    # 🔹 Chat / Recommandation (enregistré après le chat)
    chat_answers = Column(JSON, nullable=True) # réponses du chat
    recommendation = Column(String, nullable=True)
    # recommendation = Column(JSON, nullable=True)
    # ex:
    # {
    #   "titre": "...",
    #   "contenu": "...",
    #   "ressources": [...]
    # }

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")
