from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date


# For prompt-based requests (Tab 1)
class PromptRequest(BaseModel):
    user_id: str
    prompt: str


# For filter-based requests (Tab 2)
class FilterRequest(BaseModel):
    user_id: str
    from_date: date
    to_date: date
    destination: str
    budget: str
    travel_type: Optional[str] = Field(default="flexible")  # relaxed / adventurous / explorer


# One activity inside a day
class Activity(BaseModel):
    time: str
    place: str
    activity: str
    cost: Optional[str] = None


# Day-wise breakdown of itinerary
class DayPlan(BaseModel):
    day: int
    date: Optional[date]
    activities: List[Activity]


# Each travel package
class Package(BaseModel):
    package_id: str
    title: str
    days: List[DayPlan]
    total_cost_estimate: Optional[str]
    accommodation: Optional[dict]
    local_transport: Optional[List[str]]
    visa_required: Optional[bool]
    notes: Optional[str] = None


# Final response format
class PackageResponse(BaseModel):
    packages: List[Package]


class SaveItineraryRequest(BaseModel):
    user_id: str
    selected_package: Package


