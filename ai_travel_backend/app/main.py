from fastapi import FastAPI
from app.api.user_api import router as user_router
from app.api.itinerary_api import router as itinerary_router
from app.api.auth_api import router as auth_router
app = FastAPI(
    title="AITravelAgent API",
    description="Mood-based travel assistant using OpenAI",
    version="1.0.0"
)

# Register routers
app.include_router(user_router)
app.include_router(itinerary_router)
app.include_router(auth_router)
