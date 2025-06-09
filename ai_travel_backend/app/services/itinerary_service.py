import os
import uuid
from datetime import timedelta, datetime
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from app.models.itinerary import (
    PromptRequest, FilterRequest, PackageResponse
)

import json

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

chat = ChatOpenAI(
    api_key=OPENAI_API_KEY,
    model="gpt-4",
    temperature=0.7
)


def generate_packages_from_prompt(request: PromptRequest) -> PackageResponse:
    system_prompt = f"""
    Act as a professional travel assistant. Based on this user prompt:
    "{request.prompt}", suggest 3 unique travel packages. 
    Each package should include:
    - Title
    - Day-wise breakdown with time, place, activity, cost
    - Accommodation info
    - Total cost estimate
    - Whether visa is required
    - Notes

    Format the response as JSON:
    {{
      "packages": [
        {{
          "package_id": "string",
          "title": "string",
          "days": [
            {{
              "day": 1,
              "date": "2025-06-15",
              "activities": [
                {{
                  "time": "09:00 AM",
                  "place": "string",
                  "activity": "string",
                  "cost": "$20"
                }}
              ]
            }}
          ],
          "total_cost_estimate": "$500",
          "accommodation": {{
            "name": "Hotel Name",
            "cost_per_night": "$120",
            "amenities": ["WiFi", "Breakfast"]
          }},
          "local_transport": ["Uber", "Metro"],
          "visa_required": false,
          "notes": "Some helpful tips"
        }}
      ]
    }}
    """

    response = chat.invoke([HumanMessage(content=system_prompt)])

    print("\n🔍 GPT Raw Response (Prompt):\n", response.content)

    try:
        parsed = json.loads(response.content)
    except json.JSONDecodeError as e:
        print("⚠️ JSON decode error:", e)
        try:
            parsed = eval(response.content)
        except Exception as inner:
            print("❌ Eval failed:", inner)
            raise inner

    return PackageResponse(**parsed)


def generate_packages_from_filters(request: FilterRequest) -> PackageResponse:
    duration = (request.to_date - request.from_date).days + 1

    system_prompt = f"""
Act as a travel assistant. Suggest 3 complete travel packages for:
- Destination: {request.destination}
- Duration: {duration} days (from {request.from_date} to {request.to_date})
- Budget: {request.budget}
- Travel Type: {request.travel_type}

Assume the typical seasonal weather in {request.destination} during {request.from_date} to {request.to_date}.
- If this is a hot or rainy period, avoid long outdoor activities in the day.
- Recommend indoor, weather-safe, and comfort-focused experiences when applicable.
- Include time for breaks, flexibility, and convenience.

Strict formatting rules:
- Return only valid JSON (no markdown, no comments)
- Each package must include:
  - package_id, title
  - day-wise plans for **each of the {duration} days**
  - total_cost_estimate
  - accommodation (with cost and amenities)
  - visa_required (true/false)
  - local_transport (list)
  - notes (travel tips, warnings, etc.)

Use this exact format:
{{
  "packages": [
    {{
      "package_id": "string",
      "title": "string",
      "days": [
        {{
          "day": 1,
          "date": "YYYY-MM-DD",
          "activities": [
            {{
              "time": "10:00 AM",
              "place": "Some Place",
              "activity": "Some Activity",
              "cost": "$25"
            }}
          ]
        }}
      ],
      "total_cost_estimate": "$700",
      "accommodation": {{
        "name": "Hotel Name",
        "cost_per_night": "$100",
        "amenities": ["WiFi", "Breakfast"]
      }},
      "local_transport": ["Taxi", "Bus"],
      "visa_required": true,
      "notes": "Important travel tips"
    }}
  ]
}}
"""

    response = chat.invoke([HumanMessage(content=system_prompt)])
    raw_output = response.content.strip()

    print("\n🔍 GPT Raw Response (Filter):\n", raw_output)

    try:
        parsed = json.loads(raw_output)
    except json.JSONDecodeError as e:
        print("⚠️ JSON decode error:", e)
        try:
            parsed = eval(raw_output)
        except Exception as inner:
            print("❌ Eval failed:", inner)
            raise inner

    return PackageResponse(**parsed)


