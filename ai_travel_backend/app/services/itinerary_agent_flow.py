from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from dotenv import load_dotenv
import os
import json

# Load .env if not already done globally
load_dotenv()

# Initialize the GPT model
llm = ChatOpenAI(model="gpt-4", temperature=0.3)

def analyze_user_intent(prompt: str) -> dict:
    system_prompt = """
You are an AI travel planner assistant. Your job is to extract the user's travel intent from their free-form prompt. 
Return a JSON object with the following keys:

- mood: (e.g., adventurous, relaxing, romantic)
- interests: (list of categories like beach, hiking, nightlife, food, history, etc.)
- travel_type: (e.g., solo, couple, family, group)
- duration_days: number of days (if mentioned)
- preferred_month: (if any mentioned)

If any field is not mentioned, try to infer it or leave it null.
Your response must be valid JSON and nothing else.
"""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=prompt)
    ]

    response = llm(messages)
    
    try:
        return json.loads(response.content)
    except Exception as e:
        print("Parsing Error:", e)
        return {
            "mood": None,
            "interests": [],
            "travel_type": None,
            "duration_days": None,
            "preferred_month": None,
        }
