import requests
from ai_travel_ui.constants import API_BASE_URL

# In-memory auth token (temporary)
auth_token = {"access_token": None}

def register_user(email: str, password: str) -> str:
    url = f"{API_BASE_URL}/auth/register"
    payload = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            return "✅ Registered successfully! You can now log in."
        elif response.status_code == 400:
            return "⚠️ Email already registered."
        else:
            return f"❌ Error: {response.json().get('detail', 'Something went wrong')}"
    except Exception as e:
        return f"🚨 Server error: {str(e)}"

def login_user(email: str, password: str) -> str:
    url = f"{API_BASE_URL}/auth/login"
    payload = {
        "email": email,
        "password": password
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            auth_token["access_token"] = data["access_token"]
            return "✅ Login successful!"
        else:
            return f"❌ Login failed: {response.json().get('detail', 'Invalid credentials')}"
    except Exception as e:
        return f"🚨 Server error: {str(e)}"
