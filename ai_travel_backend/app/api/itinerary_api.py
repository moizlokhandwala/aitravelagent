from fastapi import APIRouter, HTTPException
from app.models.itinerary import PromptRequest, FilterRequest, PackageResponse, SaveItineraryRequest, Package
from app.services.itinerary_service import generate_packages_from_prompt, generate_packages_from_filters
from typing import List

router = APIRouter()


# Temporary storage
saved_itineraries = {}

@router.post("/itinerary/save")
def save_itinerary(request: SaveItineraryRequest):
    if request.user_id not in saved_itineraries:
        saved_itineraries[request.user_id] = []
    saved_itineraries[request.user_id].append(request.selected_package)
    return {"message": "Itinerary saved successfully."}

@router.get("/itinerary/{user_id}", response_model=List[Package])
def get_saved_itineraries(user_id: str):
    if user_id not in saved_itineraries or not saved_itineraries[user_id]:
        raise HTTPException(status_code=404, detail="No itineraries found for this user")
    return saved_itineraries[user_id]

@router.post("/suggest-packages/prompt", response_model=PackageResponse)
def suggest_from_prompt(request: PromptRequest):
    try:
        return generate_packages_from_prompt(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/suggest-packages/filters", response_model=PackageResponse)
def suggest_from_filters(request: FilterRequest):
    try:
        return generate_packages_from_filters(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
