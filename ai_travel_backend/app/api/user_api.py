from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

from app.models.user import UserProfile
from app.db.models import User
from app.db.db import get_db

router = APIRouter()


@router.post("/user/profile", response_model=UserProfile)
async def create_or_update_profile(profile: UserProfile, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.user_id == profile.user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields only related to profile
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

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update profile")

    return profile


@router.get("/user/{user_id}", response_model=UserProfile)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
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


@router.put("/user/{user_id}", response_model=UserProfile)
async def update_user(user_id: str, profile: UserProfile, db: AsyncSession = Depends(get_db)):
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

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update user")

    return profile
