from sqlalchemy import Integer, Column, String, DateTime
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import sessionmaker, declarative_base

#posiposinleh table
Base = declarative_base()

    
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index= True)
    email = Column(String, unique=True)
    password = Column(String)
    create_at = Column( DateTime(timezone=True),server_default=func.now())
