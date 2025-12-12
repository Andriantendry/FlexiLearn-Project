from sqlalchemy import Integer, Column, String, DateTime, JSON, ForeignKey
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

#posiposinleh table
Base = declarative_base()

    
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index= True)
    email = Column(String, unique=True)
    password = Column(String)
    create_at = Column( DateTime(timezone=True),server_default=func.now())
    
    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profile"
    id_profile = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, ForeignKey("users.id"), nullable=False)
    answers = Column(JSON)
    profile = Column(String)
    statistiques = Column(JSON)

    user = relationship("User", back_populates="profile")

