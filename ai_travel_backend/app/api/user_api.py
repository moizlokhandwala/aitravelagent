from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import asyncio

from app.models.user import UserProfile
from app.db.models import User
from app.db.db import get_db

router = APIRouter()

# ✅ Dummy Profile (used for fallbacks)
def dummy_profile(user_id: str, email: str = "") -> UserProfile:
    return UserProfile(
        user_id=user_id,
        name="Dummy User",
        email=email or user_id,
        nationality="Unknown",
        country_of_residence="Unknown",
        passport_number="XXXXXX",
        passport_expiry=None,
        has_visa=False,
        visa_expiry=None,
        travel_persona="Casual",
        interests=["travel", "explore"],
        preferred_languages=["English"]
    )

@router.post("/user/profile", response_model=UserProfile)
async def create_or_update_profile(profile: UserProfile, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.user_id == profile.user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.name = profile.name
        user.nationality = profile.nationality
        user.country_of_residence = profile.country_of_residence
        user.passport_number = profile.passport_number
        user.passport_expiry = profile.passport_expiry
        user.has_visa = profile.has_visa
        user.visa_expiry = profile.visa_expiry
        user.travel_persona = profile.travel_persona
        user.interests = ",".join(profile.interests)
        user.preferred_languages = ",".join(profile.preferred_languages)

        await db.commit()
        return profile

    except (SQLAlchemyError, ConnectionError, asyncio.TimeoutError) as e:
        print(f"[POST /user/profile] DB or Network Error: {e}")
        return dummy_profile(user_id=profile.user_id, email=profile.email)

    except Exception as e:
        print(f"[POST /user/profile] Unexpected Error: {e}")
        return dummy_profile(user_id=profile.user_id, email=profile.email)


@router.get("/user/{user_id}", response_model=UserProfile)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return UserProfile(
            user_id=user.user_id,
            name=user.name,
            email=user.email,
            nationality=user.nationality,
            country_of_residence=user.country_of_residence,
            passport_number=user.passport_number,
            passport_expiry=user.passport_expiry,
            has_visa=user.has_visa,
            visa_expiry=user.visa_expiry,
            travel_persona=user.travel_persona,
            interests=user.interests.split(",") if user.interests else [],
            preferred_languages=user.preferred_languages.split(",") if user.preferred_languages else [],
        )

    except (SQLAlchemyError, ConnectionError, asyncio.TimeoutError) as e:
        print(f"[GET /user/{user_id}] DB or Network Error: {e}")
        return dummy_profile(user_id)

    except Exception as e:
        print(f"[GET /user/{user_id}] Unexpected Error: {e}")
        return dummy_profile(user_id)


@router.put("/user/{user_id}", response_model=UserProfile)
async def update_user(user_id: str, profile: UserProfile, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        user.name = profile.name
        user.email = profile.email
        user.nationality = profile.nationality
        user.country_of_residence = profile.country_of_residence
        user.passport_number = profile.passport_number
        user.passport_expiry = profile.passport_expiry
        user.has_visa = profile.has_visa
        user.visa_expiry = profile.visa_expiry
        user.travel_persona = profile.travel_persona
        user.interests = ",".join(profile.interests)
        user.preferred_languages = ",".join(profile.preferred_languages)

        await db.commit()
        return profile

    except (SQLAlchemyError, ConnectionError, asyncio.TimeoutError) as e:
        print(f"[PUT /user/{user_id}] DB or Network Error: {e}")
        return dummy_profile(user_id, email=profile.email)

    except Exception as e:
        print(f"[PUT /user/{user_id}] Unexpected Error: {e}")
        return dummy_profile(user_id, email=profile.email)
