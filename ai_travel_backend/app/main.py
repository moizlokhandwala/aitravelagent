from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.user_api import router as user_router
from app.api.itinerary_api import router as itinerary_router
from app.api.auth_api import router as auth_router

app = FastAPI(
    title="AITravelAgent API",
    description="Mood-based travel assistant using OpenAI",
    version="1.0.0"
)

# 👇 Add this CORS block before including routers
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://horizon-ai-planner.lovable.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_router)
app.include_router(itinerary_router)
app.include_router(auth_router)
