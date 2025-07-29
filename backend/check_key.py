import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("FRAGELLA_API_KEY")

if api_key:
    print(f"✅ Key loaded successfully: {api_key}")
else:
    print("❌ ERROR: Could not load key from .env file.")