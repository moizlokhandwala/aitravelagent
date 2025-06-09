from typing import List, Optional
from pydantic import BaseModel
from datetime import date

class UserProfile(BaseModel):
    user_id: str
    name: str
    email: str
    nationality: str
    country_of_residence: Optional[str]
    passport_number: Optional[str]
    passport_expiry: Optional[date]
    has_visa: Optional[bool] = False
    visa_expiry: Optional[date] = None
    travel_persona: Optional[str] = "flexible"
    interests: Optional[List[str]] = []
    preferred_languages: Optional[List[str]] = []