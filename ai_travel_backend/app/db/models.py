# app/db/models.py

from sqlalchemy import Column, String, Date, Boolean, DateTime, func
from app.db.db import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    nationality = Column(String, nullable=False)
    country_of_residence = Column(String, nullable=True)
    passport_number = Column(String, nullable=True)
    passport_expiry = Column(Date, nullable=True)
    has_visa = Column(Boolean, default=False)
    visa_expiry = Column(Date, nullable=True)
    travel_persona = Column(String, default="flexible")
    interests = Column(String, nullable=True)  # Comma-separated
    preferred_languages = Column(String, nullable=True)  # Comma-separated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)